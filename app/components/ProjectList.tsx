import { Project } from "../types";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onNewMeeting: (projectId: string) => void;
}

export function ProjectList({ projects, onToggleStatus, onDelete, onNewMeeting }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum projeto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onNewMeeting={onNewMeeting}
        />
      ))}
    </div>
  );
}
