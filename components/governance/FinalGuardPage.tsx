
import React, { useState } from 'react';
import { Idea, Role, WorkflowStatus } from '../../types';
import { Landmark, ShieldCheck, Gavel, AlertTriangle, CheckCircle2, Pause, ArrowRight, XCircle } from 'lucide-react';

interface FinalGuardPageProps {
  idea: Idea;
  onAction: (status: WorkflowStatus, notes: string) => void;
  userRole: Role;
}

const FinalGuardPage: React.FC<FinalGuardPageProps> = ({ idea, onAction, userRole }) => {
  const [notes, setNotes] = useState('');
  const [consCheck, setConsCheck] = useState(false);
  
  const hasAuthority = userRole === Role.GOLE_SARE || userRole === Role.SUPER_ADMIN;

  if (!hasAuthority) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center">
        <div className="w-32 h-32 bg-slate-900 rounded-[3rem] flex items-center justify-center text-indigo-400 mb-8 shadow-2xl">
           <Landmark size={64} />
        </div>
        <h3 className="text-2xl font-black uppercase text-slate-500 tracking-tight">Supreme Guardian Only - Stage 4</h3>
        <p className="text-slate-400 max-w-sm mt-4">Boggan waxaa loo asteeyay Golaha Sare si ay u xaqiijiyaan waafaqsanaanta Dastuurka (Article II).</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 text-red-600 font-black uppercase text-[10px] tracking-[0.3em] mb-2">
              <ShieldCheck size={16} /> Supreme Council Authority
           </div>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">STAGE 4: FINAL GUARD</h2>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
           <Gavel className="text-indigo-400" size={24} />
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ratification: <span className="text-white">30 DAYS MAX</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[4rem] border border-slate-200 p-16 shadow-sm space-y-12">
               <section className="space-y-6">
                  <h3 className="text-4xl font-black text-slate-900 leading-tight uppercase">{idea.title}</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Author</div>
                        <div className="text-sm font-black text-slate-900">{idea.authorName}</div>
                     </div>
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Synthesis Vote</div>
                        <div className="text-sm font-black text-emerald-600">PASS: {idea.synthesisVotes?.for}/{idea.synthesisVotes?.total}</div>
                     </div>
                  </div>
               </section>

               <section className="space-y-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Synthesis Context</h4>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                     {idea.reviewHistory.find(h => h.actorRole === Role.GOLE_DHEXE)?.notes || 'Strategic alignment confirmed.'}
                  </p>
               </section>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-200 p-12 space-y-8">
               <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Constitutional Verification (Article IV Check)</h4>
               <div 
                  onClick={() => setConsCheck(!consCheck)}
                  className={`p-10 rounded-[2.5rem] border-4 cursor-pointer transition-all flex items-center justify-between group ${
                    consCheck ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
                  }`}
               >
                  <div className="space-y-2">
                     <h5 className={`text-xl font-black uppercase ${consCheck ? 'text-emerald-700' : 'text-slate-400 group-hover:text-indigo-600'}`}>I confirm compliance</h5>
                     <p className="text-xs text-slate-500 font-medium">Waxaan xaqiijinayaa in soo-jeedintan aysan ka hor imaanayn Articles I-VI.</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${consCheck ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200'}`}>
                     {consCheck && <CheckCircle2 size={24} />}
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-2">Supreme Verdict Notes *</label>
                  <textarea 
                    required
                    rows={8}
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                    placeholder="Qor sababta rasmiga ah ee go'aankan..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
               </div>

               <div className="space-y-4">
                  <button 
                    disabled={!consCheck || !notes.trim()}
                    onClick={() => onAction(WorkflowStatus.CONVERTED_TO_POLICY, notes)}
                    className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest disabled:opacity-20 active:scale-95 transition-all"
                  >
                    <ArrowRight size={18} /> Ratify to Policy
                  </button>
                  <button 
                    disabled={!notes.trim()}
                    onClick={() => onAction(WorkflowStatus.TERMINATED, notes)}
                    className="w-full py-6 bg-white text-red-600 font-black rounded-2xl border-2 border-red-100 flex items-center justify-center gap-3 uppercase text-xs tracking-widest active:scale-95 transition-all"
                  >
                    <XCircle size={18} /> Veto (Terminate)
                  </button>
                  <button 
                    disabled={!notes.trim()}
                    onClick={() => onAction(WorkflowStatus.PAUSED, notes)}
                    className="w-full py-6 bg-amber-50 text-amber-700 font-black rounded-2xl border border-amber-200 flex items-center justify-center gap-3 uppercase text-xs tracking-widest active:scale-95 transition-all"
                  >
                    <Pause size={18} /> Pause Execution
                  </button>
               </div>

               <div className="p-8 bg-red-50 rounded-3xl border border-red-100">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                     <AlertTriangle size={16} />
                     <span className="text-[10px] font-black uppercase">Guardian Lock</span>
                  </div>
                  <p className="text-[10px] text-red-800 leading-relaxed font-bold uppercase tracking-tight">
                    Go'aanka Golaha Sare waa mid kama dambays ah (Final). Veto wuxuu gabi ahaanba tirtirayaa fikradda pipeline-ka.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinalGuardPage;
