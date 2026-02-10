
import React, { useState } from 'react';
import { Role } from '../../types';
import { Send, FileText, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

interface SubmissionPageProps {
  onSubmit: (title: string, desc: string, category: string) => void;
  onCancel: () => void;
  userRole: Role;
}

const SubmissionPage: React.FC<SubmissionPageProps> = ({ onSubmit, onCancel, userRole }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Siyaasad');

  const isMember = userRole !== Role.SUPER_ADMIN && userRole !== Role.CHAIRPERSON_PENDING;

  if (!isMember && userRole !== Role.SUPER_ADMIN) {
    return (
      <div className="max-w-2xl mx-auto p-20 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={40} />
        </div>
        <h3 className="text-2xl font-black uppercase">Access Locked</h3>
        <p className="text-slate-500">Only registered members (Xubin) can initiate Stage 1 of the governance pipeline.</p>
        <button onClick={onCancel} className="text-indigo-600 font-bold uppercase text-xs hover:underline">Back to Registry</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><ArrowLeft /></button>
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">STAGE 1: SUBMISSION</h2>
          <p className="text-slate-500 font-medium mt-1">Xubin Ideation Protocol (Article II)</p>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl">
             <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                <ShieldCheck size={12} /> Identity Verified
             </div>
             <p className="text-lg text-indigo-50 font-medium leading-relaxed italic">
               "Power belongs to the institution. Every great change begins with a single member's thought."
             </p>
          </div>
          <div className="shrink-0 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
             <div className="text-[10px] font-black uppercase mb-1 opacity-60">Cooling-Off Rule</div>
             <div className="text-2xl font-black">72 HOURS</div>
          </div>
        </div>
        <FileText className="absolute -bottom-10 -right-10 text-white opacity-5" size={240} />
      </div>

      <form 
        onSubmit={(e) => { e.preventDefault(); onSubmit(title, desc, category); }}
        className="bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-sm space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Proposal Title *</label>
              <input 
                required
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Cinwaan cad oo kooban..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Policy Category</label>
              <select 
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="Siyaasad">Siyaasad (Policy)</option>
                <option value="Sharci">Sharci (Legal)</option>
                <option value="Dhaqaale">Dhaqaale (Economy)</option>
                <option value="Amni">Amni (Security)</option>
              </select>
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Faahfaahinta Soo-jeedinta *</label>
           <textarea 
              required
              rows={8}
              className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium leading-relaxed resize-none"
              placeholder="Sharax dhibaatada iyo xalka aad soo jeedinayso..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
           />
        </div>

        <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
           <AlertCircle className="text-amber-600 shrink-0 mt-1" size={20} />
           <p className="text-[11px] font-bold text-amber-900 uppercase leading-relaxed">
             Marka aad gudbiso fikradan, waxay noqonaysaa diiwaan aan la tirtiri karin. Waxaa dib u eegi doona Guddiga Siyaasadda ee heerka 2-aad.
           </p>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
           <button 
             type="submit"
             className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl uppercase tracking-widest text-sm hover:bg-black active:scale-95 transition-all flex items-center gap-3"
           >
             Gudbi Protocol-ka Stage 1 <Send size={18} />
           </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionPage;
