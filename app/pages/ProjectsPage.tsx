"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Project } from "../types";
import { mockProjects } from "../data/mockProjects";
import { Button } from "../components/Button";
import { ProjectList } from "../components/ProjectList";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const handleToggleStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projetos</h1>
          <p className="text-gray-500 text-sm mt-1">Projetos atuais:</p>
        </div>
        <Button variant="primary" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <ProjectList
        projects={projects}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />
    </div>
  );
}
