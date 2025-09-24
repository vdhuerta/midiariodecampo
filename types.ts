export interface Attachment {
  name: string;
  type: string;
  data: string; // base64 data URL
}

export interface LinkedGoal {
  goalId: string;
  progress: number;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO String format
  title: string;
  reflection: string;
  skills: string;
  deontology: string;
  dimensions: string;
  tags: string[];
  competencies: string[];
  linkedGoals: LinkedGoal[];
  attachment?: Attachment;
  supervisorFeedback?: string;
  linkedBibliography?: string[];
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  progress: number;
}