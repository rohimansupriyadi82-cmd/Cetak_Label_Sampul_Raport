import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { ChevronLeft, Printer, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logoBekasi from "@/assets/logo-bekasi.svg";

type LabelDesign = "desain1" | "desain2" | "desain3";

type LabelSiswa = {
  nama: string;
  nis?: string;
  nisn?: string;
};

type LayoutProps = {
  siswa: LabelSiswa;
  themeColor: string;
  logoSrc: string;
};

const LS_THEME_KEY = "label_ijazah_theme";
const LS_LOGO_KEY = "label_ijazah_logo_base64";
const LS_DESIGN_KEY = "label_ijazah_selected_design_v1";

function normalizeSavedDesign(v: string | null): LabelDesign | null {
  if (v === "desain1" || v === "desain2" || v === "desain3") return v;
  if (v === "design1") return "desain1";
  if (v === "design2") return "desain2";
  if (v === "design3") return "desain3";
  return null;
}

function LayoutDesainAwal({ siswa, themeColor, logoSrc }: LayoutProps) {
  const nisText = (siswa.nis || "-") + " / " + (siswa.nisn || "-");
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        border: `1px solid var(--label-gold)`,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `
          linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.04) 35%, rgba(255,255,255,0.0) 100%),
          radial-gradient(circle at 10% 15%, rgba(212,175,55,0.18), rgba(255,255,255,0) 55%),
          radial-gradient(circle at 90% 85%, rgba(13,27,42,0.10), rgba(255,255,255,0) 60%),
          repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, rgba(255,255,255,0) 2px, rgba(255,255,255,0) 8px)
        `,
        boxShadow: `inset 0 0 0 2px rgba(212,175,55,0.25), inset 0 0 0 4px rgba(0,0,0,0.03)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "8px",
          pointerEvents: "none",
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.65), inset 0 0 0 6px rgba(0,0,0,0.02)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "0.9mm",
          borderRadius: "7px",
          border: `1px solid rgba(13,27,42,0.08)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00) 28%, rgba(0,0,0,0.00) 72%, rgba(0,0,0,0.02))`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: "7mm",
          background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)`,
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "2mm",
          gap: "1.5mm",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "-1mm",
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Logo"
              style={{
                height: "11mm",
                width: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <div style={{ height: "11mm" }} />
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            fontWeight: 900,
            textTransform: "uppercase",
            fontSize: "11pt",
            lineHeight: 1.05,
            width: "100%",
            color: themeColor,
            textShadow: "0 0.4px 0 rgba(0,0,0,0.08)",
          }}
        >
          {siswa.nama}
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "10pt",
            lineHeight: 1.1,
            width: "100%",
            color: "#111827",
          }}
        >
          {nisText}
        </div>
      </div>
    </div>
  );
}

function LayoutDesainModern({ siswa, themeColor, logoSrc }: LayoutProps) {
  const nisText = (siswa.nis || "-") + " / " + (siswa.nisn || "-");
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.98)",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 1px rgba(17,24,39,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.00) 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3.2mm",
          background: themeColor,
          opacity: 0.16,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "2.2mm",
          gap: "1.6mm",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Logo"
              style={{
                height: "11mm",
                width: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <div style={{ height: "11mm" }} />
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            fontWeight: 800,
            textTransform: "uppercase",
            fontSize: "11pt",
            lineHeight: 1.05,
            width: "100%",
            color: themeColor,
            letterSpacing: "0.2px",
          }}
        >
          {siswa.nama}
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "10pt",
            lineHeight: 1.1,
            width: "100%",
            color: "rgba(17,24,39,0.9)",
          }}
        >
          {nisText}
        </div>
      </div>
    </div>
  );
}

function LayoutDesainPremium({ siswa, themeColor, logoSrc }: LayoutProps) {
  const nisText = (siswa.nis || "-") + " / " + (siswa.nisn || "-");
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        border: `1px solid var(--label-gold)`,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `
          linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85)),
          radial-gradient(circle at 18% 22%, rgba(212,175,55,0.16), rgba(255,255,255,0) 55%),
          radial-gradient(circle at 85% 80%, rgba(13,27,42,0.08), rgba(255,255,255,0) 60%)
        `,
        boxShadow:
          "inset 0 0 0 2px rgba(212,175,55,0.45), inset 0 0 0 4px rgba(255,255,255,0.70), inset 0 0 0 5px rgba(13,27,42,0.06)",
        fontFamily: "'Times New Roman', serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "1.1mm",
          borderRadius: "7px",
          border: "1px solid rgba(13,27,42,0.08)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00) 30%, rgba(0,0,0,0.00) 70%, rgba(0,0,0,0.02))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: "6mm",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.22), transparent)",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "2mm",
          gap: "1.5mm",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "-1mm",
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Logo"
              style={{
                height: "11mm",
                width: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <div style={{ height: "11mm" }} />
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            fontWeight: 900,
            textTransform: "uppercase",
            fontSize: "11pt",
            lineHeight: 1.05,
            width: "100%",
            color: themeColor,
            textShadow: "0 0.4px 0 rgba(0,0,0,0.08)",
          }}
        >
          {siswa.nama}
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "10pt",
            lineHeight: 1.1,
            width: "100%",
            color: "#111827",
          }}
        >
          {nisText}
        </div>
      </div>
    </div>
  );
}

export default function CetakLabelIjazah() {
  const store = useStore();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  const s = store.sekolah;
  const status = String(s.statusSekolah || "Negeri");
  const isNegeri = status.trim().toLowerCase() === "negeri";
  const baseLogoSrc = isNegeri ? logoBekasi : s.logoSekolahCustom || logoBekasi;

  const themeOptions = [
    { value: "navy", label: "Biru Navy", color: "#0D1B2A" },
    { value: "bottle", label: "Hijau Botol", color: "#064E3B" },
    { value: "maroon", label: "Merah Maroon", color: "#7F1D1D" },
    { value: "black", label: "Hitam", color: "#111827" },
  ] as const;
  const gold = "#D4AF37";

  const [theme, setTheme] = useState<(typeof themeOptions)[number]["value"]>(() => {
    const saved = window.localStorage.getItem(LS_THEME_KEY);
    const isValid = saved && themeOptions.some((t) => t.value === saved);
    return (isValid ? saved : "navy") as (typeof themeOptions)[number]["value"];
  });

  const [logoOverride, setLogoOverride] = useState<string>(() => {
    const saved = window.localStorage.getItem(LS_LOGO_KEY);
    return saved || "";
  });

  const [selectedDesign, setSelectedDesign] = useState<LabelDesign>(() => {
    const saved = normalizeSavedDesign(window.localStorage.getItem(LS_DESIGN_KEY));
    return saved || "desain1";
  });

  const themeColor =
    themeOptions.find((t) => t.value === theme)?.color || themeOptions[0].color;
  const logoSrc = logoOverride || baseLogoSrc;

  useEffect(() => {
    window.localStorage.setItem(LS_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (logoOverride) window.localStorage.setItem(LS_LOGO_KEY, logoOverride);
    else window.localStorage.removeItem(LS_LOGO_KEY);
  }, [logoOverride]);

  useEffect(() => {
    window.localStorage.setItem(LS_DESIGN_KEY, selectedDesign);
  }, [selectedDesign]);

  const pages = useMemo(() => {
    const list = store.siswaList || [];
    const chunks: Array<typeof list> = [];
    for (let i = 0; i < list.length; i += 12) chunks.push(list.slice(i, i + 12));
    return chunks.length ? chunks : [[]];
  }, [store.siswaList]);

  const pageStyle: CSSProperties = {
    width: "210mm",
    height: "297mm",
    boxSizing: "border-box",
    padding: "5mm",
    fontFamily: "'Times New Roman', serif",
    position: "relative",
  };

  function designButtonClass(isActive: boolean) {
    return isActive
      ? "h-9 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
      : "h-9 rounded-none bg-background text-foreground hover:bg-accent hover:text-accent-foreground";
  }

  return (
    <div className="space-y-4 animate-fade-in pb-20">
      <Card className="shadow-card no-print border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/print/menu-cetak")}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-heading font-semibold">Cetak Label Ijazah</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Format: A4 Portrait, 2 kolom × 6 baris (maksimal 12 label per halaman). Ukuran
              label: 9,5 cm × 4 cm.
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="space-y-1">
                <Label htmlFor="label-logo">Upload Logo</Label>
                <Input
                  id="label-logo"
                  type="file"
                  accept="image/*"
                  className="h-9 w-[260px]"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setLogoOverride(String(reader.result || ""));
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label>Warna Tema</Label>
                <Select value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
                  <SelectTrigger className="h-9 w-[220px]">
                    <SelectValue placeholder="Pilih warna tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Desain Label</Label>
                <div className="inline-flex h-9 overflow-hidden rounded-md border border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={designButtonClass(selectedDesign === "desain1")}
                    onClick={() => setSelectedDesign("desain1")}
                    aria-pressed={selectedDesign === "desain1"}
                  >
                    Desain 1
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={designButtonClass(selectedDesign === "desain2")}
                    onClick={() => setSelectedDesign("desain2")}
                    aria-pressed={selectedDesign === "desain2"}
                  >
                    Desain 2
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={designButtonClass(selectedDesign === "desain3")}
                    onClick={() => setSelectedDesign("desain3")}
                    aria-pressed={selectedDesign === "desain3"}
                  >
                    Desain 3
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => handlePrint()}
                size="sm"
                disabled={store.siswaList.length === 0}
                className="h-9"
              >
                <Printer className="mr-2 h-4 w-4" /> Cetak Label
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-auto bg-muted/30 p-8">
        <CardContent className="p-0">
          <div className="flex justify-center">
            <div
              ref={printRef}
              className="label-print-root"
              style={
                {
                  "--label-theme": themeColor,
                  "--label-gold": gold,
                } as CSSProperties
              }
            >
              <style>{`
                @media print {
                  @page { size: A4 portrait; margin: 0mm !important; }
                  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
                  html, body, .label-print-root, .label-print-root * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    forced-color-adjust: none !important;
                  }
                  .label-page { page-break-after: always; break-after: page; }
                  .label-page:last-child { page-break-after: auto; break-after: auto; }
                }
              `}</style>

              {pages.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className="label-page bg-white shadow-lg mx-auto"
                  style={pageStyle}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 95mm)",
                      gridAutoRows: "40mm",
                      columnGap: "10mm",
                      rowGap: "5mm",
                      alignContent: "start",
                    }}
                  >
                    {page.map((st) => (
                      <div
                        key={st.id}
                        style={{
                          width: "95mm",
                          height: "40mm",
                          border: "1px dashed #666",
                          boxSizing: "border-box",
                          position: "relative",
                          padding: "1.5mm",
                          overflow: "hidden",
                        }}
                      >
                        <Scissors
                          style={{
                            position: "absolute",
                            top: "1mm",
                            right: "1mm",
                          }}
                          className="text-muted-foreground"
                          size={14}
                        />

                        {selectedDesign === "desain1" && (
                          <LayoutDesainAwal siswa={st} themeColor={themeColor} logoSrc={logoSrc} />
                        )}
                        {selectedDesign === "desain2" && (
                          <LayoutDesainModern siswa={st} themeColor={themeColor} logoSrc={logoSrc} />
                        )}
                        {selectedDesign === "desain3" && (
                          <LayoutDesainPremium
                            siswa={st}
                            themeColor={themeColor}
                            logoSrc={logoSrc}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
