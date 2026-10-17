import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/audio';
import { Sparkles, X, MessageSquare, Lightbulb, ChevronRight, HelpCircle } from 'lucide-react';

export type MascotMood = 'idle' | 'happy' | 'mistake' | 'thinking';

interface MascotAssistantProps {
  mood: MascotMood;
  customMessage?: string | null;
  onClearMessage?: () => void;
}

const IDLE_TIPS = [
  "🏫 Classroom Rule: Use Zero Conditional for school rules! E.g.: 'If you raise your hand, the teacher answers.'",
  "📚 Study Habit: 'If you review your notes every day, you remember vocabulary easily.'",
  "🎓 Future Teacher: Use First Conditional for career goals! 'If I become a teacher, I will design fun games.'",
  "⭐ Golden Rule: Never put 'will' right after 'if'! Say: 'If I study tonight, I will pass.'",
  "✏️ Comma Check: If the if-clause is first, add a comma! If 'if' is in the middle, no comma is needed!",
  "💡 Quick Tip: Present simple with 'he/she/it' always takes -s or -es: 'If the teacher explains clearly...'"
];

export const MascotAssistant: React.FC<MascotAssistantProps> = ({
  mood,
  customMessage,
  onClearMessage
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTipIdx, setCurrentTipIdx] = useState(0);

  const handleNextTip = () => {
    sounds.playClick();
    setCurrentTipIdx((prev) => (prev + 1) % IDLE_TIPS.length);
  };

  const getMoodTitle = () => {
    switch (mood) {
      case 'happy': return 'Hoo-ray! Great Job!';
      case 'mistake': return "Ollie's Learning Tip!";
      case 'thinking': return 'Ollie is pondering...';
      default: return 'Ollie the Grammar Owl';
    }
  };

  const getMoodSpeech = () => {
    if (customMessage) return customMessage;
    switch (mood) {
      case 'happy':
        return "Spot on! That's the exact conditional structure. Keep that winning streak going!";
      case 'mistake':
        return "Don't worry, learning takes practice! Check if the sentence talks about a general truth or a specific future possibility.";
      case 'thinking':
        return "Take your time! Read both clauses carefully before choosing your answer.";
      default:
        return IDLE_TIPS[currentTipIdx];
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden flex flex-col items-end pointer-events-auto">
      
      {/* Expanded Speech Bubble */}
      {!isMinimized && (
        <div className={`mb-3 max-w-xs sm:max-w-sm rounded-3xl p-4 shadow-2xl border-2 transition-all duration-300 relative ${
          mood === 'mistake'
            ? 'bg-rose-50 border-rose-300 text-rose-950 animate-mascot-confused'
            : mood === 'happy'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 animate-mascot-happy'
            : 'bg-white border-amber-300 text-slate-800'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-1.5 font-display font-extrabold text-xs">
              {mood === 'mistake' ? (
                <HelpCircle className="w-4 h-4 text-rose-600" />
              ) : mood === 'happy' ? (
                <Sparkles className="w-4 h-4 text-emerald-600" />
              ) : (
                <Lightbulb className="w-4 h-4 text-amber-500" />
              )}
              <span className={
                mood === 'mistake' ? 'text-rose-700' : mood === 'happy' ? 'text-emerald-700' : 'text-amber-800'
              }>
                {getMoodTitle()}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
                title="Minimize assistant"
                aria-label="Minimize Ollie"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Speech Text */}
          <p className="text-xs sm:text-sm leading-relaxed font-medium">
            {getMoodSpeech()}
          </p>

          {/* Tip changer if idle */}
          {mood === 'idle' && !customMessage && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Grammar Coach Tip</span>
              <button
                onClick={handleNextTip}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Another tip</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Triangular tail pointing down to mascot */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-inherit border-b-2 border-r-2 border-inherit rotate-45 transform" />
        </div>
      )}

      {/* Mascot Avatar Button */}
      <button
        onClick={() => {
          sounds.playClick();
          setIsMinimized(prev => !prev);
        }}
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 shadow-xl overflow-hidden cursor-pointer transition-transform hover:scale-108 active:scale-95 group bg-purple-100 ${
          mood === 'mistake'
            ? 'border-rose-400 ring-4 ring-rose-200'
            : mood === 'happy'
            ? 'border-emerald-400 ring-4 ring-emerald-200'
            : 'border-amber-400 ring-4 ring-amber-200'
        }`}
        title="Ollie the Grammar Owl (Click to chat)"
        aria-label="Ollie Grammar Owl assistant"
      >
        <img
          src="/src/assets/images/mascot_grammar_owl_1792207846289.jpg"
          alt="Ollie the Grammar Owl"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Small badge icon */}
        <div className="absolute bottom-0 right-0 p-1 bg-amber-400 text-amber-950 rounded-full shadow-md text-[10px] font-black">
          🦉
        </div>
      </button>

    </div>
  );
};
