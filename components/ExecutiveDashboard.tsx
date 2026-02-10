
import React from 'react';
import { Idea, WorkflowStatus } from '../types';
import { Activity, Target, Clock, CheckCircle2, MoreVertical, TrendingUp } from 'lucide-react';

interface ExecutiveDashboardProps {
  ideas: Idea[];
  onViewProject: (id: string) => void;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ ideas, onViewProject }) => {
  // Fix: Map to valid existing status member
  const activeProjects = ideas.filter(i => i.status === WorkflowStatus.CONVERTED_TO_POLICY);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Hub (Fulinta)</h2>
          <p className="text-slate-500">Managing implementation of approved institutional decisions.</p>
        </div>
        <div className="text-sm font-bold text-indigo-600 px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
          Status: All Projects On Track
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Activity size={20}/></div>
            <span className="text-[10px] font-bold text-emerald-500">+12% vs LY</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">14</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Deployments</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Target size={20}/></div>
            <span className="text-[10px] font-bold text-emerald-500">Target: 90%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">88.4%</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">KPI Completion Rate</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock size={20}/></div>
            <span className="text-[10px] font-bold text-amber-500">Avg 4.2d</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">0</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Critical Delays</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Active Institutional Projects</h3>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Export All Reports</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Current Phase</th>
                <th className="px-6 py-4">Completion</th>
                <th className="px-6 py-4">Health</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeProjects.map(proj => (
                <tr key={proj.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900 text-sm">{proj.title}</div>
                    <div className="text-[10px] text-slate-400">Linked Decision: #D-{proj.id.slice(0, 6)}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-xs font-medium text-slate-600">Phase 3: Deployment</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${proj.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">On Track</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => onViewProject(proj.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                    >
                      Update Progress
                    </button>
                  </td>
                </tr>
              ))}
              {activeProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Activity className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-medium italic">No active implementation projects found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
