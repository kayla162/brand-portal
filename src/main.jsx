import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

/**
 * V1.0 只有一個首頁，但已經先架好 React Router 的殼。
 * 未來要加「房型 / 線上訂房 / 美食地圖」等子頁面時，
 * 只要在下面 <Routes> 裡多加 <Route path="..." element={...} /> 即可，
 * 不必重構專案結構。
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
