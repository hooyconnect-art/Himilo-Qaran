
import React, { useState, useMemo } from 'react';
import { User, JobPosition, TeamProposal, TeamMember, MembershipStatus, ElectionEvent, ElectionStatus } from '../../types';
import { UserPlus, Send, X, AlertCircle, Briefcase, UserCheck, CheckCircle2, Landmark, Clock } from 'lucide-react';

interface TeamProposalFormProps {
  currentUser: User;
  jobs: JobPosition[];
  users: User[];
  elections: ElectionEvent[];
  onSubmit: (proposal: TeamProposal) => void;
  existingProposal?: TeamProposal;
}

const TeamProposalForm: React.FC<TeamProposalFormProps> = ({ currentUser, jobs, users, elections, onSubmit, existingProposal }) => {
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>(existingProposal?.members || []);
  const [currentJobId, setCurrentJobId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  // SECTION 1: Context (Read-Only)
  const context = useMemo(() => {
    const activeElection = elections.find(e => e.status === ElectionStatus.CHAIRPERSON_PENDING);
    if (!activeElection) return null;
    
    return {
      electionName: activeElection.title,
      committeeId: activeElection.committeeId,
      chairName: currentUser.name,
      termDuration: '36 Months'
    };
  }, [elections, currentUser]);

  // SECTION 2: Job Selection (From Job Registry)
  const availableRegistryJobs = useMemo(() => {
    if (!context) return [];
    return jobs.filter(j => 
      j.status === 'ACTIVE' && 
      j.committeeId === context.committeeId
    );
  }, [jobs, context]);

  // SECTION 3: Member Eligibility Check
  const eligibleVoters = useMemo(() => {
    const selectedJob = jobs.find(j => j.id === currentJobId);
    return users.filter(u => {
      const isApproved = u.status === MembershipStatus.LA_ANSIXIYAY;
      const isNotChair = u.id !== currentUser.id;
      const isNotAssigned = !selectedMembers.some(m => m.memberId === u.id);
      
      if (!selectedJob) return isApproved && isNotChair && isNotAssigned;

      const matchesType = u.membershipType === selectedJob.requirements.membershipType;
      return isApproved && isNotChair && isNotAssigned && matchesType;
    });
  }, [users, currentJobId, jobs, currentUser.id, selectedMembers]);

  const addMember = () => {
    if (!currentJobId || !currentUserId) return;
    const job = jobs.find(j => j.id === currentJobId);
    const user = users.find(u => u.id === currentUserId);
    if (!job || !user) return;

    if (selectedMembers.find(m => m.jobId === currentJobId)) {
      alert("Xilkan hore ayaa loo buuxiyay.");
      return;
    }

    setSelectedMembers([...selectedMembers, {
      jobId: job.id,
      memberId: user.id,
      memberName: user.name
    }]);
    setCurrentJobId('');
    setCurrentUserId('');
  };

  const removeMember = (jobId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.jobId !== jobId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMembers.length === 0 || !context || !consentChecked) return;

    const proposal: TeamProposal = {
      id: `prop_${Date.now()}`,
      chairpersonId: currentUser.id,
      chairpersonName: currentUser.name,
      electionId: elections.find(e => e.status === ElectionStatus.CHAIRPERSON_PENDING)?.id || 'unknown',
      committeeId: context.committeeId,
      members: selectedMembers,
      status: 'PENDING_OVERSIGHT',
      submittedAt: new Date().toISOString()
    };
    onSubmit(proposal);
  };

  if (!context) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-8 animate-in fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300">
           <Clock size={40} />
        </div>
        <h3 className="text-3xl font-black text-slate-400 uppercase">Assignment Locked</h3>
        <p className="text-slate-500 font-bold uppercase tracking-tight">Team assignment is locked until chairperson confirmation.</p>
      </div>
    );
  }

  if (existingProposal && existingProposal.status === 'PENDING_OVERSIGHT') {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-2xl space-y-8">
          <div className="w-24 h-24 bg-hq-green/10 text-hq-green rounded-full flex items-center justify-center mx-auto">
            <UserCheck size={48} />
          </div>
          <h3 className="text-4xl font-black text-slate-900 uppercase">Under Oversight Review</h3>
          <p className="text-slate-500 font-medium text-lg leading-relaxed italic">
            "Your team composition is being vetted for constitutional compliance and integrity."
          </p>
          <div className="inline-block px-8 py-3 bg-slate-900 rounded-full text-xs font-black uppercase tracking-[0.2em] text-hq-yellow">
            Status: PENDING_OVERSIGHT
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24">
      {/* SECTION 1: Context */}
      <div className="bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-12 border-b-8 border-hq-yellow">
        <div className="relative z-10 space-y-6 flex-1">
          <div className="inline-flex items-center gap-3 bg-hq-green/20 text-hq-green px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-hq-green/30">
             Official Activation Flow
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Team Formation</h2>
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/10">
             <div>
                <div className="text-[10px] font-black text-hq-yellow uppercase tracking-widest mb-1">Election Body</div>
                <div className="text-lg font-black">{context.electionName}</div>
             </div>
             <div>
                <div className="text-[10px] font-black text-hq-yellow uppercase tracking-widest mb-1">Term Length</div>
                <div className="text-lg font-black">{context.termDuration}</div>
             </div>
          </div>
        </div>
        <div className="relative z-10 shrink-0 bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-xl text-center">
           <UserCheck size={48} className="mx-auto text-hq-green mb-4" />
           <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Chairperson Elect</div>
           <div className="text-2xl font-black">{context.chairName}</div>
        </div>
        <Landmark className="absolute -bottom-10 -right-10 text-white opacity-5" size={320} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SECTIONS 2 & 3: Selection & Assignment */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
               <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Briefcase size={20} />
               </div>
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Assign Member</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">1. Select Job Template *</label>
                <select 
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  value={currentJobId}
                  onChange={e => { setCurrentJobId(e.target.value); setCurrentUserId(''); }}
                >
                  <option value="">-- Pick Job Blueprint --</option>
                  {availableRegistryJobs.map(j => (
                    <option key={j.id} value={j.id}>{j.jobCode}: {j.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">2. Assign Verified Member *</label>
                <select 
                  disabled={!currentJobId}
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner disabled:opacity-50"
                  value={currentUserId}
                  onChange={e => setCurrentUserId(e.target.value)}
                >
                  <option value="">-- Pick Eligible Member --</option>
                  {eligibleVoters.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.membershipType})</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={addMember}
                disabled={!currentJobId || !currentUserId}
                className="w-full py-5 bg-hq-green text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest disabled:grayscale disabled:opacity-50"
              >
                <UserPlus size={18} /> Add to Team
              </button>
            </div>
          </div>
        </div>

        {/* TEAM LIST & SUBMIT */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-[4rem] border border-slate-200 p-12 shadow-sm space-y-12">
            <div className="flex justify-between items-center px-4">
               <h3 className="text-2xl font-black text-slate-900 uppercase">Proposed Committee Team</h3>
               <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">{selectedMembers.length} Roles Assigned</span>
            </div>

            <div className="space-y-4">
              {selectedMembers.map(m => {
                const job = jobs.find(j => j.id === m.jobId);
                return (
                  <div key={m.jobId} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:border-hq-green transition-all shadow-sm">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-hq-green shadow-inner border border-slate-50">
                          <CheckCircle2 size={24} />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{job?.jobCode}</span>
                             <div className="text-xs font-black text-slate-900 uppercase">{job?.title}</div>
                          </div>
                          <div className="text-lg font-bold text-slate-500">{m.memberName}</div>
                       </div>
                    </div>
                    <button type="button" onClick={() => removeMember(m.jobId)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                       <X size={20} />
                    </button>
                  </div>
                );
              })}
              {selectedMembers.length === 0 && (
                <div className="py-24 text-center space-y-6 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem]">
                   <Briefcase size={64} className="mx-auto text-slate-200" />
                   <p className="text-slate-400 font-black uppercase tracking-[0.3em]">No team members assigned.</p>
                </div>
              )}
            </div>

            {selectedMembers.length > 0 && (
               <div className="space-y-8 pt-8 border-t border-slate-50">
                  <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start gap-6">
                     <div className="shrink-0 w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center text-amber-700">
                        <AlertCircle size={20} />
                     </div>
                     <div className="flex-1 space-y-4">
                        <label htmlFor="finalDecl" className="text-sm font-bold text-amber-900 leading-relaxed uppercase cursor-pointer flex gap-4">
                           <input 
                              required 
                              type="checkbox" 
                              id="finalDecl" 
                              className="w-6 h-6 rounded-lg text-amber-600" 
                              checked={consentChecked}
                              onChange={e => setConsentChecked(e.target.checked)}
                           />
                           I confirm these assignments comply with the Party Constitution and Job Registry blueprint. I understand this selection is subject to Oversight review.
                        </label>
                     </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!consentChecked || selectedMembers.length === 0}
                    className="w-full py-8 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-black active:scale-95 transition-all uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale"
                  >
                     Submit for Oversight Review <Send size={20} />
                  </button>
               </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamProposalForm;
