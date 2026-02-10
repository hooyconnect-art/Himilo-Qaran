
import React from 'react';
import { User, Role, SystemHealth } from '../types';
import { Bell, UserCircle, Activity, Layout, LogOut } from 'lucide-react';

interface HeaderProps {
  user: User;
  onRoleSwitch: (role: Role) => void;
  health: SystemHealth;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onRoleSwitch, health, onLogout }) => {
  const isAdmin = user.role === Role.SUPER_ADMIN;

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity size={16} className={health.captureRisk === 'Low' ? 'text-hq-green' : 'text-hq-yellow'} />
          <span className="text-xs font-black uppercase text-slate-500">Bedqabka Nidaamka:</span>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
            health.captureRisk === 'Low' ? 'bg-green-50 text-hq-green border-green-200' : 'bg-yellow-50 text-hq-yellow border-yellow-200'
          }`}>
            KHATARTA {health.captureRisk === 'Low' ? 'YAR' : health.captureRisk === 'Medium' ? 'DHEXE' : 'SARE'} EE LA-WAREEGIDDA
          </span>
        </div>
        
        <div className="h-6 w-px bg-slate-200" />
        
        <div className="hidden lg:flex gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gobollada Dalka</span>
            <span className="text-sm font-black text-hq-black">{health.regionalBalance}% Dheelitirka</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ka-qaybgalka Xubnaha</span>
            <span className="text-sm font-black text-hq-black">{health.participationRate}% Bartilmaameedka</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <div className="bg-yellow-50 text-hq-black border-2 border-hq-yellow px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mr-4 shadow-sm">
            <Layout size={14} className="text-hq-black" />
            Hannaanka Naqshadeeyaha
          </div>
        )}

        <div className="h-10 w-px bg-slate-200 mr-4" />

        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
            <div className="text-sm font-black text-hq-black leading-tight">{user.name}</div>
            <div className="text-[10px] text-hq-blue font-black uppercase tracking-wider">{user.role}</div>
          </div>
          <button 
            onClick={onLogout}
            className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;