// Emoji Helper - בוחר אימוג'ים מגוונים (לא רק פרצופים, ללא חזירים)
import openmoji from '../assets/openmoji.json';

// מחזיר מערך אימוג'ים זמין למשחק, עם אפשרות לסינון לפי קטגוריה/כמות
export function getAvailableEmojis(count: number, categories?: string[]): string[] {
  // TODO: קריאה מ-openmoji.json, סינון לפי קטגוריה, ללא חזירים/חזירי בר
  // כרגע דמו
  const all = [
    '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰',
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔',
    '🍎','🍌','🍇','🍉','🍓','🍒','🍑','🍍','🥭','🍅','🥑','🥦','🥕','🌽','🍔','🍟',
    '⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥅','🏒','🏑','🥍','🏏','⛳'
  ];
  let filtered = all;
  if (categories && categories.length) {
    // סינון לפי קטגוריה (דמו)
    filtered = all.filter(e => categories.includes('all'));
  }
  // סינון חזירים/חזירי בר (דמו)
  filtered = filtered.filter(e => e !== '🐷' && e !== '🐗');
  // ערבוב ובחירה
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }
  return filtered.slice(0, count);
}
