import {
  Project,
  CreateProjectDto,
  Meeting,
  CreateMeetingDto,
  Summary,
  SummaryResponse,
  SendMessageDto,
  ChatResponse,
  ConversationHistory,
  Conversation,
  UploadAtaDto,
  UploadAtaResponse,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const projectService = {
  create: async (data: CreateProjectDto): Promise<Project> => {
    const res = await fetch(`${API_URL}/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getAll: async (): Promise<Project[]> => {
    const res = await fetch(`${API_URL}/project`);
    return res.json();
  },

  getById: async (id: string): Promise<Project> => {
    const res = await fetch(`${API_URL}/project/${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/project/${id}`, {
      method: "DELETE",
    });
  },
};

export const meetingService = {
  create: async (data: CreateMeetingDto): Promise<Meeting> => {
    const res = await fetch(`${API_URL}/meeting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getAll: async (): Promise<Meeting[]> => {
    const res = await fetch(`${API_URL}/meeting`);
    return res.json();
  },

  getById: async (id: string): Promise<Meeting> => {
    const res = await fetch(`${API_URL}/meeting/${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/meeting/${id}`, { method: "DELETE" });
  },
};

export const summaryService = {
  generate: async (meetingId: string): Promise<SummaryResponse> => {
    const res = await fetch(`${API_URL}/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ meetingId }),
    });
    return res.json();
  },

  upload: async (data: UploadAtaDto): Promise<UploadAtaResponse> => {
    const formData = new FormData();

    formData.append("file", data.file);
    formData.append("projectId", data.projectId);

    if (data.meetingDate) {

      formData.append("meetingDate", new Date(data.meetingDate).toISOString());
    }

    if (data.participants && data.participants.length > 0) {
      data.participants.forEach((p) => formData.append("participants", p));
    }

    const res = await fetch(`${API_URL}/summary/upload`, {
      method: "POST",
      body: formData,
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Erro ao enviar ata");
    }

    return responseData;
  },

  getAll: async (): Promise<Summary[]> => {
    const res = await fetch(`${API_URL}/summary`);
    return res.json();
  },

  getById: async (id: string): Promise<Summary> => {
    const res = await fetch(`${API_URL}/summary/${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/summary/${id}`, { method: "DELETE" });
  },
};

export const chatService = {
  sendMessage: async (data: SendMessageDto): Promise<ChatResponse> => {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Erro ao enviar mensagem");
    }
    return res.json();
  },

  getConversationHistory: async (conversationId: string): Promise<ConversationHistory> => {
    const res = await fetch(`${API_URL}/chat/conversation/${conversationId}`);
    if (!res.ok) {
      throw new Error("Erro ao carregar histórico");
    }
    return res.json();
  },

  getProjectConversations: async (projectId: string): Promise<Conversation[]> => {
    const res = await fetch(`${API_URL}/chat/project/${projectId}`);
    if (!res.ok) {
      throw new Error("Erro ao carregar conversas");
    }
    return res.json();
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/chat/conversation/${conversationId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Erro ao deletar conversa");
    }
  },
};