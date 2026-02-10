
import React from 'react';
import { User, Idea, WorkflowStatus } from '../types';
import { Award, FileText, Send, Clock, ChevronRight } from 'lucide-react';
import { GovernanceStatusBadge, GovernancePipelineProgress } from './GovernanceStatusVisualizer';

interface MemberDashboardProps {
  user: User;
  ideas: Idea[];
  onViewProposal: (id: string) => void;
  onNewProposal: () => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, ideas, onViewProposal, onNewProposal }) => {
  const myIdeas = ideas.filter(i => i.authorId === user.id);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-hq-black to-slate-800 rounded-[3rem] p-12 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden border-b-8 border-hq-yellow">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-hq-green/20 text-hq-green px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-hq-green/30 mb-4">
             Welcome to Himilo Qaran
          </div>
          <h2 className="text-5xl font-black mb-2 tracking-tighter uppercase leading-none">Welcome, {user.name.split(' ')[0]}</h2>
          <p className="text-slate-400 font-medium text-lg">Your participation strengthens the institutional foundation of the party.</p>
        </div>
        <div className="relative z-10 bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 flex items-center gap-6 border border-white/10 shadow-xl">
          <div className="w-16 h-16 bg-hq-green rounded-[1.2rem] flex items-center justify-center text-hq-yellow text-3xl shadow-xl shadow-green-900/40">
            <Award />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Participation Score</div>
            <div className="text-5xl font-black tracking-tighter text-white">{user.participationScore}%</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <FileText size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-2xl font-black text-hq-black uppercase tracking-tighter">My Proposals Pipeline</h3>
            <button 
              onClick={onNewProposal}
              className="flex items-center gap-3 px-8 py-4 bg-hq-green hover:bg-green-600 text-white rounded-2xl text-xs font-black transition-all shadow-xl shadow-green-900/20 uppercase tracking-widest active:scale-95"
            >
              <Send size={16} /> New Idea
            </button>
          </div>

          <div className="space-y-6">
            {myIdeas.length > 0 ? myIdeas.map(idea => (
              <div 
                key={idea.id} 
                className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-hq-green transition-all cursor-pointer group"
                onClick={() => onViewProposal(idea.id)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-hq-blue uppercase tracking-[0.2em] px-3 py-1 bg-blue-50 rounded-lg mb-3 inline-block border border-blue-100">
                      {idea.category}
                    </span>
                    <h4 className="text-3xl font-black text-hq-black group-hover:text-hq-green transition-colors uppercase leading-tight tracking-tight">
                      {idea.title}
                    </h4>
                  </div>
                  <div className="shrink-0">
                    <GovernanceStatusBadge status={idea.status} createdAt={idea.createdAt} />
                  </div>
                </div>
                
                <p className="text-base text-slate-500 font-medium line-clamp-2 mb-8 italic">
                  "{idea.description}"
                </p>

                <div className="pt-8 border-t border-slate-50 space-y-6">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <span>Protocol Progression</span>
                    <span className="text-hq-green font-black">v{idea.version}.0 LOCKED</span>
                  </div>
                  <GovernancePipelineProgress status={idea.status} />
                </div>

                <div className="flex justify-end pt-4">
                  <span className="text-[10px] font-black text-hq-green flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 uppercase tracking-widest">
                    Enter Stage Control <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-[3rem] border-4 border-dashed border-slate-100 p-24 text-center">
                <FileText className="mx-auto text-slate-100 mb-6" size={64} />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em]">No proposals submitted.</p>
                <p className="text-slate-400 text-xs font-medium mt-4 uppercase">Institutional change starts with your voice.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-black text-hq-black uppercase tracking-tighter px-2">Institutional Pulse</h3>
          
          <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
            <h4 className="font-black text-slate-400 mb-6 text-[10px] uppercase tracking-widest border-b border-slate-50 pb-4">Recent Voting Log</h4>
            <div className="space-y-4">
              {[
                { label: 'Energy Policy v2', result: 'Supported', date: '2d ago' },
                { label: 'Infrastructure Allocation', result: 'Supported', date: '5d ago' },
                { label: 'Internal Ethics Code', result: 'Opposed', date: '1w ago' }
              ].map((vote, i) => (
                <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-hq-blue transition-all">
                  <div>
                    <div className="text-xs font-black text-hq-black uppercase tracking-tight">{vote.label}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">{vote.date}</div>
                  </div>
                  <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                    vote.result === 'Supported' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {vote.result}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-5 text-[10px] font-black text-hq-blue hover:bg-blue-50 rounded-xl transition-all border-2 border-hq-blue/10 uppercase tracking-widest shadow-sm">
              View Public Ledger
            </button>
          </div>
          
          <div className="bg-hq-black rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border-t-8 border-hq-green">
            <div className="relative z-10">
              <h4 className="font-black text-hq-yellow mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Award size={14} /> Next Milestone
              </h4>
              <p className="text-base text-slate-300 font-medium leading-relaxed mb-6">
                Contribute <strong>2 more vetted ideas</strong> to reach "Institutional Stakeholder" status.
              </p>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-hq-green w-3/4 rounded-full shadow-[0_0_15px_rgba(76,175,80,0.4)]" />
              </div>
              <div className="text-[9px] font-black text-slate-500 flex justify-between uppercase tracking-widest">
                <span>Member</span>
                <span className="text-hq-yellow">Stakeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;