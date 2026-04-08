import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { signOut } = useAuthActions();
  const goals = useQuery(api.userGoals.get);
  const upsertGoals = useMutation(api.userGoals.upsert);

  const [form, setForm] = useState({
    dailyKcal: 2000,
    dailyProtein: 150,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (goals) {
      setForm({
        dailyKcal: goals.dailyKcal,
        dailyProtein: goals.dailyProtein,
      });
    }
  }, [goals]);

  const handleSave = async () => {
    await upsertGoals(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Daily Goals</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="kcal">Calories (kcal)</Label>
            <Input
              id="kcal"
              type="number"
              value={form.dailyKcal}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dailyKcal: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              value={form.dailyProtein}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dailyProtein: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
        <Button onClick={handleSave}>
          {saved ? "Saved!" : "Save Goals"}
        </Button>
      </section>

      <section className="pt-4 border-t">
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </section>
    </div>
  );
}
