import React, { useState } from 'react';
import { GameScreen } from '../types/grammar';
import { 
  sentenceBuilderChallenges, 
  classroomDilemmas, 
  futureClassroomItems 
} from '../data/grammarData';
import { sounds } from '../utils/audio';
import { 
  School, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Monitor, 
  BookOpen, 
  Bot, 
  Tablet, 
  GraduationCap,
  Info,
  Check,
  X
} from 'lucide-react';

interface Game3Props {
  onNavigate: (screen: GameScreen) => void;
  onCompleteGame: (stars: number, score: number) => void;
  savedStars: number;
  unlockedItems: string[];
  onUnlockItem: (itemId: string) => void;
}

export const Game3FutureClassroom: React.FC<Game3Props> = ({
  onNavigate,
  onCompleteGame,
  savedStars,
  unlockedItems,
  onUnlockItem
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'dilemmas' | 'classroom'>('builder');
  
  const [stars, setStars] = useState<[boolean, boolean, boolean]>([
    savedStars >= 1,
    savedStars >= 2,
    savedStars >= 3
  ]);

  // --- CHALLENGE A: SENTENCE BUILDER STATE ---
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [builderSubmitted, setBuilderSubmitted] = useState<boolean>(false);
  const [builderCorrect, setBuilderCorrect] = useState<boolean | null>(null);
  const [builderCompletedList, setBuilderCompletedList] = useState<string[]>([]);

  // --- CHALLENGE B: TEACHER DILEMMAS STATE ---
  const [currentDilemmaIdx, setCurrentDilemmaIdx] = useState<number>(0);
  const [dilemmaSelections, setDilemmaSelections] = useState<Record<string, number | null>>({});
  const [dilemmaSubmitted, setDilemmaSubmitted] = useState<Record<string, boolean>>({});

  // Active item inspection in virtual classroom
  const [inspectedItemId, setInspectedItemId] = useState<string | null>(null);

  // ---------------------------------------------------------------------
  // CHALLENGE A HANDLERS
  // ---------------------------------------------------------------------
  const currentBuilder = sentenceBuilderChallenges[currentChallengeIdx];

  const handleAddWord = (word: string, indexInScrambled: number) => {
    sounds.playClick();
    setSelectedWords(prev => [...prev, word]);
  };

  const handleRemoveWord = (indexInSelected: number) => {
    sounds.playClick();
    setSelectedWords(prev => prev.filter((_, i) => i !== indexInSelected));
  };

  const handleCheckBuilderSentence = () => {
    // Reconstruct user's assembled sentence
    // Target sentence has punctuation at end, and maybe comma inside
    // We check if the sequence of words matches
    const constructed = selectedWords.join(' ').trim().toLowerCase();
    
    // Normalize target sentence for comparison (strip trailing period or comma for easy matching)
    const normalizedTarget = currentBuilder.targetSentence
      .replace(/[.,]/g, '')
      .trim()
      .toLowerCase();

    const normalizedConstructed = constructed.replace(/[.,]/g, '').trim();

    const isMatch = normalizedConstructed === normalizedTarget;

    setBuilderSubmitted(true);
    setBuilderCorrect(isMatch);

    if (isMatch) {
      sounds.playCorrect();
      if (!builderCompletedList.includes(currentBuilder.id)) {
        const nextList = [...builderCompletedList, currentBuilder.id];
        setBuilderCompletedList(nextList);
        
        // Auto-unlock classroom items sequentially
        if (nextList.length === 2 && !unlockedItems.includes('smart-board')) {
          onUnlockItem('smart-board');
        }
        if (nextList.length === 4 && !unlockedItems.includes('reading-nook')) {
          onUnlockItem('reading-nook');
        }
        if (nextList.length >= 6) {
          setStars(prev => [true, prev[1], prev[2]]);
          if (!unlockedItems.includes('digital-tablets')) {
            onUnlockItem('digital-tablets');
          }
        }
      }
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNextBuilderChallenge = () => {
    sounds.playClick();
    if (currentChallengeIdx < sentenceBuilderChallenges.length - 1) {
      setCurrentChallengeIdx(c => c + 1);
      setSelectedWords([]);
      setBuilderSubmitted(false);
      setBuilderCorrect(null);
    } else {
      // Completed all builder challenges
      setActiveTab('dilemmas');
    }
  };

  const handleResetCurrentBuilder = () => {
    sounds.playClick();
    setSelectedWords([]);
    setBuilderSubmitted(false);
    setBuilderCorrect(null);
  };

  // Calculate available tiles for current challenge
  // Count frequencies in scrambled vs selected to prevent reuse
  const wordFrequencyMap: Record<string, number> = {};
  currentBuilder.scrambledWords.forEach(w => {
    wordFrequencyMap[w] = (wordFrequencyMap[w] || 0) + 1;
  });
  selectedWords.forEach(w => {
    if (wordFrequencyMap[w]) wordFrequencyMap[w]--;
  });

  // ---------------------------------------------------------------------
  // CHALLENGE B HANDLERS (DILEMMAS)
  // ---------------------------------------------------------------------
  const currentDilemma = classroomDilemmas[currentDilemmaIdx];

  const handleSelectDilemmaOption = (optIdx: number) => {
    sounds.playClick();
    setDilemmaSelections(prev => ({
      ...prev,
      [currentDilemma.id]: optIdx
    }));
  };

  const handleCheckDilemma = () => {
    const selectedIdx = dilemmaSelections[currentDilemma.id];
    if (selectedIdx === undefined || selectedIdx === null) return;

    const isBest = currentDilemma.options[selectedIdx].isBestChoice;
    setDilemmaSubmitted(prev => ({ ...prev, [currentDilemma.id]: true }));

    if (isBest) {
      sounds.playUnlock();
      onUnlockItem(currentDilemma.unlockedItem.id);

      // Check if all dilemmas solved
      const newDilemmasSolved = Object.keys(dilemmaSubmitted).length + 1;
      if (newDilemmasSolved >= classroomDilemmas.length) {
        sounds.playFanfare();
        const updatedStars: [boolean, boolean, boolean] = [stars[0], true, true];
        setStars(updatedStars);
        if (!unlockedItems.includes('teacher-podium')) {
          onUnlockItem('teacher-podium');
        }
        onCompleteGame(3, 400);
      }
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNextDilemma = () => {
    sounds.playClick();
    if (currentDilemmaIdx < classroomDilemmas.length - 1) {
      setCurrentDilemmaIdx(idx => idx + 1);
    } else {
      setActiveTab('classroom');
    }
  };

  // Helper icon renderer
  const renderItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Tablet': return <Tablet className="w-5 h-5" />;
      default: return <GraduationCap className="w-5 h-5" />;
    }
  };

  const totalEarnedStars = stars.filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <School className="w-4 h-4" />
            <span>Mission 3 · Future English Teacher Studio</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            Build the Future Classroom
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            “Become a future English teacher! Build correct conditional sentences, solve classroom situations, and create your dream learning environment.”
          </p>
        </div>

        {/* Stars and Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl">
            <span className="text-xs font-bold text-amber-800">Stars:</span>
            {[0, 1, 2].map((idx) => (
              <Star
                key={idx}
                className={`w-5 h-5 ${
                  stars[idx] ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('builder');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'builder'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sentence Builder
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('dilemmas');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dilemmas'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teacher Dilemmas
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('classroom');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'classroom'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classroom View ({unlockedItems.length}/6)
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHALLENGE A: SENTENCE BUILDER                            */}
      {/* ======================================================== */}
      {activeTab === 'builder' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase">
                Challenge A · Sentence {currentChallengeIdx + 1} of {sentenceBuilderChallenges.length}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Arrange the Shuffled Word Tiles
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Click tiles to place them into the sentence line. Click words in the sentence to return them to the tray.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Progress:</span>
              <div className="flex items-center gap-1">
                {sentenceBuilderChallenges.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      builderCompletedList.includes(sentenceBuilderChallenges[i].id)
                        ? 'bg-emerald-500'
                        : i === currentChallengeIdx
                        ? 'bg-indigo-600 ring-2 ring-indigo-200'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Constructed Sentence Display Area */}
          <div className="min-h-[110px] p-5 rounded-2xl bg-indigo-50/40 border-2 border-dashed border-indigo-200 flex flex-wrap items-center gap-2.5">
            {selectedWords.length === 0 ? (
              <span className="text-sm text-indigo-400 italic">
                Click word tiles from the tray below to build your sentence...
              </span>
            ) : (
              selectedWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  disabled={builderSubmitted && builderCorrect === true}
                  onClick={() => handleRemoveWord(idx)}
                  className="px-3.5 py-2 bg-white text-indigo-950 font-display font-bold text-sm rounded-xl border border-indigo-300 shadow-xs hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer group flex items-center gap-1.5"
                  title="Click to remove"
                >
                  <span>{word}</span>
                  <X className="w-3 h-3 text-slate-400 group-hover:text-rose-500" />
                </button>
              ))
            )}
          </div>

          {/* Scrambled Word Tile Tray */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
              Available Word Tiles:
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {currentBuilder.scrambledWords.map((word, idx) => {
                const remaining = wordFrequencyMap[word] || 0;
                const isExhausted = remaining <= 0;

                return (
                  <button
                    key={`${word}-${idx}`}
                    disabled={isExhausted || (builderSubmitted && builderCorrect === true)}
                    onClick={() => handleAddWord(word, idx)}
                    className={`px-4 py-2.5 rounded-xl font-display font-bold text-sm transition-all cursor-pointer ${
                      isExhausted
                        ? 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
                        : 'bg-white text-slate-800 border border-slate-300 hover:border-indigo-500 hover:text-indigo-700 hover:shadow-xs active:scale-95'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Teacher Insight */}
          {builderSubmitted && (
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
              builderCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="font-bold flex items-center gap-2">
                {builderCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Sentence Built Successfully!</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-rose-600" />
                    <span>Not quite right yet. Check word order and punctuation!</span>
                  </>
                )}
              </div>
              <p>{currentBuilder.explanation}</p>
              <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-800 flex items-start gap-1.5 font-medium">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Teacher Pedagogical Note: {currentBuilder.teachingTip}</span>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!builderSubmitted || builderCorrect === false ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCheckBuilderSentence}
                  disabled={selectedWords.length < 3}
                  className={`px-6 py-2.5 font-display font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer ${
                    selectedWords.length >= 3
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  CHECK SENTENCE
                </button>
                <button
                  onClick={handleResetCurrentBuilder}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Tiles</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleNextBuilderChallenge}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {currentChallengeIdx < sentenceBuilderChallenges.length - 1
                    ? 'Next Sentence Builder Challenge'
                    : 'Proceed to Teacher Dilemmas'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="text-xs text-slate-500">
              Completed: {builderCompletedList.length} / {sentenceBuilderChallenges.length}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHALLENGE B: TEACHER DILEMMAS SIMULATION                 */}
      {/* ======================================================== */}
      {activeTab === 'dilemmas' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase">
                Challenge B · Dilemma {currentDilemmaIdx + 1} of {classroomDilemmas.length}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {currentDilemma.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Apply your pedagogical judgment and select the most accurate conditional sentence.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Scenario:</span>
              <div className="flex items-center gap-1">
                {classroomDilemmas.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      dilemmaSubmitted[classroomDilemmas[i].id]
                        ? 'bg-emerald-500'
                        : i === currentDilemmaIdx
                        ? 'bg-teal-600 ring-2 ring-teal-200'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scenario Situation Card */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200">
            <div className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-1">
              Teaching Scenario:
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              “{currentDilemma.situation}”
            </p>
          </div>

          {/* Dilemma Option Choices */}
          <div className="space-y-3">
            {currentDilemma.options.map((opt, optIdx) => {
              const isSelected = dilemmaSelections[currentDilemma.id] === optIdx;
              const isSubmitted = dilemmaSubmitted[currentDilemma.id];

              let borderClass = 'border-slate-200 bg-white hover:border-slate-300';
              if (isSelected) {
                borderClass = 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500';
              }
              if (isSubmitted) {
                if (opt.isBestChoice) {
                  borderClass = 'border-emerald-400 bg-emerald-50 text-emerald-950 font-medium';
                } else if (isSelected && !opt.isBestChoice) {
                  borderClass = 'border-rose-400 bg-rose-50 text-rose-950';
                }
              }

              return (
                <div
                  key={optIdx}
                  onClick={() => !isSubmitted && handleSelectDilemmaOption(optIdx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${borderClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm text-slate-900 leading-relaxed">
                      {opt.text}
                    </div>
                  </div>

                  {isSubmitted && (
                    <div className={`mt-2.5 p-2 rounded-xl text-xs ${
                      opt.isBestChoice ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {opt.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Unlocked Item Preview */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              {renderItemIcon(currentDilemma.unlockedItem.icon)}
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-900">
                Reward on completion: {currentDilemma.unlockedItem.name}
              </div>
              <div className="text-[11px] text-slate-600">
                {currentDilemma.unlockedItem.description}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!dilemmaSubmitted[currentDilemma.id] ? (
              <button
                onClick={handleCheckDilemma}
                disabled={dilemmaSelections[currentDilemma.id] === undefined || dilemmaSelections[currentDilemma.id] === null}
                className={`px-6 py-2.5 font-display font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer ${
                  dilemmaSelections[currentDilemma.id] !== undefined && dilemmaSelections[currentDilemma.id] !== null
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                CONFIRM DECISION
              </button>
            ) : (
              <button
                onClick={handleNextDilemma}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-display font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {currentDilemmaIdx < classroomDilemmas.length - 1
                    ? 'Next Dilemma'
                    : 'View Fully Furnished Classroom!'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('classroom');
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Go to Classroom Hub →
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIRTUAL CLASSROOM VISUAL HUB                             */}
      {/* ======================================================== */}
      {activeTab === 'classroom' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase">Interactive Studio</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Your Modern Future Classroom
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Click on any unlocked classroom station to read pedagogical tips and grammar rules!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-bold">
                {unlockedItems.length} / 6 Stations Unlocked
              </span>
              <button
                onClick={() => {
                  sounds.playFanfare();
                  onNavigate('certificate');
                }}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Claim Teacher Diploma</span>
              </button>
            </div>
          </div>

          {/* Interactive Classroom Visual Stage */}
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border-2 border-slate-200 shadow-lg bg-slate-900 group">
            <img
              src="/src/assets/images/classroom_future_base_1792204393455.jpg"
              alt="Future Classroom Stage"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Interactive Object Hotspots */}
            {futureClassroomItems.map((item) => {
              const isUnlocked = unlockedItems.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setInspectedItemId(item.id);
                  }}
                  style={{ top: item.position.top, left: item.position.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer group/pin ${
                    isUnlocked
                      ? 'bg-teal-600/90 text-white hover:scale-110 hover:bg-teal-500 ring-2 ring-white'
                      : 'bg-slate-800/80 text-slate-400 opacity-60 hover:opacity-90'
                  }`}
                  title={item.name}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {renderItemIcon(item.icon)}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold whitespace-nowrap pr-1">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Station Popover / Inspection Card */}
          {inspectedItemId && (() => {
            const item = futureClassroomItems.find(i => i.id === inspectedItemId);
            if (!item) return null;
            const isUnlocked = unlockedItems.includes(item.id);

            return (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200 flex flex-col sm:flex-row items-start justify-between gap-4 animate-fadeIn">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      {item.category}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isUnlocked ? 'Station Active' : 'Locked Station'}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  <div className="mt-2 p-2.5 rounded-xl bg-white/80 text-xs font-medium text-teal-900 border border-teal-100 flex items-start gap-1.5">
                    <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item.teacherNote}</span>
                  </div>
                </div>

                <button
                  onClick={() => setInspectedItemId(null)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer shrink-0"
                >
                  Close
                </button>
              </div>
            );
          })()}

          {/* Station Grid Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {futureClassroomItems.map((item) => {
              const isUnlocked = unlockedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setInspectedItemId(item.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-white border-teal-200 hover:border-teal-400 hover:shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {renderItemIcon(item.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                      <span className="text-[11px] text-slate-500">
                        {isUnlocked ? 'Station Active' : 'Solve Mission 3 Challenges to Unlock'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
