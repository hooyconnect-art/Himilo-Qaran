
import React, { useState } from 'react';
import { ElectionEvent, CandidateRecord, ElectionStatus, AppView } from '../types';
import { Trophy, Gavel, AlertCircle, BarChart3, ChevronRight, Scale, Activity, ShieldAlert, CheckCircle2, Send, History, PieChart } from 'lucide-react';

interface ElectionResultsProps {
  elections: ElectionEvent[];
  candidates: CandidateRecord[];
  onViewAnalytics: (id: string) => void;
}

const ElectionResults: React.FC<ElectionResultsProps> = ({ elections, candidates, onViewAnalytics }) => {
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'analytics'>('results');
  
  const closedElections = elections.filter(e => 
    e.status === ElectionStatus.CLOSED || 
    e.status === ElectionStatus.APPEAL || 
    e.status === ElectionStatus.FINALIZED ||
    e.status === ElectionStatus.DHAMMAYSTIRAN
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">Natiijooyinka & Kormeerka</h2>
          <p className="text-slate-500 font-medium italic">Geedi-socodka hubinta natiijada iyo dacwadaha hay'adeed.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <button 
             onClick={() => setActiveTab('results')}
             className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Results & Appeals
           </button>
           <button 
             onClick={() => setActiveTab('analytics')}
             className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Election Analytics
           </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {closedElections.filter(e => e.status === ElectionStatus.FINALIZED || e.status === ElectionStatus.DHAMMAYSTIRAN).map(election => (
                <div key={election.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 hover:shadow-xl hover:border-indigo-300 transition-all group flex flex-col h-full">
                   <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <PieChart size={24} />
                         </div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{election.id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 uppercase">{election.title}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{election.level} • Finalized</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                         <div>
                            <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Total Votes</div>
                            <div className="text-sm font-black text-slate-900">{election.votesCast.toLocaleString()}</div>
                         </div>
                         <div>
                            <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Turnout</div>
                            <div className="text-sm font-black text-emerald-600">{Math.round((election.votesCast / election.totalVoters) * 100)}%</div>
                         </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => onViewAnalytics(election.id)}
                     className="mt-8 w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                   >
                     View Full Analytics <ChevronRight size={14} />
                   </button>
                </div>
              ))}
              {closedElections.filter(e => e.status === ElectionStatus.FINALIZED || e.status === ElectionStatus.DHAMMAYSTIRAN).length === 0 && (
                <div className="col-span-full py-32 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] text-center space-y-4">
                   <BarChart3 size={48} className="mx-auto text-slate-200" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest italic">Analytics are generated after result finalization.</p>
                </div>
              )}
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {closedElections.map(election => (
            <div key={election.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-xl flex flex-col xl:flex-row hover:border-indigo-200 transition-all">
               <div className="w-full xl:w-[400px] bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10 space-y-10">
                     <div className="flex items-center gap-3 text-indigo-400 font-black uppercase text-[10px] tracking-widest border-b border-white/10 pb-4">
                        <History size={14} />
                        Election Archive Log
                     </div>
                     <div>
                        <h4 className="text-3xl font-black tracking-tight leading-tight uppercase">{election.title}</h4>
                        <div className="flex items-center gap-2 mt-2 text-indigo-400 font-bold uppercase text-[10px] tracking-widest">
                           <Scale size={14} /> {election.level}
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Wadarta Codka</div>
                           <div className="text-2xl font-black">{election.votesCast.toLocaleString()}</div>
                        </div>
                        <div className="space-y-1">
                           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Turnout Rate</div>
                           <div className="text-2xl font-black">{Math.round((election.votesCast / election.totalVoters) * 100)}%</div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${(election.votesCast / election.totalVoters) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Verified by Election Integrity Committee</p>
                     </div>
                  </div>
                  <BarChart3 className="absolute bottom-[-10%] right-[-10%] text-white opacity-5" size={320} />
               </div>

               <div className="flex-1 p-12 space-y-10 bg-white">
                  <div className="flex justify-between items-center">
                     <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Natiijada Hubsan (Verified Results)</h5>
                     <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${
                        election.status === ElectionStatus.FINALIZED || election.status === ElectionStatus.DHAMMAYSTIRAN ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                     }`}>
                        {election.status === ElectionStatus.DHAMMAYSTIRAN ? 'Lagu Dhawaaqay' : election.status}
                     </span>
                  </div>

                  <div className="space-y-4">
                     {candidates.filter(c => c.electionId === election.id).sort((a,b) => b.votesCount - a.votesCount).map((cand, idx) => (
                        <div key={cand.id} className={`p-8 rounded-[2rem] border flex items-center justify-between transition-all group ${idx === 0 ? 'bg-indigo-50/50 border-indigo-200 ring-4 ring-indigo-500/5' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                           <div className="flex items-center gap-8">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg relative ${idx === 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-100 text-slate-400 shadow-slate-100'}`}>
                                 {idx + 1}
                                 {idx === 0 && <Trophy size={18} className="absolute -top-2 -right-2 text-amber-500 drop-shadow-md" />}
                              </div>
                              <div>
                                 <div className="text-lg font-black text-slate-900 tracking-tight">Musharax ID-{cand.id.slice(-4)}</div>
                                 <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">{idx === 0 ? 'Guulaystaha Doorashada' : 'Kaydka (Runner Up)'}</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-2xl font-black text-slate-900 tracking-tighter">{cand.votesCount.toLocaleString()}</div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Codadka Guud</div>
                           </div>
                        </div>
                     ))}
                  </div>

                  {election.status === ElectionStatus.CLOSED && (
                     <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex-1">
                           <Gavel className="text-amber-600 shrink-0" size={24} />
                           <div>
                              <span className="text-xs font-black text-amber-800 uppercase tracking-widest block">Objection Window Open</span>
                              <span className="text-[10px] text-amber-600 font-bold">Racfaanka waxaa la gudbin karaa 72 saac gudahood natiijada kadib.</span>
                           </div>
                        </div>
                        <button 
                           onClick={() => {setSelectedElectionId(election.id); setIsObjectionModalOpen(true);}}
                           className="px-10 py-4 bg-slate-900 text-white text-xs font-black rounded-2xl flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-widest active:scale-95"
                        >
                           Gudbi Dacwad (Objection) <ChevronRight size={18} />
                        </button>
                     </div>
                  )}

                  {(election.status === ElectionStatus.FINALIZED || election.status === ElectionStatus.DHAMMAYSTIRAN) && (
                     <div className="pt-8 border-t border-slate-50 flex justify-end">
                        <button 
                          onClick={() => onViewAnalytics(election.id)}
                          className="flex items-center gap-3 text-indigo-600 font-black uppercase text-[10px] tracking-widest hover:underline"
                        >
                           View Detailed Analytics <ChevronRight size={14} />
                        </button>
                     </div>
                  )}
               </div>
            </div>
          ))}
          {closedElections.length === 0 && (
             <div className="p-40 bg-white border-2 border-dashed border-slate-200 rounded-[4rem] text-center space-y-8 shadow-inner">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                   <Scale size={60} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">“Ma jiro natiijo furan waqtigan.”</h3>
                   <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                     Natiijooyinka doorashooyinka waxay halkan ka soo muuqanayaan marka codbixintu si rasmi ah u xiranto (CLOSED).
                   </p>
                </div>
             </div>
          )}
        </div>
      )}

      {isObjectionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden p-12 animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                       <ShieldAlert size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gudbi Dacwad Doorasho</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Election Objections Protocol (Article V)</p>
                    </div>
                 </div>
                 <button onClick={() => setIsObjectionModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><AlertCircle size={24} /></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setIsObjectionModalOpen(false); alert("Dacwada waa la gudbiyay, waxaa dib u eegi doona Guddiga Kormeerka."); }} className="space-y-8">
                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nooca Xadgudubka (Type of Irregularity) *</label>
                    <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500">
                       <option value="">-- Dooro Nooca --</option>
                       <option value="Procedural Error">Khalad Farsamo/Hab-raac</option>
                       <option value="Voter Suppression">Cadayn hufnaan la’aan</option>
                       <option value="Candidate Ineligibility">U-qalmitaan la’aan musharax</option>
                       <option value="Technical Glitch">Khalad ka dhacay nidaamka</option>
                    </select>
                 </div>

                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sharaxaad Faahfaahsan & Caddeymo *</label>
                    <textarea 
                       required
                       rows={6}
                       className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium leading-relaxed"
                       placeholder="Gali faahfaahinta dacwadaada iyo caddeymaha aad u hayso si looga baaro diiwaanka kormeerka..."
                    />
                 </div>

                 <button type="submit" className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-200 flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-widest text-xs">
                    <Send size={18} /> Gudbi Dacwada rasmiga ah
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ElectionResults;
