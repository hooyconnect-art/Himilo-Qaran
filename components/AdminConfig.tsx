
import React from 'react';
import { Settings2, Save, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

const AdminConfig: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">10. Matoorka Shuruucda Nidaamka</h2>
          <p className="text-slate-500">Deji xuduudaha, muddada xilka, iyo ilaalinta algorithm-ka.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all">
            <RefreshCw size={16} /> Ku celi Bilowgii Sharciga
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-lg transition-all hover:bg-black">
            <Save size={16} /> Hirgeli Habaynta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <Settings2 className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-800">Xuduudaha Go’aan-gaarista</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Ugu Yar ee Ka-qaybgalka Xubnaha', desc: 'Heerka digniinta rasmiga ah ee nidaamka.', val: '40%' },
                { label: 'Xadka Eexda Gobolka', desc: 'Xadka ugu sarreeya ee dheelitir la’aanta gobollada.', val: '15%' },
                { label: 'Muddada Hakinta Golaha Sare', desc: 'Xilliga ugu sarreeya ee go’aanka la hayn karo.', val: '30 maalmood' },
                { label: 'Xilliga Qaboojinta Sharciga', desc: 'Sugitaanka qasabka ah ka hor intaan go’aan la gaarin.', val: '72 saacadood' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                  <input 
                    type="text" 
                    defaultValue={item.val} 
                    className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 text-center outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <RefreshCw className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-800">Muddada Xilka & Wareegga</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-4">
                <ShieldCheck className="text-indigo-600 shrink-0" size={20} />
                <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                  Dhaqangelinta Qodobka 3-aad waa <b>DHAQDHAQAAQ</b>. Nidaamku wuxuu si toos ah u joojinayaa xilka marka muddadu dhammaato.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 border border-slate-200 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Xilliga Xil-haynta ee Xidhiidhka ah</div>
                  <div className="text-xl font-bold text-slate-900">2</div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Muddada Nasashada</div>
                  <div className="text-xl font-bold text-slate-900">1</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <AlertTriangle className="text-amber-500" size={20} />
              <h3 className="font-bold text-slate-800">Ilaalinta La-wareegidda</h3>
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Dhaqangelinta Kala-soocidda Xilalka', status: true },
                 { label: 'Habaynta Diiwaanka ee Joogtada ah', status: true },
                 { label: 'Sugidda Kootada Gobolka', status: true },
                 { label: 'Wareegga Tooska ah ee Saamileeyda', status: false },
               ].map((rule, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-medium text-slate-700">{rule.label}</span>
                    <button className={`w-12 h-6 rounded-full relative transition-colors ${rule.status ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.status ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
             <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
               <ShieldCheck className="text-indigo-400" />
               Hab-maamuuska Amniga ee Naqshadeeyaha
             </h4>
             <p className="text-sm text-slate-400 leading-relaxed mb-6">
               Adigoo ah Naqshadeeyaha Nidaamka, waxaad leedahay awood aad ku beddesho shuruucda nidaamka, laakiin beddelid kasta waxaa lagu qoraa diiwaanka kormeerka ee rasmiga ah. Isticmaal awooddan si aad u hubiso in hay’addu ay ka badbaaddo fashilka shakhsiyaadka.
             </p>
             <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <AlertTriangle className="text-amber-400 shrink-0" size={16} />
                <p className="text-[10px] text-slate-300 leading-relaxed uppercase font-bold tracking-wider">
                  Digniin: Beddelidda qaabaynta waxay carqaladayn kartaa geedi-socodka socda.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;
