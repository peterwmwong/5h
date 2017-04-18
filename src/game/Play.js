export const sortByRank = (a, b) => a.rank - b.rank;

export const same = (attr, [f, ...cards]) => cards.every(c => c[attr] === f[attr]);

export const groupBySize = ([...cards], size) =>
  [...Array(cards.length / size)].map(_ => cards.splice(0, size));

export const isStraight = cards =>
  cards.every((c, i) => i === 0 || c.rank - cards[i - 1].rank === 1);

export const isSisters = (sortedCards, size) => {
  if(sortedCards.length % size !== 0) return false;

  const groups = groupBySize(sortedCards, size);
  return (
    groups.every(c => same('rank', c)) && // Cards of each group have the same rank
    isStraight(groups.map(([c]) => c))    // Each group's rank make a straight
  );
}

// Assumption: input is sorted
export const isFullHouse = ([a, b, c, d, e]/* :[Card, Card, Card, Card, Card] */) =>
  (same('rank', [c, d, e]) && same('rank', [a, b])) || // XX YYY
  (same('rank', [a, b, c]) && same('rank', [d, e]));   // XXX YY

// Assumption: input is sorted and is a full house
export const fullHouseRank = ([, {rank: a}, {rank: b},,]) => a === b ? a : b;

export const typeForCards = cards => {
  const numCards = cards.length;
  switch(numCards){
    case 0: return 'INVALID';
    case 1: return 'SINGLES';
    case 2: return same('rank', cards) ? 'PAIRS' : 'INVALID';
    case 3: return same('rank', cards) ? 'TRIPLES' : 'INVALID';
    case 4:
      return (
          isSisters(cards, 2) ? 'PAIRS_SISTERS_X2'
        : same('rank', cards)     ? 'BOMB'
        : 'INVALID'
      );
    case 5:
      return (
          isStraight(cards)  ? (same('suit', cards) ? 'STRAIGHT_FLUSH'
                                                    : 'STRAIGHT_X5')
        : isFullHouse(cards) ? 'FULL_HOUSE'
        : 'INVALID'
      );
    default:
      return (
          isSisters(cards, 2) ? `PAIRS_SISTERS_X${numCards / 2}`
        : isSisters(cards, 3) ? `TRIPLES_SISTERS_X${numCards / 3}`
        : isStraight(cards)   ? `STRAIGHT_X${numCards}`
        : 'INVALID'
      );
  }
}

export default class Play {
  constructor(cards/* :Card[] */) {
    this.cards = cards.sort(sortByRank);
    this.type = typeForCards(this.cards);
  }

  isTrumpedBy({ cards, type }/* :Play */) /* :Boolean */ {
    if (this.type === type) {
      if(this.type === 'FULL_HOUSE') {
        return getFullHouseRank(this.cards) < getFullHouseRank(cards);
      }
      return this.cards[0].rank < cards[0].rank;
    }
    return type === 'BOMB' || type === 'STRAIGHT_FLUSH';
  }
}
