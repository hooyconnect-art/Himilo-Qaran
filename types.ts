
export interface SystemHealth {
  participationRate: number;
  captureRisk: 'Low' | 'Medium' | 'High';
  regionalBalance: number;
  unresolvedGrievances: number;
}

export enum Role {
  SUPER_ADMIN = 'Maamulaha Sare (Architect)',
  ELECTION_ADMIN = 'Maamulaha Doorashoda',
  OVERSIGHT = 'Guddiga Kormeerka (Oversight)',
  XUBIN = 'Xubin Guud',
  DHALINYARO = 'Xubin Dhalinyaro',
  COMMITTEE_MEMBER = 'Xubin Gudi Qaybeed',
  GOLE_DHEXE = 'Golaha Dhexe',
  GOLE_SARE = 'Golaha Sare',
  FULINTA = 'Hay’adda Fulinta',
  CHAIRPERSON_PENDING = 'Guddoomiye Sugitaan (Post-Election)',
  CHAIRPERSON_ACTIVE = 'Guddoomiye Firfircoon',
  COMMITTEE = 'Guddiga Siyaasadda (Committee)'
}

export enum WorkflowStatus {
  SUBMITTED = 'SUBMITTED',             
  UNDER_FILTERING = 'UNDER_FILTERING', 
  UNDER_REVIEW = 'UNDER_REVIEW',       
  REFINING = 'REFINING',               
  APPROVED = 'APPROVED',               
  CONVERTED_TO_POLICY = 'CONVERTED_TO_POLICY', 
  TERMINATED = 'TERMINATED',
  PAUSED = 'PAUSED',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED'
}

export type AppView = 
  | 'dashboard'              
  | 'admin-membership'
  | 'admin-committees'
  | 'admin-policy'
  | 'admin-elections'
  | 'admin-candidates'
  | 'admin-jobs'
  | 'admin-oversight'
  | 'admin-memory'
  | 'voting-terminal'
  | 'election-results'
  | 'member-registration'
  | 'member-submission'
  | 'page-submission'
  | 'page-filtering'
  | 'page-synthesis'
  | 'page-final-guard'
  | 'page-execution'
  | 'activation-team-proposal'
  | 'review-council-opinion'
  | 'oversight-team-review';

export enum MembershipStatus {
  SUGITAAN = 'Sugitaan',
  LA_ANSIXIYAY = 'La Ansixiyay',
  LA_DIIDAY = 'La Diiday',
  INACTIVE = 'Aan Firfirconayn',
  PENDING_ACTIVATION = 'Sugitaan Hawl-gelin'
}

export enum MembershipType {
  GUUD = 'General Member',
  FIRFIRCOON = 'Active Member',
  PROFESSIONAL = 'Professional'
}

export interface ReviewAction {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  actionType: string;
  notes: string;
  timestamp: string;
}

export enum PolicyType {
  SIYAASAD = 'Siyaasad',
  SHARCI = 'Sharci',
  MABAADII = 'Mabaadii'
}

export enum ImpactLevel {
  QARAN = 'Qaran',
  GOBOL = 'Gobol',
  DEGMO = 'Degmo'
}

export enum AppealStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  UPHELD = 'UPHELD',
  OVERTURNED = 'OVERTURNED',
  RETURNED = 'RETURNED'
}

export interface Appeal {
  id: string;
  appellantId: string;
  appellantName: string;
  justification: string;
  legalBasis: string;
  status: AppealStatus;
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'pending';
  date?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  status: WorkflowStatus;
  createdAt: string;
  category: string;
  version: number;
  reviewHistory: ReviewAction[];
  linkedCampaignsCount?: number;
  synthesisVotes?: {
    for: number;
    against: number;
    total: number;
  };
  progress?: number;
  assignedExecutive?: string;
  milestones?: ProjectMilestone[];
  kpis?: string[];
  appeals?: Appeal[];
  policyType?: PolicyType;
  impactLevel?: ImpactLevel;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  details: string;
  affectedEntityId?: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  region: string;
  district: string;
  gender: string;
  birthDate: string;
  status: MembershipStatus;
  membershipType: MembershipType;
  participationScore: number;
  phone: string;
  nationalId: string;
  email?: string;
  password?: string;
  createdAt: string;
}

export enum ElectionStatus {
  DRAFT = 'Qabyo',
  OPEN_FOR_APPLICATION = 'Diiwaangelin Furan',
  REGISTRATION_CLOSED = 'Diiwaangelintu waa Xiran tay',
  CODBIXINTA = 'Codbixinta',
  CLOSED = 'Xiran',
  FINALIZED = 'Natiijada la Hubiyay',
  DHAMMAYSTIRAN = 'Dhammaystiran',
  APPEAL = 'Racfaan',
  CHAIRPERSON_PENDING = 'Guddoomiye Sugitaan'
}

export enum ElectionLevel {
  QARAN = 'Heer Qaran',
  GOBOL = 'Heer Gobol',
  DEGMO = 'Heer Degmo'
}

export interface ElectionConfiguration {
  votingStartAt: string;
  votingEndAt: string;
  electionCycle?: string;
}

export interface ElectionEvent {
  id: string;
  title: string;
  committeeId: string; // Links to Job Registry
  status: ElectionStatus;
  startDate: string;
  endDate: string;
  registrationEnd: string;
  level: string;
  scope: string;
  jobIds: string[];
  totalVoters: number;
  votesCast: number;
  campaignPolicyIds?: string[];
  registrationEnabled?: boolean;
  registrationStart?: string;
  voterPool?: MembershipType;
  isLocked?: boolean;
  config?: ElectionConfiguration;
}

export enum JobCategory {
  FARSAMO = 'Technical',
  SIYAASAD = 'Policy',
  HOGGAAN = 'Leadership'
}

export enum VotingMethod {
  DIRECT = 'Direct Vote',
  COUNCIL = 'Council Selection'
}

export interface JobPosition {
  id: string;
  jobCode: string;
  title: string;
  committeeId: string;
  category: JobCategory;
  level: string;
  termMonths: number;
  termLimit: number;
  youthQuota: boolean;
  votingMethod: VotingMethod;
  kpis: string[];
  status: 'ACTIVE' | 'INACTIVE';
  requirements: {
    membershipType: MembershipType;
    status: MembershipStatus;
  };
}

export enum CandidateStatus {
  SUGITAAN = 'Sugitaan',
  ANSIXIYAY = 'Ansixiyay',
  REJECTED = 'La Diiday',
  VERIFIED = 'La Hubiyay'
}

export interface CandidateRecord {
  id: string;
  userId: string;
  electionId: string;
  jobId: string;
  status: CandidateStatus;
  votesCount: number;
  statementOfIntent: string;
  conflictDeclaration?: string;
}

export interface VoteRecord {
  id: string;
  electionId: string;
  candidateId: string;
  timestamp: string;
  voterId: string;
  hash: string;
}

export interface TeamMember {
  jobId: string;
  memberId: string;
  memberName: string;
}

export interface TeamProposal {
  id: string;
  chairpersonId: string;
  chairpersonName: string;
  electionId: string;
  committeeId: string;
  members: TeamMember[];
  // Added OPINION_WINDOW and OVERSIGHT_REVIEW to status union
  status: 'DRAFT' | 'SUBMITTED' | 'OPINION_WINDOW' | 'OVERSIGHT_REVIEW' | 'PENDING_OVERSIGHT' | 'APPROVED' | 'RETURNED' | 'REJECTED';
  submittedAt?: string;
}

export interface CouncilOpinion {
  id: string;
  proposalId: string;
  actorId: string;
  actorName: string;
  opinion: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  timestamp: string;
}

export enum PlanStatus {
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  RETURNED = 'RETURNED'
}

export interface ActionPlan {
  id: string;
  chairpersonId: string;
  chairpersonName: string;
  committeeId: string;
  committeeName: string;
  electionId: string;
  vision: string;
  objectives: string[];
  selectedActivities: string[];
  implementationDetails: Record<string, { method: string, timeline: string, kpi: string }>;
  team: { role: string, memberId: string, memberName: string, tasks: string[] }[];
  oathAccepted: boolean;
  status: PlanStatus;
  submittedAt: string;
}

// Added missing ReviewCommitteeType enum
export enum ReviewCommitteeType {
  MEMBERSHIP = 'Membership',
  PROPOSAL = 'Proposal',
  ETHICS = 'Ethics',
  ELIGIBILITY = 'Eligibility'
}

// Added missing Committee interface
export interface Committee {
  id: string;
  name: string;
  type: ReviewCommitteeType;
  module: string;
  membersCount: number;
  mandate: string;
  prohibited: string[];
  kpis: string[];
  status: string;
  riskLevel: string;
}

// Added missing CampaignMapping interface
export interface CampaignMapping {
  electionId: string;
}

// Added missing ExecutionProject interface
export interface ExecutionProject {
  id: string;
  title: string;
}
