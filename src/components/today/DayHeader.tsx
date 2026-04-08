import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DailyTotals } from "@/hooks/useDailyLog";
import type { Doc } from "../../../convex/_generated/dataModel";
import MacroChart from "./MacroChart";
import MacroBar from "./MacroBar";

export default function DayHeader({
  date,
  onPrev,
  onNext,
  onToday,
  totals,
  goals,
}: {
  date: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  totals: DailyTotals;
  goals: Doc<"userGoals"> | null | undefined;
}) {
  const isToday = date === new Date().toISOString().slice(0, 10);
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="p-1">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={onToday}
          className={`font-semibold ${!isToday ? "underline underline-offset-4 decoration-primary" : ""}`}
        >
          {isToday ? "Today" : formatted}
        </button>
        <button onClick={onNext} className="p-1">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-lg bg-muted p-3">
        <div className="flex items-center gap-4">
          <MacroChart totals={totals} />
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold">
              {Math.round(totals.kcal)}
            </span>
            {goals && (
              <span className="text-muted-foreground">
                {" "}
                / {goals.dailyKcal} kcal
              </span>
            )}
          </div>
        </div>

        {goals && (
          <div className="mt-3 space-y-2">
            <MacroBar
              label="Protein"
              current={totals.protein}
              goal={goals.dailyProtein}
              color="#3b82f6"
            />
            {goals.dailyCarbs != null && (
              <MacroBar
                label="Carbs"
                current={totals.carbs}
                goal={goals.dailyCarbs}
                color="#f59e0b"
              />
            )}
            {goals.dailyFat != null && (
              <MacroBar
                label="Fat"
                current={totals.fat}
                goal={goals.dailyFat}
                color="#ef4444"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
