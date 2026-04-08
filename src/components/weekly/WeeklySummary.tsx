type DayData = { kcal: number; protein: number; carbs: number; fat: number };

export default function WeeklySummary({
  data,
}: {
  data: Record<string, DayData>;
}) {
  const days = Object.values(data);
  const count = days.length || 1;

  const avg = {
    kcal: days.reduce((s, d) => s + d.kcal, 0) / count,
    protein: days.reduce((s, d) => s + d.protein, 0) / count,
    carbs: days.reduce((s, d) => s + d.carbs, 0) / count,
    fat: days.reduce((s, d) => s + d.fat, 0) / count,
  };

  return (
    <div className="rounded-lg bg-muted p-3 mx-4">
      <p className="text-sm font-medium mb-2">Weekly Averages</p>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div>
          <span className="font-bold">{Math.round(avg.kcal)}</span>
          <p className="text-xs text-muted-foreground">kcal</p>
        </div>
        <div>
          <span className="font-bold">{Math.round(avg.protein)}g</span>
          <p className="text-xs text-muted-foreground">Protein</p>
        </div>
        <div>
          <span className="font-bold">{Math.round(avg.carbs)}g</span>
          <p className="text-xs text-muted-foreground">Carbs</p>
        </div>
        <div>
          <span className="font-bold">{Math.round(avg.fat)}g</span>
          <p className="text-xs text-muted-foreground">Fat</p>
        </div>
      </div>
    </div>
  );
}
