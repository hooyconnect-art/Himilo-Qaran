
import React, { useState } from 'react';
import { ElectionEvent, CandidateRecord, VoteRecord, JobPosition, User, ElectionStatus } from '../types';
import { Vote, ShieldCheck, UserCheck, Clock, Lock, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';

interface VotingTerminalProps {
  elections: ElectionEvent[];
  candidates: CandidateRecord[];
  votes: VoteRecord[];
  currentUserId: string;
  onVote: (electionId: string, jobId: string, candidateId: string) => void;
}

const VotingTerminal: React.FC<VotingTerminalProps> = ({ elections, candidates, votes, currentUserId, onVote }) => {
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
  /* Fix: Use ElectionStatus.CODBIXINTA instead of a raw string to ensure type safety */
  const activeVoting = elections.filter(e => e.status === ElectionStatus.CODBIXINTA);

  const hasVoted = (electionId: string) => votes.some(v => v.voterId === currentUserId && v.electionId === electionId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Terminal-ka Codbixinta Tooska ah</h2>
          <p className="text-slate-500 font-medium">Codkaagu waa awoodda hay'adda. Hubi inuu yahay mid qarsoodi ah oo sugan.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
           <ShieldCheck className="text-emerald-600" size={20} />
           <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Democratic Integrity Lock: ACTIVE</span>
        </div>
      </div>

      {!selectedElectionId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {activeVoting.map(election => (
             <div 
               key={election.id} 
               onClick={() => setSelectedElectionId(election.id)}
               className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-2xl hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Vote size={140} />
                </div>
                <div className="relative z-10 space-y-6">
                   <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-emerald-200 animate-pulse">Live & Active</span>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{election.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 font-medium">Doorashada xilka looga tartamayo heerka {election.level}.</p>
                   </div>
                   <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {hasVoted(election.id) ? (
                           <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12}/> Voted successfully</span>
                        ) : (
                           'Waiting for your vote'
                        )}
                      </div>
                      <Clock size={18} className="text-slate-300" />
                   </div>
                </div>
             </div>
           ))}
           {activeVoting.length === 0 && (
              <div className="col-span-full py-32 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] text-center space-y-6">
                 <Lock size={60} className="mx-auto text-slate-200" />
                 <h3 className="text-xl font-bold text-slate-700 italic">“Ma jiro doorasho firfircoon waqtigan.”</h3>
                 <p className="text-slate-400 max-w-sm mx-auto">Sida ku cad Qodobka VI, codbixintu waxay furantaa oo kaliya marka Guddiga Doorashada ay si rasmi ah u hawlgeliyaan tartanka.</p>
              </div>
           )}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           <div className="flex justify-between items-center border-b border-slate-200 pb-10">
              <div className="space-y-2">
                 <button onClick={() => setSelectedElectionId(null)} className="text-xs font-black text-indigo-600 hover:underline uppercase">← Dib u noqo Terminal-ka</button>
                 <h3 className="text-4xl font-black text-slate-900">{elections.find(e => e.id === selectedElectionId)?.title}</h3>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Audit Hash</div>
                 <div className="text-xs font-mono font-bold text-slate-900">HM-6723-PRT-09</div>
              </div>
           </div>

           {hasVoted(selectedElectionId) ? (
              <div className="bg-emerald-600 rounded-[3rem] p-16 text-white text-center shadow-2xl space-y-8">
                 <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-400">
                    <CheckCircle2 size={40} />
                 </div>
                 <h4 className="text-3xl font-black">Codkaaga waa la xaqiijiyay!</h4>
                 <p className="text-lg opacity-80 max-w-xl mx-auto">Nidaamka CivicTrust wuxuu codkaaga ku kaydiyay si qarsoodi ah oo aan la beddeli karin. Natiijada waxaa lagu dhawaaqi doonaa marka xilliga codbixintu dhammaado.</p>
                 <div className="inline-flex items-center gap-3 bg-emerald-700 px-6 py-3 rounded-2xl border border-emerald-500">
                    <Fingerprint size={20} />
                    <span className="text-xs font-mono font-bold">VOTE_RECEIPT_HASH: {votes.find(v => v.electionId === selectedElectionId && v.voterId === currentUserId)?.hash.toUpperCase()}</span>
                 </div>
              </div>
           ) : (
              <div className="space-y-12">
                 {elections.find(e => e.id === selectedElectionId)?.jobIds.map(jobId => (
                    <section key={jobId} className="space-y-8">
                       <h4 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                          <span className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-lg italic">!</span>
                          Tartanka Xilka: {candidates.find(c => c.jobId === jobId)?.jobId} (Draft Role)
                       </h4>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {candidates.filter(c => c.electionId === selectedElectionId && c.jobId === jobId).map(cand => (
                             <div key={cand.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 space-y-8 shadow-sm hover:border-emerald-500 transition-all relative group">
                                <div className="flex gap-6 items-start">
                                   <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                      <UserCheck size={40} />
                                   </div>
                                   <div>
                                      <h4 className="text-xl font-bold text-slate-900">Musharax ID-{cand.id.slice(-4)}</h4>
                                      <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Verified Candidate</p>
                                   </div>
                                </div>
                                
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 italic">"{cand.statementOfIntent}"</p>
                                
                                <button 
                                   onClick={() => onVote(selectedElectionId!, jobId, cand.id)}
                                   className="w-full py-4 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-600 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3"
                                >
                                   <Vote size={20} /> DOORO MUSHARAXAN
                                </button>
                             </div>
                          ))}
                       </div>
                    </section>
                 ))}
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default VotingTerminal;
