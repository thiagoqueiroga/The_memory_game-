import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, Heart, Sun, Moon, Cloud, Zap, Umbrella, Snowflake,
  Anchor, Award, Bell, Camera, RotateCcw, Trophy, Settings2
} from 'lucide-react';
import { cn } from '../lib/utils';

type Card = {
  id: string;
  iconId: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const ICONS = [
  { id: 'star', component: Star, colorClass: 'bg-pink-500 border-pink-700 text-white' },
  { id: 'heart', component: Heart, colorClass: 'bg-orange-400 border-orange-600 text-white' },
  { id: 'sun', component: Sun, colorClass: 'bg-yellow-400 border-yellow-600 text-white' },
  { id: 'moon', component: Moon, colorClass: 'bg-sky-400 border-sky-600 text-white' },
  { id: 'cloud', component: Cloud, colorClass: 'bg-cyan-400 border-cyan-600 text-white' },
  { id: 'zap', component: Zap, colorClass: 'bg-emerald-400 border-emerald-600 text-white' },
  { id: 'umbrella', component: Umbrella, colorClass: 'bg-indigo-400 border-indigo-600 text-white' },
  { id: 'snowflake', component: Snowflake, colorClass: 'bg-teal-400 border-teal-600 text-white' },
  { id: 'anchor', component: Anchor, colorClass: 'bg-blue-500 border-blue-700 text-white' },
  { id: 'award', component: Award, colorClass: 'bg-violet-500 border-violet-700 text-white' },
  { id: 'bell', component: Bell, colorClass: 'bg-rose-400 border-rose-600 text-white' },
  { id: 'camera', component: Camera, colorClass: 'bg-fuchsia-400 border-fuchsia-600 text-white' },
];

type Difficulty = 'facil' | 'medio' | 'dificil';

const DIFFICULTIES = {
  facil: { label: 'Fácil', pairs: 6, cols: 'grid-cols-3' },
  medio: { label: 'Médio', pairs: 8, cols: 'grid-cols-4' },
  dificil: { label: 'Difícil', pairs: 12, cols: 'grid-cols-4' },
};

const generateDeck = (difficulty: Difficulty): Card[] => {
  const selectedIcons = ICONS.slice(0, DIFFICULTIES[difficulty].pairs);
  const deckPairs = [...selectedIcons, ...selectedIcons];
  
  return deckPairs
    .sort(() => Math.random() - 0.5)
    .map((icon, index) => ({
      id: `${icon.id}-${index}`,
      iconId: icon.id,
      isFlipped: false,
      isMatched: false,
    }));
};

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medio');
  const [cards, setCards] = useState<Card[]>(generateDeck('medio'));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [timeParams, setTimeParams] = useState({ start: 0, current: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isGameWon) {
      interval = setInterval(() => {
        setTimeParams((prev) => ({ ...prev, current: Date.now() }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isGameWon]);

  const timeElapsed = Math.floor((timeParams.current - timeParams.start) / 1000);
  const formattedTime = timeParams.start > 0 
    ? `${Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:${(timeElapsed % 60).toString().padStart(2, '0')}`
    : '00:00';

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || isGameWon) return;

    if (!isPlaying) {
      setIsPlaying(true);
      setTimeParams({ start: Date.now(), current: Date.now() });
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [firstIndex, secondIndex] = newFlippedIndices;
      if (newCards[firstIndex].iconId === newCards[secondIndex].iconId) {
        // Match
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setIsLocked(false);
        
        // Check win condition
        if (newCards.every((card) => card.isMatched)) {
          setIsGameWon(true);
          setIsPlaying(false);
        }
      } else {
        // No match, unflip after delay
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const restartGame = (newDifficulty: Difficulty = difficulty) => {
    setDifficulty(newDifficulty);
    setCards(generateDeck(newDifficulty));
    setFlippedIndices([]);
    setMoves(0);
    setIsLocked(false);
    setIsGameWon(false);
    setIsPlaying(false);
    setTimeParams({ start: 0, current: 0 });
    setShowSettings(false);
  };

  return (
    <div className="min-h-[100dvh] bg-indigo-900 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-md bg-slate-50 rounded-[36px] sm:rounded-[48px] border-[8px] sm:border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative min-h-[650px] max-h-[95dvh]">
        {/* Notch decoration */}
        <div className="h-6 bg-slate-800 w-32 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20 hidden sm:block"></div>

        {/* Top Area */}
        <div className="bg-indigo-600 pt-8 sm:pt-12 pb-6 px-6 text-white relative z-10 shrink-0">
          
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black uppercase tracking-tighter mb-0">
              Memo!
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors",
                  showSettings ? "bg-indigo-800 text-indigo-200" : "bg-indigo-400 text-white hover:bg-indigo-500"
                )}
              >
                Nível
              </button>
              <button
                onClick={() => restartGame()}
                className="px-3 py-1.5 bg-indigo-400 rounded-full text-xs font-bold uppercase text-white hover:bg-indigo-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </header>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-indigo-700/50 rounded-2xl p-4 border-b-4 border-indigo-800">
                  <h3 className="text-[10px] font-bold text-indigo-200 mb-3 uppercase tracking-widest">Dificuldade</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(DIFFICULTIES) as [Difficulty, typeof DIFFICULTIES[Difficulty]][]).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => restartGame(key)}
                        className={cn(
                          "py-2 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-b-4",
                          difficulty === key
                            ? "bg-white text-indigo-600 border-indigo-200"
                            : "bg-indigo-500 text-indigo-100 border-indigo-600 hover:bg-indigo-400"
                        )}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Bar */}
          <div className="flex gap-4">
            <div className="flex-1 bg-indigo-700/50 p-3 rounded-2xl border-b-4 border-indigo-800 flex flex-col items-center">
              <p className="text-[10px] uppercase font-bold opacity-70 mb-1 tracking-wider">Movimentos</p>
              <p className="text-xl font-black">{moves}</p>
            </div>
            <div className="flex-1 bg-indigo-700/50 p-3 rounded-2xl border-b-4 border-indigo-800 flex flex-col items-center">
              <p className="text-[10px] uppercase font-bold opacity-70 mb-1 tracking-wider">Tempo</p>
              <p className="text-xl font-black">{formattedTime}</p>
            </div>
          </div>
        </div>

        {/* Game Grid Box */}
        <div className="flex-1 bg-slate-50 p-6 flex flex-col justify-center overflow-y-auto">
          <div 
            className={cn(
              "grid gap-3 sm:gap-4 w-full mx-auto pb-4",
              DIFFICULTIES[difficulty].cols,
            )}
          >
            {cards.map((card, index) => {
              const iconDef = ICONS.find((i) => i.id === card.iconId) || ICONS[0];
              const Icon = iconDef.component;
              const colorClass = iconDef.colorClass;

              return (
                <div
                  key={card.id}
                  className="relative perspective-1000 w-full aspect-square max-w-[100px] mx-auto"
                  onClick={() => handleCardClick(index)}
                >
                  <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {/* Front value (Card Back visually) */}
                    <div 
                      className={cn(
                        "absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center cursor-pointer shadow-md transition-colors",
                        "bg-indigo-500 border-b-4 border-indigo-700 hover:bg-indigo-400"
                      )}
                    >
                      <span className="text-3xl font-black text-indigo-800/40">?</span>
                    </div>

                    {/* Back value (Card Face visually) */}
                    <div 
                      className={cn(
                        "absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center shadow-md border-b-4",
                        colorClass,
                        "rotate-y-180",
                        card.isMatched && "opacity-60 scale-95 transition-all duration-300"
                      )}
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      <Icon className={cn(
                          "w-1/2 h-1/2",
                          card.isMatched && "animate-pulse" 
                        )} 
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
          
          {/* Bottom home indicator line for aesthetic */}
          <div className="h-1.5 w-1/3 bg-slate-200 mx-auto mt-auto rounded-full shrink-0"></div>
        </div>

        {/* Win Overlay */}
        <AnimatePresence>
          {isGameWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white border-[6px] border-indigo-900 rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center flex flex-col relative"
              >
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-b-4 border-yellow-600">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-indigo-900 mb-2">
                  Você Venceu!
                </h2>
                <p className="text-slate-500 mb-8 font-medium">
                  Sua memória é incrível! Nível {DIFFICULTIES[difficulty].label} concluído.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-100 rounded-2xl p-4 border-b-4 border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Movimentos</div>
                    <div className="text-2xl font-black text-indigo-900">{moves}</div>
                  </div>
                  <div className="bg-slate-100 rounded-2xl p-4 border-b-4 border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Tempo</div>
                    <div className="text-2xl font-black text-indigo-900">{formattedTime}</div>
                  </div>
                </div>

                <button
                  onClick={() => restartGame()}
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-3xl shadow-xl border-b-4 border-indigo-800 uppercase tracking-widest hover:bg-indigo-500 active:transform active:translate-y-1 active:border-b-0 transition-all"
                >
                  Jogar Novamente
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
