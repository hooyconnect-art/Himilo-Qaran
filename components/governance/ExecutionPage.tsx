
import React, { useState } from 'react';
import { Idea, Role } from '../../types';
import { Activity, Target, ListChecks, ShieldCheck, CheckCircle2, Plus, Clock, Rocket, ArrowLeft, BarChart3 } from 'lucide-react';

interface ExecutionPageProps {
  idea: Idea;
  onUpdateProgress: (data: any) => void;
  userRole: Role;
}

const ExecutionPage: React.FC<ExecutionPageProps> = ({ idea, onUpdateProgress, userRole }) => {
  const [kpis, setKpis] = useState<string[]>(['Target Engagement: 75%']);
  const [milestones, setMilestones] = useState<{label: string, status: string}[]>([
    { label: 'Project Launch', status: 'completed' },
    { label: 'Initial Deployment', status: 'in-progress' }
  ]);
  
  const hasAuthority = userRole === Role.FULINTA || userRole === Role.SUPER_ADMIN;

  if (!hasAuthority) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center">
        <Activity size={64} className="text-indigo-200 animate-pulse mb-8" />
        <h3 className="text-2xl font-black uppercase text-slate-400">Execution Blocked</h3>
        <p className="text-slate-400 max-w-sm mt-4">Boggan waxaa geli kara oo keliya Hay’adda Fulinta si ay u dhufeys-ka u dejiyaan (Article II).</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-left-12 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-10">
        <div>
           <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em] mb-2">
              <Rocket size={16} /> Executive Body Jurisdiction
           </div>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">STAGE 5: EXECUTION</h2>
        </div>
        <div className="bg-indigo-600 text-white px-10 py-5 rounded-[2.5rem] flex items-center gap-4 shadow-2xl">
           <Activity className="animate-pulse" size={24} />
           <div className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Project Status: <span className="text-white">ACTIVE DEPLOYMENT</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-10">
            <section className="bg-white rounded-[4rem] border border-slate-200 p-16 shadow-sm space-y-12">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                     <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase">Ratified Policy Detail</h3>
               </div>
               <div className="space-y-6">
                  <h4 className="text-xl font-bold text-indigo-600 leading-tight">#{idea.id.slice(-8)} • {idea.title}</h4>
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-slate-600 leading-relaxed font-medium italic opacity-80">
                    "{idea.description}"
                  </div>
               </div>
            </section>

            <section className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-10">
               <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Operational Milestones</h4>
                  <button className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"><Plus size={16} /></button>
               </div>
               <div className="space-y-6">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-indigo-200 text-indigo-500'}`}>
                          {m.status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                       </div>
                       <div className="flex-1 font-bold text-slate-700 text-sm uppercase">{m.label}</div>
                       <span className="text-[10px] font-black uppercase text-slate-400">{m.status}</span>
                    </div>
                  ))}
               </div>
            </section>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl space-y-12 relative overflow-hidden">
               <div className="relative z-10 space-y-12">
                  <div className="space-y-6">
                     <h4 className="text-xl font-black uppercase tracking-widest border-b border-white/10 pb-4 flex items-center gap-3">
                        <Target size={20} className="text-indigo-400" />
                        Key Metrics (KPIs)
                     </h4>
                     <div className="space-y-4">
                        {kpis.map((k, i) => (
                          <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all">
                             <span className="text-xs font-bold text-indigo-100">{k}</span>
                             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-8 space-y-6 border-t border-white/10">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Deployment Progress</span>
                        <span className="text-2xl font-black text-indigo-400">42%</span>
                     </div>
                     <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: '42%' }} />
                     </div>
                     <button 
                       onClick={() => onUpdateProgress({ kpis, milestones })}
                       className="w-full py-6 bg-white text-indigo-900 font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest active:scale-95 transition-all"
                     >
                       Update Deployment Log <CheckCircle2 size={18} />
                     </button>
                  </div>
               </div>
               <BarChart3 className="absolute -bottom-10 -right-10 text-white opacity-5" size={240} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default ExecutionPage;
