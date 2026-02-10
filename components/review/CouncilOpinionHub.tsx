
import React, { useState } from 'react';
import { User, TeamProposal, CouncilOpinion } from '../../types';
import { Eye, MessageSquare, ShieldCheck, TrendingUp, TrendingDown, Clock, ChevronRight } from 'lucide-react';

interface CouncilOpinionHubProps {
  proposals: TeamProposal[];
  opinions: CouncilOpinion[];
  onSubmitOpinion: (opinion: CouncilOpinion) => void;
  currentUser: User;
}

const CouncilOpinionHub: React.FC<CouncilOpinionHubProps> = ({ proposals, opinions, onSubmitOpinion, currentUser }) => {
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [opinionText, setOpinionText] = useState('');
  const [sentiment, setSentiment] = useState<'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'>('NEUTRAL');

  const activeProposals = proposals.filter(p => p.status === 'SUBMITTED' || p.status === 'OPINION_WINDOW');
  const currentProp = activeProposals.find(p => p.id === selectedPropId);
  const existingOpinion = opinions.find(o => o.proposalId === selectedPropId && o.actorId === currentUser.id);

  const handleOpinionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropId || !opinionText.trim() || existingOpinion) return;

    const op: CouncilOpinion = {
      id: `op_${Date.now()}`,
      proposalId: selectedPropId,
      actorId: currentUser.id,
      actorName: currentUser.name,
      opinion: opinionText,
      sentiment,
      timestamp: new Date().toISOString()
    };
    onSubmitOpinion(op);
    setOpinionText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Council Opinions</h2>
           <p className="text-slate-500 font-medium mt-1">Institutional Advisory: Golaha Dhexe wuxuu ra’yi ka bixinayaa kooxaha la soo jeediyay.</p>
        </div>
        <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 text-[10px] font-black uppercase text-indigo-600 tracking-widest">
           Non-Binding Window
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Active Proposals</h3>
           <div className="space-y-4">
              {activeProposals.map(p => (
                <div 
                  key={p.id}
                  onClick={() => { setSelectedPropId(p.id); setOpinionText(''); }}
                  className={`p-6 rounded-[2rem] border transition-all cursor-pointer group flex justify-between items-center ${
                    selectedPropId === p.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                   <div className="space-y-1">
                      <div className="text-sm font-black uppercase tracking-tight">{p.chairpersonName}</div>
                      <div className={`text-[10px] font-bold ${selectedPropId === p.id ? 'text-indigo-200' : 'text-slate-400'}`}>{p.members.length} Members</div>
                   </div>
                   <ChevronRight size={18} className={selectedPropId === p.id ? 'text-white' : 'text-slate-300'} />
                </div>
              ))}
              {activeProposals.length === 0 && (
                <div className="p-10 bg-white border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-300 italic">
                   No proposals in the opinion window.
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           {currentProp ? (
             <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm space-y-10 animate-in slide-in-from-right-4">
                <div className="flex justify-between items-start border-b border-slate-50 pb-6">
                   <h3 className="text-2xl font-black text-slate-900 uppercase">Team Structure</h3>
                   <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Ref: {currentProp.id.slice(-6)}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {currentProp.members.map(m => (
                     <div key={m.jobId} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 border border-slate-200">
                           <ShieldCheck size={20} />
                        </div>
                        <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">JOB ID: {m.jobId}</div>
                           <div className="text-xs font-black text-slate-900">{m.memberName}</div>
                        </div>
                     </div>
                   ))}
                </div>

                {existingOpinion ? (
                  <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-4">
                     <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-xs">
                        <ShieldCheck size={18} /> Opinion Logged
                     </div>
                     <p className="text-sm text-emerald-800 italic leading-relaxed">"{existingOpinion.opinion}"</p>
                  </div>
                ) : (
                  <form onSubmit={handleOpinionSubmit} className="pt-10 border-t border-slate-50 space-y-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Provide Advisory Opinion *</label>
                       <textarea 
                          required
                          className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm h-32"
                          placeholder="Your opinion on the composition of this team..."
                          value={opinionText}
                          onChange={e => setOpinionText(e.target.value)}
                       />
                    </div>

                    <div className="flex gap-4">
                       {[
                         { id: 'POSITIVE', label: 'Support', icon: TrendingUp, color: 'text-hq-green bg-green-50 border-green-100' },
                         { id: 'NEUTRAL', label: 'Neutral', icon: Eye, color: 'text-slate-500 bg-slate-50 border-slate-100' },
                         { id: 'NEGATIVE', label: 'Concern', icon: TrendingDown, color: 'text-red-500 bg-red-50 border-red-100' }
                       ].map(s => (
                         <button 
                           key={s.id}
                           type="button"
                           onClick={() => setSentiment(s.id as any)}
                           className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                             sentiment === s.id ? `${s.color} ring-2 ring-indigo-500 ring-inset` : 'bg-white border-slate-200 text-slate-400'
                           }`}
                         >
                            <s.icon size={24} />
                            <span className="text-[10px] font-black uppercase">{s.label}</span>
                         </button>
                       ))}
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                       Submit Advisory Opinion <MessageSquare size={18} />
                    </button>
                  </form>
                )}
             </div>
           ) : (
             <div className="h-full bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center space-y-4">
                <Clock size={48} className="text-slate-200" />
                <h4 className="text-xl font-black text-slate-300 uppercase">Select a proposal to review</h4>
                <p className="text-sm text-slate-400 max-w-xs">Your advisory opinions will be visible to the Oversight body before final activation.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CouncilOpinionHub;
