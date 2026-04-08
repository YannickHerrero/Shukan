import { useState } from "react";
import { useDailyLog, MEAL_SLOTS } from "@/hooks/useDailyLog";
import DayHeader from "@/components/today/DayHeader";
import MealSlotSection from "@/components/today/MealSlotSection";
import WeightInput from "@/components/today/WeightInput";

function toDateString(d: Date) {
  return d.toISOString().slice(0, 10);
}

function shiftDate(dateStr: string, days: number) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export default function TodayPage() {
  const [date, setDate] = useState(() => toDateString(new Date()));
  const { entriesBySlot, quickAddsBySlot, totals, goals, isLoading } =
    useDailyLog(date);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div>
      <DayHeader
        date={date}
        onPrev={() => setDate((d) => shiftDate(d, -1))}
        onNext={() => setDate((d) => shiftDate(d, 1))}
        onToday={() => setDate(toDateString(new Date()))}
        totals={totals}
        goals={goals}
      />
      <WeightInput date={date} />
      {MEAL_SLOTS.map((slot) => (
        <MealSlotSection
          key={slot}
          date={date}
          slot={slot}
          entries={entriesBySlot(slot)}
          quickAdds={quickAddsBySlot(slot)}
        />
      ))}
    </div>
  );
}
