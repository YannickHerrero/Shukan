import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { MealSlot } from "@/hooks/useDailyLog";
import { MEAL_SLOT_LABELS } from "@/hooks/useDailyLog";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function QuickAddPage() {
  const navigate = useNavigate();
  const { date, mealSlot } = useParams<{ date: string; mealSlot: string }>();
  const slot = mealSlot as MealSlot;

  const addQuick = useMutation(api.quickAdds.add);

  const [form, setForm] = useState({
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    note: "",
  });

  const update = (field: keyof typeof form, value: string) => {
    if (field === "note") {
      setForm((prev) => ({ ...prev, note: value }));
    } else {
      setForm((prev) => ({ ...prev, [field]: Number(value) || 0 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    await addQuick({
      date,
      mealSlot: slot,
      kcal: form.kcal,
      protein: form.protein,
      carbs: form.carbs,
      fat: form.fat,
      note: form.note || undefined,
    });
    navigate(-1);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">
          Quick Add — {MEAL_SLOT_LABELS[slot]}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="kcal">Calories</Label>
            <Input
              id="kcal"
              type="number"
              value={form.kcal}
              onChange={(e) => update("kcal", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              value={form.protein}
              onChange={(e) => update("protein", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              value={form.carbs}
              onChange={(e) => update("carbs", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              type="number"
              value={form.fat}
              onChange={(e) => update("fat", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="note">Note (optional)</Label>
          <Input
            id="note"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Add
        </Button>
      </form>
    </div>
  );
}
