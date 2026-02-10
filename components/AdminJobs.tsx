
import React, { useState, useMemo } from 'react';
import { JobPosition, JobCategory, ElectionLevel, VotingMethod, MembershipStatus, MembershipType } from '../types';
import { Briefcase, Plus, X, Award, Target, ListChecks, Hash, Calendar, ShieldCheck, Search, Filter } from 'lucide-react';

interface AdminJobsProps {
  jobs: JobPosition[];
  onAddJob: (job: JobPosition) => void;
}

const PRESET_DEPARTMENTS = [
  'Guddiga Warbaahinta & Xiriirka Bulshada',
  'Guddiga Ololaha & Doorashooyinka',
  'Guddiga Dhalinyarada',
  'Guddiga Haweenka',
  'Guddiga Cilmi-baarista & Siyaasadda',
  'Guddiga Abaabulka & Xubinnimada',
  'Guddiga Maaliyadda & Hantida',
  'Guddiga Anshaxa & Kormeerka',
  'Guddiga Arrimaha Sharciga & Dastuurka',
  'Guddiga Nabadda & Midnimada',
  'Guddiga Arrimaha Bulshada',
  'Guddiga Waxbarashada & Tababarka',
  'Guddiga Dhaqaalaha & Horumarinta',
  'Guddiga Xiriirka Dibadda',
  'Guddiga Caddaaladda & Xuquuqul Insaanka',
  'Guddiga Kormeerka Fullinta',
  'Guddiga Qorsheynta & Istaraatiijiyadda Qaranka'
];

const AdminJobs: React.FC<AdminJobsProps> = ({ jobs, onAddJob }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState<Partial<JobPosition>>({
    jobCode: '',
    title: '',
    committeeId: '',
    category: JobCategory.FARSAMO,
    level: ElectionLevel.QARAN,
    termMonths: 36,
    termLimit: 2,
    youthQuota: false,
    votingMethod: VotingMethod.COUNCIL,
    status: 'ACTIVE',
    requirements: {
      membershipType: MembershipType.FIRFIRCOON,
      status: MembershipStatus.LA_ANSIXIYAY
    },
    kpis: []
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           job.jobCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [jobs, searchTerm, categoryFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddJob({ ...formData, id: `job_${Date.now()}` } as JobPosition);
    setIsModalOpen(false);
    setFormData({ jobCode: '', title: '', committeeId: '', category: JobCategory.FARSAMO, level: ElectionLevel.QARAN, termMonths: 36, termLimit: 2, youthQuota: false, votingMethod: VotingMethod.COUNCIL, status: 'ACTIVE', requirements: { membershipType: MembershipType.FIRFIRCOON, status: MembershipStatus.LA_ANSIXIYAY }, kpis: [] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl gap-6 relative overflow-hidden border-b-8 border-hq-yellow">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-hq-yellow font-black uppercase text-[10px] tracking-[0.4em] mb-3">
             <Target size={14} /> Structural Registry
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Job Blueprint Hub</h2>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl">
            Institutional Role Repository: Only standardized roles from this registry can be assigned to committee members after elections.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 flex items-center gap-4 px-12 py-6 bg-hq-green hover:bg-green-600 text-white rounded-[2rem] text-sm font-black shadow-2xl transition-all active:scale-95 uppercase tracking-widest group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform" /> 
          Qeex Xil Cusub
        </button>
        <Briefcase className="absolute -bottom-10 -right-10 text-white opacity-5" size={320} />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 p-8 flex flex-col md:flex-row gap-6 shadow-sm">
         <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Raadi xilka ama Job Code-ka..." 
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none font-black text-base shadow-inner focus:border-indigo-400 transition-all"
            />
         </div>
         <div className="flex items-center gap-4">
            <Filter className="text-slate-400" size={20} />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-8 py-5 bg-white border-2 border-slate-100 rounded-[1.5rem] font-black text-xs uppercase outline-none shadow-sm"
            >
               <option value="all">Dhammaan Qaybaha</option>
               {(Object.values(JobCategory) as JobCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white rounded-[3rem] border border-slate-200 p-10 hover:shadow-2xl hover:border-indigo-400 transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="p-5 bg-slate-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                   <Target size={32} />
                 </div>
                 <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-100 shadow-sm">{job.jobCode}</div>
              </div>
              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border ${job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{job.status}</span>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight flex-1 uppercase tracking-tight">{job.title}</h3>
            
            <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-50 mb-8 bg-slate-50/50 rounded-[2rem] px-8">
               <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Committee ID</div>
                 <div className="text-sm font-black text-slate-900">{job.committeeId || 'N/A'}</div>
               </div>
               <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Level</div>
                 <div className="text-sm font-black text-indigo-600">{job.level}</div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ListChecks size={14} className="text-indigo-400" /> Key Metrics (KPIs)
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {(job.kpis || []).map((k: string, i: number) => (
                       <span key={i} className="px-4 py-1.5 bg-white border border-slate-100 text-slate-500 text-[10px] font-black rounded-xl uppercase shadow-sm">{k}</span>
                     ))}
                  </div>
               </div>
               
               <div className="space-y-3 pt-6 border-t border-slate-50">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-hq-green" /> Requirements
                  </div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                    {job.requirements.membershipType} • {job.requirements.status}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] w-full max-w-5xl shadow-2xl overflow-hidden p-16 animate-in slide-in-from-bottom-12 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-12 shrink-0 border-b border-slate-50 pb-8">
                 <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                     <ShieldCheck size={32} />
                   </div>
                   <div>
                     <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Blueprint Definition</h3>
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Standardized Committee Role Protocol</p>
                   </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-100 rounded-full transition-colors"><X size={32}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-12 overflow-y-auto pr-8 custom-scrollbar flex-1 pb-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Job Code *</label>
                      <input required className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" value={formData.jobCode || ''} onChange={e => setFormData({...formData, jobCode: e.target.value})} placeholder="HQ-PO-001" />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Official Title *</label>
                      <input required className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="E.g. Director of Strategic Communications" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Committee ID *</label>
                      <input required className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 shadow-inner" value={formData.committeeId || ''} onChange={e => setFormData({...formData, committeeId: e.target.value})} placeholder="E.g. COM-POL-01" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Role Level</label>
                      <select className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 shadow-inner" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                         {['National', 'Regional', 'District'].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Membership Type Requirement</label>
                      <select className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 shadow-inner" value={formData.requirements?.membershipType} onChange={e => setFormData({...formData, requirements: { ...formData.requirements!, membershipType: e.target.value as MembershipType }})}>
                         {(Object.values(MembershipType) as MembershipType[]).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Term Length (Months)</label>
                      <input type="number" required className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black shadow-inner" value={formData.termMonths || 36} onChange={e => setFormData({...formData, termMonths: parseInt(e.target.value)})} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Success Indicators (KPIs)</label>
                    <textarea 
                      className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] font-black text-sm h-32 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" 
                      placeholder="Gali KPIs-ka (Hal xariiq midkiiba)..."
                      value={(formData.kpis || []).join('\n')}
                      onChange={e => setFormData({...formData, kpis: e.target.value.split('\n').filter(k => k.trim())})}
                    />
                 </div>

                 <div className="pt-10 sticky bottom-0 bg-white">
                   <button type="submit" className="w-full py-8 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl active:scale-95 transition-all uppercase tracking-[0.4em] text-sm hover:bg-black">
                     Authorize & Archive Blueprint
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
