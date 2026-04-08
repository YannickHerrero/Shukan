import type { RouteObject } from "react-router";
import AppLayout from "@/layouts/AppLayout";
import TodayPage from "@/pages/TodayPage";
import FoodsPage from "@/pages/FoodsPage";
import StatsPage from "@/pages/StatsPage";
import SettingsPage from "@/pages/SettingsPage";
import FoodFormPage from "@/pages/FoodFormPage";
import AddEntryPage from "@/pages/AddEntryPage";
import QuickAddPage from "@/pages/QuickAddPage";
import CopyMealPage from "@/pages/CopyMealPage";
import WeeklyPage from "@/pages/WeeklyPage";
import TemplatesPage from "@/pages/TemplatesPage";
import TemplateFormPage from "@/pages/TemplateFormPage";

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: "foods", element: <FoodsPage /> },
      { path: "foods/new", element: <FoodFormPage /> },
      { path: "foods/:id/edit", element: <FoodFormPage /> },
      { path: "log/:date/:mealSlot", element: <AddEntryPage /> },
      { path: "log/:date/:mealSlot/quick", element: <QuickAddPage /> },
      { path: "log/:date/:mealSlot/copy", element: <CopyMealPage /> },
      { path: "templates", element: <TemplatesPage /> },
      { path: "templates/new", element: <TemplateFormPage /> },
      { path: "templates/:id/edit", element: <TemplateFormPage /> },
      { path: "weekly", element: <WeeklyPage /> },
      { path: "stats", element: <StatsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
];
