
import React from 'react';
import { SystemHealth, Idea, Role, AppView, User, MembershipStatus, AuditEntry } from '../types';
import { 
  Users, Lightbulb, TrendingUp, ShieldCheck, 
  Briefcase, Landmark, Scale, ShieldAlert, 
  Activity, Vote, ChevronRight, AlertTriangle, Fingerprint, Clock, Radio
} from 'lucide-react';

interface DashboardProps {
  health: SystemHealth;
  ideas: Idea[];
  usersCount: number;
  onNavigate: (view: AppView) => void;
  currentUser: User;
  auditLogs?: AuditEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ health, ideas, usersCount, onNavigate, currentUser, auditLogs = [] }) => {
  const isApproved = currentUser.status === MembershipStatus.LA_ANSIXIYAY;

  const stats = [
    { label: 'Wadarta Xubnaha', value: usersCount.toLocaleString(), icon: Users, color: 'text-hq-blue', bg: 'bg-blue-50' },
    { label: 'Geedi-socodka Fikradaha', value: ideas.length.toString(), icon: Lightbulb, color: 'text-hq-yellow', bg: 'bg-yellow-50' },
    { label: 'Hirgelinta Fulinta', value: '94.2%', icon: Activity, color: 'text-hq-green', bg: 'bg-green-50' },
    { label: 'Khatarta Capture-ka', value: health.captureRisk === 'Low' ? 'Safe' : 'Warning', icon: ShieldCheck, color: 'text-hq-blue', bg: 'bg-blue-50' },
  ];

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-12">
      
      {/* VERIFICATION BANNER FOR UNAPPROVED MEMBERS */}
      {!isApproved && (
        <div className="bg-hq-yellow rounded-[2.5rem] p-8 text-hq-black shadow-xl flex flex-col md:flex-row items-center gap-8 border-b-8 border-hq-black/20">
           <div className="w-16 h-16 bg-hq-black text-hq-yellow rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <AlertTriangle size={32} />
           </div>
           <div className="flex-1 space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Codsigaaga wuu socdaa (Pending Approval)</h3>
              <p className="text-sm font-bold opacity-80 leading-relaxed uppercase tracking-tight">
                Xubinnimadaadu waxay ku jirtaa hubinta rasmiga ah. Ilaa lagaa ansixiyo, qaar ka mid ah adeegyada hay'adda (sida codbixinta iyo tartanka) ma awoodid inaad isticmaasho.
              </p>
           </div>
           <div className="shrink-0 flex items-center gap-3 px-6 py-3 bg-hq-black/10 rounded-2xl border border-hq-black/10">
              <Fingerprint size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Auth ID: {currentUser.id.slice(-6)}</span>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hq-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-hq-green"></span>
            </span>
            <span className="text-[10px] font-black text-hq-green uppercase tracking-widest">Live System Active</span>
          </div>
          <h2 className="text-4xl font-black text-hq-black tracking-tight uppercase">National Console</h2>
          <p className="text-slate-500 font-medium italic">Himilo Qaran: Institution-based governance for a resilient future.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-hq-green shadow-sm">
              <ShieldCheck className="text-hq-green" size={20} />
              <div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Stability Status</div>
                 <div className="text-sm font-black text-hq-black tracking-tight">System Integrity: HIGH</div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={12} /> +2.4%
              </div>
            </div>
            <div className="text-3xl font-black text-hq-black tracking-tighter mb-2">{stat.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm h-full">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-black text-hq-black text-xl tracking-tight uppercase">My Participation Log</h3>
                <p className="text-sm text-slate-500">History of your institutional contributions and vetted ideas.</p>
              </div>
              <div className="p-3 bg-green-50 text-hq-green rounded-2xl border border-hq-green/20">
                 <Activity size={24} />
              </div>
            </div>
            
            <div className="p-20 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[2rem]">
               <Fingerprint size={48} className="mx-auto text-slate-200" />
               <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No participation records found in the official ledger.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* LIVE ACTIVITY FEED - THE REAL-TIME ENGINE VISUAL */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h4 className="font-black text-hq-black text-sm uppercase tracking-tight flex items-center gap-2">
                   <Radio size={16} className="text-hq-green animate-pulse" />
                   Live Activity Feed
                </h4>
                <span className="text-[8px] font-black bg-slate-100 px-2 py-1 rounded text-slate-400">SYNCED</span>
             </div>
             <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {auditLogs.length > 0 ? auditLogs.slice(0, 5).map((log, i) => (
                  <div key={log.id} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 animate-in slide-in-from-top-2">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                       <Activity size={18} />
                    </div>
                    <div className="flex-1">
                       <div className="text-[10px] font-black text-hq-black uppercase tracking-tight">{log.actorName}</div>
                       <p className="text-[9px] text-slate-500 font-bold uppercase leading-tight mt-0.5">{log.action}</p>
                       <div className="text-[8px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock size={8} /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Awaiting system events...</p>
                  </div>
                )}
             </div>
          </div>

          <div className={`bg-hq-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group border-b-8 border-hq-yellow ${!isApproved ? 'opacity-40 grayscale' : ''}`}>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-hq-green rounded-lg shadow-lg">
                   <Vote size={18} className="text-white" />
                </div>
                <h3 className="font-black text-lg tracking-tight uppercase">Election Unit</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Official hub for voting and leadership candidacy. Restricted for unapproved members.</p>
              
              <div className="space-y-3">
                 <button 
                   disabled={!isApproved}
                   onClick={() => onNavigate('voting-terminal')} 
                   className="w-full py-4 bg-hq-green hover:bg-green-600 disabled:bg-slate-700 rounded-xl text-xs font-black transition-all flex items-center justify-between px-6 shadow-xl uppercase tracking-widest"
                 >
                    Access Terminal <ChevronRight size={14} />
                 </button>
              </div>
            </div>
            <Vote className="absolute -bottom-10 -right-10 text-white opacity-5 group-hover:opacity-10 transition-opacity" size={240} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
