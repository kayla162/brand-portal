/**
 * ============================================================================
 *  把度假小屋環境照的相機原檔壓成網頁用的 WebP
 * ----------------------------------------------------------------------------
 *  來源：assets-src/stay/*.JPG      （相機原檔，已在 .gitignore，不進版控）
 *  產出：public/images/stay/NN.webp（網站實際載入的檔案，要 commit）
 *
 *  手動執行：
 *
 *      npm run optimize:images
 *
 *  只有在「新增或替換環境照」時才需要跑。跑之前先把新的原檔放進
 *  assets-src/stay/，檔名用數字（1.JPG、2.JPG…），數字就是顯示順序。
 *
 *  這支腳本做四件事：
 *    1. rotate()  依 EXIF 把照片轉正。iPhone 常把照片「躺著存」，
 *                 靠 EXIF 的 orientation 欄位告訴瀏覽器要轉幾度。
 *                 ⚠️ 下一步會清掉 EXIF，所以一定要先在這裡把旋轉「烤」進畫素，
 *                    否則部分照片（原檔 3、4、26…）會整張倒過來。
 *    2. resize()  長邊縮到 1280px。原檔是 4032×3024（iPhone 12MP），
 *                 但網頁上最大只會用到約 360px 寬，1280 已含高解析螢幕的餘裕。
 *    3. webp()    轉 WebP。同樣畫質下比 JPEG 小約三成，
 *                 Safari 14+／Chrome／Edge／Firefox 全支援。
 *    4. 清 EXIF   sharp 預設不複製 metadata，拍攝時間與 GPS 座標會一併移除。
 *    5. 遮蔽      把 REDACTIONS 指定的區域模糊掉（目前只有一面車牌）。
 *                 ⚠️ 這一步一定要留在腳本裡，不要改成「手動修好圖再放進 public/」。
 *                    手動改的話，下次有人重跑這支腳本就會被原圖覆蓋回去。
 * ============================================================================
 */

import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SOURCE_DIR = fileURLToPath(new URL("../assets-src/stay/", import.meta.url));
const OUTPUT_DIR = fileURLToPath(new URL("../public/images/stay/", import.meta.url));

/**
 * 長邊上限。網頁上最大顯示寬度約 360px，1280 是給 2～3 倍高解析螢幕的餘裕。
 *
 * 這批照片橫幅直幅都有，所以限制的是「長邊」而不是寬度：
 * 直幅若只限寬 1280，高度會被拉到 1707，檔案白白大一倍。
 */
const MAX_EDGE = 1280;

/** WebP 品質。78 在這批風景照上看不出壓縮痕跡，再高只是變大 */
const QUALITY = 78;

/**
 * 要模糊掉的區域，key 是 assets-src/stay/ 裡的「原檔名」。
 *
 * 座標用 0～1 的比例而不是像素，相對於「縮圖後」的畫面。
 * 用比例的原因：改 MAX_EDGE、或哪天換成更高解析度的原檔重拍，都不必重新量座標。
 *
 * 換照片時記得檢查這裡 —— key 對應的是原檔名，
 * 如果 9.JPG 被換成別張照片，這個區域就會蓋錯地方。
 */
const REDACTIONS = {
  // 停在左側的廂型車車牌
  "9.JPG": [{ left: 0.183, top: 0.532, width: 0.034, height: 0.028 }],
};

/** 檔名開頭的數字就是顯示順序：1.JPG → 1。取不到數字的排到最後 */
function orderOf(filename) {
  const matched = filename.match(/^(\d+)/);
  return matched ? Number(matched[1]) : Number.MAX_SAFE_INTEGER;
}

/** 把 0～1 的比例換算成實際像素，並確保不會超出圖片邊界 */
function toPixelRegion(area, { width, height }) {
  const left = Math.max(0, Math.round(area.left * width));
  const top = Math.max(0, Math.round(area.top * height));
  return {
    left,
    top,
    width: Math.min(Math.round(area.width * width), width - left),
    height: Math.min(Math.round(area.height * height), height - top),
  };
}

/**
 * 縮圖 →（需要的話）模糊指定區域 → 輸出 WebP。
 *
 * 沒有要遮蔽的照片走單一條 pipeline，一次做完。
 * 有要遮蔽的才多繞一圈：得先拿到縮圖後的畫素，才知道比例座標落在哪幾個 px。
 * 中間用 raw 而不是 JPEG 傳遞，避免多一次壓縮造成的畫質損失。
 */
async function renderPhoto(sourcePath, outputPath, areas) {
  const resized = sharp(sourcePath)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });

  if (areas.length === 0) {
    return resized.webp({ quality: QUALITY }).toFile(outputPath);
  }

  const { data, info } = await resized.raw().toBuffer({ resolveWithObject: true });
  const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };

  const patches = await Promise.all(
    areas.map(async (area) => {
      const region = toPixelRegion(area, info);
      // 模糊強度跟著區域大小走，小區域用固定 sigma 會糊不掉
      const sigma = Math.max(4, region.width / 4);
      const patch = await sharp(data, raw).extract(region).blur(sigma).png().toBuffer();
      return { input: patch, left: region.left, top: region.top };
    }),
  );

  return sharp(data, raw)
    .composite(patches)
    .webp({ quality: QUALITY })
    .toFile(outputPath);
}

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const entries = await readdir(SOURCE_DIR);

const sources = entries
  .filter((name) => /\.jpe?g$/i.test(name))
  .sort((a, b) => orderOf(a) - orderOf(b));

if (sources.length === 0) {
  console.error(`❌ ${SOURCE_DIR} 裡沒有找到 .jpg／.jpeg 檔。`);
  process.exit(1);
}

await mkdir(OUTPUT_DIR, { recursive: true });

console.log(`找到 ${sources.length} 張原檔，開始壓縮…\n`);

let totalBefore = 0;
let totalAfter = 0;
const manifest = [];

for (const [index, filename] of sources.entries()) {
  // 補零讓檔案總管與 ls 的排序跟實際順序一致（01、02…10，而不是 1、10、2）
  const outputName = `${String(index + 1).padStart(2, "0")}.webp`;

  const before = (await stat(SOURCE_DIR + filename)).size;

  const areas = REDACTIONS[filename] ?? [];

  const { width, height } = await renderPhoto(
    SOURCE_DIR + filename,
    OUTPUT_DIR + outputName,
    areas,
  );

  const after = (await stat(OUTPUT_DIR + outputName)).size;

  totalBefore += before;
  totalAfter += after;
  manifest.push({ order: index + 1, source: filename, file: outputName, width, height });

  console.log(
    `  ${filename.padEnd(8)} → ${outputName}  ${width}×${height}  ` +
      `${formatSize(before)} → ${formatSize(after)}` +
      (areas.length ? `  🔒 已遮蔽 ${areas.length} 處` : ""),
  );
}

// 留一份對照表，之後想知道 07.webp 原本是哪張時可以查
await writeFile(
  OUTPUT_DIR + "manifest.json",
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

const saved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);

console.log(
  `\n✅ 完成 ${sources.length} 張：` +
    `${formatSize(totalBefore)} → ${formatSize(totalAfter)}（少了 ${saved}%）`,
);
