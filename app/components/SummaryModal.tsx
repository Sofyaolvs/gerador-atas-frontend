"use client";

import { X, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Summary } from "../types";
import { Button } from "./Button";

interface SummaryModalProps {
  summary: Summary;
  onClose: () => void;
}

export function SummaryModal({ summary, onClose }: SummaryModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-violet-900">Ata da Reunião</h2>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-violet-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans">
          {summary.summary}
        </pre>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={handleCopy} className="flex-1">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "Copiado!" : "Copiar"}
        </Button>
      </div>
    </div>
  );
}
