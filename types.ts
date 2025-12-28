
export enum UserRole {
  PARTICIPANT = 'participant',
  FACILITATOR = 'facilitator'
}

export interface User {
  userId: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  srpmicAffiliation: string;
  createdAt: string;
}

export interface Intake {
  userId: string;
  baselineConnection: number;
  baselineStress: number;
  baselineEfficacy: number;
  primaryGoal: string;
  meaningOfIndigenousGenius: string;
}

export interface Worksheet {
  week: number;
  data: Record<string, any>;
  anonymous: boolean;
  date: string;
}

export interface Session {
  cohortId: string;
  weekNumber: number;
  topic: string;
  dateTime: string;
  zoomLink: string;
}

export interface CohortReport {
  participants: number;
  sessions: number;
  completionRatePercent: number;
  preAverages: { connection: number; stress: number; efficacy: number };
  postAverages: { connection: number; stress: number; efficacy: number };
  deltas: { connectionChange: number; stressChange: number; efficacyChange: number };
}
