export type UserRole = 'PATIENT' | 'HEALTH_PRO' | 'DOCTOR' | 'PSYCHOLOGIST' | 'PHYSIOTHERAPIST';

export interface DailyRecordStats {
  averagePain: number;
  goodDays: number;
  badDays: number;
  totalRecords: number;
  adherence: number;
}

export interface ChartDataPoint {
  date: string;
  painIntensity: number;
  dayType: 'good' | 'neutral' | 'bad';
}

export interface DashboardData {
  chartData: ChartDataPoint[];
  stats: DailyRecordStats;
  activeIndications: number;
  communities: { id: string; name: string; pathology: string }[];
}

export interface TakenMedicationEntry {
  id: string;
  relief: number;
}

export interface DailyRecord {
  id: string;
  date: string;
  painIntensity: number;
  dayType?: 'good' | 'neutral' | 'bad';
  symptoms?: string[];
  triggers?: string[];
  medications?: { name: string; dose: string; effects?: string }[];
  notes?: string;
  painAreas?: string[];
  painDurationUnit?: 'hours' | 'days' | 'weeks' | 'months' | 'chronic';
  painDurationValue?: number | null;
  painTypes?: string[];
  activities?: string[];
  phq2Answer1?: number | null;
  phq2Answer2?: number | null;
  gad2Answer1?: number | null;
  gad2Answer2?: number | null;
  functionalImpactPhysical?: number;
  functionalImpactWork?: number;
  functionalImpactSocial?: number;
  functionalImpactSleep?: number;
  takenMedications?: TakenMedicationEntry[];
}

export type MedicationType = 'analgesic' | 'antiinflammatory' | 'muscle-relaxant' | 'other';

export interface Medication {
  id: string;
  name: string;
  type: MedicationType;
  dose: string;
  frequency: number;
  lastTaken?: string;
  nextDose?: string;
  substance?: string;
  clinicalUse?: string;
  takenHistory?: string[];
}

export interface MedicationCatalogItem {
  id: string;
  name: string;
  substance: string;
  defaultFrequency: number;
  type: MedicationType;
  standardDose: string;
  clinicalUse: string;
}

export interface Recommendation {
  category: 'autocuidado' | 'cesfam-ccr' | 'sapu-sar' | 'urgencia';
  message: string;
}

/** Origen de un mensaje de chat: AlivIA IA o un miembro del equipo médico. */
export type ChatChannel = 'ai' | 'team';

export interface ChatMessage {
  id: string;
  channel: ChatChannel;
  authorName: string;
  authorRole: 'AlivIA' | 'PATIENT' | 'DOCTOR' | 'PSYCHOLOGIST' | 'PHYSIOTHERAPIST';
  body: string;
  createdAt: string;
}

export type CommunityPostCategory =
  | 'experiencias'
  | 'preguntas'
  | 'logros'
  | 'recursos'
  | 'apoyo';

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  category: CommunityPostCategory;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
}

export interface VoiceSpace {
  id: string;
  title: string;
  hostName: string;
  description: string;
  scheduledFor: string | null;
  isLive: boolean;
  participants: number;
  channelName: string;
}
