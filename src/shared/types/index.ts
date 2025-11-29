// Ruta: src/shared/types/index.ts

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'psychologist';
  profileImageUrl?: string;
  phone?: string;
  dateOfBirth?: string;
  personalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// APPOINTMENT TYPES
// ============================================

export interface Appointment {
  id: string;
  patientId: string;
  psychologistId: string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface WebSocketMessage {
  type: 'chat_message' | 'typing' | 'read' | 'error';
  data?: any;
  error?: string;
}

// ============================================
// AI ANALYSIS TYPES
// ============================================

export interface EmotionalAnalysis {
  id: string;
  patientId: string;
  psychologistId: string;
  analysisType: 'emotional_trend' | 'risk_assessment' | 'progress_report';
  analysisData: {
    overallSentiment: number;
    emotionalPatterns: EmotionalPattern[];
    trends: TrendData[];
    riskFactors: RiskFactor[];
  };
  confidenceScore: number;
  sentimentScore: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  keyTopics: string[];
  analyzedAt: string;
  dataRangeStart: string;
  dataRangeEnd: string;
  createdAt: string;
}

export interface EmotionalPattern {
  emotion: string;
  intensity: number;
  frequency: number;
}

export interface TrendData {
  period: string;
  sentiment: number;
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string[];
}

// ============================================
// DIAGNOSIS TYPES
// ============================================

export interface DiagnosisSuggestion {
  id: string;
  patientId: string;
  psychologistId: string;
  symptoms: string[];
  suggestedConditions: DiagnosisCondition[];
  recommendedTests: string[];
  treatmentOptions: TreatmentOption[];
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
  psychologistNotes?: string;
  finalDiagnosis?: string;
  createdAt: string;
  reviewedAt?: string;
  updatedAt: string;
}

export interface DiagnosisCondition {
  condition: string;
  confidence: number;
  icd10Code?: string;
  symptoms: string[];
  urgency: 'low' | 'medium' | 'high';
}

export interface TreatmentOption {
  type: string;
  description: string;
  expectedDuration: string;
}

// ============================================
// INSIGHTS TYPES
// ============================================

export interface ChatInsights {
  id: string;
  patientId: string;
  psychologistId: string;
  messageCount: number;
  analyzedMessages: string[];
  keyTopics: KeyTopic[];
  emotionalPatterns: any;
  languageIndicators: any;
  riskMarkers: string[];
  overallSentiment: number;
  stressLevel: 'low' | 'medium' | 'high';
  engagementScore: number;
  suggestedFollowUp: string[];
  interventionNeeded: boolean;
  analysisPeriodStart: string;
  analysisPeriodEnd: string;
  createdAt: string;
}

export interface KeyTopic {
  topic: string;
  relevance: number;
  mentions: number;
}

// ============================================
// REPORT TYPES
// ============================================

export interface GeneratedReport {
  id: string;
  patientId: string;
  psychologistId: string;
  reportType: 'progress' | 'summary' | 'diagnostic' | 'treatment_plan';
  reportTitle: string;
  reportContent: ReportContent;
  includedData: any;
  timePeriodStart?: string;
  timePeriodEnd?: string;
  keyFindings: string[];
  recommendations: string[];
  actionItems: any[];
  status: 'draft' | 'reviewed' | 'shared_with_patient';
  psychologistEdits?: string;
  sharedWithPatient: boolean;
  generatedAt: string;
  reviewedAt?: string;
  sharedAt?: string;
}

export interface ReportContent {
  executiveSummary: string;
  patientOverview: {
    presentingIssues: string[];
    currentStatus: string;
    keyStrengths: string[];
  };
  clinicalFindings: ClinicalFinding[];
  progressAssessment: ProgressAssessment;
  recommendations: RecommendationItem[];
  nextSteps: string[];
  professionalNotes: string;
}

export interface ClinicalFinding {
  finding: string;
  evidence: string;
  significance: string;
}

export interface ProgressAssessment {
  overallProgress: string;
  areasOfImprovement: string[];
  areasNeedingAttention: string[];
  progressMetrics: {
    engagement: number;
    goalAttainment: number;
    symptomReduction: number;
  };
}

export interface RecommendationItem {
  recommendation: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface PatientAnalytics {
  id: string;
  patientId: string;
  psychologistId: string;
  periodStart: string;
  periodEnd: string;
  totalSessions: number;
  attendedSessions: number;
  cancelledSessions: number;
  sessionAdherenceRate: number;
  totalMessages: number;
  avgResponseTimeMinutes: number;
  engagementScore: number;
  avgSentimentScore: number;
  sentimentTrend: 'improving' | 'stable' | 'declining';
  stressLevelAvg: number;
  progressScore: number;
  improvementRate: number;
  goalCompletionRate: number;
  aiInsights: any;
  riskAssessment: any;
  calculatedAt: string;
  updatedAt: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AppointmentForm {
  patientId: string;
  scheduledAt: string;
  duration: number;
  notes?: string;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
}