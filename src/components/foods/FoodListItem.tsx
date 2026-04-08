import type { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Star } from "lucide-react";

export default function FoodListItem({
  food,
  onClick,
}: {
  food: Doc<"foods">;
  onClick?: () => void;
}) {
  const toggleFavorite = useMutation(api.foods.toggleFavorite);

  return (
    <div
      className="flex items-center gap-3 border-b px-4 py-3 active:bg-muted/50"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{food.name}</p>
        {food.brand && (
          <p className="text-sm text-muted-foreground truncate">{food.brand}</p>
        )}
      </div>
      <p className="text-sm text-muted-foreground whitespace-nowrap">
        {food.kcal} kcal
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          void toggleFavorite({ id: food._id });
        }}
        className="p-1"
      >
        <Star
          className={`h-5 w-5 ${
            food.isFavorite
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      </button>
    </div>
  );
}
