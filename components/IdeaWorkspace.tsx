
import React, { useState } from 'react';
import { Role } from '../types';
import { Send, FileText, AlertCircle } from 'lucide-react';

interface IdeaWorkspaceProps {
  ideas: any[];
  userRole: Role;
  onAddIdea: (title: string, desc: string) => void;
}

const IdeaWorkspace: React.FC<IdeaWorkspaceProps> = ({ ideas, userRole, onAddIdea }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;
    onAddIdea(title, desc);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Goobta Ka-qaybgalka Xubnaha</h2>
          <p className="text-indigo-100 max-w-xl">Go’aan kasta oo hay’adeed wuxuu ku bilaabmaa hal fikrad. Adeegso codkaaga si aad u qaabayso mustaqbalka dalka. Qoraalkaagu wuxuu mari doonaa 5 heer oo qasab ah oo lagu qiimeeyo.</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
          <FileText size={160} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Cinwaanka Codsiga/Fikradaha</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
            placeholder="Gali cinwaan cad oo kooban..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Faahfaahinta & Cadaymaha</label>
          <textarea 
            rows={6}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
            placeholder="Sharax dhibaatada, xalka aad soo jeedinayso, iyo natiijada hay'addu ka filayso..."
          />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4">
          <AlertCircle className="text-slate-400 shrink-0" size={20} />
          <p className="text-xs text-slate-500 leading-relaxed">
            <b>Hab-maamuuska Hay’adda:</b> Marka aad gudbiso, fikradani waxay noqonaysaa xog dadweyne oo ku jirta heerka Xubin. Waxaa dib u eegi doona Guddiga Qaybta ee khuseeya ka hor intaan loo gudbin Golaha Dhexe. <b>Ma jiro wax la tirtiri karo ka dib markii la gudbiyo.</b>
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-3 transition-all transform active:scale-95"
          >
            U Gudbi Qiimeynta Hay’adeed
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaWorkspace;
