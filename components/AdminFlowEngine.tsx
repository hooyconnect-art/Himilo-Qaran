
import React, { useState, useMemo } from 'react';
import { Workflow, Settings, Shield, Zap, AlertCircle, Scale, MessageCircle, CheckCircle, XCircle, ArrowRight, Gavel, ChevronRight } from 'lucide-react';
import { Idea, WorkflowStatus, AppealStatus, User, Role } from '../types';

interface AdminFlowEngineProps {
  ideas: Idea[];
  onResolveAppeal: (policyId: string, appealId: string, nextStatus: WorkflowStatus, resolution: string, result: AppealStatus) => void;
  currentUser: User;
}

const AdminFlowEngine: React.FC<AdminFlowEngineProps> = ({ ideas, onResolveAppeal, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'appeals'>('flow');
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const stages = [
    { id: 1, name: 'Submission', committee: 'General Membership', actor: 'Xubin', delay: '72h cooling', logic: 'Member Identity Verif' },
    { id: 2, name: 'Filtering', committee: 'Guddiga Soo-jeedinta', actor: 'Committee', delay: 'Max 7d', logic: 'Conflict of Interest Check' },
    { id: 3, name: 'Synthesis', committee: 'Golaha Dhexe', actor: 'Council', delay: 'Varies', logic: 'Supermajority Required' },
    { id: 4, name: 'Final Guard', committee: 'Golaha Sare', actor: 'Supreme', delay: 'Max 30d', logic: 'Veto/Approve/Pause' },
    { id: 5, name: 'Execution', committee: 'Hay’adda Fulinta', actor: 'Executive', delay: 'Immediate', logic: 'Project/KPI Creation' },
  ];

  const activeAppeals = useMemo(() => {
    const list: { idea: Idea, appeal: any }[] = [];
    ideas.forEach(idea => {
      idea.appeals?.forEach(appeal => {
        if (appeal.status === AppealStatus.SUBMITTED || appeal.status === AppealStatus.REVIEWING) {
          list.push({ idea, appeal });
        }
      });
    });
    return list;
  }, [ideas]);

  const selectedAppealData = useMemo(() => {
    return activeAppeals.find(a => a.appeal.id === selectedAppealId);
  }, [activeAppeals, selectedAppealId]);

  const handleResolve = (result: AppealStatus) => {
    if (!selectedAppealId || !selectedAppealData || !resolutionNote.trim()) return;
    
    let nextStatus: WorkflowStatus = selectedAppealData.idea.status;
    if (result === AppealStatus.UPHELD) nextStatus = WorkflowStatus.APPROVED; // Stay as it was before appeal
    if (result === AppealStatus.OVERTURNED) nextStatus = WorkflowStatus.REJECTED;
    if (result === AppealStatus.RETURNED) nextStatus = WorkflowStatus.REFINING;

    onResolveAppeal(selectedAppealData.idea.id, selectedAppealId, nextStatus, resolutionNote, result);
    setSelectedAppealId(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">4. Governance Flow & Appeals Engine</h2>
          <p className="text-slate-500">Matoorka maamulka go’aan-gaarista iyo xallinta dacwadaha hay’adeed.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
           <button 
             onClick={() => setActiveTab('flow')}
             className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'flow' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
           >
             Visualization
           </button>
           <button 
             onClick={() => setActiveTab('appeals')}
             className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'appeals' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
           >
             Appeals Hub 
             {activeAppeals.length > 0 && <span className="bg-amber-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">{activeAppeals.length}</span>}
           </button>
        </div>
      </div>

      {activeTab === 'flow' ? (
        <>
          <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <Workflow size={200} />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6">
              {stages.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-indigo-500 rounded-full flex flex-col items-center justify-center font-bold text-lg mb-4 shadow-lg border-4 border-slate-900 relative">
                    {s.id}
                    <div className="absolute -bottom-1 -right-1 bg-white text-indigo-900 p-1 rounded-full border border-slate-900 shadow-sm">
                       <Scale size={10} />
                    </div>
                  </div>
                  <h5 className="text-[11px] font-bold text-center mb-1 text-white uppercase tracking-wider">{s.name}</h5>
                  <p className="text-[9px] text-indigo-400 text-center font-bold mb-4 px-2 bg-indigo-900/50 py-0.5 rounded-full">{s.committee}</p>
                  
                  {idx < stages.length - 1 && (
                    <div className="hidden md:block absolute w-full h-0.5 bg-slate-800 top-[70px] -z-10" />
                  )}
                  
                  <div className="w-full bg-slate-800 rounded-xl p-4 border border-slate-700 space-y-3">
                     <div className="flex items-center gap-2 text-indigo-400">
                        <Zap size={10} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Logic & Rule</span>
                     </div>
                     <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{s.logic}</p>
                     <div className="pt-2 border-t border-slate-700 flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase">
                        <Shield size={8} />
                        {s.delay}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="text-amber-500" size={18} />
                Stage Binding Protocols
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Independent Vetting Required', committee: 'Guddiga Soo-jeedinta', status: 'Enforced' },
                  { label: 'Supermajority Consensus (2/3)', committee: 'Golaha Dhexe', status: 'Enforced' },
                  { label: 'Constitutional Compliance Check', committee: 'Golaha Sare', status: 'Critical' },
                  { label: 'Independent Oversight Monitoring', committee: 'Kormeerka', status: 'Live' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <div>
                      <div className="text-sm text-slate-800 font-bold">{r.label}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{r.committee}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <Gavel size={32} />
               </div>
               <h4 className="font-bold text-slate-900">Independent Appeals Layer</h4>
               <p className="text-sm text-slate-500 max-w-sm">
                 Every final decision made by the system is subject to exactly one (1) appeal by qualified stakeholders. Objections freeze all execution until resolution.
               </p>
               <button 
                 onClick={() => setActiveTab('appeals')}
                 className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
               >
                 Review Active Objections
               </button>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                   <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                     <Gavel size={16} className="text-amber-500" />
                     Safka Dacwadaha & Racfaannada (Appeals Queue)
                   </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {activeAppeals.map(({idea, appeal}) => (
                    <div 
                      key={appeal.id} 
                      onClick={() => setSelectedAppealId(appeal.id)}
                      className={`p-6 hover:bg-slate-50 transition-all cursor-pointer group flex justify-between items-start ${selectedAppealId === appeal.id ? 'bg-indigo-50/50 ring-2 ring-indigo-500 ring-inset' : ''}`}
                    >
                      <div className="space-y-2">
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">Ref: {idea.id.slice(0, 6)}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${appeal.status === AppealStatus.SUBMITTED ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                               {appeal.status}
                            </span>
                         </div>
                         <h4 className="font-bold text-slate-900">{idea.title}</h4>
                         <p className="text-xs text-slate-500 line-clamp-1 italic">Objection: "{appeal.justification}"</p>
                         <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase">
                            <span className="flex items-center gap-1"><ArrowRight size={10}/> {appeal.appellantName}</span>
                            <span className="flex items-center gap-1"><ArrowRight size={10}/> {new Date(appeal.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  ))}
                  {activeAppeals.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                       <CheckCircle size={48} className="mx-auto text-emerald-100" />
                       <p className="text-slate-400 font-medium italic">Ma jiraan racfaanno firfircoon xiligan.</p>
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             {selectedAppealData ? (
               <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 animate-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center gap-3 border-b pb-4">
                     <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <Scale size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">Xallinta Dacwada</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Independent Judicial Review</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Asalka Dacwada (Justification)</label>
                        <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-100">
                           "{selectedAppealData.appeal.justification}"
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Dhabar-adayga Sharciga (Legal Basis)</label>
                        <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                           {selectedAppealData.appeal.legalBasis}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                     <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest block">Sababaynta Go’aanka Xallinta *</label>
                     <textarea 
                        required
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 h-32 resize-none"
                        placeholder="Qor sababta hay’adeed ee go’aankan..."
                     />
                     <div className="grid grid-cols-1 gap-2">
                        <button 
                          onClick={() => handleResolve(AppealStatus.UPHELD)}
                          className="w-full py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={14} /> ADKEE GO’AANKA (UPHOLD)
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => handleResolve(AppealStatus.RETURNED)}
                            className="py-3 bg-amber-500 text-white text-[10px] font-bold rounded-xl hover:bg-amber-600"
                          >
                            DIB U CELI (RETURN)
                          </button>
                          <button 
                            onClick={() => handleResolve(AppealStatus.OVERTURNED)}
                            className="py-3 bg-red-600 text-white text-[10px] font-bold rounded-xl hover:bg-red-700"
                          >
                            BEDDEL GO’AANKA
                          </button>
                        </div>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="bg-indigo-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="relative z-10 space-y-4">
                     <Gavel size={40} className="text-indigo-300" />
                     <h4 className="text-lg font-bold">Judicial Integrity Layer</h4>
                     <p className="text-xs text-indigo-100 leading-relaxed">
                       Review committees must maintain 100% neutrality. Decisions made here are final and update the institutional memory as irreversible records.
                     </p>
                  </div>
                  <Scale className="absolute -bottom-12 -right-12 text-white opacity-5" size={240} />
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFlowEngine;
