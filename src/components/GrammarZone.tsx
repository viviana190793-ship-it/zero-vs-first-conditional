import React, { useState } from 'react';
import { GameScreen } from '../types/grammar';
import { knowledgeCheckQuestions, educationalThemes, a2VocabularyList } from '../data/grammarData';
import { sounds } from '../utils/audio';
import { 
  ArrowRight, 
  RotateCw, 
  CheckCircle, 
  Sparkles,
  BookMarked,
  Info,
  HelpCircle,
  Volume2
} from 'lucide-react';

interface GrammarZoneProps {
  onNavigate: (screen: GameScreen) => void;
  knowledgeCheckCompleted: boolean;
  onCompleteKnowledgeCheck: () => void;
  onMascotFeedback?: (mood: 'idle' | 'happy' | 'mistake' | 'thinking', message?: string) => void;
}

export const GrammarZone: React.FC<GrammarZoneProps> = ({
  onNavigate,
  knowledgeCheckCompleted,
  onCompleteKnowledgeCheck,
  onMascotFeedback
}) => {
  // Comma Rule Interactive Flipper State
  const [flipperClauseOrder, setFlipperClauseOrder] = useState<'ifFirst' | 'mainFirst'>('ifFirst');

  // Knowledge check quiz state
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState<boolean>(knowledgeCheckCompleted);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Vocabulary Helper Drawer State
  const [showVocab, setShowVocab] = useState<boolean>(false);

  const handleSelectAnswer = (qId: string, optIndex: number) => {
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleFlipClause = () => {
    sounds.playClick();
    setFlipperClauseOrder(prev => (prev === 'ifFirst' ? 'mainFirst' : 'ifFirst'));
  };

  const handleCheckQuiz = () => {
    let correctCount = 0;
    knowledgeCheckQuestions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    setQuizScore(correctCount);
    setSubmitted(true);

    if (correctCount >= 2) {
      sounds.playCorrect();
      onCompleteKnowledgeCheck();
      onMascotFeedback?.('happy', "Hoo-ray! You passed the Gateway Check! Game 1 is unlocked! 🌟");
    } else {
      sounds.playIncorrect();
      onMascotFeedback?.('mistake', "Ollie's Tip: Review the cards above! Zero Conditional is for general classroom rules, while First Conditional is for realistic future plans.");
    }
  };

  const handleRetryQuiz = () => {
    sounds.playClick();
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border-2 border-teal-400">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black text-teal-100 uppercase tracking-wide">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Interactive Grammar Zone · CEFR A2–B1</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight title-3d-illuminated">
            Zero Conditional vs. First Conditional
          </h1>
          <p className="text-teal-50 text-sm sm:text-base leading-relaxed font-medium">
            Learn how conditionals are used in real educational contexts: <strong>classroom rules</strong>, <strong>study habits</strong>, and <strong>future teaching scenarios</strong>! Use the color-coded guides below, test the clause flipper, and pass the short gateway check to play the games.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setShowVocab(!showVocab);
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-display font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>📖 {showVocab ? 'Hide A2 Vocabulary Helper' : 'Open A2 Vocabulary Helper (English / Español)'}</span>
            </button>
          </div>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -right-6 -bottom-6 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* A2 Vocabulary Helper Drawer */}
      {showVocab && (
        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h3 className="font-display font-black text-amber-950 text-lg">
                Classroom & Study Vocabulary (A2 Level)
              </h3>
            </div>
            <span className="text-xs text-amber-800 font-bold">
              Easy words to help you understand every example
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {a2VocabularyList.map((item, i) => (
              <div key={i} className="p-3 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-slate-900 text-sm">{item.word}</span>
                  <button 
                    onClick={() => sounds.playClick()} 
                    className="text-amber-600 hover:text-amber-800 p-1"
                    title="Audio sound"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs font-bold text-teal-700">{item.spanish}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{item.definition}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Didactic Context Cards (Educational Scenarios) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h2 className="font-display text-2xl font-black text-slate-900">
            Educational Contexts & Didactic Illustrations
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationalThemes.map(theme => (
            <div 
              key={theme.id}
              className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100 border-b border-slate-100">
                <img
                  src={theme.image}
                  alt={theme.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs font-black">
                  {theme.icon} {theme.title}
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-black uppercase text-teal-600 tracking-wider">
                    {theme.conditionalFocus}
                  </div>
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    {theme.title} <span className="text-xs text-slate-400 font-normal">({theme.spanishTitle})</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-800 italic">
                    “{theme.examples[0].sentence}”
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side Conditional Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* A. ZERO CONDITIONAL CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-teal-300 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-teal-600">Structure 1</span>
                <h2 className="font-display text-2xl font-black text-slate-900">Zero Conditional</h2>
              </div>
              <span className="px-3 py-1 bg-teal-100 text-teal-900 border border-teal-300 rounded-xl text-xs font-black">
                Classroom Rules & Facts
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              We use the <strong>Zero Conditional</strong> for things that are <strong>always true</strong>: established classroom rules, daily study habits, and natural facts.
            </p>

            {/* Formula Block */}
            <div className="p-4 bg-teal-50/80 border-2 border-teal-200 rounded-2xl shadow-2xs">
              <div className="text-[11px] font-black text-teal-800 uppercase tracking-wider mb-1">
                Grammar Formula (Fórmula)
              </div>
              <div className="font-display font-black text-base sm:text-lg text-teal-950 tracking-wide flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 bg-teal-200/90 rounded-md text-teal-900 font-black">IF</span>
                <span>+</span>
                <span className="px-2 py-0.5 bg-emerald-200/90 rounded-md text-emerald-950 font-black">PRESENT SIMPLE</span>
                <span className="text-teal-700 font-extrabold">,</span>
                <span className="px-2 py-0.5 bg-cyan-200/90 rounded-md text-cyan-950 font-black">PRESENT SIMPLE</span>
              </div>
            </div>

            {/* Examples with Color Coding */}
            <div className="space-y-3">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wide">
                Classroom & Study Examples:
              </div>
              
              <div className="p-3 bg-slate-50 rounded-2xl border border-teal-100 space-y-1">
                <div className="text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="font-black text-teal-700">If</span> you{' '}
                  <span className="font-black text-emerald-700 underline decoration-emerald-400">raise</span> your hand, the teacher{' '}
                  <span className="font-black text-cyan-700 underline decoration-cyan-400">answers</span> your question.
                </div>
                <div className="text-[11px] text-teal-700 font-semibold">🏫 Classroom Rule: What always happens in class.</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-teal-100 space-y-1">
                <div className="text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="font-black text-teal-700">If</span> students{' '}
                  <span className="font-black text-emerald-700 underline decoration-emerald-400">review</span> their notes, they{' '}
                  <span className="font-black text-cyan-700 underline decoration-cyan-400">remember</span> English words.
                </div>
                <div className="text-[11px] text-teal-700 font-semibold">📚 Study Habit: General truth about daily practice.</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-teal-100 space-y-1">
                <div className="text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="font-black text-teal-700">If</span> students{' '}
                  <span className="font-black text-emerald-700 underline decoration-emerald-400">do not arrive</span> on time, they{' '}
                  <span className="font-black text-cyan-700 underline decoration-cyan-400">miss</span> the warm-up game.
                </div>
                <div className="text-[11px] text-teal-700 font-semibold">⏰ Negative form: Uses "do not" + base verb.</div>
              </div>
            </div>

            {/* Grammar Rules List */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                <span>Key Rules to Remember:</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside font-medium">
                <li>Use <strong>present simple</strong> in both parts.</li>
                <li>Add <strong>-s</strong> or <strong>-es</strong> for he, she, it (e.g. <em>the teacher answers</em>).</li>
                <li>Use <strong>do not</strong> or <strong>does not</strong> for negative sentences.</li>
                <li>Describes general rules, daily habits, and scientific facts.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* B. FIRST CONDITIONAL CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-sky-300 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-sky-600">Structure 2</span>
                <h2 className="font-display text-2xl font-black text-slate-900">First Conditional</h2>
              </div>
              <span className="px-3 py-1 bg-sky-100 text-sky-900 border border-sky-300 rounded-xl text-xs font-black">
                Future Possibilities
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              We use the <strong>First Conditional</strong> for <strong>realistic future possibilities</strong> and their likely results in upcoming situations.
            </p>

            {/* Formula Block */}
            <div className="p-4 bg-sky-50/80 border-2 border-sky-200 rounded-2xl shadow-2xs">
              <div className="text-[11px] font-black text-sky-800 uppercase tracking-wider mb-1">
                Grammar Formula (Fórmula)
              </div>
              <div className="font-display font-black text-base sm:text-lg text-sky-950 tracking-wide flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 bg-sky-200/90 rounded-md text-sky-900 font-black">IF</span>
                <span>+</span>
                <span className="px-2 py-0.5 bg-emerald-200/90 rounded-md text-emerald-950 font-black">PRESENT SIMPLE</span>
                <span className="text-sky-700 font-extrabold">,</span>
                <span className="px-2 py-0.5 bg-indigo-200/90 rounded-md text-indigo-950 font-black">WILL + BASE VERB</span>
              </div>
            </div>

            {/* Examples with Color Coding */}
            <div className="space-y-3">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wide">
                Classroom & Study Examples:
              </div>
              
              <div className="p-3 bg-slate-50 rounded-2xl border border-sky-100 space-y-1">
                <div className="text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="font-black text-sky-700">If</span> I{' '}
                  <span className="font-black text-emerald-700 underline decoration-emerald-400">study</span> tonight, I{' '}
                  <span className="font-black text-indigo-700 underline decoration-indigo-400">will feel</span> ready for tomorrow's quiz.
                </div>
                <div className="text-[11px] text-sky-700 font-semibold">📚 Study Plan: Specific action tonight with future result tomorrow.</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-sky-100 space-y-1">
                <div className="text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="font-black text-sky-700">If</span> the teacher{' '}
                  <span className="font-black text-emerald-700 underline decoration-emerald-400">uses</span> a game, students{' '}
                  <span className="font-black text-indigo-700 underline decoration-indigo-400">will participate</span> more.
                </div>
                <div className="text-[11px] text-sky-700 font-semibold">🎓 Future Teaching: Likely result of a fun teaching method.</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-sky-100 space-y-1">
                <div className="text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="font-black text-sky-700">If</span> I{' '}
                  <span className="font-black text-emerald-700 underline decoration-emerald-400">become</span> an English teacher, I{' '}
                  <span className="font-black text-indigo-700 underline decoration-indigo-400">will create</span> interactive lessons.
                </div>
                <div className="text-[11px] text-sky-700 font-semibold">🎯 Future Career Goal: Realistic aspiration for student teachers.</div>
              </div>
            </div>

            {/* Grammar Rules List */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                <span>Key Rules to Remember:</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside font-medium">
                <li>Use <strong>present simple</strong> after "if".</li>
                <li>Use <strong>will + base verb</strong> in the result clause.</li>
                <li><strong>Golden Rule: Never put "will" right after "if"</strong> (*If I will study = INCORRECT!).</li>
                <li>Use <strong>won't</strong> (will not) for negative future results.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* C. COMMA RULE: Interactive Clause Flipper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-md">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Punctuation Workshop</span>
          </div>
          <h2 className="font-display text-2xl font-black text-slate-900">
            The Comma Rule: Where Does "If" Go?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Click the button below to see how comma punctuation changes when the clause order flips:
          </p>
        </div>

        {/* Dynamic Sentence Display */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/60 border border-indigo-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex-1 text-center sm:text-left">
              {flipperClauseOrder === 'ifFirst' ? (
                <div className="space-y-2">
                  <div className="text-base sm:text-2xl font-black text-slate-900">
                    <span className="px-3 py-1 bg-teal-100 text-teal-900 rounded-xl inline-block mr-1">
                      If students practice
                    </span>
                    <span className="text-rose-600 font-black text-2xl sm:text-3xl px-1 animate-bounce inline-block">
                      ,
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-xl inline-block ml-1">
                      they improve.
                    </span>
                  </div>
                  <div className="text-xs font-black text-rose-600 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>If-clause comes FIRST → A COMMA IS REQUIRED!</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-base sm:text-2xl font-black text-slate-900">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-xl inline-block mr-1.5">
                      Students improve
                    </span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-900 rounded-xl inline-block">
                      if they practice.
                    </span>
                  </div>
                  <div className="text-xs font-black text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Main clause comes FIRST → NO COMMA IS NEEDED!</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleFlipClause}
              className="px-5 py-3 btn-3d-indigo text-white font-display font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <RotateCw className="w-4 h-4" />
              <span>Flip Clause Order</span>
            </button>
          </div>
        </div>

        {/* Rule Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-medium">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-black text-slate-900">Rule 1:</span> When the <strong>if-clause</strong> starts the sentence, place a comma before the second part.
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-black text-slate-900">Rule 2:</span> When the <strong>main clause</strong> starts the sentence, do not use a comma before "if".
          </div>
        </div>
      </div>

      {/* D. QUICK VISUAL COMPARISON SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 bg-teal-50 border-2 border-teal-200 rounded-2xl flex items-start gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
            0
          </div>
          <div>
            <h3 className="font-display font-black text-teal-950 text-base">ZERO CONDITIONAL</h3>
            <p className="text-xs text-teal-800 font-bold mt-0.5">“What generally happens?” (Classroom rules & facts)</p>
            <p className="text-xs text-teal-700 mt-1 leading-relaxed">
              Use for timeless truths, established classroom expectations, habits, and scientific facts. Both verbs in Present Simple!
            </p>
          </div>
        </div>

        <div className="p-5 bg-sky-50 border-2 border-sky-200 rounded-2xl flex items-start gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
            1st
          </div>
          <div>
            <h3 className="font-display font-black text-sky-950 text-base">FIRST CONDITIONAL</h3>
            <p className="text-xs text-sky-800 font-bold mt-0.5">“What may happen in the future?” (Plans & predictions)</p>
            <p className="text-xs text-sky-700 mt-1 leading-relaxed">
              Use for realistic future possibilities, upcoming study goals, and future teaching plans. Uses "will + base verb"!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 3-Question Knowledge Check */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-teal-300 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Gateway Knowledge Check (3 Questions)</span>
            </div>
            <h2 className="font-display text-2xl font-black text-slate-900">
              Test Your Conditional Knowledge!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Answer 2 or more questions correctly to unlock your missions.
            </p>
          </div>

          {submitted && (
            <div className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border-2 ${
              quizScore >= 2
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}>
              <span>Score: {quizScore} / {knowledgeCheckQuestions.length}</span>
              {quizScore >= 2 ? (
                <span className="text-emerald-600">✓ Unlocked!</span>
              ) : (
                <span className="text-rose-600">Try Again</span>
              )}
            </div>
          )}
        </div>

        {/* Question Cards */}
        <div className="space-y-6">
          {knowledgeCheckQuestions.map((q, qIndex) => {
            const selectedOpt = answers[q.id];
            const isAnswered = selectedOpt !== undefined && selectedOpt !== null;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div 
                key={q.id}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-rose-50/50 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    Q{qIndex + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    <p className="font-display font-bold text-slate-900 text-sm sm:text-base">
                      {q.question}
                    </p>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {q.options.map((option, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-teal-400";

                        if (submitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-black";
                          } else if (isSelected && !isCorrect) {
                            btnStyle = "bg-rose-100 border-rose-400 text-rose-950 font-bold";
                          }
                        } else if (isSelected) {
                          btnStyle = "bg-teal-50 border-teal-500 text-teal-900 font-black shadow-xs ring-2 ring-teal-200";
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submitted}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`p-3 rounded-xl border-2 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${btnStyle}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation feedback */}
                    {submitted && (
                      <div className={`text-xs p-3 rounded-xl border font-medium ${
                        isCorrect
                          ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                          : 'bg-rose-100/60 border-rose-300 text-rose-950'
                      }`}>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Check / Proceed CTA Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {!submitted ? (
            <button
              onClick={handleCheckQuiz}
              disabled={Object.keys(answers).length < knowledgeCheckQuestions.length}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-display font-black text-sm text-white shadow-md transition-all cursor-pointer ${
                Object.keys(answers).length === knowledgeCheckQuestions.length
                  ? 'btn-3d-teal'
                  : 'bg-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              Check Answers & Unlock Games
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {quizScore < 2 ? (
                <button
                  onClick={handleRetryQuiz}
                  className="w-full sm:w-auto px-6 py-3 btn-3d-amber text-amber-950 font-display font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Retry Knowledge Check
                </button>
              ) : (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onNavigate('game1');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 btn-3d-teal text-white font-display font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Enter Game 1: Match & Sort</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          )}

          <div className="text-xs text-slate-500 font-medium">
            Need a reminder? Review the color-coded formulas above anytime!
          </div>
        </div>
      </div>

    </div>
  );
};
