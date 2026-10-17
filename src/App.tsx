import React, { useState, useEffect } from 'react';
import { GameScreen, UserProgress } from './types/grammar';
import { sounds } from './utils/audio';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GrammarZone } from './components/GrammarZone';
import { Game1MatchUp } from './components/Game1MatchUp';
import { Game2Escape } from './components/Game2Escape';
import { Game3FutureClassroom } from './components/Game3FutureClassroom';
import { GrammarHandbookModal } from './components/GrammarHandbookModal';
import { CertificateModal } from './components/CertificateModal';
import { MascotAssistant, MascotMood } from './components/MascotAssistant';
import { ScoreboardModal } from './components/ScoreboardModal';

const INITIAL_PROGRESS: UserProgress = {
  playerName: 'Future Teacher Alex',
  knowledgeCheckCompleted: false,
  game1Completed: false,
  game2Completed: false,
  game3Completed: false,
  game1Stars: 0,
  game2Stars: 0,
  game3Stars: 0,
  totalScore: 0,
  unlockedItems: ['teacher-podium']
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('welcome');
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mascot assistant mood & custom speech
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotMessage, setMascotMessage] = useState<string | null>(null);

  // Live streak counter
  const [streak, setStreak] = useState<number>(0);

  // Load progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('grammar_quest_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROGRESS;
  });

  // Save progress on change
  useEffect(() => {
    try {
      localStorage.setItem('grammar_quest_progress', JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  // Handle mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    sounds.isMuted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playClick();
    }
  };

  // Handle reduced motion
  const handleToggleReducedMotion = () => {
    sounds.playClick();
    setReducedMotion(prev => !prev);
  };

  const handleUpdatePlayerName = (name: string) => {
    setProgress(prev => ({ ...prev, playerName: name }));
  };

  const handleMascotFeedback = (mood: MascotMood, message?: string) => {
    setMascotMood(mood);
    if (message) {
      setMascotMessage(message);
    }
  };

  const handleIncrementStreak = () => {
    setStreak(s => s + 1);
  };

  const handleResetStreak = () => {
    setStreak(0);
  };

  const handleCompleteKnowledgeCheck = () => {
    setProgress(prev => ({
      ...prev,
      knowledgeCheckCompleted: true,
      totalScore: prev.totalScore + 50
    }));
  };

  const handleCompleteGame1 = (stars: number, score: number) => {
    setProgress(prev => ({
      ...prev,
      game1Completed: true,
      game1Stars: Math.max(prev.game1Stars, stars),
      totalScore: prev.totalScore + score
    }));
  };

  const handleCompleteGame2 = (stars: number, score: number) => {
    setProgress(prev => ({
      ...prev,
      game2Completed: true,
      game2Stars: Math.max(prev.game2Stars, stars),
      totalScore: prev.totalScore + score
    }));
  };

  const handleCompleteGame3 = (stars: number, score: number) => {
    setProgress(prev => ({
      ...prev,
      game3Completed: true,
      game3Stars: Math.max(prev.game3Stars, stars),
      totalScore: prev.totalScore + score
    }));
  };

  const handleUnlockItem = (itemId: string) => {
    setProgress(prev => {
      if (prev.unlockedItems.includes(itemId)) return prev;
      return {
        ...prev,
        unlockedItems: [...prev.unlockedItems, itemId],
        totalScore: prev.totalScore + 50
      };
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all game progress and stars?')) {
      sounds.playClick();
      setProgress(INITIAL_PROGRESS);
      setStreak(0);
      setMascotMood('idle');
      setMascotMessage(null);
      setCurrentScreen('welcome');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* Top Bar Contract Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setMascotMood('idle');
          setMascotMessage(null);
        }}
        progress={progress}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onOpenScoreboard={() => setIsScoreboardOpen(true)}
      />

      {/* Main Screen Body */}
      <main className="flex-1 w-full">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              setMascotMood('idle');
              setMascotMessage(null);
            }}
            progress={progress}
            onUpdatePlayerName={handleUpdatePlayerName}
          />
        )}

        {currentScreen === 'learn' && (
          <GrammarZone
            onNavigate={setCurrentScreen}
            knowledgeCheckCompleted={progress.knowledgeCheckCompleted}
            onCompleteKnowledgeCheck={handleCompleteKnowledgeCheck}
            onMascotFeedback={handleMascotFeedback}
          />
        )}

        {currentScreen === 'game1' && (
          <Game1MatchUp
            onNavigate={setCurrentScreen}
            onCompleteGame={handleCompleteGame1}
            savedStars={progress.game1Stars}
            onMascotFeedback={handleMascotFeedback}
            onIncrementStreak={handleIncrementStreak}
            onResetStreak={handleResetStreak}
          />
        )}

        {currentScreen === 'game2' && (
          <Game2Escape
            onNavigate={setCurrentScreen}
            onCompleteGame={handleCompleteGame2}
            savedStars={progress.game2Stars}
            onMascotFeedback={handleMascotFeedback}
            onIncrementStreak={handleIncrementStreak}
            onResetStreak={handleResetStreak}
          />
        )}

        {(currentScreen === 'game3' || currentScreen === 'classroom_view') && (
          <Game3FutureClassroom
            onNavigate={setCurrentScreen}
            onCompleteGame={handleCompleteGame3}
            savedStars={progress.game3Stars}
            unlockedItems={progress.unlockedItems}
            onUnlockItem={handleUnlockItem}
          />
        )}

        {currentScreen === 'certificate' && (
          <CertificateModal
            progress={progress}
            onNavigate={setCurrentScreen}
            onUpdatePlayerName={handleUpdatePlayerName}
          />
        )}
      </main>

      {/* Mascot Assistant Ollie (Always Available Coach) */}
      <MascotAssistant
        mood={mascotMood}
        customMessage={mascotMessage}
        onClearMessage={() => setMascotMessage(null)}
      />

      {/* Grammar Quick Handbook Modal */}
      <GrammarHandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      {/* Scoreboard / Leaderboard Modal */}
      <ScoreboardModal
        isOpen={isScoreboardOpen}
        onClose={() => setIsScoreboardOpen(false)}
        progress={progress}
        streak={streak}
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Grammar Quest</span>
            <span>·</span>
            <span>Zero & First Conditional Academy (CEFR A2–B1)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsScoreboardOpen(true)}
              className="hover:text-slate-900 font-bold transition-colors cursor-pointer text-amber-700"
            >
              Class Scoreboard
            </button>
            <button
              onClick={() => setIsHandbookOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Rules Handbook
            </button>
            <button
              onClick={() => setCurrentScreen('certificate')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              My Certificate
            </button>
            <button
              onClick={handleResetProgress}
              className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
