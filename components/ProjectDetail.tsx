
import React from 'react';
import { Idea, ProjectMilestone } from '../types';
import { ArrowLeft, CheckCircle2, Clock, Target, FileText, AlertTriangle, Send } from 'lucide-react';

interface ProjectDetailProps {
  project: Idea;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Target size={120} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                 <span className="text-[10px] font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full uppercase tracking-wider">Active Execution</span>
                 <span className="text-xs text-slate-400">ID: #{project.id.slice(0, 8)}</span>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 mb-4">{project.title}</h2>
               <p className="text-slate-600 leading-relaxed mb-8">{project.description}</p>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Completion</div>
                    <div className="text-xl font-bold text-slate-900">{project.progress}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Lead Unit</div>
                    <div className="text-xl font-bold text-slate-900">{project.assignedExecutive || 'Unassigned'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Milestones</div>
                    <div className="text-xl font-bold text-slate-900">{project.milestones?.filter(m => m.status === 'completed').length} / {project.milestones?.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</div>
                    <div className="text-xl font-bold text-emerald-500">Normal</div>
                  </div>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Implementation Milestones</h3>
              <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Add Milestone</button>
            </div>
            <div className="p-6">
              <div className="space-y-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />
                {project.milestones?.map((milestone, idx) => (
                  <div key={milestone.id} className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-emerald-500 text-white' : 
                      milestone.status === 'in-progress' ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {milestone.status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-bold ${milestone.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                          {milestone.label}
                        </h4>
                        {milestone.date && <span className="text-[10px] text-slate-400">{milestone.date}</span>}
                      </div>
                      <div className="mt-1 text-[10px] uppercase font-bold text-slate-400">{milestone.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <FileText size={18} className="text-indigo-400" />
                Linked Decision
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed italic mb-4">
                "Infrastructure project for decentralized energy production across regional hubs. Budget capped at Institutional Tier 2."
              </p>
              <div className="text-[10px] font-mono text-indigo-400 bg-indigo-900/50 p-2 rounded">
                Ref: GS-2024-415-X
              </div>
              <div className="mt-6 flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <AlertTriangle className="text-amber-400 shrink-0" size={16} />
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  <b>Immutability Note:</b> The Executive Body cannot modify this text. Any requested change requires a return to Supreme Council.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-sm">Key Performance Indicators</h4>
            <div className="space-y-6">
              {project.kpis?.map((kpi, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-medium text-slate-600">{kpi}</span>
                    <span className="text-xs font-bold text-indigo-600">82%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-sm">Submit Progress Report</h4>
            <textarea 
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 outline-none focus:ring-1 focus:ring-indigo-500"
              rows={4}
              placeholder="Detail work performed in the last 72 hours..."
            />
            <button className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
              <Send size={14} /> Submit Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
