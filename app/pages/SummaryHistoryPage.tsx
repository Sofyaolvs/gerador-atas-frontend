"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Project, Summary } from "../types";
import { projectService, summaryService } from "../service/service";
import { Modal } from "../components/PopUp";
import { SummaryModal } from "../components/SummaryModal";
import { SummaryHistory } from "../components/SummaryHistory";
import { Button } from "../components/Button";
import { UploadArea } from "../components/UploadArea";

interface SummaryHistoryPageProps {
  onBack: () => void;
}

export function SummaryHistoryPage({ onBack }: SummaryHistoryPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [file, setFile] = useState<string>();
  const [fileEnter, setFileEnter] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, summariesData] = await Promise.all([
        projectService.getAll(),
        summaryService.getAll(),
      ]);
      setProjects(projectsData);
      setSummaries(summariesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = (summary: Summary) => {
    setSelectedSummary(summary);
    setIsSummaryModalOpen(true);
  };

  const handleDeleteSummary = async (id: string) => {
    try {
      await summaryService.delete(id);
      setSummaries((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Erro ao deletar ata:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 text-center">
        <p className="text-gray-500">Carregando atas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-violet-700 hover:bg-violet-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Histórico de Atas</h1>
          <p className="text-gray-500 text-sm mt-1">Todas as atas geradas</p>
        </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="primary" size="md" onClick={() => setIsUploadModalOpen(true)}>
            Upload de ata
          </Button>
        </div>
      </div>

      <SummaryHistory
        summaries={summaries}
        projects={projects}
        onView={handleViewSummary}
        onDelete={handleDeleteSummary}
      />

      {selectedSummary && (
        <Modal open={isSummaryModalOpen} onClose={() => setIsSummaryModalOpen(false)}>
          <SummaryModal
            summary={selectedSummary}
            onClose={() => setIsSummaryModalOpen(false)}
          />
        </Modal>
      )}

      <Modal open={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
        <UploadArea onClose={() => setIsUploadModalOpen(false)} onSubmit={() => {}} />
      </Modal>
    </div>
  );
}
