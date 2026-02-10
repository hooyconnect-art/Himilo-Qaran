
import React, { useState } from 'react';
import { Idea, Role, WorkflowStatus } from '../../types';
import { Scale, Users, CheckCircle2, XCircle, ShieldAlert, TrendingUp, ArrowRight } from 'lucide-react';

interface SynthesisPageProps {
  idea: Idea;
  onAction: (status: WorkflowStatus, notes: string, votes: {for: number, against: number, total: number}) => void;
  userRole: Role;
}

const SynthesisPage: React.FC<SynthesisPageProps> = ({ idea, onAction, userRole }) => {
  const [notes, setNotes] = useState('');
  const [voteFor, setVoteFor] = useState(0);
  const [voteAgainst, setVoteAgainst] = useState(0);
  
  const total = voteFor + voteAgainst;
  const isMajority = total > 0 ? (voteFor / total) >= (2/3) : false;
  const hasAuthority = userRole === Role.GOLE_DHEXE || userRole === Role.SUPER_ADMIN;

  if (!hasAuthority) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center">
        <Scale size={64} className="text-slate-200 mb-8" />
        <h3 className="text-2xl font-black uppercase text-slate-400 tracking-tighter">Council Locked - Stage 3</h3>
        <p className="text-slate-400 max-w-sm mt-4">Boggan waxaa iska leh Golaha Dhexe si ay ugu sameeyaan 'Synthesis' iyo Codbixin (Article II).</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-right-12 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-10">
        <div>
           <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em] mb-2">
              <Users size={16} /> Central Council Jurisdiction
           </div>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">STAGE 3: SYNTHESIS</h2>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
           <ShieldAlert className="text-emerald-600" size={20} />
           <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Consensus Rule: <span className="text-emerald-900">2/3 SUPERMAJORITY</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-8">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] border-b pb-4">Nuxurka Soo-jeedinta (Draft)</h4>
               <div className="space-y-6">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">{idea.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium italic opacity-80">"{idea.description}"</p>
                  
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center gap-4">
                     <TrendingUp className="text-indigo-600" size={24} />
                     <div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase">Committee Verdict (Stage 2)</div>
                        <p className="text-xs font-bold text-indigo-900">
                          {idea.reviewHistory.find(h => h.actorRole === Role.COMMITTEE)?.notes || 'Approved for synthesis.'}
                        </p>
                     </div>
                  </div>
               </div>
            </section>

            <section className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-8">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] border-b pb-4">Council Deliberation Notes</h4>
               <textarea 
                  rows={8}
                  className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm shadow-inner"
                  placeholder="Qor qodobbada ay goluhu isku raaceen iyo qabyo-qoraalka rasmiga ah..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
               />
            </section>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col h-full">
               <div className="relative z-10 flex-1 space-y-12">
                  <div className="text-center space-y-4">
                     <h4 className="text-xl font-black uppercase tracking-widest border-b border-white/10 pb-6">Synthesis Voting</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                           <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Codka Haa (For)</div>
                           <input 
                              type="number" 
                              className="bg-transparent text-4xl font-black text-center w-full outline-none text-emerald-400"
                              value={voteFor}
                              onChange={e => setVoteFor(parseInt(e.target.value) || 0)}
                           />
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                           <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Codka Maya (Against)</div>
                           <input 
                              type="number" 
                              className="bg-transparent text-4xl font-black text-center w-full outline-none text-red-400"
                              value={voteAgainst}
                              onChange={e => setVoteAgainst(parseInt(e.target.value) || 0)}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Consensus Status</span>
                        <span className={`text-2xl font-black ${isMajority ? 'text-emerald-400' : 'text-red-400'}`}>
                           {isMajority ? 'RATIFIED' : 'FAILED'}
                        </span>
                     </div>
                     <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden flex">
                        <div 
                           className="h-full bg-emerald-500 transition-all duration-1000" 
                           style={{ width: `${total > 0 ? (voteFor / total) * 100 : 0}%` }} 
                        />
                        <div 
                           className="h-full bg-red-500 transition-all duration-1000" 
                           style={{ width: `${total > 0 ? (voteAgainst / total) * 100 : 0}%` }} 
                        />
                     </div>
                     <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <span>For: {voteFor}</span>
                        <span>Threshold: {(total * (2/3)).toFixed(1)}</span>
                        <span>Against: {voteAgainst}</span>
                     </div>
                  </div>

                  <button 
                    disabled={total === 0 || !notes.trim()}
                    onClick={() => onAction(isMajority ? WorkflowStatus.APPROVED : WorkflowStatus.TERMINATED, notes, {for: voteFor, against: voteAgainst, total})}
                    className={`w-full py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                       isMajority ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-red-600 text-white hover:bg-red-700'
                    } disabled:opacity-30`}
                  >
                    {isMajority ? 'Finalize Synthesis' : 'Reject Proposal'} <ArrowRight size={18} />
                  </button>
               </div>
               <Users className="absolute -bottom-10 -right-10 text-white opacity-5" size={240} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default SynthesisPage;
