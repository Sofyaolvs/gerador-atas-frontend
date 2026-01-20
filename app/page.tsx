"use client";

import { useState } from "react";
import { PageLayout } from "./layout/PageLayout";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SummaryHistoryPage } from "./pages/SummaryHistoryPage";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"projects" | "history">("projects");

  return (
    <PageLayout>
      {currentPage === "projects" ? (
        <ProjectsPage onGoToHistory={() => setCurrentPage("history")} />
      ) : (
        <SummaryHistoryPage onBack={() => setCurrentPage("projects")} />
      )}
    </PageLayout>
  );
}
