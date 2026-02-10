
import React from 'react';
import { WorkflowStatus } from '../types';
import { 
  FileText, Filter, Layers, ShieldCheck, Play, 
  AlertTriangle, Clock, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface StatusConfig {
  label: string;
  color: string;
  icon: any;
  responsible: string;
  meaning: string;
  limitDays?: number;
  order: number;
}

export const STAGE_MAP: Record<WorkflowStatus, StatusConfig | null> = {
  [WorkflowStatus.SUBMITTED]: { 
    label: "Submitted", 
    color: "hq-blue", 
    icon: FileText, 
    responsible: "Xubin (Member)", 
    meaning: "Awaiting initial review", 
    order: 0 
  },
  [WorkflowStatus.UNDER_FILTERING]: { 
    label: "Filtering", 
    color: "hq-yellow", 
    icon: Filter, 
    responsible: "Sector Committee", 
    meaning: "Committee screening in progress", 
    limitDays: 7, 
    order: 1 
  },
  [WorkflowStatus.UNDER_REVIEW]: { 
    label: "Synthesis", 
    color: "hq-green", 
    icon: Layers, 
    responsible: "Central Council", 
    meaning: "Council debate & merging", 
    limitDays: 14, 
    order: 2 
  },
  [WorkflowStatus.REFINING]: { 
    label: "Synthesis", 
    color: "hq-green", 
    icon: Layers, 
    responsible: "Central Council", 
    meaning: "Council debate & merging", 
    limitDays: 14, 
    order: 2 
  },
  [WorkflowStatus.APPROVED]: { 
    label: "Final Guard", 
    color: "hq-black", 
    icon: ShieldCheck, 
    responsible: "Supreme Council", 
    meaning: "Constitutional review", 
    limitDays: 30, 
    order: 3 
  },
  [WorkflowStatus.CONVERTED_TO_POLICY]: { 
    label: "Execution", 
    color: "hq-green", 
    icon: Play, 
    responsible: "Executive Body", 
    meaning: "Approved and being implemented", 
    order: 4 
  },
  [WorkflowStatus.TERMINATED]: null,
  [WorkflowStatus.PAUSED]: null,
  [WorkflowStatus.RETURNED]: null,
  [WorkflowStatus.REJECTED]: null,
};

const STAGES_ORDERED = [
  WorkflowStatus.SUBMITTED,
  WorkflowStatus.UNDER_FILTERING,
  WorkflowStatus.UNDER_REVIEW,
  WorkflowStatus.APPROVED,
  WorkflowStatus.CONVERTED_TO_POLICY
];

interface VisualizerProps {
  status: WorkflowStatus;
  createdAt: string;
}

export const GovernanceStatusBadge: React.FC<VisualizerProps> = ({ status, createdAt }) => {
  const config = STAGE_MAP[status];
  if (!config) return <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">{status}</span>;

  const Icon = config.icon;
  const createdDate = new Date(createdAt);
  const diffTime = Math.abs(new Date().getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExceeded = config.limitDays ? diffDays > config.limitDays : false;

  const colorClasses: Record<string, string> = {
    'hq-blue': "bg-blue-50 text-hq-blue border-hq-blue/20",
    'hq-yellow': "bg-yellow-50 text-hq-yellow border-hq-yellow/20",
    'hq-green': "bg-green-50 text-hq-green border-hq-green/20",
    'hq-black': "bg-slate-900 text-white border-slate-800",
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div 
        title={`${config.meaning} | Responsible: ${config.responsible}`}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${colorClasses[config.color]} ${isExceeded ? 'border-dashed border-red-500 ring-2 ring-red-50' : ''}`}
      >
        <Icon size={12} />
        {config.label}
        {isExceeded && <AlertTriangle size={12} className="text-red-500 ml-1 animate-pulse" />}
      </div>
      <div className="flex items-center gap-2 px-1">
        <Clock size={10} className="text-slate-400" />
        <span className={`text-[9px] font-black uppercase tracking-tight ${isExceeded ? 'text-red-600 font-black' : 'text-slate-400'}`}>
          In this stage: {diffDays} days
          {isExceeded && " (EXCEEDED LIMIT)" }
        </span>
      </div>
    </div>
  );
};

export const GovernancePipelineProgress: React.FC<{ status: WorkflowStatus }> = ({ status }) => {
  const currentConfig = STAGE_MAP[status];
  const currentIndex = currentConfig ? currentConfig.order : -1;

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        
        {STAGES_ORDERED.map((stageStatus, index) => {
          const config = STAGE_MAP[stageStatus]!;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const Icon = config.icon;

          return (
            <div key={stageStatus} className="relative z-10 flex flex-col items-center group">
              <div 
                title={`${config.label}: ${config.meaning}`}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                  isCompleted ? 'bg-hq-green border-green-100 text-white shadow-lg' :
                  isCurrent ? `bg-white border-hq-yellow text-hq-black scale-110 shadow-lg` :
                  'bg-slate-50 border-slate-100 text-slate-300'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>
              <span className={`mt-3 text-[8px] font-black uppercase tracking-widest transition-colors ${
                isCurrent ? `text-hq-black` :
                isCompleted ? 'text-hq-green' : 'text-slate-400'
              }`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};