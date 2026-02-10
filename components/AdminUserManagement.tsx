
import React, { useState, useMemo } from 'react';
import { Role, User, MembershipType, MembershipStatus } from '../types';
import { 
  UserPlus, Search, Shield, X, IdCard, Phone, 
  Users, ChevronRight, MapPin, ShieldAlert, Mail, 
  UserCircle, Award, Landmark, Edit, Trash2, 
  Filter, UserX, Clock, Hash, CheckCircle2, Gavel, 
  AlertTriangle, Calendar, Building2, UserCheck, ShieldCheck
} from 'lucide-react';

interface AdminUserManagementProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: Partial<User>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateStatus: (userId: string, newStatus: MembershipStatus, justification: string) => void;
  onUpdateRole: (userId: string, newRole: Role) => void;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ 
  users, 
  onUpdateStatus, 
  onUpdateRole 
}) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [newStatusValue, setNewStatusValue] = useState<MembershipStatus>(MembershipStatus.SUGITAAN);
  const [newRoleValue, setNewRoleValue] = useState<Role>(Role.XUBIN);
  const [justification, setJustification] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (u.nationalId || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
      const matchesRegion = filterRegion === 'all' || u.region === filterRegion;
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [users, searchTerm, filterStatus, filterRegion]);

  const pendingVerificationCount = useMemo(() => 
    users.filter(u => u.status === MembershipStatus.SUGITAAN).length
  , [users]);

  const handleStatusCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUserId && justification.trim()) {
      onUpdateStatus(targetUserId, newStatusValue, justification);
      setIsStatusModalOpen(false);
      setJustification('');
      setTargetUserId(null);
    }
  };

  const handleRoleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUserId) {
      onUpdateRole(targetUserId, newRoleValue);
      setIsRoleModalOpen(false);
      setTargetUserId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-hq-black p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-hq-yellow font-black uppercase text-[10px] tracking-[0.4em]">
             <Landmark size={14} /> National Membership Registry
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Institutional Diiwaanka</h2>
          <p className="text-slate-400 font-medium max-w-xl text-lg">Official registry management and security vetting desk for party members.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full lg:w-auto">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md px-8 py-5 rounded-[2rem] flex items-center gap-4">
             <div className="w-12 h-12 bg-hq-yellow rounded-2xl flex items-center justify-center text-hq-black shadow-lg">
                <ShieldCheck size={24} />
             </div>
             <div>
                <div className="text-[9px] font-black text-hq-yellow uppercase tracking-widest">Pending Verification</div>
                <div className="text-2xl font-black text-white leading-none">{pendingVerificationCount} Applications</div>
             </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
           <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Raadi Magaca, Xubinta ama ID-ga..." 
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none font-black text-base shadow-inner focus:border-hq-green transition-all"
              />
           </div>
           <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                 <Filter size={16} className="text-hq-blue" />
                 <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-transparent text-xs font-black uppercase outline-none text-slate-700">
                    <option value="all">All Status</option>
                    {(Object.values(MembershipStatus) as MembershipStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>
              <div className="flex items-center gap-2 px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                 <MapPin size={16} className="text-hq-green" />
                 <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="bg-transparent text-xs font-black uppercase outline-none text-slate-700">
                    <option value="all">All Regions</option>
                    {['Banaadir', 'Puntland', 'Jubaland', 'Galmudug', 'Hirshabelle', 'Koonfur Galbeed', 'Somaliland'].map(reg => <option key={reg} value={reg}>{reg}</option>)}
                 </select>
              </div>
           </div>
        </div>
      </div>

      {/* USER LIST */}
      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 bg-slate-50/50">
                <th className="px-12 py-10">Official Member Identity</th>
                <th className="px-12 py-10">Current Designation</th>
                <th className="px-12 py-10">Region / District</th>
                <th className="px-12 py-10">Registry Status</th>
                <th className="px-12 py-10 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-green-50/30 transition-all group">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-hq-white text-hq-blue rounded-[1.5rem] flex items-center justify-center border-2 border-hq-blue/10 shadow-sm group-hover:bg-hq-blue group-hover:text-white transition-all">
                          <UserCircle size={32} />
                       </div>
                       <div>
                          <div className="font-black text-hq-black text-xl leading-tight">{user.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-4">
                             <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md text-slate-600"><Hash size={12} /> {user.nationalId || 'PENDING'}</span>
                             <span className="flex items-center gap-1.5"><Phone size={12} /> {user.phone || 'N/A'}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                     <div className="inline-flex items-center gap-2 text-sm font-black text-hq-blue uppercase mb-1">
                        <Award size={16} /> {user.role}
                     </div>
                     <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{user.membershipType}</div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="text-xs font-black text-slate-700 mb-1">{user.region}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.district || 'Branch Level'}</div>
                  </td>
                  <td className="px-12 py-10">
                    <button 
                      onClick={() => { setTargetUserId(user.id); setNewStatusValue(user.status); setIsStatusModalOpen(true); }}
                      className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm flex items-center gap-2.5 transition-all hover:scale-105 ${
                        user.status === MembershipStatus.LA_ANSIXIYAY ? 'bg-green-50 text-hq-green border-green-200' :
                        user.status === MembershipStatus.SUGITAAN ? 'bg-yellow-50 text-hq-yellow border-yellow-200 animate-pulse' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {user.status === MembershipStatus.LA_ANSIXIYAY && (
                        <button 
                          onClick={() => { setTargetUserId(user.id); setNewRoleValue(user.role); setIsRoleModalOpen(true); }}
                          className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-hq-blue transition-all"
                        >
                          Assign Role
                        </button>
                      )}
                      <button 
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <UserX size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATUS VERIFICATION MODAL */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-2xl p-12 animate-in slide-in-from-bottom-8">
              <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-hq-green rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <ShieldCheck size={24} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Membership Verification</h3>
                 </div>
                 <button onClick={() => setIsStatusModalOpen(false)}><X /></button>
              </div>

              <form onSubmit={handleStatusCommit} className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Final Registry Status *</label>
                    <select 
                      required
                      value={newStatusValue}
                      onChange={e => setNewStatusValue(e.target.value as MembershipStatus)}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-hq-green shadow-inner"
                    >
                       {(Object.values(MembershipStatus) as MembershipStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Justification (Mandatory) *</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium outline-none focus:ring-2 focus:ring-hq-green shadow-inner"
                      placeholder="Explain the reason for this verification decision..."
                      value={justification}
                      onChange={e => setJustification(e.target.value)}
                    />
                 </div>

                 <button type="submit" className="w-full py-6 bg-hq-green text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs active:scale-95 transition-all">
                    Authorize Identity Transition
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* ROLE ASSIGNMENT MODAL */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-2xl p-12 animate-in slide-in-from-bottom-8">
              <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-hq-blue rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Award size={24} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Institutional Appointment</h3>
                 </div>
                 <button onClick={() => setIsRoleModalOpen(false)}><X /></button>
              </div>

              <form onSubmit={handleRoleCommit} className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Assign System Role *</label>
                    <select 
                      required
                      value={newRoleValue}
                      onChange={e => setNewRoleValue(e.target.value as Role)}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-hq-blue shadow-inner"
                    >
                       {(Object.values(Role) as Role[]).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>

                 <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] text-blue-800 leading-relaxed font-bold uppercase tracking-tight">
                       Appointments grant specific governance authorities. Every role change is logged to the immutable audit trail and visible to the Oversight Body.
                    </p>
                 </div>

                 <button type="submit" className="w-full py-6 bg-hq-blue text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs active:scale-95 transition-all">
                    Authorize Role Assignment
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
