"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Project, Summary, UploadAtaDto } from "../types";
import { projectService, summaryService } from "../service/service";
import { Modal } from "../components/PopUp";
import { SummaryModal } from "../components/SummaryModal";
import { SummaryHistory } from "../components/SummaryHistory";
import { Button } from "../components/Button";
import { UploadArea } from "../components/UploadArea";

interface SummaryHistoryPageProps {
  projectId: string;
  onBack: () => void;
}

export function SummaryHistoryPage({ projectId, onBack }: SummaryHistoryPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
      setSummaries(
        summariesData.filter(
          (s) => s.projectId === projectId || s.meetingData?.projectId === projectId
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAta = async (data: UploadAtaDto) => {
    const result = await summaryService.upload(data);
    if (result.data) {
      setSummaries((prev) => [result.data!, ...prev]);
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-violet-700 hover:bg-violet-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Histórico de Atas
              {projects.length > 0 && (
                <span className="text-violet-700 ml-2">
                   {projects.find((p) => p._id === projectId)?.name}
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Atas deste projeto</p>
          </div>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsUploadModalOpen(true)}>
          Upload de ata
        </Button>
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
        <UploadArea
          projects={projects}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleUploadAta}
        />
      </Modal>
    </div>
  );
}
