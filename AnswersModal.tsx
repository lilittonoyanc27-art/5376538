import React, { useState } from 'react';
import { Riddle, RiddleStatus } from './riddles';
import { X, Search, Volume2, CheckCircle2, XCircle, Clock, BookOpen, ExternalLink } from 'lucide-react';
import { speakText, soundManager } from './audio';

interface AnswersModalProps {
  isOpen: boolean;
  onClose: () => void;
  riddles: Riddle[];
  statuses: Record<number, RiddleStatus>;
  onSelectRiddle: (index: number) => void;
}

export const AnswersModal: React.FC<AnswersModalProps> = ({
  isOpen,
  onClose,
  riddles,
  statuses,
  onSelectRiddle,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredRiddles = riddles.filter((r) => {
    const status = statuses[r.id] || 'pending';
    if (filter === 'correct' && status !== 'correct') return false;
    if (filter === 'wrong' && status !== 'wrong') return false;
    if (filter === 'pending' && status !== 'pending' && status !== 'passed') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.letter.toLowerCase().includes(q) ||
      r.spanishAnswer.toLowerCase().includes(q) ||
      r.russianAnswer.toLowerCase().includes(q) ||
      r.spanishQuestion.toLowerCase().includes(q) ||
      r.russianQuestion.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-white overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="answers-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="answers-modal-title" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Справочник ответов и загадок
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  27 загадок
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Полные карточки загадок с русским и испанским переводом, озвучкой и подсказками
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters and search bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по слову, загадке или букве..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-start sm:self-auto text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Все (27)
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Верно
            </button>
            <button
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'wrong' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Ошибки
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Осталось
            </button>
          </div>
        </div>

        {/* List of Riddles & Answers */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-slate-800/60">
          {filteredRiddles.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              Ничего не найдено по запросу «{searchQuery}»
            </div>
          ) : (
            filteredRiddles.map((r) => {
              const status = statuses[r.id] || 'pending';
              const origIndex = riddles.findIndex((x) => x.id === r.id);

              return (
                <div key={r.id} className="pt-4 first:pt-0 flex flex-col md:flex-row gap-4 items-start justify-between">
                  {/* Left Column: Number & Letter badge */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-950 border border-blue-400/50 flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                      <span className="text-2xl font-black font-['Outfit',sans-serif] leading-none text-yellow-300 drop-shadow">
                        {r.letter}
                      </span>
                      <span className="text-[10px] text-blue-200 font-bold mt-0.5">#{r.id}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                          {r.letterDisplay}
                        </span>
                        {status === 'correct' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Отгадано
                          </span>
                        )}
                        {status === 'wrong' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400">
                            <XCircle className="w-3.5 h-3.5" /> Ошибка
                          </span>
                        )}
                        {(status === 'pending' || status === 'passed') && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3.5 h-3.5" /> {status === 'passed' ? 'Пропущено' : 'В игре'}
                          </span>
                        )}
                      </div>

                      {/* Spanish Riddle */}
                      <p className="text-sm font-medium text-slate-200 mt-1">
                        <span className="text-amber-400 mr-1.5 font-bold">🇪🇸</span>
                        {r.spanishQuestion}
                      </p>

                      {/* Russian Riddle */}
                      <p className="text-xs text-slate-400 mt-1">
                        <span className="text-blue-400 mr-1.5 font-bold">🇷🇺</span>
                        {r.russianQuestion}
                      </p>

                      {/* Vocabulary note */}
                      {r.vocabularyNotes && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          💡 Словник: {r.vocabularyNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Answer badge & Quick actions */}
                  <div className="flex flex-row md:flex-col items-end md:items-end justify-between w-full md:w-auto gap-2 shrink-0 pl-14 md:pl-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Правильный ответ:</div>
                      <div className="text-base font-bold text-emerald-400 flex items-center justify-end gap-1.5">
                        <span>{r.spanishAnswer}</span>
                        <span className="text-slate-400 text-sm font-normal">— {r.russianAnswer}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Audio listen button */}
                      <button
                        type="button"
                        onClick={() => {
                          speakText(r.spanishAnswer, 'es-ES');
                        }}
                        title="Прослушать произношение на испанском"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {/* Go to this riddle */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectRiddle(origIndex);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>Играть</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Показано: {filteredRiddles.length} из 27 загадок</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Вернуться к игре
          </button>
        </div>
      </div>
    </div>
  );
};
