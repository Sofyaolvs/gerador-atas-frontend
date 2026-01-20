"use client";

import { useEffect, useState } from "react";
import { Plus, FileText } from "lucide-react";
import { Project, CreateProjectDto, CreateMeetingDto, Summary } from "../types";
import { projectService, meetingService, summaryService } from "../service/service";
import { Button } from "../components/Button";
import { ProjectList } from "../components/ProjectList";
import { Modal } from "../components/PopUp";
import { Form } from "../components/Form";
import { SummaryModal } from "../components/SummaryModal";

interface ProjectsPageProps {
  onGoToHistory: () => void;
}

export function ProjectsPage({ onGoToHistory }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedProjectForMeeting, setSelectedProjectForMeeting] = useState<string>("");
  const [generatedSummary, setGeneratedSummary] = useState<Summary | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);


  useEffect(()=>{
    loadProjects();
  },[])

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await projectService.delete(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
    }
  };

  const handleCreateProject = async (data: CreateProjectDto) => {
    try {
      const newProject = await projectService.create(data);
      setProjects((prev) => [...prev, newProject]);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    }
  };

  const handleNewMeeting = (projectId: string) => {
    setSelectedProjectForMeeting(projectId);
    setIsMeetingModalOpen(true);
  };

  const handleCreateMeeting = async (data: CreateMeetingDto) => {
    try {
      setIsGenerating(true);
      setIsMeetingModalOpen(false);

      const meeting = await meetingService.create(data);

      const summaryResponse = await summaryService.generate(meeting._id);

      if (summaryResponse.success && summaryResponse.data) {
        setGeneratedSummary(summaryResponse.data);
        setIsSummaryModalOpen(true);
      } else {
        console.error("Erro ao gerar ata:", summaryResponse.message);
        alert('Erro ao gerar ata')
      }
    } catch (error) {
      console.error("Erro ao criar reunião:", error);
      alert("Erro ao criar reunião. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 text-center">
        <p className="text-gray-500">Carregando projetos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projetos</h1>
          <p className="text-gray-500 text-sm mt-1">Projetos atuais:</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="secondary" size="md" onClick={onGoToHistory}>
            Histórico de Atas
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsProjectModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>

      <ProjectList
        projects={projects}
        // onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onNewMeeting={handleNewMeeting}
      />

      <Modal open={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)}>
        <Form type="project" onClose={() => setIsProjectModalOpen(false)} onSubmit={handleCreateProject} />
      </Modal>

      <Modal open={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)}>
        <Form
          type="meeting"
          projects={projects}
          selectedProjectId={selectedProjectForMeeting}
          onClose={() => setIsMeetingModalOpen(false)}
          onSubmit={handleCreateMeeting}
        />
      </Modal>

      <Modal open={isGenerating} onClose={() => {}}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-violet-900 mb-2">Gerando Ata...</h2>
        </div>
      </Modal>

      {generatedSummary && (
        <Modal open={isSummaryModalOpen} onClose={() => setIsSummaryModalOpen(false)}>
          <SummaryModal
            summary={generatedSummary}
            onClose={() => setIsSummaryModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
