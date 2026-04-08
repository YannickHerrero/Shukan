import type { Doc } from "../../../convex/_generated/dataModel";
import { MEAL_SLOT_LABELS } from "@/hooks/useDailyLog";
import type { MealSlot } from "@/hooks/useDailyLog";

export default function TemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: Doc<"mealTemplates">;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{template.name}</h3>
        {template.defaultSlot && (
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {MEAL_SLOT_LABELS[template.defaultSlot as MealSlot]}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="text-sm text-primary">
          Edit
        </button>
        <button onClick={onDelete} className="text-sm text-destructive">
          Delete
        </button>
      </div>
    </div>
  );
}
