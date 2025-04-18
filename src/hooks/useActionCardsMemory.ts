import { useState, useEffect } from 'react';
import { Card, Player, MemorySettings, EmojiItem } from '../core/BaseMemory';
import { getAvailableEmojis } from '../utils/EmojiHelper';

const ACTION_TYPES = ['reveal-pair', 'shuffle', 'extra-turn', 'lose-turn'] as const;
type ActionType = typeof ACTION_TYPES[number];

function getRandomAction(): ActionType {
  return ACTION_TYPES[Math.floor(Math.random() * ACTION_TYPES.length)];
}

export function useActionCardsMemory(settings: MemorySettings) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [players, setPlayers] = useState<Player[]>(settings.players.map(p => ({ ...p })));
  const [currentPlayer, setCurrentPlayer] = useState(settings.currentPlayer);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const numPairs = settings.numPairs || 8;
    const emojis: EmojiItem[] = getAvailableEmojis(numPairs - 2);
    let newCards: Card[] = [];
    emojis.forEach((emoji, i) => {
      newCards.push({ id: `${i}-a`, emoji, type: 'normal', isOpen: false, isMatched: false });
      newCards.push({ id: `${i}-b`, emoji, type: 'normal', isOpen: false, isMatched: false });
    });
    for (let i = 0; i < 2; i++) {
      const action = getRandomAction();
      newCards.push({ id: `action${i}-a`, emoji: { shortName: 'star', name: 'כוכב', src: 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg' }, type: 'action', actionType: action, isOpen: false, isMatched: false });
      newCards.push({ id: `action${i}-b`, emoji: { shortName: 'star', name: 'כוכב', src: 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg' }, type: 'action', actionType: action, isOpen: false, isMatched: false });
    }
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    setCards(newCards);
    setFlipped([]);
    setLockBoard(false);
    setPlayers(settings.players.map(p => ({ ...p })));
    setCurrentPlayer(settings.currentPlayer);
    setWinner(null);
    setIsPopupOpen(false);
  }, [settings]);

  useEffect(() => {
    if (flipped.length === 2) {
      setLockBoard(true);
      setTimeout(() => {
        const [id1, id2] = flipped;
        const c1 = cards.find(c => c.id === id1);
        const c2 = cards.find(c => c.id === id2);
        if (c1 && c2 && c1.type === 'action' && c2.type === 'action' && c1.actionType === c2.actionType) {
          setCards(prev => prev.map(card =>
            card.id === id1 || card.id === id2 ? { ...card, isMatched: true, isOpen: true } : card
          ));
          applyAction(c1.actionType!);
        } else if (c1 && c2 && c1.emoji.shortName === c2.emoji.shortName && c1.type === 'normal' && c2.type === 'normal') {
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
        setLockBoard(false);
      }, 800);
    }
  }, [flipped]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setIsPopupOpen(true);
      const maxScore = Math.max(...players.map(p => p.score));
      setWinner(players.find(p => p.score === maxScore) || null);
    }
  }, [cards]);

  function applyAction(action: ActionType) {
    switch (action) {
      case 'reveal-pair': {
        const closed = cards.filter(c => !c.isOpen && !c.isMatched);
        if (closed.length >= 2) {
          setCards(prev => prev.map(card =>
            card.id === closed[0].id || card.id === closed[1].id ? { ...card, isOpen: true } : card
          ));
        }
        break;
      }
      case 'shuffle': {
        setCards(prev => {
          const shuffled = [...prev];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        });
        break;
      }
      case 'extra-turn': {
        // לא מעבירים תור
        break;
      }
      case 'lose-turn': {
        setCurrentPlayer(prev => (prev + 1) % players.length);
        break;
      }
    }
  }

  const onCardClick = (id: string) => {
    if (lockBoard) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isOpen || card.isMatched || flipped.includes(id)) return;
    setCards(prev => prev.map(c => c.id === id ? { ...c, isOpen: true } : c));
    setFlipped(prev => [...prev, id]);
  };

  const reset = () => {
    const numPairs = settings.numPairs || 8;
    const emojis: EmojiItem[] = getAvailableEmojis(numPairs - 2);
    let newCards: Card[] = [];
    emojis.forEach((emoji, i) => {
      newCards.push({ id: `${i}-a`, emoji, type: 'normal', isOpen: false, isMatched: false });
      newCards.push({ id: `${i}-b`, emoji, type: 'normal', isOpen: false, isMatched: false });
    });
    for (let i = 0; i < 2; i++) {
      const action = getRandomAction();
      newCards.push({ id: `action${i}-a`, emoji: { shortName: 'star', name: 'כוכב', src: 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg' }, type: 'action', actionType: action, isOpen: false, isMatched: false });
      newCards.push({ id: `action${i}-b`, emoji: { shortName: 'star', name: 'כוכב', src: 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg' }, type: 'action', actionType: action, isOpen: false, isMatched: false });
    }
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    setCards(newCards);
    setFlipped([]);
    setLockBoard(false);
    setPlayers(settings.players.map(p => ({ ...p })));
    setCurrentPlayer(settings.currentPlayer);
    setWinner(null);
    setIsPopupOpen(false);
  };

  return {
    cards,
    players,
    currentPlayer,
    onCardClick,
    winner,
    isPopupOpen,
    reset,
  };
}
