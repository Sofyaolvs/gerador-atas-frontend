import { Send } from "lucide-react";
import { Button } from "./Button";

export function ChatInput() {

  return (
    <form  className="w-full">
      <div className="relative flex items-end gap-2">
        <input
          type="text"
          placeholder="Tire dúvidas sobre as reuniões e projetos..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <Button
            type="submit"
            variant="secondary"
            size="sm"
            rightIcon={<Send className="h-4 w-4" />} 
            children={undefined}
        />
      </div>
    </form>
  );
};