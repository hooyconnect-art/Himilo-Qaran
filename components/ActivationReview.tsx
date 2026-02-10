
import React, { useState } from 'react';
import { ActionPlan, PlanStatus, User } from '../types';
import { ShieldCheck, Scale, AlertTriangle, CheckCircle2, XCircle, Clock, ChevronRight, User as UserIcon, ListChecks, Target, Briefcase } from 'lucide-react';

interface ActivationReviewProps {
  plans: ActionPlan[];
  users: User[];
  onReview: (planId: string, status: PlanStatus, notes: string) => void;
}

const ActivationReview: React.FC<ActivationReviewProps> = ({ plans, users, onReview }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const pendingPlans = plans.filter(p => p.status === PlanStatus.UNDER_REVIEW);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-[0.3em]">
             <ShieldCheck size={14} /> Authority: Oversight Committee
          </div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">Qiimeynta Hawlgelinta</h2>
          <p className="text-slate-500 font-medium">Article VI Oversight: Hubi qorshe-hawleedyada Guddoomiyayaasha cusub.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Qorshayaasha Sugitaanka ({pendingPlans.length})</h3>
           <div className="space-y-4">
              {pendingPlans.map(plan => (
                <div 
                  key={plan.id}
                  onClick={() => { setSelectedPlanId(plan.id); setReviewNotes(''); }}
                  className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex justify-between items-center ${
                    selectedPlanId === plan.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                   <div className="space-y-2">
                      <div className={`text-[9px] font-black uppercase tracking-widest ${selectedPlanId === plan.id ? 'text-indigo-200' : 'text-indigo-600'}`}>
                        {plan.committeeName}
                      </div>
                      <div className="text-sm font-black">{plan.chairpersonName}</div>
                   </div>
                   <ChevronRight size={18} className={selectedPlanId === plan.id ? 'text-white' : 'text-slate-300 group-hover:text-indigo-500'} />
                </div>
              ))}
              {pendingPlans.length === 0 && (
                <div className="p-16 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] text-center space-y-4 text-slate-400">
                   <Clock size={40} className="mx-auto opacity-20" />
                   <p className="text-xs font-bold uppercase tracking-widest italic">Ma jiraan qorshe la qiimeeyo.</p>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
           {selectedPlan ? (
             <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                {/* PLAN DETAILS RENDERING */}
                <div className="bg-white rounded-[3rem] border border-slate-200 p-16 shadow-xl space-y-12">
                   <div className="flex justify-between items-start border-b border-slate-50 pb-8">
                      <div className="space-y-2">
                         <h4 className="text-2xl font-black text-slate-900 uppercase">{selectedPlan.committeeName}</h4>
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <UserIcon size={14} /> Guddoomiye {selectedPlan.chairpersonName}
                         </div>
                      </div>
                      <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                         {selectedPlan.status}
                      </div>
                   </div>

                   <section className="space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Scale size={14} /> Aragti-Fog & Yoolal
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-sm font-medium leading-relaxed italic text-slate-700">
                        "{selectedPlan.vision}"
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPlan.objectives.map((obj, i) => (
                           <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl flex gap-3 items-center">
                              <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px] font-black">{i+1}</div>
                              <span className="text-xs font-bold text-slate-600">{obj}</span>
                           </div>
                        ))}
                      </div>
                   </section>

                   <section className="space-y-6">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ListChecks size={14} /> Hawlaha la xushay & Hirgelinta
                      </div>
                      <div className="space-y-4">
                        {selectedPlan.selectedActivities.map(act => (
                           <div key={act} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center">
                              <div>
                                 <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">{act}</h5>
                                 <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase">
                                    <span>Habka: <strong className="text-slate-800">{selectedPlan.implementationDetails[act]?.method}</strong></span>
                                    <span>Xilliga: <strong className="text-slate-800">{selectedPlan.implementationDetails[act]?.timeline}</strong></span>
                                 </div>
                              </div>
                              <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase">
                                KPI: {selectedPlan.implementationDetails[act]?.kpi}
                              </div>
                           </div>
                        ))}
                      </div>
                   </section>

                   <section className="space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase size={14} /> Dhismaha Kooxda (Team)
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPlan.team.map((m, i) => (
                           <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                 <UserIcon size={18} />
                              </div>
                              <div>
                                 <div className="text-xs font-black text-slate-900">{m.memberName}</div>
                                 <div className="text-[9px] font-black text-indigo-400 uppercase">{m.role}</div>
                              </div>
                           </div>
                        ))}
                      </div>
                   </section>

                   <div className="pt-12 border-t border-slate-100 space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Go'aanka Guddiga Kormeerka (Review Notes) *</label>
                         <textarea 
                            required
                            className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium h-32 shadow-inner"
                            placeholder="Qor sababta ansixinta ama dib u celinta..."
                            value={reviewNotes}
                            onChange={e => setReviewNotes(e.target.value)}
                         />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                         <button 
                            onClick={() => onReview(selectedPlan.id, PlanStatus.RETURNED, reviewNotes)}
                            className="py-6 bg-white text-red-600 font-black rounded-2xl text-[10px] uppercase tracking-widest border border-red-200 hover:bg-red-50 transition-all shadow-sm active:scale-95"
                         >
                            <XCircle size={16} className="inline mr-2" /> Dib u celi (Revision)
                         </button>
                         <button 
                            onClick={() => onReview(selectedPlan.id, PlanStatus.APPROVED, reviewNotes)}
                            className="py-6 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                         >
                            <CheckCircle2 size={16} /> Ansixi Hawlgelinta (Approve)
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full bg-slate-900 rounded-[3rem] p-20 text-white text-center flex flex-col justify-center space-y-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <Scale size={80} className="mx-auto text-indigo-400" />
                  <h4 className="text-3xl font-black uppercase tracking-tight">Saf-ka Qiimeynta Hoggaanka</h4>
                  <p className="text-slate-400 max-w-sm mx-auto font-medium">Fadlan dhinaca ka xulo qorshe-hawleedka u baahan hubinta hay'adeed.</p>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-5">
                   <ShieldCheck size={300} />
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ActivationReview;
