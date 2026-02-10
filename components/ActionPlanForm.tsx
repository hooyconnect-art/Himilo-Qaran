
import React, { useState, useMemo } from 'react';
import { User, ElectionEvent, JobPosition, CandidateRecord, ActionPlan, PlanStatus, MembershipStatus } from '../types';
import { ShieldCheck, Target, Users, Calendar, Clock, ArrowRight, CheckCircle2, AlertTriangle, Landmark, ListChecks, Send, Briefcase, Lock } from 'lucide-react';

interface ActionPlanFormProps {
  currentUser: User;
  elections: ElectionEvent[];
  jobs: JobPosition[];
  candidates: CandidateRecord[];
  onSubmit: (plan: ActionPlan) => void;
  alreadySubmitted?: boolean;
}

const ActionPlanForm: React.FC<ActionPlanFormProps> = ({ currentUser, elections, jobs, candidates, onSubmit, alreadySubmitted }) => {
  const [vision, setVision] = useState('');
  const [objectives, setObjectives] = useState(['', '']);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [implDetails, setImplDetails] = useState<Record<string, { method: string, timeline: string, kpi: string }>>({});
  const [team, setTeam] = useState<{ role: string, memberId: string, memberName: string, tasks: string[] }[]>([
    { role: 'Xoghayaha Guddiga', memberId: '', memberName: '', tasks: [] },
    { role: 'Farsamada & Isku-duwidda', memberId: '', memberName: '', tasks: [] }
  ]);
  const [oathAccepted, setOathAccepted] = useState(false);

  // Auto-filled Context
  const context = useMemo(() => {
    const winningRecord = candidates.find(c => c.userId === currentUser.id);
    const election = elections.find(e => e.id === winningRecord?.electionId);
    const job = jobs.find(j => j.id === winningRecord?.jobId);
    return {
      committeeName: job?.title || 'Unknown Committee',
      committeeId: job?.id || '',
      electionId: election?.id || '',
      termLength: `${job?.termMonths || 0} Bilood`,
    };
  }, [currentUser.id, candidates, elections, jobs]);

  // Available pre-registered activities linked to the committee
  const availableActivities = useMemo(() => {
    const job = jobs.find(j => j.id === context.committeeId);
    return job?.kpis || ['Social Outreach', 'Policy Review', 'Internal Audit'];
  }, [jobs, context.committeeId]);

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjs = [...objectives];
    newObjs[index] = value;
    setObjectives(newObjs);
  };

  const toggleActivity = (act: string) => {
    if (alreadySubmitted) return;
    if (selectedActivities.includes(act)) {
      setSelectedActivities(selectedActivities.filter(a => a !== act));
    } else {
      setSelectedActivities([...selectedActivities, act]);
      setImplDetails(prev => ({ ...prev, [act]: { method: '', timeline: '', kpi: '' } }));
    }
  };

  const updateImpl = (act: string, field: 'method' | 'timeline' | 'kpi', val: string) => {
    if (alreadySubmitted) return;
    setImplDetails(prev => ({
      ...prev,
      [act]: { ...prev[act], [field]: val }
    }));
  };

  const handleTeamChange = (index: number, field: string, val: string) => {
    if (alreadySubmitted) return;
    const newTeam = [...team];
    (newTeam[index] as any)[field] = val;
    setTeam(newTeam);
  };

  const isComplete = vision.length > 20 && 
    objectives.every(o => o.length > 5) && 
    selectedActivities.length > 0 && 
    oathAccepted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || alreadySubmitted) return;

    const plan: ActionPlan = {
      id: `plan_${Date.now()}`,
      chairpersonId: currentUser.id,
      chairpersonName: currentUser.name,
      committeeId: context.committeeId,
      committeeName: context.committeeName,
      electionId: context.electionId,
      vision,
      objectives,
      selectedActivities,
      implementationDetails: implDetails,
      team,
      oathAccepted,
      status: PlanStatus.UNDER_REVIEW,
      submittedAt: new Date().toISOString()
    };

    onSubmit(plan);
  };

  if (alreadySubmitted) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-slate-900 text-indigo-400 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl border-4 border-slate-800">
          <Lock size={40} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900 uppercase">Qorshaha waa la gudbiyay</h2>
          <p className="text-slate-500 font-bold text-lg max-w-lg mx-auto leading-relaxed">
            Guddoomiye, nidaamku wuxuu xiray form-ka maadaama aad hore u soo gudbisay. Hadda waxaa gacanta ku haya Guddiga Kormeerka (Oversight).
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl inline-block">
          <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Status: KU JIRA QIIMEYN (UNDER REVIEW)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="bg-slate-900 rounded-[3rem] p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
            Post-Election Activation (Protocol VI)
          </div>
          <h2 className="text-5xl font-black tracking-tight uppercase leading-none">Dhismaha Qorshe-Hawleedka</h2>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
            Guddoomiye Sugitaan, hambalyo! Si aad si rasmi ah ugu hawlgasho xilka laguu doortay ee <strong>{context.committeeName}</strong>, waa inaad buuxisaa qorshahan oo ay ansixiyaan Guddiga Kormeerka.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-16 opacity-10">
          <Landmark size={300} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* SECTION A: Context */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8">
           <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guddiga</div>
              <div className="text-sm font-black text-slate-900">{context.committeeName}</div>
           </div>
           <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guddoomiyaha</div>
              <div className="text-sm font-black text-slate-900">{currentUser.name}</div>
           </div>
           <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Muddada Xilka</div>
              <div className="text-sm font-black text-slate-900">{context.termLength}</div>
           </div>
           <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status-ka Hadda</div>
              <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase w-fit border border-indigo-100">Chairperson Pending</div>
           </div>
        </section>

        {/* SECTION B: Vision */}
        <section className="bg-white rounded-[3rem] border border-slate-200 p-16 shadow-sm space-y-8">
           <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <Target className="text-indigo-600" size={24} />
              <h3 className="text-2xl font-black text-slate-900 uppercase">Qaybta B: Aragti & Yoolal</h3>
           </div>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aragtida Guddiga ee 3-da Sano *</label>
                 <textarea 
                    required
                    className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium h-32"
                    placeholder="Maxaad rabtaa inaad u qabato guddigan..."
                    value={vision}
                    onChange={e => setVision(e.target.value)}
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yoolalka ugu muhiimsan (Objectives) *</label>
                 {objectives.map((obj, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                       <input 
                          required
                          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                          value={obj}
                          onChange={e => handleObjectiveChange(i, e.target.value)}
                          placeholder={`Yoolka ${i+1}...`}
                       />
                    </div>
                 ))}
                 <button 
                    type="button" 
                    onClick={() => setObjectives([...objectives, ''])}
                    className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest flex items-center gap-2"
                 >
                    <Plus size={14} /> Ku dar Yool kale
                 </button>
              </div>
           </div>
        </section>

        {/* SECTION C & D: Activity Implementation */}
        <section className="bg-white rounded-[3rem] border border-slate-200 p-16 shadow-sm space-y-12">
           <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <ListChecks className="text-indigo-600" size={24} />
              <h3 className="text-2xl font-black text-slate-900 uppercase">Qaybta C & D: Hawlaha & Hirgelinta</h3>
           </div>
           <div className="space-y-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xulo Hawlaha hor-yaalla Guddiga *</label>
                 <div className="flex flex-wrap gap-3">
                    {availableActivities.map(act => (
                       <button 
                          key={act}
                          type="button"
                          onClick={() => toggleActivity(act)}
                          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                             selectedActivities.includes(act) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200'
                          }`}
                       >
                          {act}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-8 pt-8">
                 {selectedActivities.map(act => (
                    <div key={act} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 space-y-6 animate-in fade-in slide-in-from-top-4">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-indigo-600" />
                          <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{act}</h4>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Habka loo qabanayo *</label>
                             <input required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={implDetails[act]?.method} onChange={e => updateImpl(act, 'method', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Timeline (Xilliga) *</label>
                             <input required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={implDetails[act]?.timeline} onChange={e => updateImpl(act, 'timeline', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">KPI (Bartilmaameed) *</label>
                             <input required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={implDetails[act]?.kpi} onChange={e => updateImpl(act, 'kpi', e.target.value)} />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION E: Team Formation */}
        <section className="bg-white rounded-[3rem] border border-slate-200 p-16 shadow-sm space-y-8">
           <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <Users className="text-indigo-600" size={24} />
              <h3 className="text-2xl font-black text-slate-900 uppercase">Qaybta E: Dhismaha Kooxda</h3>
           </div>
           <div className="space-y-8">
              {team.map((member, i) => (
                 <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Xilka Kooxda *</label>
                       <input required className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={member.role} onChange={e => handleTeamChange(i, 'role', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Magaca Xubinta (Hubi Xubinnimada) *</label>
                       <input required className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs font-bold" value={member.memberName} onChange={e => handleTeamChange(i, 'memberName', e.target.value)} placeholder="Tusaale: Cali Faarax..." />
                    </div>
                 </div>
              ))}
              <button 
                 type="button" 
                 onClick={() => setTeam([...team, { role: '', memberId: '', memberName: '', tasks: [] }])}
                 className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest flex items-center gap-2"
              >
                 <Plus size={14} /> Ku dar Xubin Kooxda ah
              </button>
           </div>
        </section>

        {/* SECTION G: Declaration */}
        <section className="bg-slate-900 rounded-[3rem] p-16 text-white shadow-2xl space-y-10 relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                 <ShieldCheck className="text-emerald-400" size={24} />
                 <h3 className="text-2xl font-black uppercase">Qaybta G: Ballanqaadka Hay’adeed</h3>
              </div>
              <p className="text-lg text-slate-300 italic leading-relaxed">
                 “Waxaan ballanqaadayaa in qorshahan iyo kooxda aan dhisay ay waafaqsan yihiin Dastuurka Himilo Qaran. Waxaanan aqbalayaa isla-xisaabtan buuxa ee ku aaddan guusha iyo bedqabka guddigan xilliga aan xilka hayo.”
              </p>
              <div className="flex items-center gap-4 bg-white/5 p-8 rounded-[2rem] border border-white/10">
                 <input 
                    required 
                    type="checkbox" 
                    id="oath" 
                    checked={oathAccepted}
                    onChange={e => setOathAccepted(e.target.checked)}
                    className="w-8 h-8 rounded-lg text-emerald-500 border-white/20" 
                 />
                 <label htmlFor="oath" className="text-xs font-black uppercase tracking-widest leading-none cursor-pointer">
                    Waan aqbalay ballanqaadka kore
                 </label>
              </div>
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-5">
              <ShieldCheck size={240} />
           </div>
        </section>

        <div className="flex justify-between items-center bg-white p-12 rounded-[3rem] border border-slate-200">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                 <AlertTriangle size={24} />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                 Markaad gudbiso, xaaladdaada waxaa loo beddeli doonaa <strong>UNDER_REVIEW</strong>. Lama beddeli karo ka dib markii la gudbiyo.
              </p>
           </div>
           <button 
              type="submit"
              disabled={!isComplete}
              className={`px-16 py-6 rounded-2xl font-black text-white shadow-2xl flex items-center gap-4 transition-all transform active:scale-95 uppercase tracking-widest text-xs ${
                 isComplete ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-slate-300 cursor-not-allowed shadow-none'
              }`}
           >
              Gudbi Qorshe-Hawleedka
              <Send size={18} />
           </button>
        </div>
      </form>
    </div>
  );
};

const Plus = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default ActionPlanForm;
