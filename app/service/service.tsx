import {
  Project,
  CreateProjectDto,
  Meeting,
  CreateMeetingDto,
  Summary,
  SummaryResponse,
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