
import React, { useState } from 'react';
import { User, Role, MembershipStatus, Idea, WorkflowStatus, PolicyType, ImpactLevel } from '../types';
import { 
  Send, FileText, ShieldCheck, AlertCircle, Info, 
  ChevronRight, CheckCircle2, User as UserIcon, 
  MapPin, Fingerprint, Award, Landmark, HelpCircle, Target
} from 'lucide-react';

interface MemberIdeaSubmissionProps {
  currentUser: User;
  onAddIdea: (data: Partial<Idea>) => void;
  onNavigateToDashboard: () => void;
}

const CATEGORIES = [
  "Policy & Strategy", "Legal & Constitutional", "Economy & Development",
  "Social Affairs", "Education & Skills", "Youth & Innovation",
  "Women & Inclusion", "Security & Peace", "Governance & Accountability",
  "Environment & Climate", "Foreign Affairs & Diaspora", "Technology & Digital",
  "Culture & Identity", "Finance & Resources", "Special Initiatives"
];

const MemberIdeaSubmission: React.FC<MemberIdeaSubmissionProps> = ({ currentUser, onAddIdea, onNavigateToDashboard }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    problem: '',
    solution: '',
    impact: '',
    targetGroup: '',
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);

  const isEligible = currentUser.status === MembershipStatus.LA_ANSIXIYAY || currentUser.status === MembershipStatus.PENDING_ACTIVATION;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;

    const newIdea: Partial<Idea> = {
      title: formData.title,
      description: `PROBLEM:\n${formData.problem}\n\nSOLUTION:\n${formData.solution}\n\nIMPACT:\n${formData.impact}${formData.targetGroup ? `\n\nTARGET:\n${formData.targetGroup}` : ''}`,
      category: formData.category,
      authorId: currentUser.id,
      authorName: currentUser.name,
      status: WorkflowStatus.SUBMITTED
    };

    onAddIdea(newIdea);
    setSubmitted(true);
  };

  if (!isEligible) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-red-100">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl font-black text-slate-900 uppercase">Access Restricted</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Only verified members with an <strong>ACTIVE (LA_ANSIXIYAY)</strong> status are permitted to initiate the institutional ideation protocol. Your current account status is: <span className="text-red-600 font-bold underline">{currentUser.status}</span>.
          </p>
        </div>
        <button onClick={onNavigateToDashboard} className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">
          Return to Console
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-20 animate-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-[4rem] p-20 text-center space-y-10 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-100 relative z-10">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-4xl font-black text-slate-900 uppercase leading-none">Fikradaada Waa La Gudbiyay</h3>
            <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">
              Your proposal has been successfully logged into the institutional memory. It is now awaiting Stage 2 (Technical Filtering) by the respective committee.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 relative z-10">
             <button onClick={() => { setSubmitted(false); setFormData({ title: '', category: '', problem: '', solution: '', impact: '', targetGroup: '', consent: false }); setStep(1); }} className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all uppercase text-xs tracking-widest">
               Submit Another Idea
             </button>
             <button onClick={onNavigateToDashboard} className="px-10 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">
               Back to My Dashboard
             </button>
          </div>
          <Landmark className="absolute -bottom-10 -right-10 text-slate-50 opacity-50" size={300} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24">
      {/* HEADER SECTION */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
        <div className="relative z-10 space-y-4">
           <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
              <Landmark size={14} /> Official Ideation Protocol
           </div>
           <h2 className="text-5xl font-black tracking-tight uppercase leading-none">Dhismaha Fikrad Cusub</h2>
           <p className="text-slate-400 text-lg font-medium max-w-xl">
             Stage 1 of the Governance Pipeline. Your voice is the foundation of our institution's growth.
           </p>
        </div>
        <div className="shrink-0 bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[240px]">
           <div className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest">Permanent Hash Registry</div>
           <div className="text-xl font-mono font-bold tracking-tighter opacity-80">STG-1-AUTH-{currentUser.id.toUpperCase().slice(0, 6)}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: MEMBER IDENTITY (Read Only) */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-8">
           <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Fingerprint className="text-indigo-600" size={24} />
              <h3 className="text-xl font-black text-slate-900 uppercase">Section 1: Member Identity</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Full Name</div>
                 <div className="text-sm font-black text-slate-800 uppercase">{currentUser.name}</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Membership ID</div>
                 <div className="text-sm font-black text-slate-800">{currentUser.nationalId || `M-${currentUser.id.slice(0, 8)}`}</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Region / Branch</div>
                 <div className="text-sm font-black text-slate-800">{currentUser.region}</div>
              </div>
           </div>
        </section>

        {/* SECTION 2: CLASSIFICATION */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-8">
           <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Target className="text-indigo-600" size={24} />
              <h3 className="text-xl font-black text-slate-900 uppercase">Section 2: Idea Classification</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Idea Title *</label>
                 <input 
                    required
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all"
                    placeholder="E.g. National Infrastructure Resilience Strategy..."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Institutional Category *</label>
                 <select 
                    required
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                 >
                    <option value="">-- Select Category --</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
           </div>
        </section>

        {/* SECTION 3: DESCRIPTION */}
        <section className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-12">
           <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <FileText className="text-indigo-600" size={24} />
              <h3 className="text-xl font-black text-slate-900 uppercase">Section 3: Detailed Framework</h3>
           </div>
           
           <div className="space-y-8">
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Problem Statement *</label>
                    <div className="group relative">
                       <HelpCircle size={14} className="text-slate-300" />
                       <span className="absolute left-full ml-2 top-0 bg-slate-800 text-white text-[9px] p-2 rounded w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">Sharax dhibaatada aad aragtay oo u baahan xal hay'adeed.</span>
                    </div>
                 </div>
                 <textarea 
                    required
                    rows={4}
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                    placeholder="What specific issue is the party facing or what national gap needs addressing?"
                    value={formData.problem}
                    onChange={e => setFormData({...formData, problem: e.target.value})}
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Proposed Solution *</label>
                 <textarea 
                    required
                    rows={6}
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                    placeholder="Provide a step-by-step resolution or strategy proposal."
                    value={formData.solution}
                    onChange={e => setFormData({...formData, solution: e.target.value})}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Expected Impact</label>
                    <textarea 
                       rows={3}
                       className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                       placeholder="Short and long-term results expected from this idea."
                       value={formData.impact}
                       onChange={e => setFormData({...formData, impact: e.target.value})}
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Target Demographic (Optional)</label>
                    <textarea 
                       rows={3}
                       className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                       placeholder="Who will benefit most from this? (E.g. Rural farmers, Youth, Educators)"
                       value={formData.targetGroup}
                       onChange={e => setFormData({...formData, targetGroup: e.target.value})}
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 4: DECLARATION */}
        <section className="bg-indigo-50 rounded-[2.5rem] border border-indigo-100 p-10 space-y-6">
           <div className="flex items-center gap-4">
              <ShieldCheck className="text-indigo-600" size={28} />
              <h3 className="text-xl font-black text-indigo-900 uppercase">Section 4: Constitutional Consent</h3>
           </div>
           <div className="flex items-start gap-5">
              <input 
                 required
                 type="checkbox" 
                 id="finalConsent" 
                 className="mt-1.5 w-8 h-8 rounded-xl text-indigo-600 border-indigo-200"
                 checked={formData.consent}
                 onChange={e => setFormData({...formData, consent: e.target.checked})}
              />
              <label htmlFor="finalConsent" className="text-sm font-bold text-indigo-800 leading-relaxed uppercase tracking-tight cursor-pointer">
                I confirm this idea aligns with the Party Constitution, and I accept that it will undergo professional committee review. I understand that once submitted, this record enters the immutable party log.
              </label>
           </div>
        </section>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl">
           <div className="flex items-center gap-4 text-slate-500 max-w-md">
              <Info className="shrink-0" size={24} />
              <p className="text-[10px] font-bold uppercase leading-relaxed">
                 Submissions are monitored by the <strong>Oversight Body (Kormeer)</strong> to prevent regional bias or duplicate entries.
              </p>
           </div>
           <button 
              type="submit"
              disabled={!formData.consent || !formData.title || !formData.category || !formData.problem || !formData.solution}
              className={`px-16 py-6 rounded-[2rem] font-black text-white shadow-2xl flex items-center gap-4 transition-all transform active:scale-95 uppercase tracking-[0.3em] text-sm ${
                formData.consent && formData.title && formData.category && formData.problem && formData.solution
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-slate-300 cursor-not-allowed shadow-none grayscale'
              }`}
           >
              Gudbi Fikrada <Send size={20} />
           </button>
        </div>

      </form>
    </div>
  );
};

export default MemberIdeaSubmission;
