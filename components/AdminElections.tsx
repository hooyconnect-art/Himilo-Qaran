
import React, { useState, useMemo } from 'react';
import { ElectionEvent, JobPosition, ElectionStatus, ElectionLevel, MembershipType, ElectionConfiguration } from '../types';
import { Calendar, Plus, X, ShieldCheck, MapPin, Megaphone, Target, Clock, Lock, ChevronRight, Gavel, AlertCircle } from 'lucide-react';

interface AdminElectionsProps {
  elections: ElectionEvent[];
  jobs: JobPosition[];
  onCreate: (e: ElectionEvent) => void;
  onUpdateStatus: (id: string, status: ElectionStatus) => void;
}

const AdminElections: React.FC<AdminElectionsProps> = ({ elections, jobs, onCreate, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    jobId: '',
    level: ElectionLevel.QARAN,
    regStart: '',
    regEnd: '',
    voteStart: '',
    voteEnd: ''
  });

  const sortedElections = useMemo(() => {
    return [...elections].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [elections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.jobId) return;

    // Added logic to find the selected job and extract its committeeId
    const selectedJob = jobs.find(j => j.id === formData.jobId);

    // Fixed: Ensure committeeId is provided to satisfy ElectionEvent interface
    const newElection: ElectionEvent = {
      id: `elec_${Date.now()}`,
      title: formData.title,
      committeeId: selectedJob?.committeeId || '', // committeeId is required
      jobIds: [formData.jobId],
      level: formData.level,
      scope: 'Qaran',
      status: ElectionStatus.DRAFT,
      startDate: formData.voteStart || new Date().toISOString(),
      endDate: formData.voteEnd || new Date().toISOString(),
      registrationEnd: formData.regEnd || new Date().toISOString(),
      registrationEnabled: true,
      registrationStart: formData.regStart || new Date().toISOString(),
      voterPool: MembershipType.FIRFIRCOON,
      totalVoters: 5000, 
      votesCast: 0,
      isLocked: false,
      config: {
        votingStartAt: formData.voteStart || new Date().toISOString(),
        votingEndAt: formData.voteEnd || new Date().toISOString(),
      }
    };
    
    onCreate(newElection);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em] mb-2">
            <Gavel size={14} /> Electoral Control
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Election Engine Hub</h2>
          <p className="text-slate-500 font-medium mt-2">Maamulka dhammaan doorashooyinka (Draft -> Finalized).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest"
        >
          <Plus size={20} /> Bilow Tartan Cusub
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedElections.map(election => (
          <div key={election.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center group hover:border-indigo-400 transition-all">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                   <Calendar size={32} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase">{election.title}</h3>
                   <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{election.level}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 border-r pr-3">
                        <Clock size={10} /> Vote: {new Date(election.startDate).toLocaleDateString()}
                      </span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-4 mt-6 md:mt-0">
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                  election.status === ElectionStatus.CODBIXINTA ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  election.status === ElectionStatus.OPEN_FOR_APPLICATION ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  'bg-slate-50 text-slate-500 border-slate-100'
                }`}>
                   {election.status}
                </div>
                
                {election.status === ElectionStatus.DRAFT && (
                  <button onClick={() => onUpdateStatus(election.id, ElectionStatus.OPEN_FOR_APPLICATION)} className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg">Activate Registration</button>
                )}
                {election.status === ElectionStatus.OPEN_FOR_APPLICATION && (
                   <button onClick={() => onUpdateStatus(election.id, ElectionStatus.REGISTRATION_CLOSED)} className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg">Close & Start Vetting</button>
                )}
                {election.status === ElectionStatus.REGISTRATION_CLOSED && (
                   <button onClick={() => onUpdateStatus(election.id, ElectionStatus.CODBIXINTA)} className="px-6 py-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg">Open Terminal</button>
                )}
                {election.status === ElectionStatus.CODBIXINTA && (
                   <button onClick={() => onUpdateStatus(election.id, ElectionStatus.CLOSED)} className="px-6 py-2.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg">End Voting</button>
                )}
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden p-12 animate-in slide-in-from-bottom-8">
             <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
                <h3 className="text-2xl font-black text-slate-900 uppercase">Qeexidda Doorashada</h3>
                <button onClick={() => setIsModalOpen(false)}><X /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Electoral Title *</label>
                   <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Tusaale: Doorashada Guddiga Maaliyadda 2024" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Role *</label>
                   <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={formData.jobId} onChange={e => setFormData({...formData, jobId: e.target.value})}>
                      <option value="">-- Xulo Xilka --</option>
                      {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                   </select>
                </div>
                <button type="submit" className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs">Kaydi Tartanka</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminElections;
