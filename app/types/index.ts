export interface Project {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Meeting {
  id: string;
  projectId: string;
  date: string;
  participants: string[];
  topics: string[];
  nextMeetingTasks: string[];
}
