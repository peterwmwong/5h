import Card, { createDeck } from './Card';
import { ALL_CARD_NAMES } from './CardTestConstants'

describe('createDeck', () => {
  let cards;
  beforeEach(() => {
    cards = createDeck();
  });

  it('instanceof Card', () => {
    cards.forEach(card => {
      expect(card).toBeInstanceOf(Card);
    });
  });

  it('Has all the cards', () => {
    const actualCardNames = cards.map(card => card.name).sort();

    expect(actualCardNames).toEqual(ALL_CARD_NAMES);
  });
});
