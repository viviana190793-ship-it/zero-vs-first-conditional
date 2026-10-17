import React from 'react';
import { GameScreen, UserProgress } from '../types/grammar';
import { sounds } from '../utils/audio';
import { Volume2, VolumeX, Eye, BookOpen, Star, Trophy } from 'lucide-react';

interface HeaderProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  progress: UserProgress;
  isMuted: boolean;
  onToggleMute: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onOpenHandbook: () => void;
  onOpenScoreboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  progress,
  isMuted,
  onToggleMute,
  reducedMotion,
  onToggleReducedMotion,
  onOpenHandbook,
  onOpenScoreboard
}) => {
  const totalStars = progress.game1Stars + progress.game2Stars + progress.game3Stars;

  const handleNav = (screen: GameScreen) => {
    sounds.playClick();
    onNavigate(screen);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={() => handleNav('welcome')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1"
          aria-label="Grammar Quest Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            GQ
          </div>
          <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors whitespace-nowrap shrink-0">
            Grammar Quest
          </span>
        </button>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700">
          <button
            onClick={() => handleNav('learn')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer ${
              currentScreen === 'learn'
                ? 'text-teal-600 border-teal-500 font-extrabold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Grammar Zone
          </button>
          <button
            onClick={() => handleNav('game1')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer ${
              currentScreen === 'game1'
                ? 'text-teal-600 border-teal-500 font-extrabold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Game 1: Match & Sort
          </button>
          <button
            onClick={() => handleNav('game2')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer ${
              currentScreen === 'game2'
                ? 'text-sky-600 border-sky-500 font-extrabold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Game 2: Escape Classroom
          </button>
        </nav>

        {/* Zone 3: Scoreboard CTA + primary action + accessible controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Scoreboard CTA Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenScoreboard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 btn-3d-amber text-amber-950 text-xs font-black rounded-xl cursor-pointer"
            title="View Class Scoreboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-900" />
            <span className="tabular-nums">{progress.totalScore} pts</span>
          </button>

          {/* Quick star tally */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-extrabold tabular-nums">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{progress.game1Stars + progress.game2Stars} / 6</span>
          </div>

          {/* Quick Handbook Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenHandbook();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-teal-500"
            title="Open Quick Grammar Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Rules Guide</span>
          </button>

          {/* Accessibility toggles: Sound & Reduced Motion */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              onClick={onToggleMute}
              className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer ${
                isMuted ? 'text-rose-500 bg-rose-50' : ''
              }`}
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label={isMuted ? 'Unmute audio effects' : 'Mute audio effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleReducedMotion}
              className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer ${
                reducedMotion ? 'text-teal-700 bg-teal-50 font-bold' : ''
              }`}
              title={reducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
              aria-label="Toggle reduced motion"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
