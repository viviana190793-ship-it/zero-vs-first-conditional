import React, { useState } from 'react';
import { GameScreen, ConditionalType } from '../types/grammar';
import { 
  matchPairsRound1, 
  sortSentencesRound2, 
  trueFalseQuestionsRound3 
} from '../data/grammarData';
import { sounds } from '../utils/audio';
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';

interface Game1Props {
  onNavigate: (screen: GameScreen) => void;
  onCompleteGame: (stars: number, score: number) => void;
  savedStars: number;
  onMascotFeedback?: (mood: 'idle' | 'happy' | 'mistake' | 'thinking', message?: string) => void;
  onIncrementStreak?: () => void;
  onResetStreak?: () => void;
}

export const Game1MatchUp: React.FC<Game1Props> = ({
  onNavigate,
  onCompleteGame,
  savedStars,
  onMascotFeedback,
  onIncrementStreak,
  onResetStreak
}) => {
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
  const [roundStars, setRoundStars] = useState<[boolean, boolean, boolean]>([
    savedStars >= 1,
    savedStars >= 2,
    savedStars >= 3
  ]);

  // Streamlined question items for fast, punchy educational gameplay
  const round1Items = matchPairsRound1.slice(0, 4);
  const round2Items = sortSentencesRound2.slice(0, 4);
  const round3Items = trueFalseQuestionsRound3.slice(0, 3);

  // --- ROUND 1 STATE (Match Sentence to Category/Meaning) ---
  const [selectedSentenceId, setSelectedSentenceId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, ConditionalType>>({});
  const [round1Submitted, setRound1Submitted] = useState<boolean>(false);
  const [round1Errors, setRound1Errors] = useState<string[]>([]);

  // --- ROUND 2 STATE (Sentence Sorting into 2 Zones) ---
  const [sortPlacements, setSortPlacements] = useState<Record<string, ConditionalType | null>>({});
  const [round2Submitted, setRound2Submitted] = useState<boolean>(false);
  const [round2Feedback, setRound2Feedback] = useState<Record<string, boolean>>({});

  // --- ROUND 3 STATE (True or False) ---
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({});
  const [round3Submitted, setRound3Submitted] = useState<boolean>(false);

  // Score accumulator
  const [earnedPoints, setEarnedPoints] = useState<number>(0);

  // ----------------------------------------------------
  // ROUND 1 HANDLERS
  // ----------------------------------------------------
  const handleAssignCategory = (sentenceId: string, category: ConditionalType) => {
    sounds.playClick();
    setMatchedPairs(prev => ({
      ...prev,
      [sentenceId]: category
    }));
  };

  const handleCheckRound1 = () => {
    const errors: string[] = [];
    round1Items.forEach(item => {
      if (matchedPairs[item.id] !== item.category) {
        errors.push(item.id);
      }
    });

    setRound1Errors(errors);
    setRound1Submitted(true);

    if (errors.length === 0) {
      sounds.playCorrect();
      setRoundStars(prev => [true, prev[1], prev[2]]);
      setEarnedPoints(p => p + 100);
      onIncrementStreak?.();
      onMascotFeedback?.('happy', "Hoo-ray! All 4 sentences matched perfectly! You understand the difference between facts and predictions!");
    } else {
      sounds.playIncorrect();
      onResetStreak?.();
      onMascotFeedback?.('mistake', "Look closely at the highlighted mistake! Remember: Zero Conditional uses Present Simple in BOTH clauses for routines.");
    }
  };

  const handleResetRound1 = () => {
    sounds.playClick();
    setMatchedPairs({});
    setSelectedSentenceId(null);
    setRound1Submitted(false);
    setRound1Errors([]);
    onMascotFeedback?.('idle', "Ready for another try! Look for 'will' in the future clause.");
  };

  // ----------------------------------------------------
  // ROUND 2 HANDLERS
  // ----------------------------------------------------
  const handleSortSentence = (sentenceId: string, targetCategory: ConditionalType) => {
    sounds.playClick();
    setSortPlacements(prev => ({
      ...prev,
      [sentenceId]: targetCategory
    }));
  };

  const handleRemoveFromZone = (sentenceId: string) => {
    sounds.playClick();
    setSortPlacements(prev => ({
      ...prev,
      [sentenceId]: null
    }));
  };

  const handleCheckRound2 = () => {
    const feedback: Record<string, boolean> = {};
    let correctCount = 0;

    round2Items.forEach(item => {
      const isCorrect = sortPlacements[item.id] === item.correctCategory;
      feedback[item.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setRound2Feedback(feedback);
    setRound2Submitted(true);

    if (correctCount === round2Items.length) {
      sounds.playCorrect();
      setRoundStars(prev => [prev[0], true, prev[2]]);
      setEarnedPoints(p => p + 120);
      onIncrementStreak?.();
      onMascotFeedback?.('happy', "Super sorting! Every card is in its proper conditional zone! 🌟");
    } else {
      sounds.playIncorrect();
      onResetStreak?.();
      onMascotFeedback?.('mistake', "Careful! Check the cards in red. If it mentions a future event like 'tomorrow', it goes in First Conditional!");
    }
  };

  const handleResetRound2 = () => {
    sounds.playClick();
    setSortPlacements({});
    setRound2Submitted(false);
    setRound2Feedback({});
    onMascotFeedback?.('thinking', "Take your time! Ask: Is this a regular fact, or a future event?");
  };

  // ----------------------------------------------------
  // ROUND 3 HANDLERS
  // ----------------------------------------------------
  const handleSelectTF = (qId: string, value: boolean) => {
    sounds.playClick();
    setTfAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleCheckRound3 = () => {
    let allCorrect = true;
    round3Items.forEach(q => {
      if (tfAnswers[q.id] !== q.isTrue) {
        allCorrect = false;
      }
    });

    setRound3Submitted(true);

    if (allCorrect) {
      sounds.playFanfare();
      const updatedStars: [boolean, boolean, boolean] = [roundStars[0], roundStars[1], true];
      setRoundStars(updatedStars);
      const totalStarsCount = updatedStars.filter(Boolean).length;
      onIncrementStreak?.();
      onMascotFeedback?.('happy', "Sensational! You aced all the grammar rules in Game 1! Let's conquer Game 2!");
      onCompleteGame(totalStarsCount, earnedPoints + 150);
    } else {
      sounds.playIncorrect();
      onResetStreak?.();
      onMascotFeedback?.('mistake', "Watch out for the trick! Never use 'will' right after 'if' in standard conditional grammar.");
    }
  };

  const handleResetRound3 = () => {
    sounds.playClick();
    setTfAnswers({});
    setRound3Submitted(false);
  };

  const totalEarnedStars = roundStars.filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Mission Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-teal-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Mission 1 · Classroom Rules & Study Habits</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            Grammar Match-Up
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            “Read each sentence carefully. Match it with its meaning or place it in the correct conditional category. Complete all rounds to earn your stars!”
          </p>
        </div>

        {/* Stars and Round Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl">
            <span className="text-xs font-bold text-amber-800">Stars:</span>
            {[0, 1, 2].map((idx) => (
              <Star
                key={idx}
                className={`w-5 h-5 ${
                  roundStars[idx] ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {[1, 2, 3].map((r) => (
              <button
                key={r}
                onClick={() => {
                  sounds.playClick();
                  setCurrentRound(r as 1 | 2 | 3);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  currentRound === r
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Round {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROUND 1: MATCH THE SENTENCE                             */}
      {/* ======================================================== */}
      {currentRound === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase">Round 1 of 3</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Match the Sentence to its Conditional Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                For each sentence, select whether it expresses a <strong>Zero Conditional</strong> (habit/fact) or <strong>First Conditional</strong> (future prediction).
              </p>
            </div>
            {round1Submitted && round1Errors.length === 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Round 1 Complete! +1 Star</span>
              </div>
            )}
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {round1Items.map((item) => {
              const selectedCategory = matchedPairs[item.id];
              const isSubmitted = round1Submitted;
              const hasError = isSubmitted && selectedCategory !== item.category;
              const isCorrect = isSubmitted && selectedCategory === item.category;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                    hasError
                      ? 'border-rose-400 bg-rose-50/80 shadow-md'
                      : isCorrect
                      ? 'border-emerald-400 bg-emerald-50/80 shadow-md'
                      : 'border-teal-200 bg-white hover:border-teal-400 shadow-sm'
                  }`}
                >
                  <div>
                    {item.theme && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900 text-[11px] font-black mb-2">
                        {item.theme === 'classroom_rules' ? '🏫 Classroom Rule' : item.theme === 'study_habits' ? '📚 Study Habit' : '🎓 Future Teaching'}
                      </span>
                    )}
                    <div className="text-sm font-bold text-slate-900 leading-snug mb-3">
                      “{item.sentence}”
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isSubmitted}
                        onClick={() => handleAssignCategory(item.id, 'zero')}
                        className={`flex-1 py-2 px-3 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${
                          selectedCategory === 'zero'
                            ? 'btn-3d-teal text-white border-teal-700 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Zero Conditional
                      </button>
                      <button
                        disabled={isSubmitted}
                        onClick={() => handleAssignCategory(item.id, 'first')}
                        className={`flex-1 py-2 px-3 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${
                          selectedCategory === 'first'
                            ? 'btn-3d-sky text-white border-sky-700 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        First Conditional
                      </button>
                    </div>

                    {isSubmitted && (
                      <div className={`p-3 rounded-2xl text-xs space-y-1 ${
                        isCorrect ? 'text-emerald-900 bg-emerald-100/90 border border-emerald-300' : 'text-rose-900 bg-rose-100/90 border border-rose-300'
                      }`}>
                        <div className="font-extrabold flex items-center gap-1.5">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <span className="text-rose-600 font-bold">🦉 Ollie says:</span>
                          )}
                          <span>{item.categoryLabel}</span>
                        </div>
                        <div>{item.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!round1Submitted ? (
              <button
                onClick={handleCheckRound1}
                disabled={Object.keys(matchedPairs).length < round1Items.length}
                className={`w-full sm:w-auto px-7 py-3 font-display font-black text-sm rounded-2xl transition-all cursor-pointer ${
                  Object.keys(matchedPairs).length === round1Items.length
                    ? 'btn-3d-teal text-white shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                CHECK ANSWERS
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleResetRound1}
                  className="px-5 py-2.5 btn-3d-amber text-amber-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>TRY AGAIN</span>
                </button>
                {round1Errors.length === 0 && (
                  <button
                    onClick={() => {
                      sounds.playCorrect();
                      setCurrentRound(2);
                      onMascotFeedback?.('thinking', "Round 2: Drag and sort sentences into the Zero or First Conditional zones!");
                    }}
                    className="px-6 py-2.5 btn-3d-sky text-white font-display font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Round 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            
            <div className="text-xs text-slate-500 font-bold">
              Matched: {Object.keys(matchedPairs).length} / {round1Items.length}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ROUND 2: SORT THE SENTENCES                             */}
      {/* ======================================================== */}
      {currentRound === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase">Round 2 of 3</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Sort Sentences into Conditional Zones
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Place each sentence card into the <strong>ZERO CONDITIONAL</strong> zone (habits & facts) or the <strong>FIRST CONDITIONAL</strong> zone (future possibilities).
              </p>
            </div>
            {round2Submitted && Object.values(round2Feedback).every(Boolean) && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Round 2 Complete! +1 Star</span>
              </div>
            )}
          </div>

          {/* Unsorted Deck */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center justify-between">
              <span>Sentence Card Deck (Click to assign):</span>
              <span className="text-slate-500 font-bold">
                {round2Items.filter(s => !sortPlacements[s.id]).length} remaining in deck
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {round2Items.map((item) => {
                const assignedZone = sortPlacements[item.id];
                if (assignedZone) return null; // already sorted

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between gap-3 hover:border-teal-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-850">
                        {item.theme === 'classroom_rules' ? '🏫 Classroom Rule' : item.theme === 'study_habits' ? '📚 Study Habit' : '🎓 Teaching Scenario'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase">{item.context}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">“{item.sentence}”</div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleSortSentence(item.id, 'zero')}
                        className="px-3 py-1.5 text-xs font-black btn-3d-teal text-white rounded-xl cursor-pointer"
                      >
                        → Zero Zone
                      </button>
                      <button
                        onClick={() => handleSortSentence(item.id, 'first')}
                        className="px-3 py-1.5 text-xs font-black btn-3d-sky text-white rounded-xl cursor-pointer"
                      >
                        → First Zone
                      </button>
                    </div>
                  </div>
                );
              })}
              {round2Items.filter(s => !sortPlacements[s.id]).length === 0 && (
                <div className="col-span-full py-4 text-center text-xs font-extrabold text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200">
                  All sentence cards have been placed! Click "CHECK ANSWERS" below.
                </div>
              )}
            </div>
          </div>

          {/* Two Sorting Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Zone A: ZERO CONDITIONAL */}
            <div className="p-5 rounded-3xl bg-teal-50/70 border-3 border-teal-300 min-h-[220px] flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-black text-teal-950 text-lg flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-black">0</span>
                    ZERO CONDITIONAL ZONE
                  </h3>
                  <span className="text-xs font-bold text-teal-800">General Truths & Rules</span>
                </div>

                <div className="space-y-2.5">
                  {round2Items.filter(s => sortPlacements[s.id] === 'zero').map(item => {
                    const isCorrect = round2Submitted ? round2Feedback[item.id] : null;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl bg-white border-2 shadow-xs transition-all flex flex-col justify-between ${
                          isCorrect === true
                            ? 'border-emerald-400 bg-emerald-50/50'
                            : isCorrect === false
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-teal-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-800">
                            “{item.sentence}”
                          </span>
                          {!round2Submitted && (
                            <button
                              onClick={() => handleRemoveFromZone(item.id)}
                              className="text-xs text-slate-400 hover:text-rose-500 font-black shrink-0 cursor-pointer p-1"
                              title="Return to deck"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {round2Submitted && (
                          <div className={`mt-2 p-2.5 rounded-xl text-xs space-y-0.5 ${
                            isCorrect ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300' : 'bg-rose-100/90 text-rose-900 border border-rose-300'
                          }`}>
                            <div className="font-bold flex items-center gap-1">
                              {isCorrect ? '✔ Correct Zone' : '🦉 Ollie: Needs Attention'}
                            </div>
                            <div>{item.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {round2Items.filter(s => sortPlacements[s.id] === 'zero').length === 0 && (
                    <div className="h-28 flex items-center justify-center text-xs font-bold text-teal-700/60 italic border-2 border-dashed border-teal-300 rounded-2xl">
                      Assign Zero Conditional cards here
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Zone B: FIRST CONDITIONAL */}
            <div className="p-5 rounded-3xl bg-sky-50/70 border-3 border-sky-300 min-h-[220px] flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-black text-sky-950 text-lg flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-600 text-white text-xs flex items-center justify-center font-black">1</span>
                    FIRST CONDITIONAL ZONE
                  </h3>
                  <span className="text-xs font-bold text-sky-800">Future Possibilities</span>
                </div>

                <div className="space-y-2.5">
                  {round2Items.filter(s => sortPlacements[s.id] === 'first').map(item => {
                    const isCorrect = round2Submitted ? round2Feedback[item.id] : null;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl bg-white border-2 shadow-xs transition-all flex flex-col justify-between ${
                          isCorrect === true
                            ? 'border-emerald-400 bg-emerald-50/50'
                            : isCorrect === false
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-sky-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-800">
                            “{item.sentence}”
                          </span>
                          {!round2Submitted && (
                            <button
                              onClick={() => handleRemoveFromZone(item.id)}
                              className="text-xs text-slate-400 hover:text-rose-500 font-black shrink-0 cursor-pointer p-1"
                              title="Return to deck"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {round2Submitted && (
                          <div className={`mt-2 p-2.5 rounded-xl text-xs space-y-0.5 ${
                            isCorrect ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300' : 'bg-rose-100/90 text-rose-900 border border-rose-300'
                          }`}>
                            <div className="font-bold flex items-center gap-1">
                              {isCorrect ? '✔ Correct Zone' : '🦉 Ollie: Needs Attention'}
                            </div>
                            <div>{item.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {round2Items.filter(s => sortPlacements[s.id] === 'first').length === 0 && (
                    <div className="h-28 flex items-center justify-center text-xs font-bold text-sky-700/60 italic border-2 border-dashed border-sky-300 rounded-2xl">
                      Assign First Conditional cards here
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!round2Submitted ? (
              <button
                onClick={handleCheckRound2}
                disabled={Object.values(sortPlacements).filter(Boolean).length < round2Items.length}
                className={`w-full sm:w-auto px-7 py-3 font-display font-black text-sm rounded-2xl transition-all cursor-pointer ${
                  Object.values(sortPlacements).filter(Boolean).length === round2Items.length
                    ? 'btn-3d-sky text-white shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                CHECK ANSWERS
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleResetRound2}
                  className="px-5 py-2.5 btn-3d-amber text-amber-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>TRY AGAIN</span>
                </button>
                {Object.values(round2Feedback).every(Boolean) && (
                  <button
                    onClick={() => {
                      sounds.playCorrect();
                      setCurrentRound(3);
                      onMascotFeedback?.('thinking', "Round 3: Quick True or False rules test!");
                    }}
                    className="px-6 py-2.5 btn-3d-teal text-white font-display font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Round 3</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            
            <div className="text-xs text-slate-500 font-bold">
              Sorted: {Object.values(sortPlacements).filter(Boolean).length} / {round2Items.length}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ROUND 3: TRUE OR FALSE                                  */}
      {/* ======================================================== */}
      {currentRound === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase">Round 3 of 3</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                True or False Grammar Flash
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Evaluate each grammar rule statement and decide whether it is True or False.
              </p>
            </div>
            {round3Submitted && roundStars[2] && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Round 3 Complete! +1 Star</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {round3Items.map((q, idx) => {
              const selectedVal = tfAnswers[q.id];
              const isCorrect = round3Submitted ? selectedVal === q.isTrue : null;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-3xl border-2 transition-all ${
                    isCorrect === true
                      ? 'border-emerald-400 bg-emerald-50/70 shadow-sm'
                      : isCorrect === false
                      ? 'border-rose-400 bg-rose-50/70 shadow-sm'
                      : 'border-slate-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="font-bold text-slate-900 text-sm sm:text-base flex items-start gap-3">
                      <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-900 text-xs flex items-center justify-center font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{q.statement}</span>
                    </div>

                    {/* True / False 3D Buttons */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        disabled={round3Submitted}
                        onClick={() => handleSelectTF(q.id, true)}
                        className={`px-5 py-2.5 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${
                          selectedVal === true
                            ? 'btn-3d-teal text-white border-teal-700 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        TRUE
                      </button>
                      <button
                        disabled={round3Submitted}
                        onClick={() => handleSelectTF(q.id, false)}
                        className={`px-5 py-2.5 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${
                          selectedVal === false
                            ? 'btn-3d-coral text-white border-rose-800 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        FALSE
                      </button>
                    </div>
                  </div>

                  {round3Submitted && (
                    <div className={`mt-3 p-3 rounded-2xl text-xs space-y-1 ${
                      isCorrect ? 'bg-emerald-100/90 text-emerald-950 border border-emerald-300' : 'bg-rose-100/90 text-rose-950 border border-rose-300'
                    }`}>
                      <div className="font-extrabold flex items-center gap-1.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="text-rose-600 font-bold">🦉 Ollie's Rule Explanation:</span>
                        )}
                        <span>{isCorrect ? 'Correct!' : 'Grammar Correction'}</span>
                      </div>
                      <div>{q.explanation}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!round3Submitted ? (
              <button
                onClick={handleCheckRound3}
                disabled={Object.keys(tfAnswers).length < round3Items.length}
                className={`w-full sm:w-auto px-7 py-3 font-display font-black text-sm rounded-2xl transition-all cursor-pointer ${
                  Object.keys(tfAnswers).length === round3Items.length
                    ? 'btn-3d-purple text-white shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                CHECK ANSWERS
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleResetRound3}
                  className="px-5 py-2.5 btn-3d-amber text-amber-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>TRY AGAIN</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playFanfare();
                    onNavigate('game2');
                    onMascotFeedback?.('happy', "Hoo-ray! Welcome to Game 2: Complete & Escape the classroom!");
                  }}
                  className="px-6 py-2.5 btn-3d-teal text-white font-display font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Game 2: Complete & Escape</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="text-xs text-slate-500 font-bold">
              Answered: {Object.keys(tfAnswers).length} / {round3Items.length}
            </div>
          </div>
        </div>
      )}

      {/* Mission 1 Completion Banner */}
      {totalEarnedStars === 3 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-teal-500 to-sky-500 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl">
              ★
            </div>
            <div>
              <h3 className="font-display font-black text-xl">Mission 1 Mastered!</h3>
              <p className="text-xs text-teal-50">
                You earned all 3 stars in Grammar Match-Up! Proceed to Mission 2 to unlock the escape room.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playFanfare();
              onNavigate('game2');
            }}
            className="px-6 py-3 bg-white text-slate-900 font-display font-bold text-sm rounded-2xl shadow-md hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
          >
            Start Mission 2 →
          </button>
        </div>
      )}

    </div>
  );
};
