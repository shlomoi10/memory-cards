import { Card, Player, MemorySettings } from '../core/BaseMemory';
import { getAvailableEmojis } from '../utils/EmojiHelper';
import { useState, useEffect, useCallback } from 'react';

// שכפול מהוק קלאסי - יותאם לכללי "קלפי קסם" בהמשך
export function useExperimentalMagicCardsMemory(settings: MemorySettings) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [experimentalLockBoard, setExperimentalLockBoard] = useState(false);
  const [players, setPlayers] = useState<Player[]>(settings.players.map(p => ({ ...p, score: 0 })));
  const [currentPlayer, setCurrentPlayer] = useState(settings.currentPlayer);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timer, setTimer] = useState('00:00');
  const [experimentalShuffleAnim, setExperimentalShuffleAnim] = useState(false);

  const MAGIC_TYPES = ['reveal-pair-v2', 'shuffle-v2'] as const;
  type MagicType = typeof MAGIC_TYPES[number];

  const generateExperimentalMagicCards = useCallback((numPairs: number): Card[] => {
    const emojis = getAvailableEmojis(numPairs - 2);
    let cards: Card[] = [];
    emojis.forEach((emoji, i) => {
      cards.push({ id: `${i}-a`, emoji, type: 'normal', isOpen: false, isMatched: false });
      cards.push({ id: `${i}-b`, emoji, type: 'normal', isOpen: false, isMatched: false });
    });
    // מוסיפים 2 זוגות קלפי קסם
    for (let i = 0; i < 2; i++) {
      const expMagic: MagicType = MAGIC_TYPES[i % 2];
      cards.push({ id: `magic${i}-a`, emoji: { shortName: 'star', name: 'כוכב', src: 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg' }, type: 'magic', magicType: expMagic, isOpen: false, isMatched: false });
      cards.push({ id: `magic${i}-b`, emoji: { shortName: 'star', name: 'כוכב', src: 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg' }, type: 'magic', magicType: expMagic, isOpen: false, isMatched: false });
    }
    // ערבוב
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }, [getAvailableEmojis]);

  useEffect(() => {
    const numPairs = settings.numPairs || 8;
    setCards(generateExperimentalMagicCards(numPairs));
    setFlipped([]);
    setExperimentalLockBoard(false);
    setPlayers(settings.players.map(p => ({ ...p, score: 0 })));
    setCurrentPlayer(settings.currentPlayer);
    setWinner(null);
    setIsPopupOpen(false);
  }, [settings.numPairs, settings.currentPlayer, settings.players, generateExperimentalMagicCards]);

  useEffect(() => {
    setMoves(0);
    setStartTime(null);
    setTimer('00:00');
  }, [settings.numPairs, settings.currentPlayer]);

  useEffect(() => {
    if (cards.length && startTime === null && moves === 0) {
      setStartTime(Date.now());
    }
  }, [cards, startTime, moves]);

  useEffect(() => {
    if (startTime !== null && !winner) {
      const interval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const m = String(Math.floor(diff / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        setTimer(`${m}:${s}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, winner]);

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(m => m + 1);
    }
  }, [flipped]);

  useEffect(() => {
    if (flipped.length === 2) {
      setExperimentalLockBoard(true);
      setTimeout(() => {
        const [id1, id2] = flipped;
        const c1 = cards.find(c => c.id === id1);
        const c2 = cards.find(c => c.id === id2);
        if (c1 && c2 && c1.emoji.shortName === c2.emoji.shortName) {
          setCards(prev => prev.map(card =>
            card.id === id1 || card.id === id2 ? { ...card, isMatched: true, isOpen: true } : card
          ));
          setPlayers(prev => prev.map((p, i) => i === currentPlayer ? { ...p, score: p.score + 1 } : p));
        } else {
          setCards(prev => prev.map(card =>
            card.id === id1 || card.id === id2 ? { ...card, isOpen: false } : card
          ));
          setCurrentPlayer(prev => (prev + 1) % players.length);
        }
        setFlipped([]);
        setExperimentalLockBoard(false);
      }, 800);
    }
  }, [flipped, cards, currentPlayer, players.length]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setIsPopupOpen(true);
      const maxScore = Math.max(...players.map(p => p.score));
      setWinner(players.find(p => p.score === maxScore) || null);
    }
  }, [cards, players]);

  const pairsFound = cards.filter(card => card.isMatched).length / 2;
  const totalPairs = cards.length / 2;

  function onMagicCardClick(cardId: string) {
    if (experimentalLockBoard) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || card.isOpen) return;
    if (card.type === 'magic') {
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, isOpen: true, isMatched: true } : c));
      // עין: גלה זוג תואם לשנייה
      if (card.magicType && card.magicType === 'reveal-pair-v2') {
        const coveredPairs = cards.filter(c => !c.isMatched && !c.isOpen && c.type === 'normal');
        let found = false;
        for (let i = 0; i < coveredPairs.length; i++) {
          for (let j = i + 1; j < coveredPairs.length; j++) {
            if (
              typeof coveredPairs[i]?.emoji?.shortName === 'string' &&
              typeof coveredPairs[j]?.emoji?.shortName === 'string' &&
              coveredPairs[i].emoji.shortName === coveredPairs[j].emoji.shortName
            ) {
              setCards(prev => prev.map(c =>
                c.id === coveredPairs[i].id || c.id === coveredPairs[j].id ? { ...c, isOpen: true } : c
              ));
              setTimeout(() => {
                setCards(prev => prev.map(c =>
                  c.id === coveredPairs[i].id || c.id === coveredPairs[j].id ? { ...c, isOpen: false } : c
                ));
              }, 1000);
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }
      // ערבוב: ממקם מחדש את הקלפים המכוסים בלבד במקומות אקראיים בלוח
      else if (card.magicType && card.magicType === 'shuffle-v2') {
        setExperimentalShuffleAnim(true);
        setTimeout(() => {
          const covered = cards.filter(c => !c.isMatched && !c.isOpen && c.type === 'normal');
          const coveredIds = covered.map(c => c.id);
          for (let t = coveredIds.length - 1; t > 0; t--) {
            const n = Math.floor(Math.random() * (t + 1));
            [coveredIds[t], coveredIds[n]] = [coveredIds[n], coveredIds[t]];
          }
          setCards(prev => {
            const normalCards = prev.filter(c => !c.isMatched && !c.isOpen && c.type === 'normal');
            const reordered = coveredIds.map(id => normalCards.find(c => c.id === id)!);
            let result: Card[] = [];
            let idx = 0;
            for (let i = 0; i < prev.length; i++) {
              if (prev[i].isMatched || prev[i].isOpen || prev[i].type !== 'normal') {
                result.push(prev[i]);
              } else {
                result.push(reordered[idx++]);
              }
            }
            return result;
          });
          setTimeout(() => setExperimentalShuffleAnim(false), 900);
        }, 350);
      }
      // קלף קסם לא מסיים תור ולא מזכה בנקודה
      setFlipped([]);
      setExperimentalLockBoard(false);
      return;
    }
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isOpen: true } : c));
    setFlipped(prev => [...prev, cardId]);
  };

  function resetExperimentalMagic(settings: MemorySettings, setCards: any, setFlipped: any, setExperimentalLockBoard: any, setPlayers: any, setCurrentPlayer: any, setWinner: any, setIsPopupOpen: any, setMoves: any, setStartTime: any, setTimer: any) {
    const numPairs = settings.numPairs || 8;
    setCards(generateExperimentalMagicCards(numPairs));
    setFlipped([]);
    setExperimentalLockBoard(false);
    setPlayers(settings.players.map(p => ({ ...p, score: 0 })));
    setCurrentPlayer(settings.currentPlayer);
    setWinner(null);
    setIsPopupOpen(false);
    setMoves(0);
    setStartTime(null);
    setTimer('00:00');
  }

  return {
    cards,
    flipped,
    experimentalLockBoard,
    players,
    currentPlayer,
    winner,
    isPopupOpen,
    moves,
    timer,
    pairsFound,
    totalPairs,
    onMagicCardClick,
    experimentalShuffleAnim,
    reset: () => resetExperimentalMagic(settings, setCards, setFlipped, setExperimentalLockBoard, setPlayers, setCurrentPlayer, setWinner, setIsPopupOpen, setMoves, setStartTime, setTimer),
    setPlayers,
    setWinner,
    setIsPopupOpen,
    setCurrentPlayer,
    setCards,
    setFlipped,
    setExperimentalLockBoard,
    setMoves,
    setTimer,
    setStartTime
  };
}
