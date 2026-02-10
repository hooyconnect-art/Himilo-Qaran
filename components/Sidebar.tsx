
import React from 'react';
import { Role, AppView, ElectionStatus, ElectionEvent, User, MembershipStatus } from '../types';
import { 
  LayoutDashboard, Users, Workflow, Activity, 
  ShieldAlert, History, Lock, Lightbulb,
  Vote, Landmark, FileText, Target, Gavel, Briefcase, AlertTriangle, UserPlus, ClipboardCheck, Eye
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView | 'member-submission') => void;
  userRole: Role;
  elections: ElectionEvent[];
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userRole, elections, currentUser }) => {
  const isAdmin = userRole === Role.SUPER_ADMIN || userRole === Role.ELECTION_ADMIN;
  const isApproved = currentUser.status === MembershipStatus.LA_ANSIXIYAY;
  
  // ROLES FOR ACTIVATION FLOW
  const isChairpersonPending = userRole === Role.CHAIRPERSON_PENDING;
  const isCouncil = userRole === Role.GOLE_DHEXE || userRole === Role.SUPER_ADMIN;
  const isOversight = userRole === Role.OVERSIGHT || userRole === Role.SUPER_ADMIN;

  const NavItem = ({ id, label, icon: Icon }: { id: AppView | 'member-submission', label: string, icon: any }) => {
    const isActive = (currentView as string) === id;
    return (
      <button 
        onClick={() => setView(id)} 
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all group ${
          isActive 
            ? `bg-hq-green text-white shadow-xl shadow-green-900/20` 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
        <span className="tracking-tight uppercase">{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-72 bg-hq-black text-slate-300 hidden md:flex flex-col flex-shrink-0 shadow-2xl z-40 border-r border-slate-800">
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 bg-hq-green rounded-xl flex items-center justify-center shadow-lg border-2 border-hq-yellow">
            <Landmark className="text-hq-yellow" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">Himilo Qaran</h1>
            <p className="text-[10px] text-hq-yellow font-black uppercase tracking-widest mt-1">Governance OS</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar pt-6">
        <section className="space-y-1">
          <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Member Services</div>
          <NavItem id="dashboard" label="My Console" icon={LayoutDashboard} />
          <NavItem id="member-submission" label="Submit Proposal" icon={Lightbulb} />
          {isApproved && <NavItem id="member-registration" label="Apply for Role" icon={FileText} />}
        </section>

        {/* POST-ELECTION ACTIVATION HUB */}
        {(isChairpersonPending || isCouncil || isOversight) && (
          <section className="space-y-1">
            <div className="px-4 py-2 text-[10px] font-black text-hq-yellow uppercase tracking-widest border-t border-slate-800 pt-6">Activation Flow</div>
            {isChairpersonPending && <NavItem id="activation-team-proposal" label="Team Assignment" icon={UserPlus} />}
            {isCouncil && <NavItem id="review-council-opinion" label="Council Opinions" icon={Eye} />}
            {isOversight && <NavItem id="oversight-team-review" label="Final Review" icon={ClipboardCheck} />}
          </section>
        )}

        {isAdmin && (
          <section className="space-y-1">
            <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-slate-800 pt-6">Governance Hub</div>
            <NavItem id="admin-membership" label="User Registry" icon={Users} />
            <NavItem id="admin-committees" label="Committees" icon={Briefcase} />
            <NavItem id="admin-policy" label="Policy Engine" icon={Workflow} />
            <NavItem id="admin-jobs" label="Job Blueprints" icon={Target} />
          </section>
        )}

        {(isAdmin || (isApproved && userRole !== Role.XUBIN)) && (
          <section className="space-y-1">
            <div className="px-4 py-2 text-[10px] font-black text-hq-yellow uppercase tracking-widest border-t border-slate-800 pt-6">Electoral Unit</div>
            {isAdmin && <NavItem id="admin-elections" label="Election Control" icon={Gavel} />}
            {isAdmin && <NavItem id="admin-candidates" label="Vetting Desk" icon={ShieldAlert} />}
            <NavItem id="voting-terminal" label="Voting Terminal" icon={Vote} />
            <NavItem id="election-results" label="Results Portal" icon={Activity} />
          </section>
        )}

        {isAdmin && (
          <section className="space-y-1 pb-10">
            <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-slate-800 pt-6">Security & Log</div>
            <NavItem id="admin-oversight" label="System Audit" icon={ShieldAlert} />
            <NavItem id="admin-memory" label="National Memory" icon={History} />
          </section>
        )}
      </nav>
      
      {!isApproved && (
        <div className="m-4 p-4 bg-hq-yellow/10 border border-hq-yellow/20 rounded-2xl">
          <div className="flex items-center gap-2 text-hq-yellow mb-2">
            <AlertTriangle size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Verification Pending</span>
          </div>
          <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase">
            Your membership is awaiting review by the Registry Office. Limited features enabled.
          </p>
        </div>
      )}

      <div className="p-6 border-t border-slate-800 bg-hq-black/80 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-3 text-[10px] text-slate-500 font-black uppercase tracking-widest border border-white/5 rounded-xl">
          <Lock size={14} className="text-hq-green" />
          Protocol Verified
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
