
import React, { useState, useMemo } from 'react';
import { Committee, ReviewCommitteeType } from '../types';
import { 
  Scale, ShieldAlert, CheckCircle, Activity, Users, ExternalLink, 
  ArrowRight, Search, Info, Briefcase, Globe, Heart, BookOpen, 
  ShieldCheck, Gavel, Cpu, Target, Landmark, Filter, ChevronRight
} from 'lucide-react';

const OVERSIGHT_COMMITTEES: Committee[] = [
  { id: 'rc-1', name: 'Guddiga Hubinta Xubinnimada (MRC)', type: ReviewCommitteeType.MEMBERSHIP, module: 'ADMIN-MEMBERSHIP', membersCount: 5, mandate: 'Xaqiijinta aqoonsiga iyo u hoggaansanaanta shuruudaha xubinimada.', prohibited: ['Ma kordhin karaan xilka', 'Ma tirtiri karaan xogta'], kpis: ['Dheelitirka Gobolka: > 95%', 'Waqtiga Hubinta: < 48h'], status: 'ACTIVE', riskLevel: 'Low' },
  { id: 'rc-2', name: 'Guddiga Hubinta Soo-jeedinta (PRC)', type: ReviewCommitteeType.PROPOSAL, module: 'ADMIN-POLICIES', membersCount: 7, mandate: 'Qiimeynta farsamo iyo sharci ee fikradaha xubnaha.', prohibited: ['Ma beddeli karaan nuxurka fikradda'], kpis: ['Heerka Synthesis: 12%', 'Integrity Score: 100%'], status: 'ACTIVE', riskLevel: 'Low' },
  { id: 'rc-3', name: 'Guddiga Anshaxa & Kormeerka (ECRC)', type: ReviewCommitteeType.ETHICS, module: 'ADMIN-OVERSIGHT', membersCount: 3, mandate: 'Kormeerka dhaqanka hay’adeed iyo baarista eedaha.', prohibited: ['Ma qaadi karaan tallaabo iyadoon caddayn jirin'], kpis: ['Xallinta Dacwadaha: 100%', 'Oversight Alerts: 0'], status: 'ACTIVE', riskLevel: 'Medium' },
  { id: 'rc-4', name: 'Guddiga Hubinta Musharaxnimada (ENRC)', type: ReviewCommitteeType.ELIGIBILITY, module: 'ADMIN-CANDIDATES', membersCount: 5, mandate: 'Xaqiijinta mudnaanta iyo vetting-ka musharaxiinta.', prohibited: ['Ma dooran karaan musharax'], kpis: ['Vetting Accuracy: 100%', 'Checks: 14 Active'], status: 'ACTIVE', riskLevel: 'High' }
];

const SECTORAL_COMMITTEES = [
  { id: 'sc-1', code: 'HQ-PR-01', name: 'Guddiga Warbaahinta & Xiriirka Bulshada', icon: Globe, mandate: 'Maamulka xiriirka bulshada, saxaafadda, iyo baahinta aragtida fog ee xisbiga.' },
  { id: 'sc-2', code: 'HQ-EL-02', name: 'Guddiga Ololaha & Doorashooyinka', icon: Target, mandate: 'Abaabulka taageerayaasha, maamulka ololaha doorashada, iyo farsamada tartanka.' },
  { id: 'sc-3', code: 'HQ-YT-03', name: 'Guddiga Dhalinyarada', icon: Cpu, mandate: 'Xoojinta doorka dhalinyarada, aqoon-kororsiga, iyo ka qaybgalka hoggaanka.' },
  { id: 'sc-4', code: 'HQ-WM-04', name: 'Guddiga Haweenka', icon: Heart, mandate: 'Sugidda xuquuqda iyo ka qaybgalka haweenka ee dhammaan heerarka go’aan-gaarista.' },
  { id: 'sc-5', code: 'HQ-RP-05', name: 'Guddiga Cilmi-baarista & Siyaasadda', icon: BookOpen, mandate: 'Daraasidda xaaladda dalka iyo soo saarista qorshayaal siyaasadeed oo cilmiyeysan.' },
  { id: 'sc-6', code: 'HQ-MB-06', name: 'Guddiga Abaabulka & Xubinnimada', icon: Users, mandate: 'Diiwaangelinta, xaqiijinta xubnaha cusub, iyo ballaarinta saldhigga xisbiga.' },
  { id: 'sc-7', code: 'HQ-FN-07', name: 'Guddiga Maaliyadda & Hantida', icon: Landmark, mandate: 'Maamulka dhaqaalaha, ururinta tabarucaadka, iyo ilaalinta hantida xisbiga.' },
  { id: 'sc-8', code: 'HQ-ET-08', name: 'Guddiga Anshaxa & Kormeerka', icon: ShieldCheck, mandate: 'Ilaalinta hab-dhaqanka toosan ee xubnaha iyo hubinta u hoggaansanaanta xeerarka.' },
  { id: 'sc-9', code: 'HQ-LC-09', name: 'Guddiga Arrimaha Sharciga & Dastuurka', icon: Gavel, mandate: 'Fasiraadda shuruucda xisbiga iyo hubinta in dhammaan go’aannadu yihiin sharci.' },
  { id: 'sc-10', code: 'HQ-PU-10', name: 'Guddiga Nabadda & Midnimada', icon: Scale, mandate: 'Hoggaaminta dadaallada dib-u-heshiisiinta iyo xoojinta wadajirka bulshada.' },
  { id: 'sc-11', code: 'HQ-SA-11', name: 'Guddiga Arrimaha Bulshada', icon: Heart, mandate: 'Ka qaybgalka adeegyada bulshada, caafimaadka, iyo gargaarka bini’aadanimo.' },
  { id: 'sc-12', code: 'HQ-ED-12', name: 'Guddiga Waxbarashada & Tababarka', icon: BookOpen, mandate: 'Kobcinta aqoonta xubnaha, tababarrada hoggaaminta, iyo xirfadaha farsamo.' },
  { id: 'sc-13', code: 'HQ-EC-13', name: 'Guddiga Dhaqaalaha & Horumarinta', icon: Activity, mandate: 'Soo-jeedinta qorshayaal lagu horumarinayo dhaqaalaha iyo fursadaha ganacsiga.' },
  { id: 'sc-14', code: 'HQ-FR-14', name: 'Guddiga Xiriirka Dibadda', icon: Globe, mandate: 'Xiriirka xisbiyada caalamiga ah, jaaliyadaha dibadda, iyo hay’adaha dunida.' },
  { id: 'sc-15', code: 'HQ-HR-15', name: 'Guddiga Caddaaladda & Xuquuqul Insaanka', icon: Scale, mandate: 'Difaacidda xuquuqda muwaadinka iyo sugidda caddaalad loo siman yahay.' },
  { id: 'sc-16', code: 'HQ-XO-16', name: 'Guddiga Kormeerka Fullinta', icon: ShieldAlert, mandate: 'Hubinta in qorshe-hawleedyada la ansixiyay ay u fulayaan sidii loogu talagalay.' },
  { id: 'sc-17', code: 'HQ-NS-17', name: 'Guddiga Qorsheynta & Istaraatiijiyadda Qaranka', icon: Target, mandate: 'Dejinta aragtida fog ee xisbiga uu qaranka ku hoggaaminayo mustaqbalka.' }
];

const AdminCommittees: React.FC = () => {
  const [activeView, setActiveView] = useState<'sectoral' | 'oversight'>('sectoral');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSectoral = useMemo(() => {
    return SECTORAL_COMMITTEES.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      {/* 1. INSTITUTIONAL HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em]">
             <Landmark size={14} /> Institutional Architecture
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Diiwaanka Guddiyada (Committee Registry)</h2>
          <p className="text-slate-500 font-medium max-w-xl">Halkan ka eeg 17-ka Guddiyada Qaybaha ee rasmiga ah ee xisbiga Himilo Qaran.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 relative z-10">
           <button 
             onClick={() => setActiveView('sectoral')}
             className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'sectoral' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:bg-slate-200'}`}
           >
             <Briefcase size={16} /> Sectoral Hub (17)
           </button>
           <button 
             onClick={() => setActiveView('oversight')}
             className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'oversight' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:bg-slate-200'}`}
           >
             <ShieldCheck size={16} /> Oversight Hub (4)
           </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-6 shadow-sm">
          <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Ku raadi magaca ama code-ka guddiga..." 
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm shadow-inner"
              />
          </div>
          <div className="flex items-center gap-2 px-6 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <Activity size={18} className="text-indigo-600" />
              <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">
                {activeView === 'sectoral' ? filteredSectoral.length : OVERSIGHT_COMMITTEES.length} Active Bodies
              </span>
          </div>
      </div>

      {/* 3. SECTORAL VIEW (The 17 Committees) */}
      {activeView === 'sectoral' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in slide-in-from-right-6 duration-500">
           {filteredSectoral.map((c) => (
             <div key={c.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 hover:shadow-2xl hover:border-indigo-300 transition-all flex flex-col group relative overflow-hidden h-full">
                <div className="flex justify-between items-start mb-8">
                   <div className="p-5 bg-slate-50 text-indigo-600 rounded-[1.5rem] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                      <c.icon size={32} />
                   </div>
                   <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-100 shadow-sm">{c.code}</div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors uppercase leading-tight">{c.name}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1 italic mb-8">"{c.mandate}"</p>
                
                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-indigo-600">
                      <Users size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Xubinnimo Firfircoon</span>
                   </div>
                   <button className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      <ExternalLink size={18} />
                   </button>
                </div>
             </div>
           ))}
           {filteredSectoral.length === 0 && (
             <div className="col-span-full py-40 text-center space-y-4 bg-white border-4 border-dashed border-slate-100 rounded-[4rem]">
                <Search size={64} className="mx-auto text-slate-100" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] italic">Ma jiro gudi u dhigma raadintaada.</p>
             </div>
           )}
        </div>
      )}

      {/* 4. OVERSIGHT VIEW */}
      {activeView === 'oversight' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-left-6 duration-500">
          {OVERSIGHT_COMMITTEES.map((committee) => (
            <div key={committee.id} className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-emerald-400 transition-all">
              <div className="p-10 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    <Scale size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 leading-none mb-2 uppercase">{committee.name}</h4>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Module: <span className="text-indigo-600">{committee.module}</span></div>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                  committee.riskLevel === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  Kormeerka: {committee.riskLevel}
                </span>
              </div>
              <div className="p-10 space-y-8 flex-1">
                 <p className="text-base text-slate-600 leading-relaxed font-medium italic">"{committee.mandate}"</p>
                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Institutional Metrics (KPIs)</h5>
                    <div className="flex flex-wrap gap-3">
                       {committee.kpis.map((k, i) => (
                         <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-xl border border-indigo-100 uppercase tracking-tight">{k}</span>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{committee.membersCount} Certified Members</span>
                 </div>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
                    Gasho Diiwaanka <ChevronRight size={14} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. ACCOUNTABILITY FOOTER */}
      <div className="bg-slate-900 rounded-[3rem] p-16 text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 flex-1">
               <h4 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                  <ShieldCheck className="text-indigo-400" size={32} /> Separation of Power
               </h4>
               <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                  Guddiyadan waa lafdhabarta rasmiga ah ee xisbiga. Sida ku cad <strong>Qodobka II</strong>, guddigu ma laha awood fulin oo toos ah, balse waxay leeyihiin awoodda soo-jeedinta iyo shaandheynta farsamo ee hufan.
               </p>
            </div>
            <div className="flex gap-8 shrink-0">
               <div className="text-center space-y-2">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Capacity</div>
                  <div className="text-5xl font-black tabular-nums">21</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase">Bodies Total</div>
               </div>
               <div className="text-center space-y-2">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Compliance</div>
                  <div className="text-5xl font-black tabular-nums text-emerald-400">100%</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase">Vetting Rate</div>
               </div>
            </div>
         </div>
         <Activity size={300} className="absolute -bottom-20 -right-20 opacity-5" />
      </div>
    </div>
  );
};

export default AdminCommittees;
