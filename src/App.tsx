import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "./pages/Dashboard";
import DataSiswa from "./pages/DataSiswa";
import Settings from "./pages/Settings";
import CetakLabelIjazah from "./CetakLabelIjazah";
import MenuCetak from "./pages/print/MenuCetak";
import { useStore } from "./lib/store";

function hexToHsl(hex: string) {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function ThemeSync() {
  const store = useStore();

  useEffect(() => {
    const root = document.documentElement;
    const primaryColor = store.ui.primaryColor;

    const hsl = hexToHsl(primaryColor);
    const primary = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
    const primarySoft = `${hsl.h} ${hsl.s}% ${Math.min(92, hsl.l + 18)}%`;
    const sidebarBg = `${hsl.h} ${Math.min(90, hsl.s + 6)}% ${Math.max(8, hsl.l - 18)}%`;

    root.style.setProperty("--primary-color", primaryColor);
    root.style.setProperty("--primary", primary);
    root.style.setProperty("--ring", primary);
    root.style.setProperty("--primary-soft", primarySoft);
    root.style.setProperty("--sidebar-bg", sidebarBg);

    const classMap = {
      "glossy-neon": "theme-glossy-neon",
      "cyberpunk-glitch": "theme-cyberpunk-glitch",
      "soft-glass": "theme-soft-glass",
    } as const;

    const nextClass = classMap[store.ui.uiTheme];
    root.classList.remove("theme-glossy-neon", "theme-cyberpunk-glitch", "theme-soft-glass");
    root.classList.add(nextClass);
  }, [store.ui.primaryColor, store.ui.uiTheme]);

  return null;
}

export default function App() {
  return (
    <>
      <ThemeSync />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="data-siswa" element={<DataSiswa />} />
            <Route path="print">
              <Route path="menu-cetak" element={<MenuCetak />} />
              <Route path="cetak-label-ijazah" element={<CetakLabelIjazah />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
