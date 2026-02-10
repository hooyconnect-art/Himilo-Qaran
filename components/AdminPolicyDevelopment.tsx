
import React, { useState, useMemo } from 'react';
import { 
  Idea, WorkflowStatus, PolicyType, ImpactLevel, User, Role, 
  ReviewAction, CampaignMapping, ExecutionProject, Appeal, 
  ElectionEvent, ElectionStatus, JobPosition, ElectionLevel, MembershipType
} from '../types';
import { 
  Lightbulb, FileText, Plus, X, Search, 
  Calendar, User as UserIcon, ShieldCheck, ChevronRight, 
  AlertCircle, History, Megaphone, Target, Gavel, 
  Scale, BookOpen, Rocket, RefreshCw, Landmark, Link, Briefcase, ShieldAlert
} from 'lucide-react';

interface AdminPolicyDevelopmentProps {
  ideas: Idea[];
  onNavigateToFlow: () => void;
  currentUser: User;
  onAddIdea: (data: Partial<Idea>) => void;
  onUpdateIdeaStatus: (id: string, status: WorkflowStatus, action: ReviewAction) => void;
  onMapToCampaign: (policyId: string, mapping: Partial<CampaignMapping>) => void;
  onMapToExecution: (policyId: string, project: Partial<ExecutionProject>) => void;
  onAddAppeal: (policyId: string, appeal: Partial<Appeal>) => void;
  elections: ElectionEvent[];
  jobs: JobPosition[];
  onCreateElection: (e: ElectionEvent) => void;
}

const AdminPolicyDevelopment: React.FC<AdminPolicyDevelopmentProps> = ({ 
  ideas, 
  currentUser,
  onAddIdea,
  onUpdateIdeaStatus,
  onMapToCampaign,
  elections,
  jobs,
  onCreateElection
}) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'policies'>('registry');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [legislativeDraft, setLegislativeDraft] = useState('');

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkOption, setLinkOption] = useState<'existing' | 'new'>('existing');
  const [selectedElectionToLink, setSelectedElectionToLink] = useState('');
  
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    level: 'Qaran',
    jobId: '',
    startDate: '',
    endDate: '',
    voterGroup: '',
    notes: ''
  });

  const [newIdea, setNewIdea] = useState<Partial<Idea>>({
    title: '',
    description: '',
    category: 'Arrimaha Bulshada',
    policyType: PolicyType.SIYAASAD,
    impactLevel: ImpactLevel.QARAN
  });

  const selectedIdea = useMemo(() => ideas.find(i => i.id === selectedIdeaId), [ideas, selectedIdeaId]);

  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase());
      if (activeTab === 'policies') return (idea.status === WorkflowStatus.CONVERTED_TO_POLICY || idea.status === WorkflowStatus.APPROVED) && matchesSearch;
      return idea.status !== WorkflowStatus.CONVERTED_TO_POLICY && idea.status !== WorkflowStatus.APPROVED && matchesSearch;
    });
  }, [ideas, searchTerm, activeTab]);

  const activeElections = useMemo(() => 
    elections.filter(e => e.status === ElectionStatus.OPEN_FOR_APPLICATION || e.status === ElectionStatus.DRAFT),
  [elections]);

  const handleAction = (nextStatus: WorkflowStatus, actionLabel: string) => {
    if (!reviewNotes.trim()) { alert("Fadlan qor warbixinta rasmiga ah."); return; }
    if (selectedIdeaId) {
      const action: ReviewAction = {
        id: `ra_${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        actionType: actionLabel,
        notes: reviewNotes + (legislativeDraft ? `\n\nLEGISLATIVE DRAFT:\n${legislativeDraft}` : ''),
        timestamp: new Date().toISOString()
      };
      onUpdateIdeaStatus(selectedIdeaId, nextStatus, action);
      setReviewNotes('');
      setLegislativeDraft('');
      setSelectedIdeaId(null);
    }
  };

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title || !newIdea.description) {
      alert("Fadlan buuxi meelaha banaan.");
      return;
    }
    onAddIdea(newIdea);
    setIsSubmitModalOpen(false);
    setNewIdea({ title: '', description: '', category: 'Arrimaha Bulshada', policyType: PolicyType.SIYAASAD, impactLevel: ImpactLevel.QARAN });
  };

  const openLinkModal = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    const idea = ideas.find(i => i.id === ideaId);
    setNewCampaign(prev => ({ ...prev, title: idea ? `${idea.title} Campaign` : '' }));
    setIsLinkModalOpen(true);
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdeaId) return;

    if (linkOption === 'existing') {
      if (!selectedElectionToLink) return;
      onMapToCampaign(selectedIdeaId, { electionId: selectedElectionToLink });
    } else {
      if (!newCampaign.title || !newCampaign.jobId) return;

      // Added logic to find the selected job and extract its committeeId
      const selectedJob = jobs.find(j => j.id === newCampaign.jobId);

      // Fixed: Ensure committeeId is provided to satisfy ElectionEvent interface
      const newElection: ElectionEvent = {
        id: `elec_${Date.now()}`,
        title: newCampaign.title,
        committeeId: selectedJob?.committeeId || '', // committeeId is required
        status: ElectionStatus.DRAFT,
        startDate: newCampaign.startDate || new Date().toISOString(),
        endDate: newCampaign.endDate || new Date(Date.now() + 2592000000).toISOString(),
        registrationEnd: new Date(Date.now() + 1296000000).toISOString(),
        level: newCampaign.level,
        scope: 'General',
        jobIds: [newCampaign.jobId],
        totalVoters: 5000,
        votesCast: 0,
        campaignPolicyIds: [selectedIdeaId]
      };
      onCreateElection(newElection);
      onMapToCampaign(selectedIdeaId, { electionId: newElection.id });
    }
    setIsLinkModalOpen(false);
    setSelectedIdeaId(null);
    setSelectedElectionToLink('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 relative">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-hq-black p-12 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-hq-yellow font-black uppercase text-[10px] tracking-[0.4em] mb-4">
             <BookOpen size={14} /> Policy Factory
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Matoorka Siyaasadda</h2>
          <p className="text-slate-400 font-medium mt-3 text-lg">U beddelidda fikradaha xubnaha go'aanno hay'adeed oo waafaqsan Himilo Qaran.</p>
        </div>
        
        <div className="flex gap-4 relative z-20">
          <button 
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-4 px-12 py-6 bg-hq-green hover:bg-green-600 text-white rounded-[2rem] text-sm font-black shadow-2xl shadow-green-900/40 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={24} /> Gudbi Fikrad
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-5">
           <Rocket size={360} className="text-white" />
        </div>
      </div>

      <div className="flex border-b-2 border-slate-200">
        <button onClick={() => setActiveTab('registry')} className={`px-10 py-5 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'registry' ? 'border-hq-green text-hq-green' : 'border-transparent text-slate-400'}`}>Registry-ga Fikradaha</button>
        <button onClick={() => setActiveTab('policies')} className={`px-10 py-5 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'policies' ? 'border-hq-green text-hq-green' : 'border-transparent text-slate-400'}`}>Xafiiska Siyaasadaha</button>
      </div>

      {/* 2. MAIN REGISTRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 bg-slate-50/50 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" placeholder="Raadi fikradaha ama siyaasadaha..." className="w-full pl-14 pr-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-base outline-none focus:border-hq-green transition-all shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
             </div>
             <div className="divide-y divide-slate-50">
                {filteredIdeas.map(idea => (
                  <div key={idea.id} className="p-10 hover:bg-green-50/20 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 cursor-pointer flex-1" onClick={() => setSelectedIdeaId(idea.id)}>
                         <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-hq-blue bg-blue-50 px-3 py-1 rounded-md border border-blue-100 uppercase">{idea.policyType || PolicyType.SIYAASAD}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{idea.category}</span>
                            {idea.linkedCampaignsCount && idea.linkedCampaignsCount > 0 ? (
                               <span className="text-[8px] font-black bg-hq-green/10 text-hq-green px-2 py-1 rounded-full border border-hq-green/20 uppercase tracking-tighter">Linked Campaign</span>
                            ) : null}
                         </div>
                         <h4 className="text-2xl font-black text-hq-black group-hover:text-hq-green transition-colors leading-tight uppercase">{idea.title}</h4>
                         <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><UserIcon size={14} className="text-hq-blue"/> {idea.authorName}</span>
                            <span className="flex items-center gap-2"><Calendar size={14} className="text-hq-green"/> {new Date(idea.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-8 shrink-0">
                         <div className="text-right flex flex-col items-end gap-3">
                            <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border-2 ${
                              idea.status === WorkflowStatus.APPROVED ? 'bg-green-50 text-hq-green border-green-200' :
                              idea.status === WorkflowStatus.REFINING ? 'bg-yellow-50 text-hq-yellow border-yellow-200' :
                              'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              {idea.status}
                            </div>
                         </div>
                         <ChevronRight size={28} className="text-slate-200 group-hover:text-hq-green transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
                {filteredIdeas.length === 0 && (
                  <div className="p-32 text-center text-slate-400 italic font-black uppercase text-sm tracking-[0.3em]">Ma jiro xog laga helay pipeline-ka.</div>
                )}
             </div>
          </div>
        </div>

        {/* 3. ORGAN CONTEXT PANEL */}
        <div className="space-y-6">
           <div className="bg-hq-black rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border-b-8 border-hq-yellow">
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-hq-green rounded-2xl shadow-xl border border-white/10">
                       <ShieldCheck size={28} className="text-hq-yellow" />
                    </div>
                    <div>
                       <h4 className="text-xl font-black uppercase tracking-tight leading-none">Your Authority</h4>
                       <p className="text-[11px] text-hq-yellow font-black uppercase tracking-widest mt-1">{currentUser.role}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                       <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Active Protocols</div>
                       <ul className="space-y-3">
                          {[
                            { role: Role.GOLE_DHEXE, text: 'Synthesis & Policy Drafting' },
                            { role: Role.GOLE_SARE, text: 'Constitutional Ratification' },
                            { role: Role.FULINTA, text: 'Implementation & KPI Launch' },
                            { role: Role.SUPER_ADMIN, text: 'Omni-Oversight Access' }
                          ].filter(x => x.role === currentUser.role || currentUser.role === Role.SUPER_ADMIN).map((a, i) => (
                            <li key={i} className="text-xs font-black text-slate-300 flex items-center gap-3">
                               <div className="w-2 h-2 bg-hq-green rounded-full shadow-[0_0_8px_rgba(76,175,80,0.8)]" /> {a.text}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
              <Scale size={240} className="absolute -bottom-16 -right-16 opacity-5" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPolicyDevelopment;
