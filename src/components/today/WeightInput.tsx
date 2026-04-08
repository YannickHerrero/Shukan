import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Scale } from "lucide-react";

export default function WeightInput({ date }: { date: string }) {
  const entry = useQuery(api.weightEntries.getByDate, { date });
  const upsert = useMutation(api.weightEntries.upsert);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(entry?.weight?.toString() ?? "");
  }, [entry]);

  const handleBlur = async () => {
    const num = parseFloat(value);
    if (!num || num === entry?.weight) return;
    setSaving(true);
    await upsert({ date, weight: num });
    setSaving(false);
  };

  return (
    <div className="mx-4 mb-3 flex items-center gap-3 rounded-xl border bg-card shadow-sm px-4 py-3">
      <Scale className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">Weight</span>
      <Input
        type="number"
        step="0.1"
        placeholder="--"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        className="w-24 ml-auto text-right"
      />
      <span className="text-sm text-muted-foreground">
        {saving ? "..." : "kg"}
      </span>
    </div>
  );
}
