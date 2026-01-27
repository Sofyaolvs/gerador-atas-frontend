import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface UploadAreaProps {
    onClose: () => void;
    onSubmit: (file: File) => void;
}


export function UploadArea({ onClose, onSubmit }: UploadAreaProps){
    const [file, setFile] = useState<File|null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver =(e:React.DragEvent)=>{
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave =(e: React.DragEvent)=>{
        e.preventDefault();
        setIsDragging(false);
    }

    const handleDrop=(e: React.DragEvent)=>{
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    }

    const handleFileChange =(e: React.ChangeEvent<HTMLInputElement>)=>{
        const selectedFile = e.target.files?.[0]
        if(selectedFile){
            setFile(selectedFile)
        }
    }

    const handleSubmit=()=>{
        if(file && onSubmit){
            onSubmit(file);
        }
    }

    const handleCancel=()=>{
        setFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onClose();
    }

    return(
        <div className="flex flex-col w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-violet-900">Upload de atas</h2>
                <button onClick={onClose} type="button" className="text-slate-500 hover:text-slate-900 hover:cursor-pointer transition-colors">
                    <X className="w-6 h-6"/>
                </button>
            </div>

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer
                    ${isDragging
                        ? "border-violet-500"
                        : "border-slate-300 hover:border-violet-400"}
                    ${file ? "border-violet-700" : ""}`}
            >
                <input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt"/>

                {file ? (
                    <div className="flex flex-col items-center gap-2 text-violet-600">
                        <Upload className="w-10 h-10"/>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Upload className="w-10 h-10 text-violet-400" />
                        <p className="font-medium text-violet-700">Coloque a ata de reunião aqui</p>
                        <p className="text-xs text-slate-400">Arraste ou clique para selecionar</p>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-2 py-2 rounded-2xl border-2 border-slate-700 text-slate-600 font-medium hover:bg-slate-300 hover:text-slate-700 transition-colors cursor-pointer"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!file}
                    className={`flex-1 px-2 py-2 rounded-2xl border-2 border-violet-600 font-medium transition-colors
                        ${file ? "text-slate-700 hover:bg-violet-600 hover:text-white cursor-pointer" : "cursor-not-allowed text-slate-500"}
                    `}
                >
                    Enviar
                </button>
            </div>
        </div>
    )
}