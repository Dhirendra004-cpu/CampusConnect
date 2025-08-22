export type UserRole = "student" | "admin";

export interface UserProfile {
  uid: string;
  email: string | null;
  role: UserRole;
  name?: string;
}

export type NoticeCategory = "Academic" | "Exam" | "Cultural" | "Sports";

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  createdAt: Date;
  fileUrl?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: Date;
  venue: string;
  organizer: string;
  registeredStudents?: string[];
  fileUrl?: string;
}
