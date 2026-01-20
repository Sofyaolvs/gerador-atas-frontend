
import { StickyNote } from "lucide-react";

export function Header() {
  return (
    <header className="shadow-lg bg-violet-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <StickyNote className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Gerador de Atas</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
