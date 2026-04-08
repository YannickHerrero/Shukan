import type { DailyTotals } from "@/hooks/useDailyLog";

const COLORS = {
  protein: "#3b82f6",
  carbs: "#f59e0b",
  fat: "#ef4444",
};

export default function MacroChart({ totals }: { totals: DailyTotals }) {
  const total = totals.protein + totals.carbs + totals.fat;
  if (total === 0) {
    return (
      <svg viewBox="0 0 100 100" className="h-24 w-24">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-muted-foreground/20"
        />
      </svg>
    );
  }

  const segments = [
    { value: totals.protein, color: COLORS.protein },
    { value: totals.carbs, color: COLORS.carbs },
    { value: totals.fat, color: COLORS.fat },
  ];

  const circumference = 2 * Math.PI * 40;
  let offset = 0;

  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24">
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dashLength = pct * circumference;
        const dashOffset = -offset;
        offset += dashLength;
        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={seg.color}
            strokeWidth="12"
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
          />
        );
      })}
    </svg>
  );
}
