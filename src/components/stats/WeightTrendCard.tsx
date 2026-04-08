import type { Doc } from "../../../convex/_generated/dataModel";

export default function WeightTrendCard({
  entries,
}: {
  entries: Doc<"weightEntries">[];
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">Weight</p>
        <p className="text-sm text-muted-foreground mt-2 text-center py-4">
          No weight data yet
        </p>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const weights = sorted.map((e) => e.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;
  const latest = weights[weights.length - 1];
  const first = weights[0];
  const diff = latest - first;

  const padding = 5;
  const chartWidth = 100;
  const chartHeight = 40;
  const usableWidth = chartWidth - padding * 2;
  const usableHeight = chartHeight - padding * 2;

  const points = sorted
    .map((e, i) => {
      const x =
        padding +
        (sorted.length > 1 ? (i / (sorted.length - 1)) * usableWidth : usableWidth / 2);
      const y =
        padding + usableHeight - ((e.weight - min) / range) * usableHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted-foreground">Weight</p>
        <div className="text-right">
          <span className="text-lg font-bold">{latest}</span>
          <span className="text-sm text-muted-foreground"> kg</span>
          {entries.length > 1 && (
            <span
              className={`ml-2 text-xs font-medium ${diff > 0 ? "text-red-500" : diff < 0 ? "text-green-500" : "text-muted-foreground"}`}
            >
              {diff > 0 ? "+" : ""}
              {diff.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-24 mt-2"
        preserveAspectRatio="none"
      >
        <polyline
          points={points}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {sorted.map((e, i) => {
          const x =
            padding +
            (sorted.length > 1 ? (i / (sorted.length - 1)) * usableWidth : usableWidth / 2);
          const y =
            padding + usableHeight - ((e.weight - min) / range) * usableHeight;
          return <circle key={e._id} cx={x} cy={y} r="1.2" fill="#8b5cf6" />;
        })}
      </svg>

      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{sorted[0].date.slice(5)}</span>
        <span>{sorted[sorted.length - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}
