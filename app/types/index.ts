export interface Project {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  created_at?: Date;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  status: boolean;
}

export interface Meeting {
  _id: string;
  projectId: string;
  participants: string[];
  date: Date;
  topics: string;
  pending_tasks: string;
  created_at?: Date;
}

export interface CreateMeetingDto {
  projectId: string;
  participants: string[];
  date: string;
  topics: string;
  pending_tasks: string;
}

export interface Summary {
  _id: string;
  meetingId: string;
  meetingData: Meeting;
  summary: string;
  created_at: Date;
}

export interface CreateSummaryDto {
  meetingId: string;
}

export interface SummaryResponse {
  success: boolean;
  data?: Summary;
  message?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SendMessageDto {
  projectId: string;
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  conversationId: string;
  projectId: string;
  message: string;
  response: string;
  created_at: string;
}

export interface ConversationHistory {
  conversationId: string;
  projectId: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    created_at: string;
  }>;
}

export interface Conversation {
  conversationId: string;
  projectId: string;
  created_at: string;
  lastMessage?: string;
}