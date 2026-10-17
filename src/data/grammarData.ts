import {
  MatchPair,
  SortItem,
  TrueFalseQuestion,
  FillBlankQuestion,
  ErrorCorrectionQuestion,
  EscapeRiddle,
  SentenceBuilderChallenge,
  ClassroomDilemma,
  ClassroomItem,
  EducationalThemeInfo
} from '../types/grammar';

/**
 * 3 Educational Themes with Didactic Illustrations (A2 CEFR Context)
 */
export const educationalThemes: EducationalThemeInfo[] = [
  {
    id: 'classroom_rules',
    title: 'Classroom Rules',
    spanishTitle: 'Normas del Aula',
    description: 'General habits, routine classroom expectations, and timeless rules. Perfect for Zero Conditional!',
    conditionalFocus: 'Zero Conditional (If + Present Simple, Present Simple)',
    image: '/src/assets/images/didactic_classroom_rules_1792208674654.jpg',
    icon: '🏫',
    examples: [
      {
        sentence: 'If you raise your hand, the teacher listens to your question.',
        type: 'zero',
        explanation: 'Timeless rule in every respectful classroom.'
      },
      {
        sentence: 'If students arrive on time, the class begins calmly.',
        type: 'zero',
        explanation: 'Habitual fact: punctuality helps everyone learn.'
      },
      {
        sentence: 'If we work quietly, everyone concentrates better.',
        type: 'zero',
        explanation: 'Natural result of a quiet study environment.'
      }
    ]
  },
  {
    id: 'study_habits',
    title: 'Study Habits',
    spanishTitle: 'Hábitos de Estudio',
    description: 'Daily learning routines and specific future study plans before quizzes and tests.',
    conditionalFocus: 'Zero (Daily habits) & First (Upcoming study goals)',
    image: '/src/assets/images/didactic_study_habits_1792208688696.jpg',
    icon: '📚',
    examples: [
      {
        sentence: 'If you review your notes every day, you remember vocabulary easily.',
        type: 'zero',
        explanation: 'General truth: daily practice strengthens your memory.'
      },
      {
        sentence: 'If I make flashcards tonight, I will learn 20 new verbs.',
        type: 'first',
        explanation: 'Real future plan: action tonight leads to a result tomorrow.'
      },
      {
        sentence: 'If you sleep 8 hours before an exam, your brain works faster.',
        type: 'zero',
        explanation: 'Scientific health fact for all students.'
      }
    ]
  },
  {
    id: 'future_teaching',
    title: 'Future Teaching Scenarios',
    spanishTitle: 'Escenarios Docentes Futuros',
    description: 'Realistic teaching plans, interactive classrooms, and methods for student teachers.',
    conditionalFocus: 'First Conditional (If + Present Simple, Will + Base Verb)',
    image: '/src/assets/images/didactic_future_teaching_1792208701057.jpg',
    icon: '🎓',
    examples: [
      {
        sentence: 'If I become an English teacher, I will design fun speaking games.',
        type: 'first',
        explanation: 'A realistic career aspiration with a future promise.'
      },
      {
        sentence: 'If my students feel nervous, I will encourage them kindly.',
        type: 'first',
        explanation: 'Pedagogical strategy for a future classroom challenge.'
      },
      {
        sentence: 'If we use smartboards, students will participate more enthusiastically.',
        type: 'first',
        explanation: 'Likely future outcome of using digital tools.'
      }
    ]
  }
];

/**
 * Quick A2 Vocabulary Helper (Helps A2 learners understand key classroom terms)
 */
export const a2VocabularyList = [
  { word: 'Raise hand', spanish: 'Levantar la mano', definition: 'Put your hand up to ask or answer in class.' },
  { word: 'Review notes', spanish: 'Repasar notas', definition: 'Read your notebook again to remember information.' },
  { word: 'On time', spanish: 'A tiempo / Puntual', definition: 'Arrive at the right hour, not late.' },
  { word: 'Flashcards', spanish: 'Tarjetas de estudio', definition: 'Small cards with words and pictures to practice.' },
  { word: 'Lesson plan', spanish: 'Plan de clase', definition: 'A teacher’s guide for what to teach in class.' },
  { word: 'Encourage', spanish: 'Animar / Motivar', definition: 'Give positive words to make someone feel brave.' },
  { word: 'Participate', spanish: 'Participar', definition: 'Join in class activities and answer questions.' },
  { word: 'Concentrate', spanish: 'Concentrarse', definition: 'Give all your attention to your study task.' }
];

/**
 * 3-Question Knowledge Check for Grammar Learning Zone (A2 Level)
 */
export const knowledgeCheckQuestions = [
  {
    id: 'kc-1',
    question: 'Which conditional is best for classroom rules, daily habits, and general facts?',
    options: ['Zero Conditional', 'First Conditional', 'Neither'],
    correctIndex: 0,
    explanation: 'Correct! The Zero Conditional describes classroom rules, routines, and facts that are always true.'
  },
  {
    id: 'kc-2',
    question: 'Which conditional uses "will + base verb" to talk about realistic future plans?',
    options: ['Zero Conditional', 'First Conditional', 'Both Conditionals'],
    correctIndex: 1,
    explanation: 'Correct! The First Conditional talks about real future plans: "If + present simple, will + base verb".'
  },
  {
    id: 'kc-3',
    question: 'In "Students learn if they practice", do we need a comma before "if"?',
    options: ['Yes, always', 'No, no comma is needed when "if" is in the middle', 'Only sometimes'],
    correctIndex: 1,
    explanation: 'Correct! When the main clause comes first and "if" is in the middle, generally NO comma is needed!'
  }
];

/**
 * GAME 1: Round 1 Match Pairs (Classroom Rules and Study Habits)
 */
export const matchPairsRound1: MatchPair[] = [
  {
    id: 'mp-1',
    sentence: 'If students practice regularly, they learn faster.',
    category: 'zero',
    categoryLabel: 'Zero Conditional (Study Habit)',
    theme: 'study_habits',
    themeLabel: 'Study Habit',
    explanation: 'Present simple in both parts ("practice" & "learn"). It describes a regular study habit.'
  },
  {
    id: 'mp-2',
    sentence: 'If I study tonight, I will pass the English quiz.',
    category: 'first',
    categoryLabel: 'First Conditional (Future Goal)',
    theme: 'study_habits',
    themeLabel: 'Study Habit',
    explanation: '"If I study" (present simple) + "I will pass" (future result). Talks about tonight and tomorrow.'
  },
  {
    id: 'mp-3',
    sentence: 'If you raise your hand, the teacher answers your question.',
    category: 'zero',
    categoryLabel: 'Zero Conditional (Classroom Rule)',
    theme: 'classroom_rules',
    themeLabel: 'Classroom Rule',
    explanation: 'Present simple in both parts ("raise" & "answers"). A standard classroom rule.'
  },
  {
    id: 'mp-4',
    sentence: 'If we finish our task early, the teacher will play a speaking game.',
    category: 'first',
    categoryLabel: 'First Conditional (Classroom Plan)',
    theme: 'future_teaching',
    themeLabel: 'Teaching Plan',
    explanation: 'Expresses a real future condition ("finish early") and a likely result ("will play").'
  },
  {
    id: 'mp-5',
    sentence: 'If students arrive late, they knock on the classroom door.',
    category: 'zero',
    categoryLabel: 'Zero Conditional (Classroom Routine)',
    theme: 'classroom_rules',
    themeLabel: 'Classroom Rule',
    explanation: 'General school policy and routine using present simple ("arrive" & "knock").'
  },
  {
    id: 'mp-6',
    sentence: 'If I become an English teacher, I will design fun interactive lessons.',
    category: 'first',
    categoryLabel: 'First Conditional (Future Career)',
    theme: 'future_teaching',
    themeLabel: 'Future Teaching',
    explanation: 'A realistic future possibility ("become") with "will design".'
  }
];

/**
 * GAME 1: Round 2 Sentence Sorting
 */
export const sortSentencesRound2: SortItem[] = [
  {
    id: 'sort-1',
    sentence: 'If you click the audio icon, the app plays clear pronunciation.',
    correctCategory: 'zero',
    context: 'Classroom Tech Rule',
    theme: 'classroom_rules',
    explanation: 'General fact: click ➔ the audio always plays (present simple + present simple).'
  },
  {
    id: 'sort-2',
    sentence: 'If the weather is sunny tomorrow, our teacher will teach outside.',
    correctCategory: 'first',
    context: 'Future Lesson Plan',
    theme: 'future_teaching',
    explanation: 'Refers to a specific event tomorrow with "will teach".'
  },
  {
    id: 'sort-3',
    sentence: 'If students do not review their vocabulary, they forget words.',
    correctCategory: 'zero',
    context: 'Study Habit Fact',
    theme: 'study_habits',
    explanation: 'General truth about memory using present simple in both clauses.'
  },
  {
    id: 'sort-4',
    sentence: 'If you forget your book tomorrow, you will share with a partner.',
    correctCategory: 'first',
    context: 'Future Classroom Situation',
    theme: 'classroom_rules',
    explanation: 'A realistic future situation for tomorrow using "will share".'
  },
  {
    id: 'sort-5',
    sentence: 'If a student feels sick in class, the teacher calls the nurse.',
    correctCategory: 'zero',
    context: 'Classroom Safety Rule',
    theme: 'classroom_rules',
    explanation: 'Standard school rule that always happens in that situation.'
  },
  {
    id: 'sort-6',
    sentence: 'If we practice speaking in pairs, our confidence will grow quickly.',
    correctCategory: 'first',
    context: 'Future Learning Goal',
    theme: 'study_habits',
    explanation: 'A future prediction: regular practice will lead to higher confidence.'
  }
];

/**
 * GAME 1: Round 3 True or False
 */
export const trueFalseQuestionsRound3: TrueFalseQuestion[] = [
  {
    id: 'tf-1',
    statement: 'Zero Conditional is used for classroom rules and daily study habits.',
    isTrue: true,
    theme: 'classroom_rules',
    explanation: 'True! Zero Conditional is ideal for timeless rules, habits, and general facts.'
  },
  {
    id: 'tf-2',
    statement: 'In First Conditional, we say "If I will study tonight..."',
    isTrue: false,
    theme: 'study_habits',
    explanation: 'False! Never use "will" right after "if". Say: "If I study tonight, I will pass."'
  },
  {
    id: 'tf-3',
    statement: 'The First Conditional pattern is: If + present simple, will + base verb.',
    isTrue: true,
    theme: 'future_teaching',
    explanation: 'True! For example: "If I become a teacher, I will use games."'
  },
  {
    id: 'tf-4',
    statement: 'We must always put a comma before "if" in "Students improve if they read."',
    isTrue: false,
    theme: 'study_habits',
    explanation: 'False! When "if" is in the middle of the sentence, we do NOT need a comma!'
  }
];

/**
 * GAME 2: Challenge A - Fill in the Blanks (A2 Educational Themes)
 */
export const fillInBlankQuestions: FillBlankQuestion[] = [
  {
    id: 'fib-1',
    sentenceParts: ['If students', 'regularly, they remember English vocabulary.'],
    options: ['review', 'will review'],
    correctAnswer: 'review',
    conditionalType: 'zero',
    theme: 'study_habits',
    themeLabel: 'Study Habit',
    explanation: 'Zero Conditional habit: use present simple ("review") after "if", not "will".',
    hint: 'This is a daily study habit. Use present simple after "if".'
  },
  {
    id: 'fib-2',
    sentenceParts: ['If you raise your hand, the teacher', 'your question.'],
    options: ['answers', 'will answers'],
    correctAnswer: 'answers',
    conditionalType: 'zero',
    theme: 'classroom_rules',
    themeLabel: 'Classroom Rule',
    explanation: 'Classroom rule: present simple in both clauses ("raise" ➔ "answers").',
    hint: 'This is an established classroom rule. Present simple for both parts!'
  },
  {
    id: 'fib-3',
    sentenceParts: ['If the teacher gives clear examples, students', 'the lesson.'],
    options: ['understand', 'will understands'],
    correctAnswer: 'understand',
    conditionalType: 'zero',
    theme: 'future_teaching',
    themeLabel: 'Teaching Fact',
    explanation: 'General educational truth: present simple in both parts.',
    hint: 'General pedagogical truth: "students" is plural, so use "understand".'
  },
  {
    id: 'fib-4',
    sentenceParts: ['If I study with a friend tonight, we', 'speaking together.'],
    options: ['practice', 'will practice'],
    correctAnswer: 'will practice',
    conditionalType: 'first',
    theme: 'study_habits',
    themeLabel: 'Study Habit',
    explanation: 'Future plan ("tonight"): use "will practice" in the main clause.',
    hint: 'Notice "tonight"! This is a realistic future plan.'
  },
  {
    id: 'fib-5',
    sentenceParts: ['If students do not arrive on time, they', 'the morning greeting.'],
    options: ['miss', 'will misses'],
    correctAnswer: 'miss',
    conditionalType: 'zero',
    theme: 'classroom_rules',
    themeLabel: 'Classroom Rule',
    explanation: 'Classroom routine: present simple ("do not arrive" ➔ "miss").',
    hint: 'General classroom routine every morning. Use present simple.'
  },
  {
    id: 'fib-6',
    sentenceParts: ['If I become an English teacher, I', 'interactive digital materials.'],
    options: ['create', 'will create'],
    correctAnswer: 'will create',
    conditionalType: 'first',
    theme: 'future_teaching',
    themeLabel: 'Future Teaching',
    explanation: 'Future career goal: use "will create" in the main result clause.',
    hint: 'This is a future goal. Use "will + base verb"!'
  }
];

/**
 * GAME 2: Challenge B - Fix the Mistake (Common A2 Student Errors)
 */
export const errorCorrectionQuestions: ErrorCorrectionQuestion[] = [
  {
    id: 'err-1',
    originalSentence: 'If I will study, I will pass the exam.',
    errorPart: 'will study',
    options: ['study', 'studies', 'will study', 'studying'],
    correctOption: 'study',
    correctedSentence: 'If I study, I will pass the exam.',
    theme: 'study_habits',
    themeLabel: 'Study Habit',
    explanation: 'Golden Rule: Never put "will" right after "if"! Use the present simple "study".',
    hint: 'Can we use "will" right after the word "if"?'
  },
  {
    id: 'err-2',
    originalSentence: 'If students practices, they improve their English.',
    errorPart: 'practices',
    options: ['practice', 'practices', 'will practice', 'practicing'],
    correctOption: 'practice',
    theme: 'classroom_rules',
    themeLabel: 'Classroom Rule',
    correctedSentence: 'If students practice, they improve their English.',
    explanation: 'Subject-Verb check: "Students" is plural (they), so use the base verb "practice" without "-s".',
    hint: 'Is "students" singular or plural?'
  },
  {
    id: 'err-3',
    originalSentence: 'If she reviews her notes, she will passes the test.',
    errorPart: 'will passes',
    options: ['will pass', 'will passes', 'pass', 'passes'],
    correctOption: 'will pass',
    theme: 'study_habits',
    themeLabel: 'Study Habit',
    correctedSentence: 'If she reviews her notes, she will pass the test.',
    explanation: 'After "will", always use the base form of the verb ("pass"), never add "-s" or "-es".',
    hint: 'What form comes after the helper word "will"?'
  },
  {
    id: 'err-4',
    originalSentence: 'Students will learn, if they practice speaking.',
    errorPart: ', if',
    options: ['if (no comma)', ', if (with comma)', '; if', '- if'],
    correctOption: 'if (no comma)',
    theme: 'future_teaching',
    themeLabel: 'Teaching Tip',
    correctedSentence: 'Students will learn if they practice speaking.',
    explanation: 'When the main clause is first and "if" is in the middle, no comma is needed!',
    hint: 'Where is the if-clause? At the start or in the middle?'
  }
];

/**
 * GAME 2: Challenge C - Escape Room Keypad Riddles
 */
export const escapeRiddles: EscapeRiddle[] = [
  {
    id: 'esc-1',
    prompt: 'Keypad Code Part 1: Choose the correct First Conditional sentence to get digits 1 & 2!',
    clue: 'Pattern: If + Present Simple, Will + Base Verb (Future Teaching Scenario).',
    theme: 'future_teaching',
    themeLabel: 'Future Teaching',
    options: [
      {
        codeDigit: '42',
        text: 'If the lesson bell rings, the teacher will start the interactive game.',
        isCorrect: true,
        explanation: 'Perfect! "If the bell rings" (present simple) + "will start" (future result). Digits 4 and 2 obtained!'
      },
      {
        codeDigit: '19',
        text: 'If the lesson bell will ring, the teacher starts the game.',
        isCorrect: false,
        explanation: 'Error: Never use "will" in the if-clause!'
      },
      {
        codeDigit: '88',
        text: 'If the lesson bell rings, the teacher will starts the game.',
        isCorrect: false,
        explanation: 'Error: Never put "-s" after "will" ("will starts" is incorrect).'
      }
    ]
  },
  {
    id: 'esc-2',
    prompt: 'Keypad Code Part 2: Choose the correct Zero Conditional sentence to get digits 3 & 4!',
    clue: 'Pattern: Timeless Classroom Rule with Present Simple in both clauses and proper comma.',
    theme: 'classroom_rules',
    themeLabel: 'Classroom Rule',
    options: [
      {
        codeDigit: '79',
        text: 'If students raise their hands, the teacher listens to their questions.',
        isCorrect: true,
        explanation: 'Brilliant! "raise" and "listens" are both present simple with a correct comma. Digits 7 and 9 obtained!'
      },
      {
        codeDigit: '31',
        text: 'If students will raise their hands, the teacher listens.',
        isCorrect: false,
        explanation: 'Error: Zero conditional does not use "will".'
      },
      {
        codeDigit: '05',
        text: 'Students raises their hands, if the teacher answers.',
        isCorrect: false,
        explanation: 'Error: Subject-verb agreement mistake ("Students raises") and unnecessary comma.'
      }
    ]
  }
];

/**
 * GAME 3: Sentence Builder Challenges (A2 Educational Themes)
 */
export const sentenceBuilderChallenges: SentenceBuilderChallenge[] = [
  {
    id: 'bld-1',
    conditionalType: 'zero',
    targetSentence: 'If students collaborate, they learn faster.',
    scrambledWords: ['they', 'collaborate', 'learn', 'If', 'faster', 'students'],
    hasComma: true,
    explanation: 'Zero Conditional: "If students collaborate, they learn faster." Comma needed because the if-clause is first.',
    teachingTip: 'Pair work and group work help students speak English naturally without fear.'
  },
  {
    id: 'bld-2',
    conditionalType: 'first',
    targetSentence: 'If I use games, students will participate more.',
    scrambledWords: ['participate', 'will', 'games', 'If', 'students', 'more', 'I', 'use'],
    hasComma: true,
    explanation: 'First Conditional: "If I use games, students will participate more." A realistic future prediction.',
    teachingTip: 'Educational games create a relaxed atmosphere where everyone wants to join in.'
  },
  {
    id: 'bld-3',
    conditionalType: 'zero',
    targetSentence: 'The lesson runs well if the teacher plans carefully.',
    scrambledWords: ['plans', 'if', 'The', 'well', 'the', 'carefully', 'lesson', 'teacher', 'runs'],
    hasComma: false,
    explanation: 'Zero Conditional with main clause first: Notice no comma before "if"!',
    teachingTip: 'A good lesson plan gives structure and confidence to both teachers and students.'
  },
  {
    id: 'bld-4',
    conditionalType: 'first',
    targetSentence: 'If we give positive feedback, students will build confidence.',
    scrambledWords: ['give', 'will', 'If', 'positive', 'build', 'feedback', 'we', 'confidence', 'students'],
    hasComma: true,
    explanation: 'First Conditional: "If we give positive feedback, students will build confidence."',
    teachingTip: 'Praising effort encourages learners to keep trying even when English feels tricky.'
  },
  {
    id: 'bld-5',
    conditionalType: 'first',
    targetSentence: 'Students will succeed if they practice every day.',
    scrambledWords: ['succeed', 'if', 'every', 'practice', 'they', 'will', 'Students', 'day'],
    hasComma: false,
    explanation: 'First Conditional: Main clause first ("Students will succeed"), so no comma before "if"!',
    teachingTip: 'Consistent 10-minute daily practice is much better than cramming before an exam.'
  },
  {
    id: 'bld-6',
    conditionalType: 'zero',
    targetSentence: 'If a student needs help, the teacher explains the rule.',
    scrambledWords: ['explains', 'the', 'If', 'help,', 'needs', 'a', 'rule.', 'the', 'teacher', 'student'],
    hasComma: true,
    explanation: 'Zero Conditional: Routine classroom support with third-person singular "-s" on both verbs.',
    teachingTip: 'Checking for understanding ensures no student is left behind during activities.'
  }
];

export const classroomDilemmas: ClassroomDilemma[] = [
  {
    id: 'dil-1',
    title: 'The Silent Speaking Activity',
    situation: 'Your students feel shy and are not speaking in the English conversation circle. What will you do?',
    options: [
      {
        text: 'If I put students in pairs with visual prompt cards, they will speak more comfortably.',
        conditionalType: 'first',
        isBestChoice: true,
        feedback: 'Excellent pedagogy! Pair work lowers anxiety and visual cards give students immediate vocabulary support.'
      },
      {
        text: 'If I call on the shyest student in front of the whole class, they participate.',
        conditionalType: 'zero',
        isBestChoice: false,
        feedback: 'Calling out a shy learner publicly may increase their anxiety (affective filter).'
      }
    ],
    unlockedItem: {
      id: 'teacher-podium',
      name: 'Interactive Smartboard',
      icon: 'Monitor',
      description: 'An interactive digital board displaying grammar cards and speaking games.'
    }
  }
];

export const futureClassroomItems: ClassroomItem[] = [
  {
    id: 'teacher-podium',
    name: 'Teacher Presentation Board',
    category: 'Teaching Hub',
    description: 'Digital smart screen with grammar formulas and games.',
    teacherNote: 'Keeps lessons visual, structured, and interactive for A2 learners.',
    icon: 'Presentation',
    position: { top: '32%', left: '48%' }
  }
];
