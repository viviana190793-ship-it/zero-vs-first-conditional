import React from 'react';
import { UserProgress } from '../types/grammar';
import { sounds } from '../utils/audio';
import { X, Trophy, Star, Flame, Target, Award, User, Sparkles } from 'lucide-react';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  streak: number;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  isOpen,
  onClose,
  progress,
  streak
}) => {
  if (!isOpen) return null;

  const totalStars = progress.game1Stars + progress.game2Stars;
  const userScore = progress.totalScore;

  // Mock class leaderboard containing real player + friendly classmate explorers
  const rawLeaderboard = [
    { name: 'Elena Ramos', score: 1120, stars: 6, streak: 14, isUser: false },
    { name: progress.playerName || 'Future Teacher Alex', score: userScore, stars: totalStars, streak: streak, isUser: true },
    { name: 'Lucas Meyer', score: 890, stars: 5, streak: 8, isUser: false },
    { name: 'Sofia Kim', score: 780, stars: 4, streak: 6, isUser: false },
    { name: 'Marcus Taylor', score: 650, stars: 3, streak: 4, isUser: false },
    { name: 'Chloe Dubois', score: 520, stars: 2, streak: 3, isUser: false }
  ];

  // Sort descending by score
  const leaderboard = rawLeaderboard.sort((a, b) => b.score - a.score);

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border-4 border-amber-300 shadow-2xl p-6 sm:p-8 space-y-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 shadow-sm flex items-center justify-center text-amber-950 font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Grammar Champions Board</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500">
                Live Class Scoreboard & Learning Milestones
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close scoreboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Player Key Stats Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100/60 border border-amber-200 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Score</span>
            </div>
            <div className="font-display font-black text-2xl text-amber-950 tabular-nums mt-0.5">
              {userScore}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-sky-100/60 border border-teal-200 text-center">
            <div className="flex items-center justify-center gap-1 text-teal-700 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Stars</span>
            </div>
            <div className="font-display font-black text-2xl text-teal-950 tabular-nums mt-0.5">
              {totalStars} / 6
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-100/60 border border-rose-200 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-700 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-600" />
              <span>Streak</span>
            </div>
            <div className="font-display font-black text-2xl text-rose-950 tabular-nums mt-0.5">
              {streak} 🔥
            </div>
          </div>
        </div>

        {/* Missions Progress Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Your Mission Breakdown:
          </div>
          
          <div className="flex items-center justify-between text-xs p-2.5 bg-white rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-800">Mission 1: Fast Match & Sort</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < progress.game1Stars ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs p-2.5 bg-white rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-800">Mission 2: Classroom Escape</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < progress.game2Stars ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
            <span>Class Rankings (CEFR A2-B1 Group):</span>
            <span className="text-[11px] text-slate-400 font-normal">Updated live</span>
          </div>

          <div className="space-y-1.5">
            {leaderboard.map((player, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={`${player.name}-${idx}`}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    player.isUser
                      ? 'bg-gradient-to-r from-teal-50 to-amber-50 border-teal-400 ring-2 ring-teal-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-display font-black text-xs ${
                      rank === 1
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : rank === 2
                        ? 'bg-slate-200 text-slate-700'
                        : rank === 3
                        ? 'bg-amber-700/20 text-amber-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {rank}
                    </div>

                    <div>
                      <div className="font-display font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {player.isUser && (
                          <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        <span>{player.stars} ★ Stars</span>
                        <span>·</span>
                        <span className="text-rose-600 font-semibold">{player.streak} Streak 🔥</span>
                      </div>
                    </div>
                  </div>

                  <div className="font-display font-black text-sm sm:text-base text-slate-800 tabular-nums">
                    {player.score} <span className="text-xs font-normal text-slate-500">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleClose}
            className="w-full py-3 btn-3d-amber text-amber-950 font-display font-black text-sm rounded-2xl cursor-pointer"
          >
            Back to Game Adventure!
          </button>
        </div>
      </div>
    </div>
  );
};
