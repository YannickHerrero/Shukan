import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TemplateCard from "@/components/templates/TemplateCard";

export default function TemplatesPage() {
  const navigate = useNavigate();
  const templates = useQuery(api.mealTemplates.list);
  const removeTemplate = useMutation(api.mealTemplates.remove);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Templates</h1>
        <Button size="sm" onClick={() => navigate("/templates/new")}>
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </div>

      {templates === undefined && (
        <p className="text-center text-muted-foreground">Loading...</p>
      )}

      {templates?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No templates yet. Create one to quickly log common meals.
        </p>
      )}

      <div className="space-y-3">
        {templates?.map((t) => (
          <TemplateCard
            key={t._id}
            template={t}
            onEdit={() => navigate(`/templates/${t._id}/edit`)}
            onDelete={() => void removeTemplate({ id: t._id })}
          />
        ))}
      </div>
    </div>
  );
}
