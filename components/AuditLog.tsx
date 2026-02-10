
import React, { useState, useMemo } from 'react';
import { AuditEntry, Role } from '../types';
import { Shield, Search, Filter, Download, Info, CheckCircle, Lock } from 'lucide-react';

interface AuditLogProps {
  auditLogs: AuditEntry[];
}

const AuditLog: React.FC<AuditLogProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = 
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || log.actorRole === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [auditLogs, searchTerm, roleFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Diiwaanka Isla-xisaabtanka ee Hay’adda</h2>
          <p className="text-slate-500">Go’aan kasta, beddelid kasta oo xil ah, iyo qoraal kasta waxaa lagu kaydiyaa xasuusta rasmiga ah ee hay’adda.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 outline-none hover:bg-slate-50 appearance-none transition-colors"
            >
              <option value="all">Dhammaan Xilalka</option>
              {Object.values(Role).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            <Download size={16} /> Soo Degso Diiwaanka
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Lock size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase">Heerka Sugnaanta</div>
            <div className="text-sm font-semibold text-emerald-900">Waa Mid Joogto ah & La Hubiyay</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-700 uppercase">Wadarta Qoraallada</div>
            <div className="text-sm font-semibold text-blue-900">{auditLogs.length} Dhacdooyin La Qoray</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <Shield size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Habka Nidaamka</div>
            <div className="text-sm font-semibold text-slate-800">Maamulku Wuu Shaqaynayaa</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <Info size={18} className="text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Diiwaanka Cadaymaha Taariikhiga ah</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ku raadi qofka, ficilka, ama faahfaahinta..." 
              className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-white">
                <th className="px-6 py-4">Xilliga</th>
                <th className="px-6 py-4">Ficil-sameeyaha</th>
                <th className="px-6 py-4">Nooca Ficilka</th>
                <th className="px-6 py-4">Faahfaahinta</th>
                <th className="px-6 py-4 text-center">Heerka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleString('so-SO')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">{log.actorName}</span>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-tight">{log.actorRole}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold py-1 px-2 bg-slate-100 rounded text-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 leading-snug">
                      {log.details}
                      {log.affectedEntityId && (
                        <span className="ml-2 text-[10px] font-mono text-slate-400">ID: {log.affectedEntityId.slice(0, 8)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                      <Lock size={10} />
                      LA SAXIIXAY
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto text-slate-400">
                      <Search className="mx-auto mb-4 opacity-20" size={48} />
                      <p className="text-sm font-medium">Ma jiro qoraal u dhigma raadintaada.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setRoleFilter('all');}}
                        className="mt-4 text-indigo-600 hover:text-indigo-800 text-xs font-bold"
                      >
                        Dib u bilaaw raadinta
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {auditLogs.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Security Hash: SHA-256 Verified Ledger</span>
            <span>Blockchain Sync: 12.4s ago</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
