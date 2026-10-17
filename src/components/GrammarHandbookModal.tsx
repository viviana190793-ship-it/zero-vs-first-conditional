import React from 'react';
import { sounds } from '../utils/audio';
import { X, BookOpen, Check, AlertCircle, Info } from 'lucide-react';

interface HandbookProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarHandbookModal: React.FC<HandbookProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Grammar Quick Handbook
              </h3>
              <p className="text-xs text-slate-500">
                Zero vs. First Conditional Cheat Sheet
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close handbook"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zero Conditional Section */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-teal-900 text-base">
              Zero Conditional (General Truths & Rules)
            </h4>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
              Habits & Facts
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-teal-900 bg-white/80 p-2 rounded-lg border border-teal-200">
            IF + PRESENT SIMPLE, PRESENT SIMPLE
          </div>
          <p className="text-xs text-slate-700">
            <strong>Example:</strong> “If students practice regularly, they improve their English.”
          </p>
          <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
            <li>Present simple in both clauses.</li>
            <li>Subject-verb agreement: add <em>-s/-es</em> for third person (he, she, it).</li>
            <li>Negative forms: <em>do not</em> or <em>does not</em>.</li>
          </ul>
        </div>

        {/* First Conditional Section */}
        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sky-900 text-base">
              First Conditional (Future Possibilities)
            </h4>
            <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
              Future Real
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-sky-900 bg-white/80 p-2 rounded-lg border border-sky-200">
            IF + PRESENT SIMPLE, WILL + BASE VERB
          </div>
          <p className="text-xs text-slate-700">
            <strong>Example:</strong> “If I study tonight, I will feel more prepared tomorrow.”
          </p>
          <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
            <li>Present simple in the <em>if-clause</em>.</li>
            <li><em>will + base verb</em> in the main clause.</li>
            <li><strong>Golden Rule:</strong> Never use <em>will</em> immediately after <em>if</em>.</li>
            <li>Negative future: <em>won't + base verb</em>.</li>
          </ul>
        </div>

        {/* Comma Rule */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
          <h4 className="font-display font-bold text-indigo-900 text-base">
            The Comma Punctuation Rule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-indigo-100">
              <span className="font-bold text-indigo-900">If-clause first:</span>
              <p className="text-slate-700 mt-1">“If students practice<strong className="text-rose-600">,</strong> they improve.”</p>
              <span className="text-[11px] text-rose-600 font-semibold">Comma required!</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-indigo-100">
              <span className="font-bold text-indigo-900">Main clause first:</span>
              <p className="text-slate-700 mt-1">“Students improve if they practice.”</p>
              <span className="text-[11px] text-emerald-600 font-semibold">No comma needed!</span>
            </div>
          </div>
        </div>

        {/* Common Pitfalls to Avoid */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Top 3 Common Mistakes for Future Teachers:</span>
          </div>
          <div className="space-y-1">
            <div>❌ *“If I will study, I will pass.” → ✅ “If I <strong>study</strong>, I will pass.”</div>
            <div>❌ *“If she studies, she will passes.” → ✅ “If she studies, she will <strong>pass</strong>.”</div>
            <div>❌ *“Students will learn, if they try.” → ✅ “Students will learn <strong>if</strong> they try.”</div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-display font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Got it, back to Game!
          </button>
        </div>
      </div>
    </div>
  );
};
