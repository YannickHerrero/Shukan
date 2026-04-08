import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  EllipsisVertical,
  Zap,
  Copy,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const templates = useQuery(api.mealTemplates.list);
  const logTemplateMut = useMutation(api.mealTemplates.logTemplate);

  const allItems = [...entries, ...quickAdds];
  const slotKcal = allItems.reduce((sum, item) => sum + item.kcal, 0);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setShowTemplates(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const menuItems = [
    {
      label: "Quick Add",
      icon: Zap,
      action: () => navigate(`/log/${date}/${slot}/quick`),
    },
    {
      label: "Copy Meal",
      icon: Copy,
      action: () => navigate(`/log/${date}/${slot}/copy`),
    },
    {
      label: "Template",
      icon: LayoutTemplate,
      action: () => setShowTemplates(!showTemplates),
      keepOpen: true,
    },
    {
      label: "AI Recognize",
      icon: Sparkles,
      action: () => navigate("/foods/ai"),
    },
  ];

  return (
    <div className="mx-4 mb-3 rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="font-semibold">{MEAL_SLOT_LABELS[slot]}</span>
        <span className="text-sm text-muted-foreground">
          {slotKcal > 0 ? `${slotKcal} kcal` : ""}
        </span>
      </div>

      {allItems.length > 0 && (
        <div className="px-2">
          {allItems.map((item) => (
            <MealEntryRow key={item._id} entry={item} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50">
        <button
          onClick={() => navigate(`/log/${date}/${slot}`)}
          className="flex items-center gap-1 text-sm text-primary font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Food
        </button>

        <div className="relative ml-auto" ref={menuRef}>
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              if (menuOpen) setShowTemplates(false);
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <EllipsisVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 z-20 w-44 rounded-lg border bg-popover shadow-md py-1">
              {menuItems.map(({ label, icon: Icon, action, keepOpen }) => (
                <button
                  key={label}
                  onClick={() => {
                    action();
                    if (!keepOpen) {
                      setMenuOpen(false);
                      setShowTemplates(false);
                    }
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </button>
              ))}

              {showTemplates && templates && (
                <div className="border-t px-3 py-2">
                  {templates.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No templates.{" "}
                      <button
                        onClick={() => {
                          navigate("/templates/new");
                          setMenuOpen(false);
                        }}
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
                            setMenuOpen(false);
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
      </div>
    </div>
  );
}
