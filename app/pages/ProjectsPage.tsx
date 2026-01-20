"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Project, Meeting, CreateProjectDto, CreateMeetingDto } from "../types";
import { projectService,meetingService } from "../service/service";
import { Button } from "../components/Button";
import { ProjectList } from "../components/ProjectList";
import { Modal } from "../components/PopUp";
import { Form } from "../components/Form";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedProjectForMeeting, setSelectedProjectForMeeting] = useState<string>("");

  
  useEffect(()=>{
    loadProjects();
  },[])

  const loadProjects = async()=>{
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (error) {
      console.error(error)
    }finally{
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string) => {
    const project = projects.find((p) => p._id === id);
    if (!project) return;
    try {
      const updated = await projectService.update(id, { status: !project.status });
      setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
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
      await meetingService.create(data);
      setIsMeetingModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar reunião:", error);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projetos</h1>
          <p className="text-gray-500 text-sm mt-1">Projetos atuais:</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setIsProjectModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <ProjectList
        projects={projects}
        onToggleStatus={handleToggleStatus}
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
    </div>
  );
}
