
import React, { useState, useMemo } from 'react';
import { ElectionEvent, CandidateRecord, User, ElectionStatus, CandidateStatus } from '../types';
import { Vote, ShieldCheck, UserCheck, Clock, CheckCircle2, AlertTriangle, ChevronRight, X, Lock, Fingerprint, Award, Landmark, Zap, Search, ShieldAlert } from 'lucide-react';

interface VotingPageProps {
  elections: ElectionEvent[];
  candidates: CandidateRecord[];
  users: User[];
  userVotes: Record<string, string>;
  onCastVote: (electionId: string, candidateId: string) => void;
  currentUser: User;
}

const VotingPage: React.FC<VotingPageProps> = ({ elections, candidates, users, userVotes, onCastVote, currentUser }) => {
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [candidateToVote, setCandidateToVote] = useState<string | null>(null);

  /**
   * PARAMETRIC INTEGRITY ENGINE
   * Respects configuration-based windows and scope restriction.
   */
  const accessibleElections = useMemo(() => {
    const now = new Date().getTime();
    
    return elections.filter(e => {
      // 1. Check if status is explicitly 'CODBIXINTA' OR within the configured time window
      const isStatusActive = e.status === ElectionStatus.CODBIXINTA;
      const withinWindow = e.config 
        ? (now >= new Date(e.config.votingStartAt).getTime() && now <= new Date(e.config.votingEndAt).getTime())
        : (now >= new Date(e.startDate).getTime() && now <= new Date(e.endDate).getTime());

      // 2. Must have approved candidates
      const approvedCandidates = candidates.filter(c => 
        c.electionId === e.id && 
        (c.status === CandidateStatus.ANSIXIYAY || c.status === CandidateStatus.VERIFIED)
      );
      
      // 3. Scope Restriction
      const matchesScope = e.level === 'Heer Qaran' || e.scope === currentUser.region;

      return (isStatusActive || withinWindow) && approvedCandidates.length >= 1 && matchesScope;
    });
  }, [elections, candidates, currentUser.region]);

  const currentElection = useMemo(() => 
    accessibleElections.find(e => e.id === selectedElectionId), 
  [accessibleElections, selectedElectionId]);

  const electionCandidates = useMemo(() => 
    candidates.filter(c => 
      c.electionId === selectedElectionId && 
      (c.status === CandidateStatus.ANSIXIYAY || c.status === CandidateStatus.VERIFIED)
    ), 
  [candidates, selectedElectionId]);

  const handleVoteSubmission = () => {
    if (selectedElectionId && candidateToVote) {
      onCastVote(selectedElectionId, candidateToVote);
      setIsConfirming(false);
      setCandidateToVote(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-8 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em]">
             <ShieldAlert size={14} /> Terminal: {currentUser.region} Protocol
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Terminal-ka Codbixinta</h2>
          <p className="text-slate-500 font-medium italic">Strict anonymity and scope-locking protocols enforced by Article VI.</p>
        </div>
      </div>

      {!selectedElectionId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {accessibleElections.map(election => (
             <div 
               key={election.id} 
               onClick={() => setSelectedElectionId(election.id)}
               className="bg-white rounded-[3rem] border border-slate-200 p-10 hover:shadow-2xl hover:border-emerald-400 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full"
             >
                <div className="relative z-10 flex-1 space-y-8">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                         <Zap size={10} fill="currentColor" /> LIVE SESSION
                      </div>
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Ref: {election.config?.electionCycle || election.id.slice(-6)}</div>
                   </div>

                   <div>
                      <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight mb-3">
                        {election.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-tighter border border-slate-200">{election.level}</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-tighter border border-indigo-100">{election.scope}</span>
                      </div>
                   </div>
                </div>

                <button className="mt-10 w-full py-6 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-4 group-hover:bg-emerald-600 transition-all shadow-xl uppercase tracking-widest text-xs">
                   {userVotes[election.id] ? 'Codkaaga waa la dhiibtay' : 'Gasho Terminal-ka Secure-ka ah'}
                   <ChevronRight size={18} />
                </button>
             </div>
           ))}

           {accessibleElections.length === 0 && (
             <div className="col-span-full py-48 bg-white border-4 border-dashed border-slate-100 rounded-[5rem] text-center space-y-8 shadow-inner flex flex-col items-center justify-center">
                <Lock size={64} className="text-slate-200" />
                <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Ma jiraan doorashooyin furan oo baaxaddaada ku jira.</h4>
                <p className="text-slate-400 font-medium max-w-lg">Nidaamku wuxuu xiraa terminal-ka meel ka baxsan xilliga rasmiga ah ama haddii aadan u lahayn xaqa codeynta baaxadda doorashada.</p>
             </div>
           )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-16 animate-in slide-in-from-bottom-12 duration-700">
           <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-slate-200 pb-16">
              <div className="space-y-8 flex-1">
                 <button onClick={() => setSelectedElectionId(null)} className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 uppercase tracking-widest transition-all">
                    ← Dib u noqo
                 </button>
                 <h3 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{currentElection?.title}</h3>
                 <div className="flex gap-4">
                    <span className="px-6 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em] flex items-center gap-2">
                       <Fingerprint size={14} /> Immutable Session Hash Active
                    </span>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl min-w-[320px]">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                      <Clock size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Session Closes At</span>
                      <div className="text-2xl font-black text-slate-900">
                        {currentElection?.config?.votingEndAt ? new Date(currentElection.config.votingEndAt).toLocaleTimeString() : 'End of Window'}
                      </div>
                    </div>
                 </div>
              </div>
           </div>

           {!userVotes[selectedElectionId] && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {electionCandidates.map(cand => {
                   const user = users.find(u => u.id === cand.userId);
                   return (
                     <div 
                       key={cand.id} 
                       className={`bg-white rounded-[4rem] border p-12 space-y-10 shadow-sm transition-all relative group flex flex-col h-full ${candidateToVote === cand.id ? 'border-emerald-500 ring-[20px] ring-emerald-50 scale-105' : 'border-slate-200 hover:shadow-xl'}`}
                     >
                        <div className="flex gap-8 items-start">
                           <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                              <UserCheck size={48} />
                           </div>
                           <div className="space-y-2 pt-4">
                              <h4 className="text-3xl font-black text-slate-900">{user?.name}</h4>
                              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">{user?.region} Candidate</p>
                           </div>
                        </div>

                        <div className="flex-1 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 italic text-sm text-slate-600 leading-relaxed shadow-inner">
                           "{cand.statementOfIntent}"
                        </div>

                        <button 
                          onClick={() => {setCandidateToVote(cand.id); setIsConfirming(true);}}
                          className={`w-full py-6 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-4 uppercase tracking-widest text-xs active:scale-95 ${candidateToVote === cand.id ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
                        >
                          <Vote size={20} />
                          Dooro Musharaxan
                        </button>
                     </div>
                   );
                })}
             </div>
           )}

           {userVotes[selectedElectionId] && (
             <div className="bg-slate-900 rounded-[5rem] p-32 text-white text-center shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-12">
                   <div className="w-32 h-32 bg-indigo-600 rounded-[3rem] flex items-center justify-center mx-auto border-[10px] border-indigo-500 shadow-2xl">
                      <CheckCircle2 size={64} className="text-white" />
                   </div>
                   <h4 className="text-6xl font-black tracking-tight uppercase leading-none">Codkaaga waa la xaqiijiyay!</h4>
                   <p className="text-2xl text-slate-400 font-medium">Nidaamku wuxuu codkaaga u kaydiyay si Anonymous ah oo waafaqsan mabaadi’da qarsoodiga.</p>
                </div>
             </div>
           )}
        </div>
      )}

      {isConfirming && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl animate-in fade-in p-6">
           <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl p-20 text-center space-y-12">
                 <div className="w-32 h-32 bg-emerald-100 rounded-[3rem] flex items-center justify-center mx-auto">
                    <Landmark size={48} className="text-emerald-600" />
                 </div>
                 <h3 className="text-4xl font-black text-slate-900 uppercase">Xaqiiji Codkaaga</h3>
                 <p className="text-slate-500 font-medium text-xl leading-relaxed">
                    Once confirmed, your selection is immutable and anonymous.
                 </p>
                 <div className="grid grid-cols-2 gap-6 pt-6">
                    <button onClick={() => setIsConfirming(false)} className="py-5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Ka Noqo</button>
                    <button onClick={handleVoteSubmission} className="py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                       <CheckCircle2 size={20} /> Xaqiiji Codeynta
                    </button>
                 </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VotingPage;
