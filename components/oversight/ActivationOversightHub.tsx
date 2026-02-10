
import React, { useState } from 'react';
import { TeamProposal, CouncilOpinion } from '../../types';
import { ShieldCheck, Gavel, Scale, AlertCircle, CheckCircle2, XCircle, RefreshCw, MessageSquare, TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface ActivationOversightHubProps {
  proposals: TeamProposal[];
  opinions: CouncilOpinion[];
  onDecision: (proposalId: string, status: TeamProposal['status'], notes: string) => void;
}

const ActivationOversightHub: React.FC<ActivationOversightHubProps> = ({ proposals, opinions, onDecision }) => {
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  const activeProposals = proposals.filter(p => p.status === 'SUBMITTED' || p.status === 'OPINION_WINDOW' || p.status === 'OVERSIGHT_REVIEW');
  const currentProp = activeProposals.find(p => p.id === selectedPropId);
  const currentOpinions = opinions.filter(o => o.proposalId === selectedPropId);

  const handleDecisionSubmit = (status: TeamProposal['status']) => {
    if (!selectedPropId || !decisionNotes.trim()) {
      alert("Fadlan qor sababta go’aankaaga.");
      return;
    }
    onDecision(selectedPropId, status, decisionNotes);
    setSelectedPropId(null);
    setDecisionNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-hq-green font-black uppercase text-[10px] tracking-[0.3em]">
              <ShieldCheck size={14} /> Authority: Oversight Committee
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Activation Oversight</h2>
           <p className="text-slate-500 font-medium">Final Verification: Hubinta kama dambaysta ah ee hawlgelinta hoggaanka.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Activation Queue</h3>
           <div className="space-y-4">
              {activeProposals.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPropId(p.id)}
                  className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group ${
                    selectedPropId === p.id ? 'bg-hq-green text-white border-hq-green shadow-xl' : 'bg-white text-slate-700 border-slate-200 hover:border-hq-green/30'
                  }`}
                >
                   <div className="text-sm font-black uppercase tracking-tight leading-tight mb-2">{p.chairpersonName}</div>
                   <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedPropId === p.id ? 'text-green-100' : 'text-slate-400'}`}>
                      {p.status}
                   </div>
                </div>
              ))}
              {activeProposals.length === 0 && (
                <div className="p-10 bg-white border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-300 italic">
                   No pending activations.
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-3 space-y-10">
           {currentProp ? (
             <div className="space-y-10 animate-in slide-in-from-bottom-6">
                {/* PROPOSAL DETAIL */}
                <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-10">
                   <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                      <h3 className="text-2xl font-black text-slate-900 uppercase">Team Composition Review</h3>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-hq-green bg-green-50 px-4 py-2 rounded-full uppercase border border-green-100">Pending Decision</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentProp.members.map(m => (
                        <div key={m.jobId} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-hq-green shadow-sm">
                              <ShieldCheck size={24} />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">XILKA: {m.jobId}</div>
                              <div className="text-sm font-black text-slate-900">{m.memberName}</div>
                           </div>
                        </div>
                      ))}
                   </div>

                   {/* COUNCIL OPINIONS HUB (READ ONLY FOR OVERSIGHT) */}
                   <div className="space-y-6 pt-10 border-t border-slate-50">
                      <div className="flex items-center justify-between">
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Advisory Opinions from Central Council</h4>
                         <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{currentOpinions.length} Reports</span>
                      </div>
                      <div className="space-y-4">
                        {currentOpinions.map(op => (
                          <div key={op.id} className="p-6 bg-indigo-50/30 rounded-2xl border border-indigo-100 flex gap-4">
                             <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                               op.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-600' :
                               op.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                             }`}>
                                {op.sentiment === 'POSITIVE' ? <TrendingUp size={20} /> :
                                 op.sentiment === 'NEGATIVE' ? <TrendingDown size={20} /> : <Eye size={20} />}
                             </div>
                             <div className="flex-1 space-y-1">
                                <div className="text-[10px] font-black uppercase text-slate-900">{op.actorName}</div>
                                <p className="text-sm text-slate-600 italic leading-relaxed">"{op.opinion}"</p>
                             </div>
                          </div>
                        ))}
                        {currentOpinions.length === 0 && (
                          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs italic">
                             No advisory opinions provided during the window.
                          </div>
                        )}
                      </div>
                   </div>
                </div>

                {/* FINAL DECISION CONSOLE */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl space-y-8 relative overflow-hidden">
                   <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-4">
                         <Gavel className="text-hq-yellow" size={32} />
                         <h3 className="text-2xl font-black uppercase tracking-tight">Oversight Final Verdict</h3>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Justification for Final Decision *</label>
                         <textarea 
                            required
                            className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:ring-2 focus:ring-hq-green font-medium text-sm text-white"
                            placeholder="Provide the institutional reasoning for this decision..."
                            value={decisionNotes}
                            onChange={e => setDecisionNotes(e.target.value)}
                         />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <button 
                           onClick={() => handleDecisionSubmit('APPROVED')}
                           className="flex flex-col items-center gap-3 p-6 bg-hq-green text-white rounded-[2rem] shadow-xl hover:bg-green-600 transition-all active:scale-95"
                         >
                            <CheckCircle2 size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Approve & Activate</span>
                         </button>
                         <button 
                           onClick={() => handleDecisionSubmit('RETURNED')}
                           className="flex flex-col items-center gap-3 p-6 bg-white/10 text-hq-yellow rounded-[2rem] border border-white/10 hover:bg-white/20 transition-all active:scale-95"
                         >
                            <RefreshCw size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Return for Revision</span>
                         </button>
                         <button 
                           onClick={() => handleDecisionSubmit('REJECTED')}
                           className="flex flex-col items-center gap-3 p-6 bg-white/10 text-red-400 rounded-[2rem] border border-white/10 hover:bg-white/20 transition-all active:scale-95"
                         >
                            <XCircle size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Formal Rejection</span>
                         </button>
                      </div>

                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex gap-4">
                         <AlertCircle className="text-hq-yellow shrink-0" size={20} />
                         <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase">
                           Decision binding: An approval will immediately transition the Chairperson to Role: FULINTA and trigger institutional activation.
                         </p>
                      </div>
                   </div>
                   <Scale className="absolute -bottom-20 -right-20 text-white opacity-5" size={400} />
                </div>
             </div>
           ) : (
             <div className="h-full bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-20 text-center space-y-6">
                <Gavel size={64} className="text-slate-100" />
                <div className="space-y-2">
                   <h4 className="text-2xl font-black text-slate-300 uppercase">Awaiting Selection</h4>
                   <p className="text-sm text-slate-400 max-w-sm">Select a proposal from the activation queue to perform institutional oversight.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ActivationOversightHub;
