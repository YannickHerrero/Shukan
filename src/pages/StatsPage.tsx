import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CalorieAverageCard from "@/components/stats/CalorieAverageCard";
import ProteinTrendCard from "@/components/stats/ProteinTrendCard";
import ComplianceHeatmap from "@/components/stats/ComplianceHeatmap";
import WeightTrendCard from "@/components/stats/WeightTrendCard";

const ranges = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

function getDatesForRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1);

  const dates: string[] = [];
  const d = new Date(start);
  while (d <= end) {
    dates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export default function StatsPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>(ranges[0]);
  const dates = getDatesForRange(range.days);

  const data = useQuery(api.stats.getDailyTotals, {
    startDate: dates[0],
    endDate: dates[dates.length - 1],
  });
  const goals = useQuery(api.userGoals.get);

  const weightEntries = useQuery(api.weightEntries.getRange, {
    startDate: dates[0],
    endDate: dates[dates.length - 1],
  });

  const heatmapDates = getDatesForRange(90);
  const heatmapData = useQuery(api.stats.getDailyTotals, {
    startDate: heatmapDates[0],
    endDate: heatmapDates[heatmapDates.length - 1],
  });

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Stats</h1>

      <div className="flex gap-1">
        {ranges.map((r) => (
          <button
            key={r.label}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 text-sm rounded-full ${
              range.label === r.label
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {data && (
        <>
          <CalorieAverageCard
            data={data}
            label={`Average (${range.label})`}
          />
          <ProteinTrendCard
            data={data}
            dates={dates.slice(-Math.min(dates.length, 14))}
            goalProtein={goals?.dailyProtein}
          />
        </>
      )}

      {weightEntries && <WeightTrendCard entries={weightEntries} />}

      {heatmapData && goals && (
        <ComplianceHeatmap
          data={heatmapData}
          goalKcal={goals.dailyKcal}
          months={3}
        />
      )}
    </div>
  );
}
