import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ArrowLeft } from "lucide-react";
import BarcodeScanner from "@/components/foods/BarcodeScanner";

export default function BarcodeScanPage() {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const food = useQuery(
    api.foods.getByBarcode,
    barcode ? { barcode } : "skip",
  );

  const handleScan = (code: string) => {
    setBarcode(code);
  };

  if (barcode && food !== undefined) {
    if (food) {
      navigate(`/foods/${food._id}/edit`);
    } else {
      navigate(`/foods/new?barcode=${encodeURIComponent(barcode)}`);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">Scan Barcode</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!barcode && (
        <BarcodeScanner onScan={handleScan} onError={setError} />
      )}

      {barcode && food === undefined && (
        <p className="text-center text-muted-foreground">
          Looking up barcode...
        </p>
      )}
    </div>
  );
}
