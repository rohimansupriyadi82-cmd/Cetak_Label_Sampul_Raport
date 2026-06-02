import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useStore } from "../lib/store";

export default function Settings() {
  const store = useStore();
  const [savedInfo, setSavedInfo] = useState<string>("");

  const themeOptions = useMemo(
    () => [
      { value: "navy", label: "Biru Navy" },
      { value: "bottle", label: "Hijau Botol" },
      { value: "maroon", label: "Merah Maroon" },
      { value: "black", label: "Hitam" },
    ] as const,
    []
  );

  const uiThemeOptions = useMemo(
    () => [
      { value: "glossy-neon", label: "Tema A (Glossy Neon)" },
      { value: "cyberpunk-glitch", label: "Tema B (Cyberpunk Glitch)" },
      { value: "soft-glass", label: "Tema C (Soft Glassmorphism)" },
    ] as const,
    []
  );

  const [form, setForm] = useState(() => ({
    namaSekolah: store.sekolah.namaSekolah || "",
    namaKepalaSekolah: store.sekolah.namaKepalaSekolah || "",
    nipKepalaSekolah: store.sekolah.nipKepalaSekolah || "",
    defaultTemaLabel: store.sekolah.defaultTemaLabel || "navy",
  }));

  const [uiForm, setUiForm] = useState(() => ({
    primaryColor: store.ui.primaryColor || "#0D1B2A",
    uiTheme: store.ui.uiTheme || "soft-glass",
  }));

  function onSave() {
    store.setSekolah({
      namaSekolah: form.namaSekolah,
      namaKepalaSekolah: form.namaKepalaSekolah,
      nipKepalaSekolah: form.nipKepalaSekolah,
      defaultTemaLabel: form.defaultTemaLabel,
    });
    store.setUi({
      primaryColor: uiForm.primaryColor,
      uiTheme: uiForm.uiTheme,
    });
    setSavedInfo("Pengaturan tersimpan.");
    window.setTimeout(() => setSavedInfo(""), 2000);
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-heading">Pengaturan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nama-sekolah">Nama Sekolah</Label>
              <Input
                id="nama-sekolah"
                value={form.namaSekolah}
                onChange={(e) => setForm((p) => ({ ...p, namaSekolah: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama-kepsek">Nama Kepala Sekolah</Label>
              <Input
                id="nama-kepsek"
                value={form.namaKepalaSekolah}
                onChange={(e) => setForm((p) => ({ ...p, namaKepalaSekolah: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nip-kepsek">NIP</Label>
              <Input
                id="nip-kepsek"
                value={form.nipKepalaSekolah}
                onChange={(e) => setForm((p) => ({ ...p, nipKepalaSekolah: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Default Tema Label</Label>
              <Select
                value={form.defaultTemaLabel}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    defaultTemaLabel: v as (typeof themeOptions)[number]["value"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tema" />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-color">Pilihan Warna (Primary)</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="primary-color"
                  type="color"
                  className="h-10 w-16 p-1"
                  value={uiForm.primaryColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setUiForm((p) => ({ ...p, primaryColor: v }));
                    store.setUi({ primaryColor: v });
                  }}
                />
                <Input
                  value={uiForm.primaryColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setUiForm((p) => ({ ...p, primaryColor: v }));
                    if (/^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{3}$/.test(v))
                      store.setUi({ primaryColor: v });
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Warna ini mempengaruhi warna utama tombol, fokus, dan aksen sidebar.
              </div>
            </div>
            <div className="space-y-2">
              <Label>Desain Tema UI</Label>
              <Select
                value={uiForm.uiTheme}
                onValueChange={(v) => {
                  const next = v as (typeof uiThemeOptions)[number]["value"];
                  setUiForm((p) => ({ ...p, uiTheme: next }));
                  store.setUi({ uiTheme: next });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih desain" />
                </SelectTrigger>
                <SelectContent>
                  {uiThemeOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                Pilih gaya tampilan keseluruhan aplikasi.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={onSave}>Simpan</Button>
            {savedInfo ? <div className="text-xs text-muted-foreground">{savedInfo}</div> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
