import flatten from '../utils/flatten';

const SUITS = [
  'Hearts',
  'Spades',
  'Clubs',
  'Diamonds'
];

export default class Card {
  constructor(rank, value, suit) {
    this.rank = rank;
    this.suit = suit || '';
    this.id = this.name = suit ? `${value} of ${suit}` : value;
  }
}

export const DECK = [
  ...flatten(
    SUITS.map(suit => [
      new Card(0, '3', suit),
      new Card(1, '4', suit),
      new Card(2, '5', suit),
      new Card(3, '6', suit),
      new Card(4, '7', suit),
      new Card(5, '8', suit),
      new Card(6, '9', suit),
      new Card(7, '10', suit),
      new Card(8, 'Jack', suit),
      new Card(9, 'Queen', suit),
      new Card(10, 'King', suit),
      new Card(11, 'Ace', suit),
      new Card(12, '2', suit)
    ])
  ),
  new Card(13, 'Small Joker'),
  new Card(14, 'Big Joker')
];

export const createDeck = () => [...DECK]
