import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "../data/site.js";
import Logo from "./Logo.jsx";
import SocialLinks from "./SocialLinks.jsx";

/**
 * 頁尾：品牌名稱、社群（Facebook / Instagram / LINE）、聯絡資訊、Copyright。
 * 所有文字都來自 src/data/site.js。
 */
export default function Footer() {
  const { brandName, brandNameLatin, tagline, contact, social, copyrightYear } =
    site;

  const contactItems = [
    contact.phone && {
      key: "phone",
      Icon: Phone,
      label: "電話",
      text: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, "")}`,
    },
    contact.email && {
      key: "email",
      Icon: Mail,
      label: "電子郵件",
      text: contact.email,
      href: `mailto:${contact.email}`,
    },
    contact.address && {
      key: "address",
      Icon: MapPin,
      label: "地區",
      text: contact.address,
      href: null,
    },
  ].filter(Boolean);

  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.4fr_1fr_auto]">
          {/* 品牌 */}
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-11 w-11" tone="light" />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-xl font-medium tracking-wide">
                  {brandName}
                </span>
                {brandNameLatin ? (
                  <span className="mt-1.5 text-[0.6rem] font-medium tracking-[0.28em] text-white/50">
                    {brandNameLatin}
                  </span>
                ) : null}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              {tagline}
            </p>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <h2 className="font-serif text-sm font-medium tracking-[0.2em] text-white/50">
              聯絡我們
            </h2>
            <ul className="mt-5 space-y-3.5">
              {contactItems.map(({ key, Icon, label, text, href }) => (
                <li key={key}>
                  <span className="flex items-start gap-3 text-sm text-white/80">
                    <Icon
                      size={17}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-white/45"
                    />
                    <span className="sr-only">{label}：</span>
                    {href ? (
                      <a
                        href={href}
                        className="-my-2 rounded-sm py-2 transition-colors duration-300 hover:text-white"
                      >
                        {text}
                      </a>
                    ) : (
                      <span>{text}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 社群 */}
          <div className="lg:text-right">
            <h2 className="font-serif text-sm font-medium tracking-[0.2em] text-white/50">
              追蹤我們
            </h2>
            <SocialLinks
              links={social}
              label={brandName}
              tone="dark"
              className="mt-3.5 lg:justify-end"
            />
          </div>
        </div>

        {/* 版權 */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/12 pt-7 text-xs text-white/45 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {copyrightYear} {brandName}. All rights reserved.
          </p>
          <p>
            <a
              href="#top"
              className="-my-2 inline-block rounded-sm py-2 transition-colors duration-300 hover:text-white/80"
            >
              回到頁首
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
