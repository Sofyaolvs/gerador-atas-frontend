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