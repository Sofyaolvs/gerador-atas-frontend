"use client";

import { Upload, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Project } from "../types";

interface UploadAreaProps {
  projects: Project[];
  onClose: () => void;
  onSubmit: (data: {
    file: File;
    projectId: string;
    meetingDate?: string;
    participants?: string[];
  }) => Promise<void>;
}

export function UploadArea({ projects, onClose, onSubmit }: UploadAreaProps) {
  const [file, setFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError("");
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const allowedExtensions = [".pdf", ".docx", ".txt"];

    const extension = selectedFile.name
      .toLowerCase()
      .substring(selectedFile.name.lastIndexOf("."));

    if (!allowedExtensions.includes(extension)) {
      setError("Formato inválido. Use PDF, DOCX ou TXT.");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    setError("");

    if (!file) {
      setError("Selecione um arquivo");
      return;
    }

    if (!projectId) {
      setError("Selecione um projeto");
      return;
    }

    setIsLoading(true);

    try {
      const participantsList = participants
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== "");

      await onSubmit({
        file,
        projectId,
        meetingDate: meetingDate || undefined,
        participants: participantsList.length > 0 ? participantsList : undefined,
      });

      setFile(null);
      setProjectId("");
      setMeetingDate("");
      setParticipants("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar ata");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClose();
  };

  return (
    <div className="flex flex-col w-full max-w-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-violet-900">Upload de ata</h2>
        <button
          onClick={onClose}
          type="button"
          className="text-slate-500 hover:text-slate-900 hover:cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}


      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Projeto <span className="text-red-500">*</span>
        </label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">Selecione um projeto</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>


      <div
        onClick={() => !isLoading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed transition-all
          ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
          ${isDragging ? "border-violet-500 bg-violet-50" : "border-slate-300 hover:border-violet-400"}
          ${file ? "border-violet-700 bg-violet-50" : ""}`}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx,.txt"
          disabled={isLoading}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2 text-violet-600">
            <Upload className="w-8 h-8" />
            <p className="font-medium text-sm">{file.name}</p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Upload className="w-8 h-8 text-violet-400" />
            <p className="font-medium text-violet-700 text-sm">
              Coloque a ata de reunião aqui
            </p>
            <p className="text-xs text-slate-400">
              PDF, DOCX ou TXT (máx 10MB)
            </p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Data da Reunião <span className="text-slate-400">(opcional)</span>
        </label>
        <input
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Participantes <span className="text-slate-400">(opcional)</span>
        </label>
        <input
          type="text"
          placeholder="João, Maria, Pedro"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          disabled={isLoading}
        />
        <p className="text-xs text-slate-400 mt-1">Separados por vírgula</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 px-2 py-2 rounded-2xl border-2 border-slate-700 text-slate-600 font-medium hover:bg-slate-300 hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || !projectId || isLoading}
          className={`flex-1 px-2 py-2 rounded-2xl border-2 border-violet-600 font-medium transition-colors flex items-center justify-center gap-2
            ${file && projectId && !isLoading
              ? "text-slate-700 hover:bg-violet-600 hover:text-white cursor-pointer"
              : "cursor-not-allowed text-slate-500 opacity-50"
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </div>
  );
}
