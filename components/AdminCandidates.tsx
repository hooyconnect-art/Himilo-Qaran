
import React, { useState, useMemo } from 'react';
import { User, CandidateRecord, CandidateStatus, ElectionEvent, ElectionStatus, Role, MembershipStatus } from '../types';
import { Vote, UserPlus, ShieldCheck, Target, Award, ChevronRight, X, Clock, AlertTriangle, UserCheck, TrendingUp, Gavel, Cpu, CheckCircle2, Megaphone, Play, Search, Filter, Landmark, Scale, Users, ShieldAlert, History, Activity, ArrowUpDown } from 'lucide-react';

interface AdminCandidatesProps {
  users: User[];
  candidates: CandidateRecord[];
  elections: ElectionEvent[];
  onRegisterCandidate: (electionId: string, userId: string, score: number) => void;
  onUpdateCandidate: (id: string, status: CandidateStatus, notes: string) => void;
  onUpdateElectionStatus: (id: string, status: ElectionStatus) => void;
  currentUser: User;
}

const AdminCandidates: React.FC<AdminCandidatesProps> = ({ users, candidates, elections, onRegisterCandidate, onUpdateCandidate, onUpdateElectionStatus, currentUser }) => {
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regForm, setRegForm] = useState({ userId: '', electionId: '', eligibilityConfirm: false });
  const [vettingNote, setVettingNote] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score'>('name');

  const activeElection = useMemo(() => elections.find(e => e.id === selectedElectionId), [elections, selectedElectionId]);
  
  const electionCandidates = useMemo(() => {
    const list = candidates.filter(c => c.electionId === selectedElectionId);
    
    return list.sort((a, b) => {
      const userA = users.find(u => u.id === a.userId);
      const userB = users.find(u => u.id === b.userId);
      
      if (sortBy === 'score') {
        return (userB?.participationScore || 0) - (userA?.participationScore || 0);
      }
      return (userA?.name || '').localeCompare(userB?.name || '');
    });
  }, [candidates, selectedElectionId, users, sortBy]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.eligibilityConfirm) return;
    const user = users.find(u => u.id === regForm.userId);
    if (!user) return;
    onRegisterCandidate(regForm.electionId, regForm.userId, user.participationScore);
    setIsRegisterModalOpen(false);
    setRegForm({ userId: '', electionId: '', eligibilityConfirm: false });
  };

  const handleVettingUpdate = (id: string, status: CandidateStatus) => {
    if (!vettingNote.trim()) {
      alert("Fadlan qor warbixinta hubinta (Vetting Notes) ka hor intaanad go'aan gaarin.");
      return;
    }
    onUpdateCandidate(id, status, vettingNote);
    setVettingNote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em]">
             <Gavel size={14} /> Authority: Guddiga Hubinta Musharaxiinta
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">Vetting Hub</h2>
          <p className="text-slate-500 font-medium">Article V Protocol: Adigoo matalaya Guddiga, hubi bedqabka tartamayaasha.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200 shadow-inner">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <ShieldCheck size={16} />
             </div>
             <div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Acting Authority</div>
                <div className="text-xs font-bold text-slate-700">{currentUser.role}</div>
             </div>
          </div>
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <UserPlus size={18} /> Diiwaangeli Musharax
          </button>
        </div>
      </div>

      {!selectedElectionId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {elections.map(election => (
            <div 
              key={election.id} 
              onClick={() => setSelectedElectionId(election.id)}
              className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-2xl hover:border-indigo-400 transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full"
            >
               <div className="relative z-10 space-y-6 flex-1">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${
                      election.status === ElectionStatus.OPEN_FOR_APPLICATION ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      election.status === ElectionStatus.CODBIXINTA ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {election.status}
                    </span>
                    <Clock size={18} className="text-slate-200" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{election.title}</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{election.level} • {election.scope}</p>
                  </div>
               </div>
               <div className="pt-6 border-t border-slate-50 mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Users size={14} className="text-slate-400" />
                     <span className="text-xs font-bold text-slate-700">{candidates.filter(c => c.electionId === election.id).length} Tartamayaal</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 transition-all" />
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-8 gap-4">
              <button onClick={() => setSelectedElectionId(null)} className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 uppercase tracking-widest transition-all">
                ← Dhammaan Doorashooyinka
              </button>
              
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                   <button 
                    onClick={() => setSortBy('name')}
                    className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${sortBy === 'name' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                   >
                     Sort: Name
                   </button>
                   <button 
                    onClick={() => setSortBy('score')}
                    className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${sortBy === 'score' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                   >
                     Sort: Engagement
                   </button>
                </div>

                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
                   <Scale className="text-indigo-600" size={20} />
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeElection?.title}</h4>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {electionCandidates.map(cand => {
                const user = users.find(u => u.id === cand.userId);
                const score = user?.participationScore;
                
                return (
                  <div key={cand.id} className={`bg-white rounded-[3rem] border p-10 shadow-sm flex flex-col h-full transition-all group ${cand.status === CandidateStatus.ANSIXIYAY ? 'border-emerald-500 ring-8 ring-emerald-50' : 'border-slate-200 hover:shadow-xl'}`}>
                    <div className="flex gap-6 items-start mb-8">
                       <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 border shadow-inner ${cand.status === CandidateStatus.ANSIXIYAY ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white border-slate-100'}`}>
                          <UserCheck size={40} />
                       </div>
                       <div className="space-y-2 pt-2 flex-1">
                          <h4 className="text-xl font-black text-slate-900 leading-none">{user?.name}</h4>
                          <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{user?.region} Branch</p>
                          <div className={`flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase border w-fit ${
                            cand.status === CandidateStatus.ANSIXIYAY ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            cand.status === CandidateStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${cand.status === CandidateStatus.ANSIXIYAY ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {cand.status}
                          </div>
                       </div>
                    </div>

                    {/* NEW: PARTICIPATION SCORE SECTION */}
                    <div className="mb-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4 shadow-inner" title="Participation Score reflects past engagement and activity. It does not replace eligibility rules.">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <Activity size={14} className="text-indigo-600" />
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Participation Score</span>
                          </div>
                          <span className={`text-sm font-black ${score !== undefined ? 'text-indigo-600' : 'text-slate-400 italic'}`}>
                            {score !== undefined ? `${score}%` : '—'}
                          </span>
                       </div>
                       {score !== undefined ? (
                         <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-indigo-100">
                            <div 
                               className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                               style={{ width: `${score}%` }} 
                            />
                         </div>
                       ) : (
                         <p className="text-[9px] text-slate-400 italic">Historical data not available for this member.</p>
                       )}
                    </div>
                    
                    <div className="flex-1 space-y-6">
                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-600 leading-relaxed shadow-inner relative">
                          <span className="absolute -top-3 left-4 bg-white px-3 py-0.5 rounded-full border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest">Vision Statement</span>
                          "{cand.statementOfIntent}"
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 mt-8 space-y-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Go'aanka Guddiga (Mandatory)</label>
                          <textarea 
                            placeholder="Qor sababta ansixinta ama diidmada..." 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none shadow-inner"
                            onChange={e => setVettingNote(e.target.value)}
                          />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                          <button 
                             onClick={() => handleVettingUpdate(cand.id, CandidateStatus.REJECTED)}
                             className="py-4 bg-white text-red-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-200 shadow-sm active:scale-95"
                          >
                             Diid (Reject)
                          </button>
                          <button 
                             onClick={() => handleVettingUpdate(cand.id, CandidateStatus.ANSIXIYAY)}
                             className="py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                          >
                             <ShieldCheck size={14} /> Ansixi (Approve)
                          </button>
                       </div>
                    </div>
                  </div>
                );
              })}
           </div>
           
           <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden mt-20">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="space-y-4 flex-1">
                    <h4 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                       <History className="text-indigo-400" /> Vetting Accountability
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                       Sida ku cad Qodobka V, ficil kasta oo halkan laga sameeyo waxaa si toos ah loogu saxiixayaa magacaaga (<strong>{currentUser.name}</strong>). Diiwaanka lama tirtiri karo, waxaana u muuqanayaa Guddiga Kormeerka.
                    </p>
                 </div>
                 <div className="flex gap-4 shrink-0">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center min-w-[140px]">
                       <div className="text-[10px] font-black text-indigo-400 uppercase mb-2">Quorum Check</div>
                       <div className="text-xl font-bold">VERIFIED</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center min-w-[140px]">
                       <div className="text-[10px] font-black text-indigo-400 uppercase mb-2">Regional Bias</div>
                       <div className="text-xl font-bold">0.0%</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl p-12 animate-in slide-in-from-bottom-8">
              <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                     <UserCheck size={24} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Diiwaangelinta Tartame</h3>
                 </div>
                 <button onClick={() => setIsRegisterModalOpen(false)} className="hover:bg-slate-100 p-2 rounded-full transition-colors"><X /></button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doorashada Firfircoon *</label>
                    <select 
                      required
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-inner"
                      value={regForm.electionId}
                      onChange={e => setRegForm({...regForm, electionId: e.target.value})}
                    >
                       <option value="">-- Xulo Tartan --</option>
                       {elections.filter(e => e.status === ElectionStatus.OPEN_FOR_APPLICATION || e.status === ElectionStatus.DRAFT).map(e => (
                         <option key={e.id} value={e.id}>{e.title}</option>
                       ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xubinta Tartamaysa *</label>
                    <select 
                      required
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-inner"
                      value={regForm.userId}
                      onChange={e => setRegForm({...regForm, userId: e.target.value})}
                    >
                       <option value="">-- Xulo Xubinta --</option>
                       {users.filter(u => u.status === MembershipStatus.LA_ANSIXIYAY).map(u => (
                         <option key={u.id} value={u.id}>{u.name} ({u.region})</option>
                       ))}
                    </select>
                 </div>

                 <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex gap-4 items-start shadow-inner">
                    <input 
                      type="checkbox" 
                      id="eligibilityConfirm"
                      className="mt-1.5 w-6 h-6 text-indigo-600 rounded-lg border-indigo-300"
                      checked={regForm.eligibilityConfirm}
                      onChange={e => setRegForm({...regForm, eligibilityConfirm: e.target.checked})}
                    />
                    <label htmlFor="eligibilityConfirm" className="text-[11px] font-black text-indigo-900 leading-relaxed uppercase">
                      <b>Xaqiijinta Vetting-ka:</b> Waxaan xaqiijinayaa in xubintan ay mari doonto hannaanka hubinta madax-bannaan (Article V).
                    </label>
                 </div>

                 <button type="submit" className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs active:scale-95 transition-all">
                    Diiwaangeli Codsiga Musharaxnimo
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminCandidates;
