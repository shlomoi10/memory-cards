// משחק עם קלפי קסם
import { BaseMemory, MemorySettings, Player, MemoryState, Card as CoreCard, EmojiItem } from '../core/BaseMemory';
import { getAvailableEmojis } from '../utils/EmojiHelper';

const EXPERIMENTAL_MAGIC_TYPES = ['reveal-pair-v2', 'shuffle-v2', 'extra-turn-v2', 'lose-turn-v2'] as const;
type ExperimentalMagicType = typeof EXPERIMENTAL_MAGIC_TYPES[number];

function getExperimentalRandomMagic(): ExperimentalMagicType {
  return EXPERIMENTAL_MAGIC_TYPES[Math.floor(Math.random() * EXPERIMENTAL_MAGIC_TYPES.length)];
}

export class ExperimentalMagicCardsMemory extends BaseMemory {
  settings: MemorySettings;
  state: MemoryState;
  private cards: CoreCard[];
  private flipped: string[];
  private experimentalLockBoard: boolean;
  constructor(settings: MemorySettings) {
    super();
    this.settings = settings;
    this.cards = this.generateExperimentalMagicCards();
    this.flipped = [];
    this.experimentalLockBoard = false;
    this.state = this.buildExperimentalMagicState();
  }
  generateExperimentalMagicCards(): CoreCard[] {
    const numPairs = this.settings.numPairs || 8;
    const emojis: EmojiItem[] = getAvailableEmojis(numPairs - 2);
    let cards: CoreCard[] = [];
    emojis.forEach((emoji, i) => {
      cards.push({ id: `${i}-a`, emoji, type: 'normal', isOpen: false, isMatched: false });
      cards.push({ id: `${i}-b`, emoji, type: 'normal', isOpen: false, isMatched: false });
    });
    // מוסיפים 2 זוגות קלפי קסם
    for (let i = 0; i < 2; i++) {
      const expMagic = getExperimentalRandomMagic();
      cards.push({ id: `magic${i}-a`, emoji: { shortName: 'star', name: 'כוכב', src: 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg' }, type: 'magic', magicType: expMagic, isOpen: false, isMatched: false });
      cards.push({ id: `magic${i}-b`, emoji: { shortName: 'star', name: 'כוכב', src: 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg' }, type: 'magic', magicType: expMagic, isOpen: false, isMatched: false });
    }
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }
  buildExperimentalMagicState(): MemoryState {
    return {
      cards: this.cards.map(c => ({ ...c })),
      players: this.settings.players,
      currentPlayer: this.settings.currentPlayer,
      isPopupOpen: false,
    };
  }
  onExperimentalMagicCardClick(cardId: string) {
    if (this.experimentalLockBoard) return;
    const card = this.cards.find(c => c.id === cardId);
    if (!card || card.isOpen || card.isMatched) return;
    card.isOpen = true;
    this.flipped.push(cardId);
    if (this.flipped.length === 2) {
      this.experimentalLockBoard = true;
      setTimeout(() => {
        this.checkExperimentalMagicMatch();
        this.experimentalLockBoard = false;
        this.state = this.buildExperimentalMagicState();
      }, 800);
    } else {
      this.state = this.buildExperimentalMagicState();
    }
  }
  checkExperimentalMagicMatch() {
    const [id1, id2] = this.flipped;
    const c1 = this.cards.find(c => c.id === id1);
    const c2 = this.cards.find(c => c.id === id2);
    if (!c1 || !c2) return;
    if (c1.type === 'magic' && c2.type === 'magic' && c1.magicType === c2.magicType) {
      c1.isMatched = true;
      c2.isMatched = true;
      this.applyExperimentalMagic(c1.magicType!);
    } else if (c1.emoji.shortName === c2.emoji.shortName && c1.type === 'normal' && c2.type === 'normal') {
      c1.isMatched = true;
      c2.isMatched = true;
      this.settings.players[this.settings.currentPlayer].score += 1;
    } else {
      c1.isOpen = false;
      c2.isOpen = false;
      // מעבר תור
      this.settings.currentPlayer = (this.settings.currentPlayer + 1) % this.settings.players.length;
    }
    this.flipped = [];
    this.state = this.buildExperimentalMagicState();
    // בדיקת ניצחון
    if (this.cards.every(c => c.isMatched)) {
      this.state.isPopupOpen = true;
      this.state.winner = this.settings.players.reduce((a, b) => (a.score > b.score ? a : b));
    }
  }
  applyExperimentalMagic(magic: ExperimentalMagicType) {
    switch (magic) {
      case 'reveal-pair-v2':
        // פותח זוג קלפים אקראי
        const closed = this.cards.filter(c => !c.isOpen && !c.isMatched);
        if (closed.length >= 2) {
          closed[0].isOpen = true;
          closed[1].isOpen = true;
        }
        break;
      case 'shuffle-v2':
        // ערבוב הקלפים
        for (let i = this.cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        break;
      case 'extra-turn-v2':
        // השחקן הנוכחי מקבל תור נוסף (לא מעבירים תור)
        break;
      case 'lose-turn-v2':
        // השחקן הנוכחי מפסיד תור (מעבירים פעמיים)
        this.settings.currentPlayer = (this.settings.currentPlayer + 1) % this.settings.players.length;
        break;
    }
  }
  onExperimentalMagicSettingsChange(settings: MemorySettings) {
    this.settings = settings;
    this.cards = this.generateExperimentalMagicCards();
    this.flipped = [];
    this.experimentalLockBoard = false;
    this.state = this.buildExperimentalMagicState();
  }
  experimentalMagicReset() {
    this.cards = this.generateExperimentalMagicCards();
    this.flipped = [];
    this.experimentalLockBoard = false;
    this.state = this.buildExperimentalMagicState();
  }
  onCardClick(cardId: string) { this.onExperimentalMagicCardClick(cardId); }
  onSettingsChange(settings: MemorySettings) { this.onExperimentalMagicSettingsChange(settings); }
  reset() { this.experimentalMagicReset(); }
}
