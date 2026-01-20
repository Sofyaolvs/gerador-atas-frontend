"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Project, Meeting } from "../types";
import { mockProjects } from "../data/mockProjects";
import { Button } from "../components/Button";
import { ProjectList } from "../components/ProjectList";
import { Modal } from "../components/PopUp";
import { Form } from "../components/Form";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedProjectForMeeting, setSelectedProjectForMeeting] = useState<string>("");

  const handleToggleStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreateProject = (data: Omit<Project, "id">) => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...data,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleNewMeeting = (projectId: string) => {
    setSelectedProjectForMeeting(projectId);
    setIsMeetingModalOpen(true);
  };


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
          onSubmit={() => console.log("Nova reunião criada")}
        />
      </Modal>
    </div>
  );
}
