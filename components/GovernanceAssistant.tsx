
import React, { useState } from 'react';
import { Role } from '../types';
import { Sparkles, MessageSquare, X, ShieldAlert, Cpu, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CONSTITUTION } from '../constants';

interface GovernanceAssistantProps {
  userRole: Role;
}

const GovernanceAssistant: React.FC<GovernanceAssistantProps> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Regional balance is within 5% variance. Current governance flow meets 100% of Constitutional criteria.' },
    { role: 'model', text: 'Notice: Two members of the Central Council are nearing their second term limit (60 days remaining). Rotation planning recommended.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Use Gemini API to provide institutional reasoning based on the Constitution
  const handleAsk = async () => {
    if (!query.trim()) return;
    
    const userQuery = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userQuery }] }
        ],
        config: {
          systemInstruction: `You are the Guardian AI of CivicTrust OS, a governance platform. 
          Analyze governance questions based on the Party Constitution provided here: 
          ${CONSTITUTION}
          
          Current Context:
          - User Role: ${userRole}
          - System Integrity: High
          
          Rules for your response:
          - Be analytical, objective, and refer to specific Articles when possible.
          - If asked about power execution, clarify that power belongs to institutions, not individuals.
          - Keep answers concise and strictly within the boundaries of the Constitution.`,
        }
      });

      const text = response.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'model', text }]);
      }
    } catch (err) {
      console.error('Governance Assistant Error:', err);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to institutional logic core. Please check connectivity." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <Cpu className="group-hover:animate-pulse" />
        </button>
      ) : (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4">
          <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="text-sm font-bold">Guardian AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-1 rounded transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert size={14} />
              System Capture Monitor
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              I am monitoring for power concentration, regional bias, and role overlap. All analyses are based on institutional immutable logs.
            </p>
          </div>

          <div className="flex-1 p-4 max-h-60 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`p-3 rounded-xl text-xs border ${
                m.role === 'user' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
              }`}>
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 text-[10px] text-slate-500 italic">
                <Loader2 size={12} className="animate-spin" />
                Synthesizing constitutional logic...
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="p-3 text-xs text-slate-500 italic">
                Awaiting further institutional actions to provide analysis...
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-100">
            <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ask about governance health..."
                className="w-full pl-3 pr-10 py-2 text-xs bg-slate-100 border-none rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                onClick={handleAsk}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernanceAssistant;