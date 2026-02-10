
import React, { useState } from 'react';
import { User, Role, MembershipStatus, MembershipType } from '../types';
import { 
  Landmark, ShieldCheck, UserPlus, LogIn, ChevronRight, 
  Fingerprint, MapPin, Phone, Hash, AlertCircle, Lock, Mail, Eye, EyeOff, 
  Calendar, User as UserIcon, Building2, Gavel
} from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
  onSignup: (user: Partial<User>) => void;
  availableUsers: User[];
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, availableUsers }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    email: '',
    region: '',
    district: '',
    gender: '',
    birthDate: '',
    nationalId: '',
    password: '',
    consent: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = availableUsers.find(u => 
      (u.email?.toLowerCase() === loginId.toLowerCase() || 
       u.name.toLowerCase() === loginId.toLowerCase() || 
       u.nationalId === loginId || 
       u.id === loginId)
    );

    if (user) {
      if (user.password && user.password !== password) {
        alert("Access Code-ka (Password) waa khalad. Fadlan iska hubi.");
        return;
      }
      onLogin(user);
    } else {
      alert("Xubintaan laguma helin nidaamka. Fadlan is-diiwaangeli ama sax aqoonsigaaga.");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.consent) return;
    onSignup(signupData);
  };

  return (
    <div className="min-h-screen bg-hq-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <Landmark className="absolute -top-20 -left-20 text-hq-green" size={600} />
        <Fingerprint className="absolute -bottom-20 -right-20 text-hq-blue" size={500} />
      </div>

      <div className={`max-w-${mode === 'login' ? 'xl' : '4xl'} w-full space-y-8 relative z-10 animate-in fade-in zoom-in duration-700`}>
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-hq-green p-4 rounded-[2rem] shadow-2xl shadow-green-900/50 mb-2 border-2 border-hq-yellow">
            <Landmark className="text-hq-yellow" size={mode === 'login' ? 48 : 36} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Himilo Qaran</h1>
          <p className="text-hq-yellow font-black uppercase tracking-[0.3em] text-xs">Political Party Governance OS</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/5">
          <div className="flex bg-slate-50 border-b border-slate-100">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white text-hq-green' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-hq-green' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Member Registration
            </button>
          </div>

          <div className="p-8 md:p-12">
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Institutional Email / ID</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-hq-green shadow-inner transition-all"
                      placeholder="Email-ka rasmiga ah..."
                      value={loginId}
                      onChange={e => setLoginId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Access Code (Password)</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-hq-green shadow-inner transition-all"
                      placeholder="Gali password-kaaga..."
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-hq-green"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-hq-green text-white font-black rounded-2xl shadow-xl hover:bg-green-600 active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-4"
                >
                  Enter Console <ChevronRight size={18} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Personal Info */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-hq-blue uppercase tracking-[0.2em] border-b pb-2">Personal Identity</h3>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name *</label>
                      <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-hq-green" placeholder="Magaca iyo aabbaha..." value={signupData.name} onChange={e => setSignupData({...signupData, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Gender *</label>
                        <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={signupData.gender} onChange={e => setSignupData({...signupData, gender: e.target.value})}>
                          <option value="">-- Dooro --</option>
                          <option value="Male">Lab (Male)</option>
                          <option value="Female">Dhedig (Female)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Birth Date *</label>
                        <input type="date" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={signupData.birthDate} onChange={e => setSignupData({...signupData, birthDate: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">National ID / Passport *</label>
                      <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-hq-green" placeholder="AA-000000" value={signupData.nationalId} onChange={e => setSignupData({...signupData, nationalId: e.target.value})} />
                    </div>
                  </div>

                  {/* Location & Contact */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-hq-blue uppercase tracking-[0.2em] border-b pb-2">Contact & Location</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Region *</label>
                        <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={signupData.region} onChange={e => setSignupData({...signupData, region: e.target.value})}>
                          <option value="">-- Xulo --</option>
                          {['Banaadir', 'Puntland', 'Jubaland', 'Galmudug', 'Hirshabelle', 'Koonfur Galbeed', 'Somaliland'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">District *</label>
                        <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-hq-green" placeholder="Degmada..." value={signupData.district} onChange={e => setSignupData({...signupData, district: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Phone Number *</label>
                      <input required type="tel" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-hq-green" placeholder="061XXXXXXX" value={signupData.phone} onChange={e => setSignupData({...signupData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Official Password *</label>
                      <input required type="password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-hq-green" placeholder="Set your access code..." value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-4">
                  <input 
                    required
                    type="checkbox" 
                    id="authConsent" 
                    className="mt-1 w-6 h-6 rounded-lg text-hq-green border-green-200"
                    checked={signupData.consent}
                    onChange={e => setSignupData({...signupData, consent: e.target.checked})}
                  />
                  <label htmlFor="authConsent" className="text-[10px] font-bold text-hq-green leading-relaxed uppercase cursor-pointer">
                    I accept the <b>Himilo Qaran Party Constitution</b> and Code of Conduct. I acknowledge that my membership will be <b>PENDING (SUGITAAN)</b> until verified by the Registry Body.
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={!signupData.consent}
                  className="w-full py-6 bg-hq-green text-white font-black rounded-2xl shadow-xl hover:bg-green-600 active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3"
                >
                  Register Identity <UserPlus size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 text-slate-500 opacity-60">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Lock size={12} /> Secure Protocol
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Gavel size={12} /> Constitutional Alignment
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
