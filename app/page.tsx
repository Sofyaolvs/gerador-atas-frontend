"use client";

import { useState } from "react";
import { PageLayout } from "./layout/PageLayout";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SummaryHistoryPage } from "./pages/SummaryHistoryPage";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"projects" | "history">("projects");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const handleGoToHistory = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage("history");
  };

  return (
    <PageLayout>
      {currentPage === "projects" ? (
        <ProjectsPage onGoToHistory={handleGoToHistory} />
      ) : (
        <SummaryHistoryPage
          projectId={selectedProjectId}
          onBack={() => setCurrentPage("projects")}
        />
      )}
    </PageLayout>
  );
}
