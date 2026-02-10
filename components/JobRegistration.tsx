
import React, { useState, useMemo } from 'react';
import { ElectionEvent, JobPosition, CandidateRecord, ElectionStatus, User, ElectionLevel, Role } from '../types';
// Fixed missing icon imports
import { Send, ShieldAlert, Lock, Target, Landmark, AlertTriangle, ShieldX, Clock, Calendar, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface JobRegistrationProps {
  elections: ElectionEvent[];
  jobs: JobPosition[];
  candidates: CandidateRecord[];
  currentUser: User;
  onRegister: (candidate: Partial<CandidateRecord>) => void;
}

const JobRegistration: React.FC<JobRegistrationProps> = ({ elections, jobs, candidates, currentUser, onRegister }) => {
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [statement, setStatement] = useState('');
  const [conflict, setConflict] = useState('');
  const [isEligibleChecked, setIsEligibleChecked] = useState(false);

  /**
   * CONSTITUTIONAL BLOCK - EXCLUSIVITY (KAREEB)
   */
  const isExcluded = useMemo(() => {
    const activeRoles: Role[] = [
      Role.COMMITTEE, 
      Role.GOLE_DHEXE, 
      Role.GOLE_SARE, 
      Role.FULINTA, 
      Role.SUPER_ADMIN, 
      Role.OVERSIGHT
    ];
    return activeRoles.includes(currentUser.role);
  }, [currentUser.role]);

  /**
   * Universal Sorting Logic: registration_end_date ASCENDING
   */
  const allSortedElections = useMemo(() => {
    return [...elections].sort((a, b) => {
      const dateA = a.registrationEnd ? new Date(a.registrationEnd).getTime() : Infinity;
      const dateB = b.registrationEnd ? new Date(b.registrationEnd).getTime() : Infinity;
      return dateA - dateB;
    });
  }, [elections]);

  const availableJobsInElection = useMemo(() => {
    if (!selectedElectionId) return [];
    const election = elections.find(e => e.id === selectedElectionId);
    if (!election) return [];

    return jobs.filter(j => 
      election.jobIds.includes(j.id) && 
      (j.status === undefined || j.status === 'ACTIVE')
    );
  }, [selectedElectionId, elections, jobs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElectionId || !selectedJobId || !statement.trim() || !isEligibleChecked || isExcluded) return;
    
    onRegister({
      electionId: selectedElectionId,
      jobId: selectedJobId,
      statementOfIntent: statement,
      conflictDeclaration: conflict
    });

    setSelectedJobId(null);
    setSelectedElectionId(null);
    setStatement('');
    setConflict('');
    setIsEligibleChecked(false);
  };

  if (isExcluded) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-in fade-in zoom-in duration-500">
         <div className="bg-white rounded-[4rem] border-4 border-slate-100 p-24 text-center space-y-10 shadow-2xl relative overflow-hidden">
            <div className="w-32 h-32 bg-red-50 rounded-[3rem] flex items-center justify-center mx-auto text-red-500 shadow-inner">
              <ShieldX size={80} />
            </div>
            <div className="space-y-6 relative z-10">
               <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200">
                  Article II Integrity Lock
               </div>
               <h3 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Waa lagaa reebay (Excluded)</h3>
               <p className="text-slate-500 max-w-lg mx-auto font-bold leading-relaxed text-lg">
                 Maadaama aad hadda hayso xil hay’adeed oo firfircoon (<strong>{currentUser.role}</strong>), nidaamku kuu oggolaan maayo inaad codsato xil kale.
               </p>
            </div>
            <div className="absolute -bottom-20 -right-20 opacity-5">
               <ShieldX size={400} />
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6 animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
            Institutional Registry (All Cycles)
          </div>
          <h2 className="text-4xl font-black tracking-tight uppercase leading-none">Diiwaanka Doorashooyinka</h2>
          <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
            Halkan ka eeg dhammaan tartamada ka dhacaya hay'adda. Codsiyada waxaa la gudbin karaa marka xilliga diiwaangelintu furan yahay oo keliya.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Landmark size={260} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LIAISON: ELECTION SELECTOR LIST */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dhammaan Tartamada (Sorted by Deadline)</h3>
              <span className="text-[10px] font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">{allSortedElections.length} Total</span>
           </div>
           
           <div className="space-y-4">
              {allSortedElections.map(e => {
                const isSelected = selectedElectionId === e.id;
                const isOpen = e.status === ElectionStatus.OPEN_FOR_APPLICATION;
                const isClosed = e.status === ElectionStatus.REGISTRATION_CLOSED || 
                                 e.status === ElectionStatus.DHAMMAYSTIRAN || 
                                 e.status === ElectionStatus.FINALIZED ||
                                 e.status === ElectionStatus.CLOSED;

                return (
                  <div 
                    key={e.id}
                    onClick={() => isOpen && setSelectedElectionId(e.id)}
                    className={`p-6 rounded-[2rem] border transition-all flex justify-between items-center group ${
                      !isOpen ? 'opacity-60 grayscale-[0.5] cursor-not-allowed bg-slate-50 border-slate-100' :
                      isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-[1.02]' :
                      'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                    }`}
                  >
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                             isSelected ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-100 text-slate-500 border-slate-200'
                           }`}>
                             {e.level}
                           </span>
                           <span className={`text-[9px] font-black uppercase ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`}>
                              {e.status}
                           </span>
                        </div>
                        <h4 className="text-lg font-black uppercase leading-tight">{e.title}</h4>
                        <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                           <span className="flex items-center gap-1"><Calendar size={12}/> Reg Ends: {e.registrationEnd ? new Date(e.registrationEnd).toLocaleDateString() : 'TBD'}</span>
                        </div>
                        
                        {isClosed && (
                          <div className={`flex items-center gap-1 text-[9px] font-black uppercase mt-1 ${isSelected ? 'text-white' : 'text-amber-600'}`}>
                             <AlertTriangle size={10} /> Is-diiwaangelinta way xidhantay
                          </div>
                        )}
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        {isOpen ? (
                          <ChevronRight size={24} className={isSelected ? 'text-white' : 'text-slate-300 group-hover:text-indigo-500'} />
                        ) : (
                          <Lock size={18} className="text-slate-300" />
                        )}
                     </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* REGISTRATION FORM SECTION */}
        <div className="space-y-6">
          {selectedElectionId ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-xl space-y-10 animate-in slide-in-from-right-8 duration-500">
               <div className="flex justify-between items-start border-b border-slate-50 pb-8">
                  <div className="space-y-1">
                     <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Application</div>
                     <h3 className="text-2xl font-black text-slate-900 uppercase">Gudbi Codsiga</h3>
                  </div>
                  <button onClick={() => setSelectedElectionId(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
               </div>

               <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Dooro Xilka aad u tartamayso *</label>
                  <select 
                    required
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={selectedJobId || ''}
                    onChange={e => setSelectedJobId(e.target.value)}
                  >
                    <option value="">-- Xulo Xilka Blueprint-ka ah --</option>
                    {availableJobsInElection.map(job => (
                        <option key={job.id} value={job.id}>{job.jobCode}: {job.title}</option>
                    ))}
                  </select>
               </div>

               <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sababaynta Musharaxnimada *</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed font-medium transition-all"
                    placeholder="Maxaad u codsanaysaa xilkan? Qorshahaaga muxuu yahay?"
                    value={statement}
                    onChange={e => setStatement(e.target.value)}
                  />
               </div>

               <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                  <div className="flex gap-4 items-start">
                      <input 
                        type="checkbox" 
                        id="eligibleCheck"
                        checked={isEligibleChecked}
                        onChange={e => setIsEligibleChecked(e.target.checked)}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded border-indigo-300"
                      />
                      <label htmlFor="eligibleCheck" className="text-[10px] font-black text-indigo-900 leading-relaxed uppercase">
                        Waxaan xaqiijinayaa inaan buuxiyay shuruudaha tartanka (Article VI).
                      </label>
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={!selectedJobId || !statement.trim() || !isEligibleChecked}
                  className={`w-full py-5 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-4 transition-all transform active:scale-95 uppercase tracking-widest text-xs ${
                    !selectedJobId || !statement.trim() || !isEligibleChecked 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                  }`}
               >
                  Gudbi Codsiga Tartanka
                  <Send size={18} />
               </button>
            </form>
          ) : (
            <div className="h-full bg-white rounded-[3rem] border-4 border-dashed border-slate-100 p-20 text-center flex flex-col justify-center items-center space-y-8 shadow-inner">
               <Target size={60} className="text-slate-100" />
               <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-300 uppercase tracking-tight">Xulo Tartan si aad u codsato</h4>
                  <p className="text-slate-400 text-xs font-medium max-w-xs">Kaliya doorashooyinka furan ayaa kuu oggolaanaya inaad gudbiso codsi xubinimo.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobRegistration;
