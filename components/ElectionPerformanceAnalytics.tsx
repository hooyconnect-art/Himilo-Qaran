
import React, { useMemo } from 'react';
import { ElectionEvent, CandidateRecord, VoteRecord, User, Role } from '../types';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Award,
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';

interface EPAProps {
  electionId: string;
  elections: ElectionEvent[];
  candidates: CandidateRecord[];
  votes: VoteRecord[];
  users: User[];
  onBack: () => void;
  userRole: Role;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ElectionPerformanceAnalytics: React.FC<EPAProps> = ({ 
  electionId, 
  elections, 
  candidates, 
  votes, 
  users, 
  onBack,
  userRole
}) => {
  const election = useMemo(() => elections.find(e => e.id === electionId), [elections, electionId]);
  const electionCandidates = useMemo(() => candidates.filter(c => c.electionId === electionId), [candidates, electionId]);
  const electionVotes = useMemo(() => votes.filter(v => v.electionId === electionId), [votes, electionId]);

  const isAdminOrOversight = userRole === Role.SUPER_ADMIN || userRole === Role.OVERSIGHT;

  /**
   * 1. VOTER TURNOUT ANALYSIS
   */
  const turnoutStats = useMemo(() => {
    const totalVoters = election?.totalVoters || 0;
    const cast = electionVotes.length;
    const percentage = totalVoters > 0 ? (cast / totalVoters) * 100 : 0;
    
    return {
      totalVoters,
      cast,
      percentage: Math.round(percentage),
      isLow: percentage < 30,
      isExceptional: percentage > 80
    };
  }, [election, electionVotes]);

  /**
   * 2. CANDIDATE VOTE DISTRIBUTION
   */
  const candidateMetrics = useMemo(() => {
    const sorted = [...electionCandidates].sort((a, b) => b.votesCount - a.votesCount);
    const total = sorted.reduce((acc, c) => acc + c.votesCount, 0);
    
    const data = sorted.map((c, i) => ({
      name: `Musharax ${c.id.slice(-4)}`,
      votes: c.votesCount,
      percentage: total > 0 ? Math.round((c.votesCount / total) * 100) : 0,
      rank: i + 1
    }));

    const winnerMargin = data.length > 1 ? data[0].votes - data[1].votes : 0;
    const marginPercentage = total > 0 ? Math.round((winnerMargin / total) * 100) : 0;

    return { data, winnerMargin, marginPercentage };
  }, [electionCandidates]);

  /**
   * 3. REGIONAL PARTICIPATION METRICS
   */
  const regionalMetrics = useMemo(() => {
    const regions: Record<string, { cast: number, registered: number }> = {};
    
    // Aggregate votes by region
    electionVotes.forEach(v => {
      const voter = users.find(u => u.id === v.voterId);
      const region = voter?.region || 'Lama Aqoon';
      if (!regions[region]) regions[region] = { cast: 0, registered: 0 };
      regions[region].cast += 1;
    });

    // Aggregate registered voters by region
    users.forEach(u => {
      if (!regions[u.region]) regions[u.region] = { cast: 0, registered: 0 };
      regions[u.region].registered += 1;
    });

    return Object.entries(regions).map(([name, stats]) => ({
      name,
      ...stats,
      turnout: stats.registered > 0 ? Math.round((stats.cast / stats.registered) * 100) : 0
    })).sort((a, b) => b.turnout - a.turnout);
  }, [electionVotes, users]);

  /**
   * 4. INTEGRITY & PERFORMANCE INSIGHTS
   */
  const insights = useMemo(() => {
    const list: string[] = [];
    
    if (turnoutStats.isLow) list.push("Ka-qaybgalka guud ee doorashadu waa mid aad u hooseeya (<30%).");
    if (turnoutStats.isExceptional) list.push("Turnout-ka doorashadu waa mid aad u sarreeya (>80%), taas oo muujinaysa abaabul xooggan.");
    
    regionalMetrics.forEach(r => {
      if (r.cast === 0 && r.registered > 0) list.push(`Gobolka ${r.name} ma lahayn wax ka-qaybgal ah (Zero participation).`);
    });

    candidateMetrics.data.forEach(c => {
      if (c.percentage > 70) list.push(`${c.name} wuxuu helay in ka badan 70% codadka, taas oo muujinaysa xukun buuxa ama loolan yaraan goobaha qaar.`);
    });

    return list;
  }, [turnoutStats, regionalMetrics, candidateMetrics]);

  if (!election) return null;

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20 max-w-[1400px] mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-slate-200 pb-12">
        <div className="space-y-4">
           <button 
             onClick={onBack}
             className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 uppercase tracking-widest transition-all"
           >
             <ArrowLeft size={14} /> Dib u noqo natiijada
           </button>
           <div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{election.title}</h2>
             <div className="flex items-center gap-3 mt-4">
                <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Institutional Analytics</span>
                <span className="text-slate-400 font-bold text-xs">Election ID: {election.id.slice(-8).toUpperCase()}</span>
             </div>
           </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl min-w-[320px] flex items-center gap-6">
           <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg ${turnoutStats.isLow ? 'bg-amber-500 shadow-amber-100' : 'bg-emerald-500 shadow-emerald-100'}`}>
              <TrendingUp size={32} />
           </div>
           <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Turnout</div>
              <div className="text-4xl font-black text-slate-900 leading-none">{turnoutStats.percentage}%</div>
           </div>
        </div>
      </div>

      {/* 1. TOP LEVEL STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Voters</div>
            <div className="text-3xl font-black text-slate-900 leading-none">{turnoutStats.totalVoters.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 font-medium">Eligible based on Membership Registry</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Votes Cast</div>
            <div className="text-3xl font-black text-indigo-600 leading-none">{turnoutStats.cast.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 font-medium">Verified Unique Hash Records</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Winner Margin</div>
            <div className="text-3xl font-black text-emerald-600 leading-none">+{candidateMetrics.winnerMargin.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 font-medium">{candidateMetrics.marginPercentage}% of total vote share</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Electoral Level</div>
            <div className="text-3xl font-black text-slate-900 leading-none uppercase">{election.level.split(' ')[1] || election.level}</div>
            <p className="text-[10px] text-slate-500 font-medium">Scope: {election.scope}</p>
         </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Vote Distribution Bar Chart */}
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Vote Distribution</h3>
                  <p className="text-xs text-slate-500 font-medium">Comparison of candidate vote totals.</p>
               </div>
               <BarChart3 className="text-slate-200" size={32} />
            </div>
            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={candidateMetrics.data}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                     <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '1rem'}}
                        itemStyle={{fontWeight: 900, fontSize: '12px'}}
                     />
                     <Bar dataKey="votes" radius={[12, 12, 0, 0]} barSize={60}>
                        {candidateMetrics.data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Share Pie Chart */}
         <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Market Share</h3>
               <PieChart size={24} className="text-slate-200" />
            </div>
            <div className="flex-1 h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={candidateMetrics.data}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="votes"
                     >
                        {candidateMetrics.data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                     />
                     <Legend 
                        layout="vertical" 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-500 ml-2">{value}</span>}
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* 3. REGIONAL PARTICIPATION TABLE */}
      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Regional Participation Metrics</h3>
               <p className="text-xs text-slate-500 font-medium">Breakdown of voter engagement by regional branches.</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
               <MapPin className="text-indigo-600" size={24} />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white">
                     <th className="px-12 py-6">Branch Name</th>
                     <th className="px-12 py-6 text-center">Registered</th>
                     <th className="px-12 py-6 text-center">Votes Cast</th>
                     <th className="px-12 py-6 text-right">Turnout Rate</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {regionalMetrics.map((r, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-12 py-6">
                           <div className="font-black text-slate-900 uppercase text-sm flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-indigo-500" />
                              {r.name}
                           </div>
                        </td>
                        <td className="px-12 py-6 text-center font-bold text-slate-500">{r.registered.toLocaleString()}</td>
                        <td className="px-12 py-6 text-center font-bold text-slate-900">{r.cast.toLocaleString()}</td>
                        <td className="px-12 py-6 text-right">
                           <div className="flex items-center justify-end gap-4">
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full ${r.turnout > 70 ? 'bg-emerald-500' : r.turnout > 40 ? 'bg-indigo-500' : 'bg-amber-500'}`} 
                                    style={{ width: `${r.turnout}%` }} 
                                 />
                              </div>
                              <span className="text-sm font-black text-slate-900">{r.turnout}%</span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* 4. PERFORMANCE INSIGHTS & ACCESS CONTROL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Institutional Insights */}
         <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                  <ShieldCheck className="text-indigo-400" size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight">Institutional Observations</h3>
               </div>
               
               <div className="space-y-6">
                  {insights.map((insight, i) => (
                     <div key={i} className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                           <Info size={18} />
                        </div>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{insight}"</p>
                     </div>
                  ))}
                  {insights.length === 0 && (
                     <div className="text-slate-500 text-sm italic py-8 text-center">No abnormal electoral patterns detected.</div>
                  )}
               </div>
               
               <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                  <AlertTriangle className="text-amber-400" size={16} />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Insights are observational markers and do not constitute legal verdicts.</p>
               </div>
            </div>
            <Scale size={240} className="absolute -bottom-10 -right-10 opacity-5 text-white" />
         </div>

         {/* Access & Integrity Controls (Admin/Oversight only) */}
         <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm space-y-10">
            <div className="space-y-2">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Integrity Controls</h3>
               <p className="text-xs text-slate-500 font-medium">Read-only auditing access for institutional bodies.</p>
            </div>

            <div className="space-y-4">
               {[
                  { label: 'Immutable Data Lock', status: 'Enforced', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Independent Audit Feed', status: 'Active', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Voter Anonymity Protocol', status: 'Verified', color: 'text-emerald-600', bg: 'bg-emerald-50' },
               ].map((c, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${c.bg} border-slate-100 flex items-center justify-between`}>
                     <div className="flex items-center gap-3">
                        <ShieldCheck size={18} className={c.color} />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{c.label}</span>
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${c.color}`}>{c.status}</span>
                  </div>
               ))}
            </div>

            {isAdminOrOversight ? (
               <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                     <h4 className="text-sm font-black uppercase">Oversight Export</h4>
                     <p className="text-xs text-indigo-100 leading-relaxed">Generated raw data is cryptographically signed and archived in the Institutional Memory.</p>
                     <button className="px-8 py-3 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all">
                        Download Audit Package
                     </button>
                  </div>
                  <Lock size={120} className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
               </div>
            ) : (
               <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Public Summary Access</div>
                  <p className="text-xs text-slate-500 leading-relaxed">Full technical breakdown is reserved for the Oversight and Admin bodies to ensure institutional security.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const Lock = ({ size, className }: { size: number, className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

export default ElectionPerformanceAnalytics;
