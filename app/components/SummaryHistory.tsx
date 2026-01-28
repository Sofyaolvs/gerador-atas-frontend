"use client";

import { Trash2, Eye } from "lucide-react";
import { Summary, Project } from "../types";
import { Button } from "./Button";

interface SummaryHistoryProps {
  summaries: Summary[];
  projects: Project[];
  onView: (summary: Summary) => void;
  onDelete: (id: string) => void;
}

export function SummaryHistory({ summaries, projects, onView, onDelete }: SummaryHistoryProps) {
  const getProjectName = (projectId?: string) => {
    if (!projectId) return "Projeto não encontrado";
    const project = projects.find((p) => p._id === projectId);
    return project?.name || "Projeto não encontrado";
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (summaries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma ata gerada ainda.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {summaries.map((summary) => (
        <div
          key={summary._id}
          className="bg-slate-100 border-2 border-violet-700 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900">
              {getProjectName(summary.projectId || summary.meetingData?.projectId)}
            </h4>
            <p className="text-sm text-slate-600">
              {summary.meetingDate || summary.meetingData?.date
                ? `Reunião em ${formatDate(summary.meetingDate || summary.meetingData?.date)}`
                : summary.originalFileName || "Ata enviada"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onView(summary)}
              className="!bg-transparent !text-violet-700 !border-none "
              title="Visualizar"
              variant="secondary"
            >
              <Eye className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => onDelete(summary._id)}
              title="Excluir"
              variant="danger"
              className="!bg-transparent !text-red-800 !border-none"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
