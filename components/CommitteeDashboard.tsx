
import React from 'react';
import { Idea, WorkflowStatus } from '../types';
import { ClipboardList, Filter, Zap, Users, ArrowRight, Layers } from 'lucide-react';

interface CommitteeDashboardProps {
  ideas: Idea[];
  onActionIdea: (id: string) => void;
}

const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({ ideas, onActionIdea }) => {
  const pendingReview = ideas.filter(i => i.status === WorkflowStatus.SUBMITTED);
  const totalReviewed = ideas.filter(i => i.status !== WorkflowStatus.SUBMITTED).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Committee Review Hub</h2>
          <p className="text-slate-500">Technical filtering and merging of member proposals.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Review Queue</div>
            <div className="text-lg font-bold text-indigo-600">{pendingReview.length}</div>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Filtered</div>
            <div className="text-lg font-bold text-slate-700">{totalReviewed}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ClipboardList size={18} className="text-indigo-600" />
                Awaiting Technical Review
              </h4>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"><Filter size={14} /></button>
                <button className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"><Layers size={14} /></button>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {pendingReview.length > 0 ? pendingReview.map(idea => (
                <div key={idea.id} className="p-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{idea.category}</span>
                        <span className="text-[10px] text-slate-400">ID: {idea.id.slice(0, 8)}</span>
                      </div>
                      <h5 className="font-bold text-slate-900 mb-2">{idea.title}</h5>
                      <p className="text-sm text-slate-600 line-clamp-2">{idea.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => onActionIdea(idea.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-indigo-700 flex items-center gap-2 transition-all"
                      >
                        Technical Review <ArrowRight size={14} />
                      </button>
                      <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 flex items-center gap-2 transition-all">
                        Mark Duplicate
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1"><Users size={12} /> From: {idea.authorName}</div>
                    <div className="flex items-center gap-1"><Zap size={12} /> Risk Level: <span className="text-emerald-500 font-bold">Low</span></div>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center">
                  <ClipboardList className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-medium italic">All institutional proposals have been technicaly vetted.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 text-sm">Committee Term Status</h4>
            <div className="space-y-6">
              {[
                { name: 'Dr. Amina Farah', role: 'Chair', progress: 85, days: 42 },
                { name: 'Ibrahim Nuur', role: 'Tech Expert', progress: 20, days: 310 },
                { name: 'Sarah Duale', role: 'Sector Lead', progress: 55, days: 160 }
              ].map((member, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{member.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{member.role}</div>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-600">{member.days}d left</div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${member.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                <b>Institutional Alert:</b> Forced rotation triggered for Chair position in 42 days. No extensions permitted per Article III.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
