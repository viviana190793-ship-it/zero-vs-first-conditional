import React, { useState } from 'react';
import { GameScreen } from '../types/grammar';
import { 
  fillInBlankQuestions, 
  errorCorrectionQuestions, 
  escapeRiddles 
} from '../data/grammarData';
import { sounds } from '../utils/audio';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface Game2Props {
  onNavigate: (screen: GameScreen) => void;
  onCompleteGame: (stars: number, score: number) => void;
  savedStars: number;
  onMascotFeedback?: (mood: 'idle' | 'happy' | 'mistake' | 'thinking', message?: string) => void;
  onIncrementStreak?: () => void;
  onResetStreak?: () => void;
}

export const Game2Escape: React.FC<Game2Props> = ({
  onNavigate,
  onCompleteGame,
  savedStars,
  onMascotFeedback,
  onIncrementStreak,
  onResetStreak
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C'>('A');
  const [challengeStars, setChallengeStars] = useState<[boolean, boolean, boolean]>([
    savedStars >= 1,
    savedStars >= 2,
    savedStars >= 3
  ]);

  // Streamlined question subsets for fast, punchy educational gameplay
  const fibItems = fillInBlankQuestions.slice(0, 4);
  const errItems = errorCorrectionQuestions.slice(0, 3);
  const escItems = escapeRiddles;

  // Hint tracker (shows hint without penalty)
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // --- CHALLENGE A: Fill in the Blanks State ---
  const [fibAnswers, setFibAnswers] = useState<Record<string, string>>({});
  const [fibSubmitted, setFibSubmitted] = useState<boolean>(false);
  const [fibResults, setFibResults] = useState<Record<string, boolean>>({});

  // --- CHALLENGE B: Fix the Mistake State ---
  const [errAnswers, setErrAnswers] = useState<Record<string, string>>({});
  const [errSubmitted, setErrSubmitted] = useState<boolean>(false);
  const [errResults, setErrResults] = useState<Record<string, boolean>>({});

  // --- CHALLENGE C: Digital Keypad Escape State ---
  const [riddleSelections, setRiddleSelections] = useState<Record<string, number | null>>({});
  const [enteredPasscode, setEnteredPasscode] = useState<string>('');
  const [doorUnlocked, setDoorUnlocked] = useState<boolean>(false);
  const [riddleSubmitted, setRiddleSubmitted] = useState<boolean>(false);

  // Score
  const [earnedScore, setEarnedScore] = useState<number>(0);

  // Calculate door unlock percentage
  let progressPct = 0;
  if (challengeStars[0]) progressPct += 34;
  if (challengeStars[1]) progressPct += 33;
  if (doorUnlocked || challengeStars[2]) progressPct = 100;

  // ------------------------------------------------
  // CHALLENGE A HANDLERS
  // ------------------------------------------------
  const handleSelectFib = (qId: string, option: string) => {
    sounds.playClick();
    setFibAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleCheckFib = () => {
    const results: Record<string, boolean> = {};
    let correctCount = 0;

    fibItems.forEach(q => {
      const isCorrect = fibAnswers[q.id] === q.correctAnswer;
      results[q.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setFibResults(results);
    setFibSubmitted(true);

    if (correctCount === fibItems.length) {
      sounds.playUnlock();
      setChallengeStars(prev => [true, prev[1], prev[2]]);
      setEarnedScore(s => s + 120);
      onIncrementStreak?.();
      onMascotFeedback?.('happy', "Lock 1 released! You chose the exact right verb tenses! 🔓");
    } else {
      sounds.playIncorrect();
      onResetStreak?.();
      onMascotFeedback?.('mistake', "Look at the red boxes! If the event is in the future ('later' or 'tomorrow'), use 'will'. If it's a general fact, use present simple.");
    }
  };

  const handleRetryFib = () => {
    sounds.playClick();
    setFibSubmitted(false);
    setFibResults({});
    onMascotFeedback?.('thinking', "Try again! Notice the time markers in the sentence.");
  };

  // ------------------------------------------------
  // CHALLENGE B HANDLERS
  // ------------------------------------------------
  const handleSelectErr = (qId: string, option: string) => {
    sounds.playClick();
    setErrAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleCheckErr = () => {
    const results: Record<string, boolean> = {};
    let correctCount = 0;

    errItems.forEach(q => {
      const isCorrect = errAnswers[q.id] === q.correctOption;
      results[q.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setErrResults(results);
    setErrSubmitted(true);

    if (correctCount === errItems.length) {
      sounds.playUnlock();
      setChallengeStars(prev => [prev[0], true, prev[2]]);
      setEarnedScore(s => s + 140);
      onIncrementStreak?.();
      onMascotFeedback?.('happy', "Lock 2 released! Outstanding error spotting! Future English teacher skills at work! 🎓");
    } else {
      sounds.playIncorrect();
      onResetStreak?.();
      onMascotFeedback?.('mistake', "Careful on the grammar rules! Never put 'will' in the if-clause, and remember base verbs follow 'will' without -s.");
    }
  };

  const handleRetryErr = () => {
    sounds.playClick();
    setErrSubmitted(false);
    setErrResults({});
    onMascotFeedback?.('thinking', "Inspect the error carefully: is it a comma rule, an extra 'will', or a subject-verb mismatch?");
  };

  // ------------------------------------------------
  // CHALLENGE C HANDLERS (ESCAPE DOOR KEYPAD)
  // ------------------------------------------------
  const handleSelectRiddle = (riddleId: string, optIndex: number, codeDigit: string) => {
    sounds.playClick();
    setRiddleSelections(prev => ({ ...prev, [riddleId]: optIndex }));

    // Auto-update keypad code display
    const currentCode = { ...riddleSelections, [riddleId]: optIndex };
    let code = '';
    escItems.forEach(r => {
      const chosenIdx = currentCode[r.id];
      if (chosenIdx !== undefined && chosenIdx !== null) {
        code += r.options[chosenIdx].codeDigit;
      } else {
        code += '__';
      }
    });
    setEnteredPasscode(code);
  };

  const handleAttemptDoorUnlock = () => {
    // Both riddles must be answered correctly
    const r1 = escItems[0];
    const r2 = escItems[1];

    const isR1Correct = riddleSelections[r1.id] !== null && r1.options[riddleSelections[r1.id]!].isCorrect;
    const isR2Correct = riddleSelections[r2.id] !== null && r2.options[riddleSelections[r2.id]!].isCorrect;

    setRiddleSubmitted(true);

    if (isR1Correct && isR2Correct) {
      sounds.playFanfare();
      setDoorUnlocked(true);
      const newStars: [boolean, boolean, boolean] = [challengeStars[0], challengeStars[1], true];
      setChallengeStars(newStars);
      onIncrementStreak?.();
      onMascotFeedback?.('happy', "HOO-RAY! 🚪✨ The classroom door unlocked! You solved the passcode and escaped like a true Grammar Champion!");
      onCompleteGame(newStars.filter(Boolean).length, earnedScore + 200);
    } else {
      sounds.playIncorrect();
      onResetStreak?.();
      onMascotFeedback?.('mistake', "Wrong passcode! One of your conditional choices has an error. Check the riddle clues!");
    }
  };

  const handleRetryRiddles = () => {
    sounds.playClick();
    setRiddleSubmitted(false);
    setDoorUnlocked(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Mission 2 Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <KeyRound className="w-4 h-4" />
            <span>Mission 2 · Grammar Escape Room</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            Complete & Escape
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            “Help the teacher unlock the classroom! Complete each sentence, correct grammar mistakes, and solve every puzzle to open the door.”
          </p>
        </div>

        {/* Stars and Door Status */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl">
            <span className="text-xs font-bold text-amber-800">Stars:</span>
            {[0, 1, 2].map((idx) => (
              <Star
                key={idx}
                className={`w-5 h-5 ${
                  challengeStars[idx] ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['A', 'B', 'C'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab);
                  setActiveHint(null);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Part {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Column Classroom Escape Stage: Door Visual on Left, Puzzle on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Classroom Door Visual & Progress (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col items-center space-y-5">
          <div className="w-full flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600">Door Lock Security:</span>
            <span className={`${doorUnlocked ? 'text-emerald-600' : 'text-sky-600'}`}>
              {progressPct}% Solved
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-500 ${
                doorUnlocked ? 'bg-emerald-500' : 'bg-gradient-to-r from-sky-400 to-teal-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Illustrated Door Frame */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner border-2 border-slate-300 bg-sky-950 group">
            <img
              src="/src/assets/images/classroom_escape_door_1792204393426.jpg"
              alt="Classroom Escape Door"
              className={`w-full h-full object-cover transition-all duration-700 ${
                doorUnlocked ? 'brightness-110 filter hue-rotate-15' : 'brightness-90'
              }`}
              referrerPolicy="no-referrer"
            />

            {/* Glowing Digital Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/25">
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border-2 border-sky-400/80 shadow-2xl text-center space-y-2 max-w-[220px]">
                <div className="flex items-center justify-center gap-2">
                  {doorUnlocked ? (
                    <Unlock className="w-6 h-6 text-emerald-400 animate-bounce" />
                  ) : (
                    <Lock className="w-6 h-6 text-sky-400" />
                  )}
                  <span className="text-xs font-mono font-bold text-sky-200 uppercase tracking-widest">
                    {doorUnlocked ? 'UNLOCKED' : 'SECURE LOCK'}
                  </span>
                </div>

                {/* Digital Keypad Display */}
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-sky-800 font-mono text-lg font-black text-emerald-400 tracking-widest">
                  {doorUnlocked ? '4 2 7 9' : enteredPasscode || '__ __'}
                </div>

                <div className="text-[10px] text-slate-300 font-sans">
                  {doorUnlocked
                    ? 'Door Opened! Freedom!'
                    : `Locks Released: ${challengeStars.filter(Boolean).length}/3`}
                </div>
              </div>
            </div>

            {/* Unlocked Confetti Banner */}
            {doorUnlocked && (
              <div className="absolute top-3 left-3 right-3 p-2 bg-emerald-600/95 text-white text-center text-xs font-extrabold rounded-xl shadow-lg animate-pulse">
                CLASSROOM UNLOCKED! MISSION ACCOMPLISHED!
              </div>
            )}
          </div>

          {/* Hint Card Box */}
          {activeHint ? (
            <div className="w-full p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Teacher Hint:</span>
              </div>
              <p>{activeHint}</p>
            </div>
          ) : (
            <div className="w-full p-3 bg-slate-50 rounded-xl text-center text-[11px] text-slate-500">
              Need a hint? Click the lightbulb on any question for a friendly clue!
            </div>
          )}
        </div>

        {/* Right Column: Active Challenge Content (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          
          {/* ======================================================== */}
          {/* CHALLENGE A: FILL IN THE BLANKS                         */}
          {/* ======================================================== */}
          {activeTab === 'A' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-sky-600 uppercase">Challenge A</span>
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    Fill in the Blanks: Choose the Correct Verb
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select the verb form that completes each Zero or First Conditional sentence.
                  </p>
                </div>
                {fibSubmitted && Object.values(fibResults).every(Boolean) && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lock Stage 1 Released!</span>
                  </div>
                )}
              </div>

              <div className="space-y-3.5">
                {fibItems.map((q, idx) => {
                  const selected = fibAnswers[q.id];
                  const isSubmitted = fibSubmitted;
                  const isCorrect = fibResults[q.id];

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-3xl border-2 transition-all ${
                        isSubmitted && isCorrect
                          ? 'border-emerald-400 bg-emerald-50/80 shadow-md'
                          : isSubmitted && !isCorrect
                          ? 'border-rose-400 bg-rose-50/80 shadow-md'
                          : 'border-slate-200 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="text-xs sm:text-sm text-slate-900 font-bold leading-relaxed">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-sky-600 font-black">{idx + 1}.</span>
                            {q.theme && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 text-[10px] font-black">
                                {q.theme === 'classroom_rules' ? '🏫 Classroom Rule' : q.theme === 'study_habits' ? '📚 Study Habit' : '🎓 Future Teaching'}
                              </span>
                            )}
                          </div>
                          {q.sentenceParts[0]}{' '}
                          <span className="inline-block px-3 py-1 mx-1 bg-sky-100 text-sky-950 font-black rounded-xl border border-sky-300">
                            {selected || '_______'}
                          </span>{' '}
                          {q.sentenceParts[1]}
                        </div>

                        <button
                          onClick={() => {
                            sounds.playClick();
                            setActiveHint(q.hint);
                            onMascotFeedback?.('thinking', `Hint for #${idx + 1}: ${q.hint}`);
                          }}
                          className="p-1.5 text-amber-500 hover:text-amber-700 bg-amber-50 rounded-xl cursor-pointer shrink-0"
                          title="Show Hint"
                          aria-label="Show teacher hint"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options */}
                      <div className="flex items-center gap-2.5">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            disabled={isSubmitted}
                            onClick={() => handleSelectFib(q.id, opt)}
                            className={`py-2 px-4 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${
                              selected === opt
                                ? 'btn-3d-sky text-white border-sky-700 shadow-md'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {isSubmitted && (
                        <div className={`mt-3 p-3 rounded-2xl text-xs space-y-0.5 ${
                          isCorrect ? 'bg-emerald-100/90 text-emerald-950 border border-emerald-300' : 'bg-rose-100/90 text-rose-950 border border-rose-300'
                        }`}>
                          <div className="font-extrabold flex items-center gap-1.5">
                            {isCorrect ? '✔ Perfect choice!' : '🦉 Ollie: Remember this rule'}
                          </div>
                          <div>{q.explanation}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {!fibSubmitted ? (
                  <button
                    onClick={handleCheckFib}
                    disabled={Object.keys(fibAnswers).length < fibItems.length}
                    className={`px-6 py-2.5 font-display font-black text-xs rounded-2xl transition-all cursor-pointer ${
                      Object.keys(fibAnswers).length === fibItems.length
                        ? 'btn-3d-sky text-white shadow-md'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    CHECK ANSWERS
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRetryFib}
                      className="px-4 py-2 btn-3d-amber text-amber-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>TRY AGAIN</span>
                    </button>
                    {Object.values(fibResults).every(Boolean) && (
                      <button
                        onClick={() => {
                          sounds.playCorrect();
                          setActiveTab('B');
                          setActiveHint(null);
                          onMascotFeedback?.('thinking', "Challenge B: Spot and fix the conditional grammar errors!");
                        }}
                        className="px-4 py-2 btn-3d-teal text-white font-display font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Fix the Mistake</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <span className="text-xs text-slate-500 font-bold">
                  {Object.keys(fibAnswers).length} / {fibItems.length} Selected
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CHALLENGE B: FIX THE MISTAKE                            */}
          {/* ======================================================== */}
          {activeTab === 'B' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-sky-600 uppercase">Challenge B</span>
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    Fix the Mistake: Spot & Correct Grammar Errors
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Each sentence has a typical error. Select the correct substitution to fix it.
                  </p>
                </div>
                {errSubmitted && Object.values(errResults).every(Boolean) && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lock Stage 2 Released!</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {errItems.map((q, idx) => {
                  const selected = errAnswers[q.id];
                  const isSubmitted = errSubmitted;
                  const isCorrect = errResults[q.id];

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-3xl border-2 transition-all ${
                        isSubmitted && isCorrect
                          ? 'border-emerald-400 bg-emerald-50/80 shadow-md'
                          : isSubmitted && !isCorrect
                          ? 'border-rose-400 bg-rose-50/80 shadow-md'
                          : 'border-slate-200 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-xs font-black text-slate-500">Error {idx + 1}:</span>
                            {q.theme && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black">
                                {q.theme === 'classroom_rules' ? '🏫 Classroom Rule' : q.theme === 'study_habits' ? '📚 Study Habit' : '🎓 Teaching Scenario'}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-xl border border-rose-300">
                            “{q.originalSentence}”
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setActiveHint(q.hint);
                            onMascotFeedback?.('thinking', `Hint for Error ${idx + 1}: ${q.hint}`);
                          }}
                          className="p-1.5 text-amber-500 hover:text-amber-700 bg-amber-50 rounded-xl cursor-pointer shrink-0"
                          title="Show Hint"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-slate-700 font-medium mb-2">
                        How should <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded">“{q.errorPart}”</strong> be corrected?
                      </div>

                      {/* Options */}
                      <div className="flex flex-wrap items-center gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            disabled={isSubmitted}
                            onClick={() => handleSelectErr(q.id, opt)}
                            className={`py-2 px-3.5 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${
                              selected === opt
                                ? 'btn-3d-sky text-white border-sky-700 shadow-md'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {isSubmitted && (
                        <div className={`mt-3 p-3 rounded-2xl text-xs space-y-1 ${
                          isCorrect ? 'bg-emerald-100/90 text-emerald-950 border border-emerald-300' : 'bg-rose-100/90 text-rose-950 border border-rose-300'
                        }`}>
                          <div className="font-extrabold flex items-center gap-1">
                            {isCorrect ? '✔ Corrected:' : '🦉 Ollie: Why this error occurs:'}
                            <span className="text-slate-900 font-bold ml-1">“{q.correctedSentence}”</span>
                          </div>
                          <div>{q.explanation}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {!errSubmitted ? (
                  <button
                    onClick={handleCheckErr}
                    disabled={Object.keys(errAnswers).length < errItems.length}
                    className={`px-6 py-2.5 font-display font-black text-xs rounded-2xl transition-all cursor-pointer ${
                      Object.keys(errAnswers).length === errItems.length
                        ? 'btn-3d-teal text-white shadow-md'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    CHECK ANSWERS
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRetryErr}
                      className="px-4 py-2 btn-3d-amber text-amber-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>TRY AGAIN</span>
                    </button>
                    {Object.values(errResults).every(Boolean) && (
                      <button
                        onClick={() => {
                          sounds.playCorrect();
                          setActiveTab('C');
                          setActiveHint(null);
                          onMascotFeedback?.('thinking', "Final Challenge: Solve the keypad riddle to unlock the classroom!");
                        }}
                        className="px-4 py-2 btn-3d-coral text-white font-display font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Final Step: Escape Keypad</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <span className="text-xs text-slate-500 font-bold">
                  {Object.keys(errAnswers).length} / {errItems.length} Corrected
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CHALLENGE C: ESCAPE PUZZLE KEYPAD                       */}
          {/* ======================================================== */}
          {activeTab === 'C' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase">Challenge C</span>
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    The Escape Passcode Riddle
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Solve the final two riddles to discover the 4-digit code and break open the classroom door!
                  </p>
                </div>
                {doorUnlocked && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlocked! +1 Star</span>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {escapeRiddles.map((riddle) => {
                  const selectedIdx = riddleSelections[riddle.id];

                  return (
                    <div key={riddle.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{riddle.prompt}</div>
                        <div className="text-xs text-sky-700 italic mt-0.5">{riddle.clue}</div>
                      </div>

                      <div className="space-y-2">
                        {riddle.options.map((opt, optIdx) => {
                          const isChosen = selectedIdx === optIdx;

                          return (
                            <button
                              key={optIdx}
                              disabled={doorUnlocked}
                              onClick={() => handleSelectRiddle(riddle.id, optIdx, opt.codeDigit)}
                              className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                isChosen
                                  ? 'bg-sky-600 text-white border-sky-600 font-semibold shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{opt.text}</span>
                              <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                                isChosen ? 'bg-sky-800 text-sky-100' : 'bg-slate-100 text-slate-600'
                              }`}>
                                Code: {opt.codeDigit}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {riddleSubmitted && selectedIdx !== null && (
                        <div className={`p-2.5 rounded-xl text-xs ${
                          riddle.options[selectedIdx].isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {riddle.options[selectedIdx].explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {!doorUnlocked ? (
                  <button
                    onClick={handleAttemptDoorUnlock}
                    disabled={Object.keys(riddleSelections).length < escItems.length}
                    className={`px-7 py-3 font-display font-black text-sm rounded-2xl transition-all cursor-pointer ${
                      Object.keys(riddleSelections).length === escItems.length
                        ? 'btn-3d-teal text-white shadow-xl'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    ENTER PASSCODE & UNLOCK DOOR
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleRetryRiddles}
                      className="px-4 py-2.5 btn-3d-amber text-amber-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Play Again</span>
                    </button>
                    <button
                      onClick={() => {
                        sounds.playFanfare();
                        onNavigate('certificate');
                        onMascotFeedback?.('happy', "Congratulations! You completed both games and earned your Teacher Certificate!");
                      }}
                      className="px-6 py-2.5 btn-3d-teal text-white font-display font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Claim Your Certificate & Score!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="text-sm font-mono font-black text-emerald-600 bg-slate-900 px-3 py-1 rounded-xl">
                  Code: {enteredPasscode || '____'}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
