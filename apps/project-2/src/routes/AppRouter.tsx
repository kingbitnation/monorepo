import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AboutPage } from "@/pages/AboutPage";
import { HomePage } from "@/pages/HomePage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
