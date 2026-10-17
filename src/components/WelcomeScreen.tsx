import React, { useState } from 'react';
import { GameScreen, UserProgress } from '../types/grammar';
import { educationalThemes } from '../data/grammarData';
import { sounds } from '../utils/audio';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  KeyRound, 
  Star, 
  Award,
  CheckCircle2,
  BookOpen,
  GraduationCap
} from 'lucide-react';

interface WelcomeScreenProps {
  onNavigate: (screen: GameScreen) => void;
  progress: UserProgress;
  onUpdatePlayerName: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigate,
  progress,
  onUpdatePlayerName
}) => {
  const [nameInput, setNameInput] = useState(progress.playerName || 'Future Teacher Alex');
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState<string>('classroom_rules');

  const handleStart = () => {
    sounds.playCorrect();
    if (nameInput.trim()) {
      onUpdatePlayerName(nameInput.trim());
    }
    if (progress.knowledgeCheckCompleted) {
      onNavigate('game1');
    } else {
      onNavigate('learn');
    }
  };

  const handleCardClick = (screen: GameScreen) => {
    sounds.playClick();
    onNavigate(screen);
  };

  const totalStars = progress.game1Stars + progress.game2Stars;
  const currentTheme = educationalThemes.find(t => t.id === activeThemeId) || educationalThemes[0];

  return (
    <div className="min-w-full pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-sky-50/50 to-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Title, Subtitle, Message & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Educational Subtitle */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/90 border border-teal-300 text-teal-900 text-xs sm:text-sm font-extrabold shadow-xs">
                <GraduationCap className="w-4 h-4 text-teal-700" />
                <span>CEFR A2–B1 · English Teacher Training</span>
              </div>

              {/* 3D-Style Illuminated Title */}
              <div className="space-y-3">
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 title-3d-illuminated select-none">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-400 drop-shadow-md">
                    GRAMMAR QUEST
                  </span>
                </h1>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-sky-600 to-indigo-700 tracking-tight">
                  Master the Zero and First Conditional!
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs font-bold text-slate-600">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800">🏫 Classroom Rules</span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900">📚 Study Habits</span>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900">🎓 Future Teaching</span>
                </div>
              </div>

              {/* Welcome Message with Ollie the Owl Mascot */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-teal-50 to-sky-50 border-2 border-amber-300 shadow-md flex items-center gap-4 text-left">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-sm animate-subtle-float bg-purple-100">
                  <img
                    src="/src/assets/images/mascot_grammar_owl_1792207846289.jpg"
                    alt="Ollie the Owl Assistant"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                    <span>Ollie Your Grammar Mascot</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed mt-0.5">
                    “Welcome, Grammar Explorer! Learn the rules, solve exciting challenges, earn stars, and become a Grammar Champion!”
                  </p>
                </div>
              </div>

              {/* Player Name Tag */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-3 p-2 bg-white/90 backdrop-blur-xs rounded-2xl border-2 border-teal-200 shadow-sm">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-teal-300 shrink-0">
                  <img
                    src="/src/assets/images/teacher_avatar_alex_1792204395572.jpg"
                    alt="Teacher Alex Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-2.5 py-1 text-sm font-bold border-2 border-teal-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Your Explorer Name"
                      maxLength={24}
                    />
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        onUpdatePlayerName(nameInput.trim() || 'Future Teacher Alex');
                      }}
                      className="px-3 py-1 text-xs font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="font-bold text-slate-900">{nameInput}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-xs text-teal-600 hover:text-teal-800 underline font-bold cursor-pointer"
                    >
                      (edit name)
                    </button>
                  </div>
                )}
              </div>

              {/* Prominent Action 3D Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={handleStart}
                  className="w-full sm:w-auto px-8 py-4 btn-3d-teal text-white font-display font-black text-lg rounded-2xl flex items-center justify-center gap-3 cursor-pointer group shadow-lg"
                >
                  <span>START YOUR ADVENTURE!</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onNavigate('learn');
                  }}
                  className="w-full sm:w-auto px-6 py-4 btn-3d-amber text-amber-950 font-display font-black text-base rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <BookOpen className="w-4 h-4 text-amber-800" />
                  <span>Grammar Rules Zone</span>
                </button>
              </div>

              {/* Quick stats indicator */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="text-slate-800 tabular-nums">{totalStars} / 6 Stars</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span className="text-slate-800 tabular-nums">{progress.totalScore} Points</span>
                </div>
                {progress.game1Completed && progress.game2Completed && (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Diploma Ready!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Hero Illustration Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-teal-100 ring-1 ring-slate-200/80 group">
                <img
                  src="/src/assets/images/hero_grammar_quest_1792204394162.jpg"
                  alt="Grammar Quest Classroom Adventure"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Interactive Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-md flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold">
                      GQ
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Grammar Expedition</div>
                      <div className="text-slate-500 text-[11px]">A2–B1 Educational Context</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-lg text-[11px]">
                    2 Fast Games
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* EDUCATIONAL THEMES SHOWCASE (Normas del aula, Hábitos de estudio, Escenarios futuros) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl border-2 border-teal-200 shadow-md p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Real Educational Context · Contexto Educativo</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              3 Didactic Classroom Themes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Conditionals are not just grammar formulas! See how they describe real classroom life, study routines, and your future as an English teacher.
            </p>
          </div>

          {/* Theme Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {educationalThemes.map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveThemeId(theme.id);
                }}
                className={`px-4 py-2.5 rounded-2xl font-display font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeThemeId === theme.id
                    ? 'bg-teal-600 text-white shadow-md scale-103'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{theme.icon}</span>
                <span>{theme.title}</span>
                <span className="text-[11px] opacity-80">({theme.spanishTitle})</span>
              </button>
            ))}
          </div>

          {/* Active Theme Didactic Showcase Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gradient-to-br from-slate-50 to-teal-50/40 rounded-2xl p-5 sm:p-6 border border-teal-100">
            <div className="md:col-span-5 rounded-2xl overflow-hidden border-2 border-teal-200 shadow-md aspect-[4/3] bg-teal-100">
              <img
                src={currentTheme.image}
                alt={currentTheme.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900 text-xs font-black">
                  <span>{currentTheme.conditionalFocus}</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {currentTheme.title} <span className="text-slate-500 text-sm font-semibold">({currentTheme.spanishTitle})</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {currentTheme.description}
                </p>
              </div>

              {/* Examples in this context */}
              <div className="space-y-2">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Didactic Examples in Simple A2 English:
                </div>
                {currentTheme.examples.map((ex, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-xl border border-teal-200/80 shadow-xs flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-black shrink-0 mt-0.5">
                      {ex.type === 'zero' ? 'Zero Cond.' : '1st Cond.'}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {ex.sentence}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {ex.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Cards Grid - 2 Fast, Engaging Games */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <span>Fast & Focused · CEFR A2-B1</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Choose Your Adventure Game
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Two dynamic, fast-paced games packed with instant feedback, tactile 3D cards, and Ollie's learning tips!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Game 1 Card */}
          <div 
            onClick={() => handleCardClick('game1')}
            className="group relative bg-white rounded-3xl p-7 border-2 border-teal-200 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < progress.game1Stars
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs font-black text-teal-600 tracking-wider uppercase">
                Game 1 · Quick Match & Sorter
              </div>
              <h3 className="font-display text-2xl font-black text-slate-900 mt-1 mb-2 group-hover:text-teal-600 transition-colors">
                Fast Grammar Match-Up
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Match classroom rules and study habits to Zero or First Conditional, sort cards into animated drop zones, and answer rapid True/False questions!
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700">3 Fast Rounds:</span>
                <span>Match Pairs</span>
                <span>·</span>
                <span>Sort Cards</span>
                <span>·</span>
                <span>True/False</span>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between text-sm font-extrabold text-teal-700">
              <span className="btn-3d-teal px-4 py-2 text-white rounded-xl text-xs">
                {progress.game1Completed ? 'Play Again (Game 1)' : 'Start Game 1 →'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">~3 mins</span>
            </div>
          </div>

          {/* Game 2 Card */}
          <div 
            onClick={() => handleCardClick('game2')}
            className="group relative bg-white rounded-3xl p-7 border-2 border-sky-200 hover:border-sky-500 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <KeyRound className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < progress.game2Stars
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs font-black text-sky-600 tracking-wider uppercase">
                Game 2 · Escape Room Mystery
              </div>
              <h3 className="font-display text-2xl font-black text-slate-900 mt-1 mb-2 group-hover:text-sky-600 transition-colors">
                Complete & Escape
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Help unlock the teacher's classroom door! Complete missing verbs in classroom scenarios, fix student mistakes, and enter the secret keypad code.
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700">3 Challenges:</span>
                <span>Fill Verbs</span>
                <span>·</span>
                <span>Fix Mistakes</span>
                <span>·</span>
                <span>Keypad Lock</span>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between text-sm font-extrabold text-sky-700">
              <span className="btn-3d-sky px-4 py-2 text-white rounded-xl text-xs">
                {progress.game2Completed ? 'Play Again (Game 2)' : 'Start Game 2 →'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">~4 mins</span>
            </div>
          </div>

        </div>

        {/* Live Scoreboard & Diploma Banner */}
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-amber-100 via-teal-100 to-indigo-100 border-2 border-amber-300 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center shadow-md text-amber-950 shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-display font-black text-slate-900 text-lg">
                Scoreboard & Teacher Certification
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Complete both games with high accuracy to climb the leaderboard and unlock your printable diploma!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('certificate');
              }}
              className="px-5 py-2.5 btn-3d-teal text-white font-display font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              My Certificate
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
