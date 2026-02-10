
import React, { useState } from 'react';
import { Idea, Role, WorkflowStatus } from '../../types';
import { ShieldCheck, Filter, ArrowRight, XCircle, RefreshCw, AlertCircle, Gavel, Scale } from 'lucide-react';

interface FilteringPageProps {
  idea: Idea;
  onAction: (status: WorkflowStatus, notes: string) => void;
  userRole: Role;
}

const FilteringPage: React.FC<FilteringPageProps> = ({ idea, onAction, userRole }) => {
  const [notes, setNotes] = useState('');
  
  const hasAuthority = userRole === Role.COMMITTEE || userRole === Role.SUPER_ADMIN;

  if (!hasAuthority) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-8">
           <ShieldCheck size={48} />
        </div>
        <h3 className="text-2xl font-black uppercase text-slate-400">Locked for Stage 2 Authority</h3>
        <p className="text-slate-400 max-w-xs mt-4">Boggan waxaa geli kara oo keliya Guddiga Siyaasadda & Barnaamijyada (Article II).</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
           <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <Filter size={14} /> Guddiga Siyaasadda Authority
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">STAGE 2: FILTERING</h2>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
           <Scale className="text-indigo-600" size={20} />
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtering Window: <span className="text-slate-900">7 DAYS MAX</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100 uppercase">{idea.category}</span>
                     <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">ID: {idea.id.slice(-8)}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{idea.title}</h3>
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-slate-600 leading-relaxed font-medium italic">
                    "{idea.description}"
                  </div>
               </div>

               <div className="space-y-4 pt-10 border-t border-slate-50">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-2">Technical Vetting & Review Notes *</label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm leading-relaxed"
                    placeholder="Qor sababaynta farsamo iyo go'aanka guddiga..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                     <Gavel className="text-indigo-400" size={24} />
                     <h4 className="text-xl font-black uppercase">Decision Desk</h4>
                  </div>
                  
                  <div className="space-y-4">
                     <button 
                       onClick={() => onAction(WorkflowStatus.UNDER_REVIEW, notes)}
                       className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                     >
                       <ArrowRight size={18} /> Pass to Synthesis
                     </button>
                     <button 
                       onClick={() => onAction(WorkflowStatus.RETURNED, notes)}
                       className="w-full py-5 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                     >
                       <RefreshCw size={18} /> Return to Author
                     </button>
                     <button 
                       onClick={() => onAction(WorkflowStatus.TERMINATED, notes)}
                       className="w-full py-5 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-black rounded-2xl border border-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                     >
                       <XCircle size={18} /> Terminate Idea
                     </button>
                  </div>

                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                     <div className="flex items-center gap-2 text-amber-400 mb-2">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-black uppercase">Institutional Note</span>
                     </div>
                     <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                       Guddigu uma laha awood ay ku beddelaan nuxurka fikradda. Kaliya waxay qiimeynayaan suurtogalnimada (Technical Feasibility).
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FilteringPage;
