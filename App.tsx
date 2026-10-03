import React, { useState, useEffect, useRef } from 'react';
import { RIDDLES, Riddle, RiddleStatus, checkAnswerMatch } from './riddles';
import { RoscoWheel } from './RoscoWheel';
import { AnswersModal } from './AnswersModal';
import { soundManager, speakText } from './audio';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Eye,
  EyeOff,
  ChevronRight,
  HelpCircle,
  Trophy,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Send,
  RefreshCw,
  Lightbulb,
  Info
} from 'lucide-react';

export default function App() {
  // Master list of 27 riddles strictly ordered in Spanish Alphabetical sequence (A to Z)
  const activeRiddleList = RIDDLES;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [statuses, setStatuses] = useState<Record<number, RiddleStatus>>({});
  const [inputVal, setInputVal] = useState<string>('');
  
  // Requirement: "при клике на исп пуст откроется перевод на рус"
  const [showRussianTranslation, setShowRussianTranslation] = useState<boolean>(false);
  // Dedicated button: "отдельно кнопка ответы"
  const [showSingleAnswer, setShowSingleAnswer] = useState<boolean>(false);
  const [showAllAnswersModal, setShowAllAnswersModal] = useState<boolean>(false);
  
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [alwaysShowTranslation, setAlwaysShowTranslation] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentRiddle: Riddle = activeRiddleList[currentIndex] || activeRiddleList[0];

  // Stats calculation
  const totalRiddles = RIDDLES.length;
  const correctCount = Object.values(statuses).filter((s) => s === 'correct').length;
  const wrongCount = Object.values(statuses).filter((s) => s === 'wrong').length;
  const passedCount = Object.values(statuses).filter((s) => s === 'passed').length;
  const resolvedCount = correctCount + wrongCount;
  const remainingCount = totalRiddles - resolvedCount;
  const isCompleted = resolvedCount === totalRiddles && totalRiddles > 0;

  // Sound sync
  useEffect(() => {
    soundManager.enabled = soundOn;
  }, [soundOn]);

  // Reset local state on riddle change
  useEffect(() => {
    setShowRussianTranslation(alwaysShowTranslation);
    setShowSingleAnswer(false);
    setInputVal('');
    setFeedbackMsg(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, alwaysShowTranslation]);

  // Keyboard shortcuts (Enter = submit, Tab/Space when empty = Pasapalabra)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnswerSubmit();
    }
  };

  // Find next pending or passed riddle
  const moveToNextRiddle = (currentIdx: number, updatedStatuses: Record<number, RiddleStatus>) => {
    const len = activeRiddleList.length;
    // 1st priority: look for next untouched 'pending'
    for (let step = 1; step <= len; step++) {
      const nextIdx = (currentIdx + step) % len;
      const id = activeRiddleList[nextIdx].id;
      if (!updatedStatuses[id] || updatedStatuses[id] === 'pending') {
        setCurrentIndex(nextIdx);
        return;
      }
    }
    // 2nd priority: look for next 'passed' (Pasapalabra)
    for (let step = 1; step <= len; step++) {
      const nextIdx = (currentIdx + step) % len;
      const id = activeRiddleList[nextIdx].id;
      if (updatedStatuses[id] === 'passed') {
        setCurrentIndex(nextIdx);
        return;
      }
    }
    // If all are finished, stay on current
  };

  // Action: Pasapalabra!
  const handlePasapalabra = () => {
    soundManager.playPasapalabra();
    const newStatuses = {
      ...statuses,
      [currentRiddle.id]: 'passed' as RiddleStatus,
    };
    setStatuses(newStatuses);
    setFeedbackMsg({ text: '¡Pasapalabra! Переход к следующей букве', type: 'info' });
    moveToNextRiddle(currentIndex, newStatuses);
  };

  // Action: Check Answer
  const handleAnswerSubmit = () => {
    if (!inputVal.trim()) {
      handlePasapalabra();
      return;
    }

    const isCorrect = checkAnswerMatch(inputVal, currentRiddle);

    if (isCorrect) {
      soundManager.playCorrect();
      const newStatuses = {
        ...statuses,
        [currentRiddle.id]: 'correct' as RiddleStatus,
      };
      setStatuses(newStatuses);
      setFeedbackMsg({
        text: `¡Correcto! ${currentRiddle.spanishAnswer} (${currentRiddle.russianAnswer})`,
        type: 'success',
      });
      // Move after a short beat so user sees success
      setTimeout(() => {
        moveToNextRiddle(currentIndex, newStatuses);
      }, 700);
    } else {
      soundManager.playWrong();
      const newStatuses = {
        ...statuses,
        [currentRiddle.id]: 'wrong' as RiddleStatus,
      };
      setStatuses(newStatuses);
      setFeedbackMsg({
        text: `¡Fallo! Ответ: ${currentRiddle.spanishAnswer} (${currentRiddle.russianAnswer})`,
        type: 'error',
      });
      setTimeout(() => {
        moveToNextRiddle(currentIndex, newStatuses);
      }, 1000);
    }
  };

  // Quick insert Spanish characters
  const insertChar = (char: string) => {
    setInputVal((prev) => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Reset Game
  const handleResetGame = () => {
    soundManager.playClick();
    if (window.confirm('Начать новую игру? Все ответы будут сброшены.')) {
      setStatuses({});
      setCurrentIndex(0);
      setInputVal('');
      setFeedbackMsg(null);
      setShowRussianTranslation(false);
      setShowSingleAnswer(false);
    }
  };

  // Celebration fanfare on victory
  useEffect(() => {
    if (isCompleted && correctCount > 0) {
      soundManager.playVictory();
    }
  }, [isCompleted, correctCount]);

  return (
    <div className="min-h-screen bg-[#071330] text-slate-100 flex flex-col font-['Montserrat',sans-serif] selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic TV Studio lighting effects in background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-500/25 via-indigo-600/15 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 blur-3xl rounded-full" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-blue-900/40 bg-slate-950/60 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-[2px] shadow-lg shadow-blue-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-300 text-lg">
                P
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg sm:text-xl tracking-tight text-white uppercase drop-shadow">
                  Pasapalabra
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold hidden sm:inline-block">
                  Без ограничения по времени ⏳
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Роско загадок: учим испанский по 27 загадкам с русским переводом
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Alphabetical Order Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-800/60 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Кольцо по алфавиту: A → Z</span>
            </div>

            {/* Dedicated "Все Ответы" Button (Requirement: "отдельно кнопка ответы") */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setShowAllAnswersModal(true);
              }}
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Все ответы</span>
              <span className="bg-slate-950/20 px-1.5 py-0.2 text-[11px] rounded-md font-black">27</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundOn(!soundOn)}
              title={soundOn ? 'Выключить звук' : 'Включить звук'}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>

            {/* Reset Game Button */}
            <button
              type="button"
              onClick={handleResetGame}
              title="Начать заново"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        {/* Game stats bar inspired by the TV studio screen (see user image) */}
        <div className="w-full max-w-3xl mb-6 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-blue-900/50 shadow-xl">
          {/* TV-style Circular Score Indicators */}
          <div className="flex items-center gap-3">
            {/* Orange Score Badge: Aciertos (Matches TV photo!) */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-amber-300 flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                {correctCount}
              </div>
              <div className="text-left">
                <span className="text-[11px] uppercase tracking-wider text-amber-300/80 font-bold block">
                  Aciertos
                </span>
                <span className="text-xs font-semibold text-slate-300">Верно</span>
              </div>
            </div>

            {/* Green Badge: Remaining letters (Matches TV photo!) */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-emerald-300 flex items-center justify-center text-white font-black text-base shadow-sm">
                {remainingCount}
              </div>
              <div className="text-left">
                <span className="text-[11px] uppercase tracking-wider text-emerald-300/80 font-bold block">
                  Restantes
                </span>
                <span className="text-xs font-semibold text-slate-300">Осталось</span>
              </div>
            </div>

            {/* Red Badge: Fallos */}
            {wrongCount > 0 && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-700 border border-rose-300 flex items-center justify-center text-white font-bold text-xs">
                  {wrongCount}
                </div>
                <span className="text-xs text-rose-300 font-medium">Ошибки</span>
              </div>
            )}
          </div>

          {/* Central progress hint: No time limit */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="font-medium text-slate-300">Без спешки:</span>
            <span>нажмите на текст загадки для перевода</span>
          </div>

          {/* Current Position */}
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Текущая буква:</span>
            <span className="text-sm font-bold text-yellow-400">
              {currentRiddle.letter} ({currentIndex + 1} из {activeRiddleList.length})
            </span>
          </div>
        </div>

        {/* Rosco & Active Riddle Section */}
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Center Column: The Circular Rosco Wheel */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="w-full flex justify-center py-2">
              <RoscoWheel
                riddles={activeRiddleList}
                statuses={statuses}
                currentIndex={currentIndex}
                onSelectIndex={(idx) => setCurrentIndex(idx)}
                size={typeof window !== 'undefined' && window.innerWidth < 640 ? 350 : 490}
              />
            </div>

            {/* Legend for Rosco status */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-300 font-medium flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-blue-400 inline-block shadow-sm" />
                <span>Ожидает</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-300 inline-block shadow-sm" />
                <span>Верно</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-300 inline-block shadow-sm" />
                <span>Ошибка</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 inline-block shadow-sm" />
                <span>Пасапалабра</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Riddle Card & Controls */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-3xl bg-slate-900/85 border border-blue-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden">
              {/* Top Card Bar: Giant Modern Letter Badge & Condition */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-4">
                  {/* BIG, MODERN, 3D GLOWING ACTIVE LETTER */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-[2.5px] shadow-[0_0_25px_rgba(245,158,11,0.5)] shrink-0">
                    <div className="w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                      <span className="absolute top-1 left-2 right-2 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />
                      <span className="font-['Outfit',sans-serif] font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]">
                        {currentRiddle.letter}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-base sm:text-lg font-black text-yellow-300 uppercase tracking-wide">
                      {currentRiddle.letterDisplay}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      Загадка № {currentRiddle.id} из {RIDDLES.length}
                    </div>
                  </div>
                </div>

                {/* Speak Riddle button */}
                <button
                  type="button"
                  onClick={() => speakText(currentRiddle.spanishQuestion, 'es-ES')}
                  title="Озвучить загадку на испанском"
                  className="px-3.5 py-2 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-600/40 text-blue-200 hover:text-white transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Озвучка 🇪🇸</span>
                </button>
              </div>

              {/* SPANISH RIDDLE: Requirement "при клике на исп пуст откроется перевод на рус" */}
              <div className="space-y-3">
                <div
                  onClick={() => {
                    soundManager.playClick();
                    setShowRussianTranslation(!showRussianTranslation);
                  }}
                  className={`group relative p-5 rounded-2xl transition-all cursor-pointer border select-none ${
                    showRussianTranslation
                      ? 'bg-blue-950/70 border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                      : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/80 hover:border-amber-400/60 shadow-lg'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setShowRussianTranslation(!showRussianTranslation);
                    }
                  }}
                  title="Кликните, чтобы открыть/закрыть перевод на русский"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wide">
                        <span>🇪🇸 Испанский вопрос</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-medium">
                          {showRussianTranslation ? 'Перевод показан' : 'Кликните для перевода'}
                        </span>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-amber-100 transition-colors">
                        «{currentRiddle.spanishQuestion}»
                      </p>
                    </div>

                    <div className="shrink-0 p-2 rounded-xl bg-slate-900/70 text-slate-400 group-hover:text-amber-300 transition-colors">
                      {showRussianTranslation ? (
                        <EyeOff className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400 group-hover:text-amber-300" />
                      )}
                    </div>
                  </div>

                  {/* Click hint */}
                  <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5 group-hover:text-amber-300 transition-colors font-medium">
                    <span>👆</span>
                    <span>Нажмите на текст, чтобы открыть перевод на русский</span>
                  </div>
                </div>

                {/* RUSSIAN TRANSLATION (unfolded when Spanish card is clicked) */}
                {showRussianTranslation && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900/90 border border-indigo-600/50 text-slate-100 animate-fadeIn space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                      <span className="flex items-center gap-1.5">
                        <span>🇷🇺 Перевод на русский</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(currentRiddle.russianQuestion, 'ru-RU');
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                        title="Озвучить по-русски"
                      >
                        <Volume2 className="w-4 h-4 text-blue-400" />
                      </button>
                    </div>
                    <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
                      «{currentRiddle.russianQuestion}»
                    </p>
                    {currentRiddle.vocabularyNotes && (
                      <div className="mt-2.5 pt-2.5 border-t border-indigo-800/50 text-xs text-indigo-200">
                        <span className="font-bold text-amber-300">💡 Разбор слов: </span>
                        {currentRiddle.vocabularyNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Answer Input Field */}
              <div className="mt-5 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Ваш ответ на испанском (Empieza por {currentRiddle.letter}):
                </label>
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Введите слово на испанском (напр. ${currentRiddle.letter}...)`}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-24 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={handleAnswerSubmit}
                    className="absolute right-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Ответить</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Spanish Accent Quick Toolbar */}
                <div className="flex items-center gap-1 pt-1 overflow-x-auto text-xs text-slate-400">
                  <span className="text-[11px] text-slate-500 mr-1">Буквы:</span>
                  {['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => insertChar(ch)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors font-mono font-bold"
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Pasapalabra & Dedicated Answers Button */}
              <div className="mt-5 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                {/* Pasapalabra Button */}
                <button
                  type="button"
                  onClick={handlePasapalabra}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>¡Pasapalabra!</span>
                </button>

                {/* Requirement: "отдельно кнопка ответы" */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setShowSingleAnswer(!showSingleAnswer);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    showSingleAnswer
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Lightbulb className={`w-4 h-4 ${showSingleAnswer ? 'text-yellow-300' : 'text-amber-400'}`} />
                  <span>{showSingleAnswer ? 'Скрыть ответ' : '💡 Показать ответ'}</span>
                </button>
              </div>

              {/* DEDICATED ANSWER CARD (When user clicks "💡 Показать ответ") */}
              {showSingleAnswer && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-600/50 animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Правильный ответ к загадке № {currentRiddle.id}:
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(currentRiddle.spanishAnswer, 'es-ES')}
                      className="p-1 rounded text-emerald-300 hover:text-white"
                      title="Озвучить правильный ответ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-lg sm:text-xl font-black text-white flex items-center gap-2 flex-wrap">
                    <span className="text-emerald-300">{currentRiddle.spanishAnswer}</span>
                    <span className="text-slate-400 text-base font-normal">— {currentRiddle.russianAnswer}</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Принимаются варианты: {currentRiddle.acceptedAnswers.join(', ')}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-emerald-800/40">
                    <span className="text-xs text-slate-400">Засчитать:</span>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playCorrect();
                        setStatuses({ ...statuses, [currentRiddle.id]: 'correct' });
                        setShowSingleAnswer(false);
                        moveToNextRiddle(currentIndex, { ...statuses, [currentRiddle.id]: 'correct' });
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                    >
                      Я знал(а) ✅
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playWrong();
                        setStatuses({ ...statuses, [currentRiddle.id]: 'wrong' });
                        setShowSingleAnswer(false);
                        moveToNextRiddle(currentIndex, { ...statuses, [currentRiddle.id]: 'wrong' });
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
                    >
                      Не знал(а) ❌
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback Alert */}
              {feedbackMsg && (
                <div
                  className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300'
                      : feedbackMsg.type === 'error'
                      ? 'bg-rose-950/80 border border-rose-600 text-rose-300'
                      : 'bg-amber-950/80 border border-amber-600 text-amber-300'
                  }`}
                >
                  {feedbackMsg.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : feedbackMsg.type === 'error' ? (
                    <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  ) : (
                    <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                  )}
                  <span>{feedbackMsg.text}</span>
                </div>
              )}
            </div>

            {/* Quick Navigation Between Riddles */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  const prev = (currentIndex - 1 + activeRiddleList.length) % activeRiddleList.length;
                  setCurrentIndex(prev);
                }}
                className="hover:text-white transition-colors"
              >
                ← Предыдущая буква
              </button>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={alwaysShowTranslation}
                  onChange={(e) => setAlwaysShowTranslation(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <span>Всегда открывать русский перевод</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  const next = (currentIndex + 1) % activeRiddleList.length;
                  setCurrentIndex(next);
                }}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Следующая буква</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Victory Celebration Banner when complete */}
        {isCompleted && (
          <div className="w-full max-w-2xl mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-2 border-yellow-400/80 shadow-2xl text-center space-y-4 animate-fadeIn">
            <div className="inline-flex p-3 rounded-2xl bg-yellow-400/20 text-yellow-300 mb-1">
              <Trophy className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">
              ¡El Rosco ha terminado! Игра завершена!
            </h3>
            <p className="text-sm text-slate-200">
              Вы ответили на все 27 загадок!
            </p>
            <div className="flex justify-center gap-6 py-2">
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-400">{correctCount}</div>
                <div className="text-xs text-slate-300">Верных ответов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-rose-400">{wrongCount}</div>
                <div className="text-xs text-slate-300">Ошибок</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-yellow-400">
                  {Math.round((correctCount / totalRiddles) * 100)}%
                </div>
                <div className="text-xs text-slate-300">Точность</div>
              </div>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetGame}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm transition-all shadow-md"
              >
                Сыграть заново
              </button>
              <button
                type="button"
                onClick={() => setShowAllAnswersModal(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700"
              >
                Посмотреть все 27 ответов
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Answers Reference Catalog Modal (Requirement: "отдельно кнопка ответы") */}
      <AnswersModal
        isOpen={showAllAnswersModal}
        onClose={() => setShowAllAnswersModal(false)}
        riddles={RIDDLES}
        statuses={statuses}
        onSelectRiddle={(idx) => {
          setCurrentIndex(idx);
          setShowAllAnswersModal(false);
        }}
      />
    </div>
  );
}
