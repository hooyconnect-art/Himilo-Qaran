
import React from 'react';
import { Idea, Role, WorkflowStatus } from '../types';
import { 
  GitPullRequest, 
  ArrowRight, 
  Clock, 
  User, 
  MessageSquare,
  Pause,
  Play,
  CheckCircle
} from 'lucide-react';

interface WorkflowPipelineProps {
  ideas: Idea[];
  userRole: Role;
  onUpdateStatus: (id: string, status: WorkflowStatus) => void;
}

const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({ ideas, userRole, onUpdateStatus }) => {
  const stages = [
    { status: WorkflowStatus.SUBMITTED, label: 'Xubin Ideas', color: 'slate' },
    { status: WorkflowStatus.UNDER_REVIEW, label: 'Committee Filter', color: 'blue' },
    { status: WorkflowStatus.REFINING, label: 'Central Synthesis', color: 'indigo' },
    { status: WorkflowStatus.APPROVED, label: 'Supreme Review', color: 'amber' },
    { status: WorkflowStatus.CONVERTED_TO_POLICY, label: 'Executive Action', color: 'emerald' }
  ];

  // Helper to determine if a role can act on a specific status
  const canAct = (status: WorkflowStatus) => {
    switch (userRole) {
      case Role.COMMITTEE: return status === WorkflowStatus.SUBMITTED;
      case Role.GOLE_DHEXE: return status === WorkflowStatus.UNDER_REVIEW;
      case Role.GOLE_SARE: return status === WorkflowStatus.REFINING || status === WorkflowStatus.APPROVED;
      case Role.FULINTA: return status === WorkflowStatus.CONVERTED_TO_POLICY;
      default: return false;
    }
  };

  const getNextStatus = (current: WorkflowStatus): WorkflowStatus | null => {
    switch (current) {
      case WorkflowStatus.SUBMITTED: return WorkflowStatus.UNDER_REVIEW;
      case WorkflowStatus.UNDER_REVIEW: return WorkflowStatus.REFINING;
      case WorkflowStatus.REFINING: return WorkflowStatus.APPROVED;
      case WorkflowStatus.APPROVED: return WorkflowStatus.CONVERTED_TO_POLICY;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Governance Pipeline</h2>
        <p className="text-slate-500">Transparency flow from idea to institutional execution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {stages.map((stage) => (
          <div key={stage.status} className="flex flex-col h-full bg-slate-100/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className={`w-2 h-2 rounded-full bg-${stage.color}-500 shadow-sm`} />
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{stage.label}</h3>
              <span className="ml-auto text-xs font-bold text-slate-400">
                {ideas.filter(i => i.status === stage.status).length}
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {ideas
                .filter(i => i.status === stage.status)
                .map((idea) => (
                  <div key={idea.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all group">
                    <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600">
                      {idea.title}
                    </h4>
                    
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        {idea.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        v{idea.version}
                      </div>
                    </div>

                    {canAct(idea.status) && (
                      <div className="pt-3 border-t border-slate-100 flex gap-2">
                        <button 
                          onClick={() => {
                            const next = getNextStatus(idea.status);
                            if (next) onUpdateStatus(idea.id, next);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                        >
                          Advance <ArrowRight size={14} />
                        </button>
                        {userRole === Role.GOLE_SARE && (
                          <button 
                             onClick={() => onUpdateStatus(idea.id, WorkflowStatus.PAUSED)}
                             className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                          >
                            <Pause size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              {ideas.filter(i => i.status === stage.status).length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                  <Clock className="mx-auto text-slate-300 mb-2" size={24} />
                  <p className="text-xs text-slate-400">No items in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowPipeline;
