export interface Task {
  id: string; // Ensure id is a string for consistency
  title: string;
  deadline: string;
  status: 'completed' | 'pending';
  points: number;
}

export interface FacultyTask extends Task {}

export interface PiTask extends Task {}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  role: 'Faculty' | 'Student' | 'PI Team';
}

export interface Student {
  name: string;
  points: number;
}
