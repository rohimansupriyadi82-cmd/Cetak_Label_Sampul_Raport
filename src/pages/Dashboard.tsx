import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useStore } from "../lib/store";

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const store = useStore();
  const totalSiswa = store.siswaList.length;
  const totalLabel = totalSiswa;
  const totalHalaman = Math.max(1, Math.ceil(totalLabel / 12));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Siswa Terdata"
          value={String(totalSiswa)}
          subtitle="Data sinkron dari menu Data Siswa"
        />
        <StatCard
          title="Jumlah Label Siap Cetak"
          value={String(totalLabel)}
          subtitle="Sesuai jumlah siswa yang terisi"
        />
        <StatCard
          title="Estimasi Halaman A4"
          value={String(totalHalaman)}
          subtitle="1 halaman = 12 label (2×6)"
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-heading">Petunjuk Singkat</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <div>1) Buka menu Data Siswa → impor Excel (.xlsx/.xls) kolom: nama, nis, nisn.</div>
          <div>2) Cek tabel untuk memastikan data sudah benar.</div>
          <div>3) Buka menu Cetak Label → preview → cetak.</div>
        </CardContent>
      </Card>
    </div>
  );
}
