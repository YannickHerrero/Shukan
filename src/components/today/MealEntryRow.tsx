import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import SwipeableRow from "./SwipeableRow";

export default function MealEntryRow({
  entry,
}: {
  entry: Doc<"mealEntries"> | Doc<"quickAdds">;
}) {
  const navigate = useNavigate();
  const removeMealEntry = useMutation(api.mealEntries.remove);
  const removeQuickAdd = useMutation(api.quickAdds.remove);

  const isQuickAdd = !("foodName" in entry);
  const isMealEntry = "foodName" in entry;

  const handleDelete = () => {
    if (isQuickAdd) {
      void removeQuickAdd({ id: entry._id as Doc<"quickAdds">["_id"] });
    } else {
      void removeMealEntry({ id: entry._id as Doc<"mealEntries">["_id"] });
    }
  };

  const handleTap = () => {
    if (isMealEntry) {
      navigate(`/entry/${entry._id}/edit`);
    }
  };

  return (
    <SwipeableRow onDelete={handleDelete}>
      <div
        className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors"
        onClick={handleTap}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {isQuickAdd
              ? (entry as Doc<"quickAdds">).note || "Quick Add"
              : (entry as Doc<"mealEntries">).foodName}
          </p>
          {isMealEntry && (
            <p className="text-xs text-muted-foreground">
              {(entry as Doc<"mealEntries">).servings} serving
              {(entry as Doc<"mealEntries">).servings !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="text-right text-sm">
          <span className="font-medium">{entry.kcal}</span>
          <span className="text-muted-foreground"> kcal</span>
        </div>
      </div>
    </SwipeableRow>
  );
}
