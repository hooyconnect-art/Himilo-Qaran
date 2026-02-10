
import React from 'react';
import { Idea, Role, WorkflowStatus, AppView } from '../types';
import { FileText, ArrowRight, ShieldCheck, Filter, Users, Gavel, Rocket, Lock, ChevronRight, Clock } from 'lucide-react';
import { GovernanceStatusBadge } from './GovernanceStatusVisualizer';

interface GovernanceRegistryProps {
  ideas: Idea[];
  userRole: Role;
  onEnterStage: (id: string, view: AppView) => void;
}

const GovernanceRegistry: React.FC<GovernanceRegistryProps> = ({ ideas, userRole, onEnterStage }) => {
  
  const STAGES = [
    { status: WorkflowStatus.SUBMITTED, label: 'Submitted', icon: FileText, page: 'page-submission' as AppView, role: Role.XUBIN },
    { status: WorkflowStatus.UNDER_FILTERING, label: 'Filtering', icon: Filter, page: 'page-filtering' as AppView, role: Role.COMMITTEE },
    { status: WorkflowStatus.UNDER_REVIEW, label: 'Synthesis', icon: Users, page: 'page-synthesis' as AppView, role: Role.GOLE_DHEXE },
    { status: WorkflowStatus.APPROVED, label: 'Final Guard', icon: Gavel, page: 'page-final-guard' as AppView, role: Role.GOLE_SARE },
    { status: WorkflowStatus.CONVERTED_TO_POLICY, label: 'Execution', icon: Rocket, page: 'page-execution' as AppView, role: Role.FULINTA }
  ];

  const canAccess = (requiredRole: Role) => userRole === requiredRole || userRole === Role.SUPER_ADMIN;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Governance Hub</h2>
           <p className="text-slate-500 font-medium mt-2">Xarunta maamulka fikradaha iyo go'aanada xisbiga Himilo Qaran.</p>
        </div>
        <button 
          onClick={() => onEnterStage('', 'page-submission')}
          className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black shadow-2xl transition-all active:scale-95 uppercase tracking-widest flex items-center gap-4"
        >
          <FileText size={20} /> Gudbi Fikrad Cusub
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* PIPELINE OVERVIEW SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Proposals Pipeline</h3>
             <span className="text-[10px] font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">{ideas.length} Total items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {STAGES.map(config => {
              const items = ideas.filter(i => i.status === config.status);

              return (
                <div key={config.status} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all group">
                   <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <config.icon size={16} className="text-indigo-600" />
                         <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">{config.label}</span>
                      </div>
                      <span className="text-[10px] font-black bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-400">{items.length}</span>
                   </div>
                   
                   <div className="p-3 flex-1 space-y-3">
                      {items.map(idea => (
                        <div 
                          key={idea.id}
                          onClick={() => canAccess(config.role) && onEnterStage(idea.id, config.page)}
                          className={`p-4 rounded-xl border transition-all flex flex-col gap-3 group/item ${
                            canAccess(config.role) 
                              ? 'bg-white border-slate-100 hover:border-indigo-400 hover:shadow-md cursor-pointer' 
                              : 'bg-slate-50/50 border-transparent opacity-60 grayscale cursor-not-allowed'
                          }`}
                        >
                           <div className="flex justify-between items-start">
                              <h4 className="text-[10px] font-black text-slate-900 leading-tight uppercase line-clamp-2">{idea.title}</h4>
                              {canAccess(config.role) ? (
                                <ChevronRight size={12} className="text-slate-300 group-hover/item:text-indigo-600" />
                              ) : (
                                <Lock size={10} className="text-slate-300" />
                              )}
                           </div>
                           <div className="flex items-center justify-between text-[7px] font-bold text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-1"><Clock size={10} /> {new Date(idea.createdAt).toLocaleDateString()}</span>
                              <span className="text-indigo-600">{idea.category}</span>
                           </div>
                        </div>
                      ))}
                      {items.length === 0 && (
                        <div className="py-8 text-center space-y-2 opacity-20">
                           <config.icon size={24} className="mx-auto" />
                           <p className="text-[8px] font-black uppercase tracking-widest italic">No items</p>
                        </div>
                      )}
                   </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TERMINATED / PAUSED SECTION */}
        <section className="space-y-6">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Archived & Objections</h3>
           <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                       <th className="px-10 py-6">Idea ID</th>
                       <th className="px-10 py-6">Title</th>
                       <th className="px-10 py-6">Status</th>
                       <th className="px-10 py-6">Authority Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {ideas.filter(i => [WorkflowStatus.TERMINATED, WorkflowStatus.PAUSED, WorkflowStatus.RETURNED, WorkflowStatus.REJECTED].includes(i.status)).map(idea => (
                      <tr key={idea.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6 text-xs font-mono font-bold text-slate-400">#{idea.id.slice(-8)}</td>
                        <td className="px-10 py-6 font-black text-slate-900 uppercase text-xs">{idea.title}</td>
                        <td className="px-10 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             idea.status === WorkflowStatus.TERMINATED || idea.status === WorkflowStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                           }`}>
                              {idea.status}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-xs italic text-slate-500 font-medium">
                           {idea.reviewHistory[idea.reviewHistory.length - 1]?.notes || 'No notes archived.'}
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>
      </div>
    </div>
  );
};

export default GovernanceRegistry;
