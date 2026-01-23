import { Trash2, ToggleRight, Plus, MessageCircleQuestionMark } from "lucide-react";
import { Project } from "../types";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { DropdownMenu } from "./DropdownMenu";

interface ProjectCardProps {
  project: Project;
  // onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onNewMeeting: (projectId: string) => void;
  onOpenChat: (projectId: string) => void;
}

export function ProjectCard({ project, onDelete, onNewMeeting, onOpenChat }: ProjectCardProps) {
  const menuItems = [
    // {
    //   label: project.status ? "Desativar" : "Ativar",
    //   icon: <ToggleRight className="w-4 h-4" />,
    //   onClick: () => onToggleStatus(project._id),
    // },
    {
      label: "Excluir",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(project._id),
      variant: "danger" as const,
    },
  ];

  return (
    <div className="bg-slate-100 border-2 border-violet-700 rounded-2xl p-5 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-slate-900 text-xl">{project.name}</h3>
        <div className="flex items-center gap-2">
          <DropdownMenu items={menuItems} />
        </div>
      </div>

      <p className="text-slate-800 text-sm mb-4 line-clamp-2 flex-1">{project.description}</p>

      <div className="flex justify-end pt-3 border-t border-gray-100 mt-auto">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<MessageCircleQuestionMark className="w-4 h-4"/>}
          className="h-10 mr-4 border-2 border-violet-700"
          onClick={() => onOpenChat(project._id)}
        >
          Chat
        </Button>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          className="h-10"
          onClick={() => onNewMeeting(project._id)}
        >
          Nova reunião
        </Button>

      </div>
    </div>
  );
}
