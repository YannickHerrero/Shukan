import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronUp, Plus, Copy, LayoutTemplate, Sparkles } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { MEAL_SLOT_LABELS } from "@/hooks/useDailyLog";
import type { MealSlot } from "@/hooks/useDailyLog";
import MealEntryRow from "./MealEntryRow";

export default function MealSlotSection({
  date,
  slot,
  entries,
  quickAdds,
}: {
  date: string;
  slot: MealSlot;
  entries: Doc<"mealEntries">[];
  quickAdds: Doc<"quickAdds">[];
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const templates = useQuery(api.mealTemplates.list);
  const logTemplateMut = useMutation(api.mealTemplates.logTemplate);

  const allItems = [...entries, ...quickAdds];
  const slotKcal = allItems.reduce((sum, item) => sum + item.kcal, 0);

  return (
    <div className="border-b">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="font-medium">{MEAL_SLOT_LABELS[slot]}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {slotKcal > 0 ? `${slotKcal} kcal` : ""}
        </span>
      </button>

      {expanded && (
        <div>
          {allItems.map((item) => (
            <MealEntryRow key={item._id} entry={item} />
          ))}
          <div className="flex gap-2 px-4 py-2">
            <button
              onClick={() => navigate(`/log/${date}/${slot}`)}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus className="h-4 w-4" />
              Add Food
            </button>
            <button
              onClick={() => navigate(`/log/${date}/${slot}/quick`)}
              className="text-sm text-muted-foreground"
            >
              Quick Add
            </button>
            <button
              onClick={() => navigate(`/log/${date}/${slot}/copy`)}
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              <LayoutTemplate className="h-3 w-3" />
              Template
            </button>
            <button
              onClick={() => navigate("/foods/ai")}
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              <Sparkles className="h-3 w-3" />
              AI
            </button>
          </div>
          {showTemplates && templates && (
            <div className="px-4 py-2 bg-muted/30 border-t">
              {templates.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No templates.{" "}
                  <button
                    onClick={() => navigate("/templates/new")}
                    className="text-primary underline"
                  >
                    Create one
                  </button>
                </p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {templates.map((t) => (
                    <button
                      key={t._id}
                      onClick={async () => {
                        await logTemplateMut({
                          templateId: t._id,
                          date,
                          mealSlot: slot,
                        });
                        setShowTemplates(false);
                      }}
                      className="px-2 py-1 text-xs bg-background border rounded-full"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
