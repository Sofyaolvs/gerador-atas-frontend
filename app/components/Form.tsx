"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { Project } from "../types";

type FormProps = {
  type: "project" | "meeting";
  onClose: () => void;
  onSubmit: (data: any) => void;
  projects?: Project[];
  selectedProjectId?: string;
};

const Field = ({ label, children }: any) => (
  <div>
    <label className="block text-sm font-medium text-slate-900 mb-2">{label}</label>
    {children}
  </div>
);

const inputClass = "w-full px-4 py-2 bg-transparent border border-slate-500 rounded-lg text-slate-900 resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500";

export function Form({ type, onClose, onSubmit, projects = [], selectedProjectId = "" }: FormProps) {
  const [data, setData] = useState<any>(
    type === "project"
      ? { name: "", description: "", status: "ativo" }
      : { projectId: selectedProjectId, date: "", participants: "", topics: "", tasks: "" }
  );

  const set = (field: string) => (e: any) => setData({ ...data, [field]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      type === "project"
        ? { name: data.name, description: data.description, status: data.status === "ativo" }
        : {
            projectId: data.projectId,
            date: data.date,
            participants: data.participants.split("\n").filter(Boolean),
            topics: data.topics,
            pending_tasks: data.tasks,
          }
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-violet-900">
          {type === "project" ? "Novo Projeto" : "Nova Reunião"}
        </h2>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-violet-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      {type === "project" ? (
        <>
          <Field label="Nome do Projeto">
            <input type="text" value={data.name} onChange={set("name")} className={inputClass} placeholder="Ex: Projeto X" required />
          </Field>
          <Field label="Descrição">
            <textarea value={data.description} onChange={set("description")} rows={3} className={inputClass} placeholder="Descreva o projeto..." required />
          </Field>
          <Field label="Status">
            <select value={data.status} onChange={set("status")} className={inputClass}>
              <option value="ativo">Ativo</option>
              <option value="pausado">Pausado</option>
            </select>
          </Field>
        </>
      ) : (
        <>
          <Field label="Projeto">
            <select value={data.projectId} onChange={set("projectId")} className={inputClass} required>
              <option value="">Selecione um projeto</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Data da Reunião">
            <input type="date" value={data.date} onChange={set("date")} className={inputClass} required />
          </Field>
          <Field label="Participantes (um por linha)">
            <textarea value={data.participants} onChange={set("participants")} placeholder="Ex: João, Maria..." rows={3} className={inputClass} required />
          </Field>
          <Field label="Tópicos Discutidos (um por linha)">
            <textarea value={data.topics} onChange={set("topics")} placeholder="Ex: Discussão do escopo, definição de prazos" rows={3} className={inputClass} required />
          </Field>
          <Field label="Tasks para Próxima Reunião (uma por linha)">
            <textarea value={data.tasks} onChange={set("tasks")} placeholder="Ex: Finalizar documentação, Agendar reunião com cliente" rows={3} className={inputClass} />
          </Field>
        </>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {type === "project" ? "Criar Projeto" : "Gerar ata da reunião"}
        </Button>
      </div>
    </form>
  );
}
