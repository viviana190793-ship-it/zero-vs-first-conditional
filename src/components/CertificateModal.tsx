import React, { useState } from 'react';
import { UserProgress, GameScreen } from '../types/grammar';
import { sounds } from '../utils/audio';
import { Award, Star, Printer, ArrowLeft, CheckCircle2, School, Sparkles } from 'lucide-react';

interface CertificateProps {
  progress: UserProgress;
  onNavigate: (screen: GameScreen) => void;
  onUpdatePlayerName: (name: string) => void;
}

export const CertificateModal: React.FC<CertificateProps> = ({
  progress,
  onNavigate,
  onUpdatePlayerName
}) => {
  const [name, setName] = useState(progress.playerName || 'Future English Teacher');
  const [isEditing, setIsEditing] = useState(false);

  const totalStars = progress.game1Stars + progress.game2Stars + progress.game3Stars;
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleSaveName = () => {
    sounds.playClick();
    setIsEditing(false);
    onUpdatePlayerName(name.trim() || 'Future English Teacher');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Controls (Hidden on Print) */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('welcome');
          }}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quest Map</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="bg-white rounded-3xl border-8 border-double border-teal-600/60 p-8 sm:p-12 shadow-xl relative overflow-hidden text-center space-y-6">
        
        {/* Subtle decorative background watermark */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-sky-50/20 to-indigo-50/30 pointer-events-none" />

        {/* Certificate Header */}
        <div className="relative space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <div className="text-xs font-bold tracking-widest uppercase text-teal-700">
            Grammar Quest International Teacher Academy
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            CERTIFICATE OF GRAMMAR MASTERY
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            CEFR Level A2–B1 Pedagogical Competency in Conditional Sentence Structures
          </p>
        </div>

        {/* Recipient Line */}
        <div className="relative py-4 border-y border-teal-100 max-w-xl mx-auto space-y-2">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            This Certificate is Proudly Awarded to
          </div>
          
          {isEditing ? (
            <div className="flex items-center justify-center gap-2 print:hidden">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center font-display text-2xl font-black text-teal-800 border-b-2 border-teal-500 focus:outline-none"
                maxLength={30}
              />
              <button
                onClick={handleSaveName}
                className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-bold"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-teal-800 underline decoration-teal-300 underline-offset-8">
                {name}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[11px] text-teal-600 hover:text-teal-800 underline font-semibold print:hidden cursor-pointer"
              >
                (change)
              </button>
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
            for successfully mastering the rules, comma punctuation, and teaching pedagogy of both the <strong>Zero Conditional</strong> and <strong>First Conditional</strong>.
          </p>
        </div>

        {/* Performance Metrics Tally */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-center">
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-2xl">
            <div className="text-xs font-bold text-teal-700">Stars Earned</div>
            <div className="font-display font-black text-xl text-teal-950 flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{totalStars} / 9 Stars</span>
            </div>
          </div>

          <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl">
            <div className="text-xs font-bold text-sky-700">Total Score</div>
            <div className="font-display font-black text-xl text-sky-950 mt-0.5">
              {progress.totalScore} Pts
            </div>
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
            <div className="text-xs font-bold text-indigo-700">Classroom Stations</div>
            <div className="font-display font-black text-xl text-indigo-950 mt-0.5">
              {progress.unlockedItems.length} / 6 Unlocked
            </div>
          </div>
        </div>

        {/* Seal and Signatures */}
        <div className="relative pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl mx-auto text-left border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Date of Achievement</div>
            <div className="font-semibold text-slate-800 text-sm">{today}</div>
          </div>

          {/* Gold Seal Graphic */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 shadow-md flex items-center justify-center text-amber-950 font-black text-[10px] text-center leading-tight p-2 rotate-12">
            OFFICIAL GRAMMAR SEAL
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Academic Certification</div>
            <div className="font-semibold text-slate-800 text-sm">Grammar Quest Board</div>
          </div>
        </div>

      </div>

    </div>
  );
};
