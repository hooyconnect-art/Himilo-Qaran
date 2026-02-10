
import React from 'react';
import { CONSTITUTION } from '../constants';
import { Book, Scale, History, FileText, Shield } from 'lucide-react';

const InstitutionalMemory: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Book size={20} className="text-indigo-600" />
              Foundations
            </h3>
            <div className="space-y-1">
              {['Party Constitution', 'Charter of Ethics', 'Regional Bylaws', 'Electoral Code'].map(doc => (
                <button key={doc} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-between group">
                  {doc}
                  <FileText size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-900 text-emerald-100 p-6 rounded-2xl shadow-xl shadow-emerald-100">
            <Scale size={32} className="mb-4 text-emerald-400" />
            <h4 className="font-bold text-lg mb-2">Supremacy of Law</h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Decisions are not made by leaders, but through the synthesis of collective logic bound by the institutional charter.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">National Charter & Constitution</h3>
              <span className="text-xs font-bold text-slate-400 uppercase">Version 1.0.4 - Ratified 2023</span>
            </div>
            <div className="p-8 prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-sm">
                {CONSTITUTION}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-slate-800">
                <History className="text-indigo-600" />
                <h4 className="font-bold">Historical Landmarks</h4>
              </div>
              <div className="space-y-4">
                {[
                  { year: '2023', event: 'First General Assembly' },
                  { year: '2023', event: 'Regional Offices Established' },
                  { year: '2024', event: 'Digital Governance Launch' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-xs font-bold text-indigo-600 w-12 pt-1">{item.year}</span>
                    <span className="text-sm text-slate-600">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-slate-800">
                <Shield className="text-emerald-600" />
                <h4 className="font-bold">Security Protocols</h4>
              </div>
              <ul className="text-sm text-slate-500 space-y-2 list-disc pl-4">
                <li>Multi-signature approval required for budget deployment.</li>
                <li>Zero-knowledge proof for member voting privacy.</li>
                <li>2FA required for all Council and Executive roles.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalMemory;
