import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WeekDayRow from "@/components/weekly/WeekDayRow";
import WeeklySummary from "@/components/weekly/WeeklySummary";

function getWeekDates(offset: number) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function WeeklyPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const dates = getWeekDates(weekOffset);
  const startDate = dates[0];
  const endDate = dates[6];

  const dailyTotals = useQuery(api.stats.getDailyTotals, {
    startDate,
    endDate,
  });
  const goals = useQuery(api.userGoals.get);

  const weekLabel = `${new Date(startDate + "T12:00:00").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" },
  )} – ${new Date(endDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => setWeekOffset((o) => o - 1)} className="p-1">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="font-semibold">{weekLabel}</h2>
        <button onClick={() => setWeekOffset((o) => o + 1)} className="p-1">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {dailyTotals && <WeeklySummary data={dailyTotals} />}

      <div>
        {dates.map((date) => (
          <WeekDayRow
            key={date}
            date={date}
            data={dailyTotals?.[date]}
            goalKcal={goals?.dailyKcal}
          />
        ))}
      </div>
    </div>
  );
}
