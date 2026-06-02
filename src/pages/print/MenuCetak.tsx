import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function MenuCetak() {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-heading">Menu Cetak</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Pilih jenis cetak yang ingin Anda buat.
        </div>
        <Button onClick={() => navigate("/print/cetak-label-ijazah")}>
          <Printer className="mr-2 h-4 w-4" /> Cetak Label Ijazah
        </Button>
      </CardContent>
    </Card>
  );
}
