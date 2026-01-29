"use client";

import { X, Copy, Check, DownloadIcon } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { Summary } from "../types";
import { Button } from "./Button";

interface SummaryModalProps {
  summary: Summary;
  onClose: () => void;
}

function markdownToDocxParagraphs(markdown: string): Paragraph[] {
  const lines = markdown.split("\n");
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      paragraphs.push(new Paragraph({}));
      continue;
    }

    if (trimmedLine.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.replace("### ", ""),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmedLine.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.replace("## ", ""),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 280, after: 120 },
        })
      );
    } else if (trimmedLine.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.replace("# ", ""),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 320, after: 140 },
        })
      );
    }

    else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      const text = trimmedLine.replace(/^[-*]\s/, "");
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(text.replace(/\*\*(.*?)\*\*/g, "$1"))],
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
        })
      );
    }

    else {
      const cleanText = trimmedLine.replace(/\*\*(.*?)\*\*/g, "$1");
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(cleanText)],
          spacing: { before: 120, after: 120 },
        })
      );
    }
  }

  return paragraphs;
}

export function SummaryModal({ summary, onClose }: SummaryModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "Ata da Reunião",
                heading: HeadingLevel.TITLE,
                spacing: { after: 300 },
              }),
              ...markdownToDocxParagraphs(summary.summary),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const fileName = `ata-reuniao-${new Date().toISOString().split("T")[0]}.docx`;
      saveAs(blob, fileName);

      setDownloading(false);
    } catch (error) {
      console.error("Erro ao gerar documento:", error);
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-violet-900">Ata da Reunião</h2>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-violet-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-96 overflow-y-auto prose prose-sm prose-slate max-w-none">
        <ReactMarkdown>
          {summary.sourceType === "uploaded"
            ? summary.summary.replace(/\n/g, "  \n")
            : summary.summary}
        </ReactMarkdown>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={handleCopy} className="flex-1">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "Copiado!" : "Copiar"}
        </Button>

        <Button type="button" variant="secondary" onClick={handleDownload} className="flex-1">
          {downloading ? <Check className="w-4 h-4 mr-2" /> : <DownloadIcon className="w-4 h-4 mr-2" />}
          {downloading ? "Baixando..." : "Baixar .docx"}
        </Button>
      </div>
    </div>
  );
}
