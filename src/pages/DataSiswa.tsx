import { useRef, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useStore, type Siswa } from "../lib/store";

const TEMPLATE_HEADERS = ["nama", "nis", "nisn"] as const;

export default function DataSiswa() {
  const store = useStore();
  const excelInputRef = useRef<HTMLInputElement>(null);
  const [importInfo, setImportInfo] = useState<{ type: "ok" | "error"; text: string } | null>(
    null
  );

  function downloadTemplateExcel() {
    const ws = XLSX.utils.aoa_to_sheet([
      [...TEMPLATE_HEADERS],
      ["CONTOH NAMA", "12345", "1234567890"],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DATA_SISWA");
    XLSX.writeFile(wb, "template-data-siswa.xlsx");
  }

  async function handleImportExcel(file: File) {
    setImportInfo(null);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        setImportInfo({ type: "error", text: "File Excel tidak memiliki sheet." });
        return;
      }

      const sheet = workbook.Sheets[firstSheetName];
      const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
      const headerRow = (aoa[0] as unknown[]) || [];

      const normalizeKey = (v: unknown) =>
        String(v ?? "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/_/g, "");

      const normalizedHeaders = headerRow.map(normalizeKey);
      const idxNama = normalizedHeaders.indexOf("nama");
      const idxNis = normalizedHeaders.indexOf("nis");
      const idxNisn = normalizedHeaders.indexOf("nisn");

      const missingHeaders = [];
      if (idxNama === -1) missingHeaders.push("nama");
      if (idxNis === -1) missingHeaders.push("nis");
      if (idxNisn === -1) missingHeaders.push("nisn");
      if (missingHeaders.length) {
        setImportInfo({
          type: "error",
          text:
            "Header kolom tidak sesuai template. Wajib ada: " +
            TEMPLATE_HEADERS.join(", ") +
            ". Kolom hilang: " +
            missingHeaders.join(", "),
        });
        return;
      }

      const toText = (v: unknown) => {
        if (v === null || v === undefined) return "";
        if (typeof v === "number") return Number.isFinite(v) ? String(v) : "";
        if (typeof v === "boolean") return v ? "1" : "0";
        return String(v);
      };

      const siswaList: Siswa[] = [];
      const seen = new Set<string>();
      for (let i = 1; i < aoa.length; i++) {
        const row = (aoa[i] as unknown[]) || [];
        const nama = toText(row[idxNama]).trim();
        const nis = toText(row[idxNis]).trim();
        const nisn = toText(row[idxNisn]).trim();
        if (!nama) continue;

        const dedupeKey = (nisn || `${nama.toLowerCase()}|${nis}`).trim();
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);

        siswaList.push({
          id: globalThis.crypto?.randomUUID?.() ?? `imp-${Date.now()}-${i}`,
          nama,
          nis: nis || undefined,
          nisn: nisn || undefined,
        });
      }

      if (siswaList.length === 0) {
        setImportInfo({
          type: "error",
          text: "Tidak ada data yang bisa diimpor. Pastikan ada isi pada kolom 'nama'.",
        });
        return;
      }

      store.setSiswaList(siswaList);
      setImportInfo({ type: "ok", text: `Berhasil mengimpor ${siswaList.length} data siswa.` });
    } catch {
      setImportInfo({
        type: "error",
        text: "Gagal membaca file Excel. Pastikan format .xlsx/.xls valid dan kolom sesuai.",
      });
    }
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-heading">Data Siswa</CardTitle>
            <div className="mt-1 text-xs text-muted-foreground">
              Impor Excel minimal kolom: nama, nis, nisn. Data akan otomatis sinkron ke menu Cetak
              Label.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={excelInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.currentTarget.value = "";
                if (!file) return;
                void handleImportExcel(file);
              }}
            />
            <Button size="sm" variant="ghost" onClick={() => downloadTemplateExcel()}>
              <Download className="mr-2 h-4 w-4" />
              Unduh Template Excel
            </Button>
            <Button size="sm" onClick={() => excelInputRef.current?.click()}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Impor Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {importInfo && (
            <div
              className={
                importInfo.type === "ok"
                  ? "mb-3 text-xs text-muted-foreground"
                  : "mb-3 text-xs text-destructive"
              }
            >
              {importInfo.text}
            </div>
          )}

          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-3 py-2 font-semibold">No</th>
                  <th className="px-3 py-2 font-semibold">Nama</th>
                  <th className="px-3 py-2 font-semibold">NIS</th>
                  <th className="px-3 py-2 font-semibold">NISN</th>
                </tr>
              </thead>
              <tbody>
                {store.siswaList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                      Belum ada data siswa. Silakan impor file Excel.
                    </td>
                  </tr>
                ) : (
                  store.siswaList.map((s, idx) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                      <td className="px-3 py-2 font-medium">{s.nama}</td>
                      <td className="px-3 py-2">{s.nis || "-"}</td>
                      <td className="px-3 py-2">{s.nisn || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
