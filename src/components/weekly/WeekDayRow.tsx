type DayData = { kcal: number; protein: number; carbs: number; fat: number };

export default function WeekDayRow({
  date,
  data,
  goalKcal,
}: {
  date: string;
  data: DayData | undefined;
  goalKcal: number | undefined;
}) {
  const d = new Date(date + "T12:00:00");
  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = d.getDate();

  const kcal = data?.kcal ?? 0;
  const hasData = kcal > 0;

  let indicator = "bg-muted";
  if (hasData && goalKcal) {
    const ratio = kcal / goalKcal;
    if (ratio >= 0.9 && ratio <= 1.1) indicator = "bg-green-500";
    else if (ratio < 0.9) indicator = "bg-yellow-500";
    else indicator = "bg-red-500";
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b">
      <div className={`h-3 w-3 rounded-full ${indicator}`} />
      <div className="w-12">
        <span className="text-sm font-medium">{dayName}</span>
        <span className="text-xs text-muted-foreground ml-1">{dayNum}</span>
      </div>
      <div className="flex-1 text-sm">
        {hasData ? (
          <>
            <span className="font-medium">{Math.round(kcal)}</span>
            <span className="text-muted-foreground"> kcal</span>
            <span className="text-xs text-muted-foreground ml-2">
              P:{Math.round(data!.protein)}g C:{Math.round(data!.carbs)}g F:
              {Math.round(data!.fat)}g
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">No data</span>
        )}
      </div>
    </div>
  );
}
