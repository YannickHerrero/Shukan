import type { RouteObject } from "react-router";
import AppLayout from "@/layouts/AppLayout";
import TodayPage from "@/pages/TodayPage";
import FoodsPage from "@/pages/FoodsPage";
import StatsPage from "@/pages/StatsPage";
import SettingsPage from "@/pages/SettingsPage";

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: "foods", element: <FoodsPage /> },
      { path: "stats", element: <StatsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
];
