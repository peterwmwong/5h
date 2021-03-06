import Play, {
  fullHouseRank,
  groupBySize,
  isFullHouse,
  isStraight,
  isSisters,
  same,
  sortByRank
} from './Play';
import Card, { DECK } from './Card';
import shuffle from '../utils/shuffle';

const cardsByNames = (...names) =>
  names.map(name => {
    const card = DECK.find(c => c.name === name);
    if (card == null) throw `Could not find card with name "${name}"`;
    return card;
  });

const playForCardNames = cardNames => new Play(cardsByNames(...cardNames));

const BOMB_4_OF_A_KIND = [
  '3 of Hearts',
  '3 of Diamonds',
  '3 of Spades',
  '3 of Clubs'
];

const BOMB_STRAIGHT_FLUSH = [
  '3 of Hearts',
  '4 of Hearts',
  '5 of Hearts',
  '6 of Hearts',
  '7 of Hearts'
];

describe('Play', () => {
  describe('sortByRank(a, b)', () => {
    it('sorts by rank', () => {
      const sortedRanks = [...DECK].sort(sortByRank).map(c => c.rank);
      // Each card is is higher or equal rank to the card before
      expect(
        sortedRanks.every((r, i) => i === 0 || sortedRanks[i - 1] <= r)
      ).toBe(true);
    });
  });

  describe('same(attr, cards)', () => {
    it('returns true if all cards have the same rank', () => {
      expect(
        same('rank', [])
      ).toBe(true);

      expect(
        same('rank', cardsByNames('3 of Hearts'))
      ).toBe(true);

      expect(
        same(
          'rank',
          cardsByNames(
            '5 of Hearts',
            '5 of Spades',
            '5 of Diamonds',
            '5 of Clubs'
          )
        )
      ).toBe(true);
    });

    it('returns false if not all cards have the same rank', () => {
      expect(
        same(
          'rank',
          cardsByNames(
            '5 of Hearts',
            '6 of Hearts'
          )
        )
      ).toBe(false);

      expect(
        same(
          'rank',
          cardsByNames(
            '5 of Hearts',
            '5 of Spades',
            '5 of Diamonds',
            '5 of Clubs',
            '6 of Hearts'
          )
        )
      ).toBe(false);
    });
  });

  describe('groupBySize(cards, groupSize)', () => {
    it('returns arrays of arrays of size `groupSize`', () => {
      const input = [1, 2, 3, 4, 5, 6];

      expect(
        groupBySize(input, 2)
      ).toEqual([
        [1, 2],
        [3, 4],
        [5, 6]
      ]);

      expect(
        groupBySize(input, 3)
      ).toEqual([
        [1, 2, 3],
        [4, 5, 6]
      ]);
    });
  });


  describe('isStraight(cards)', () => {
    it('returns true if cards have consecutive rank', () => {
      expect(
        isStraight(
          cardsByNames(
            '3 of Hearts',
            '4 of Clubs',
            '5 of Clubs',
          ),
          2
        )
      ).toBe(true);
    });
  });

  describe('isSisters(cards, groupSize)', () => {
    it('returns true if each group is 1) the same rank 2) consecutive', () => {
      expect(
        isSisters(
          cardsByNames(
            '3 of Hearts',
            '3 of Diamonds',

            '4 of Clubs',
            '4 of Spades'
          ),
          2
        )
      ).toBe(true);

      expect(
        isSisters(
          cardsByNames(
            '3 of Hearts',
            '3 of Diamonds',

            '4 of Clubs',
            '4 of Spades',

            '5 of Hearts',
            '5 of Spades'
          ),
          2
        )
      ).toBe(true);

      expect(
        isSisters(
          cardsByNames(
            '3 of Hearts',
            '3 of Diamonds',
            '3 of Clubs',

            '4 of Clubs',
            '4 of Spades',
            '4 of Diamonds'
          ),
          3
        )
      ).toBe(true);
    });

    describe('returns false', () => {
      it('returns false the number of cards is not divisible by `groupSize`', () => {
        expect(
          isSisters(
            cardsByNames(
              '3 of Hearts',
              '3 of Diamonds',

              '4 of Clubs'
            ),
            2
          )
        ).toBe(false);
      });

      it("returns false if a group's cards don't all have the same rank", () => {
        expect(
          isSisters(
            cardsByNames(
              '3 of Hearts',
              '3 of Diamonds',

              '4 of Clubs',
              '5 of Diamonds'
            ),
            2
          )
        ).toBe(false);
      });

      it("returns false if a groups are not consecutive", () => {
        expect(
          isSisters(
            cardsByNames(
              '3 of Hearts',
              '3 of Diamonds',

              '5 of Hearts',
              '5 of Diamonds'
            ),
            2
          )
        ).toBe(false);

        expect(
          isSisters(
            cardsByNames(
              '2 of Hearts',
              '2 of Diamonds',

              '3 of Hearts',
              '3 of Diamonds'
            ),
            2
          )
        ).toBe(false);
      });
    });
  });

  describe('isFullHouse(cards)', () => {
    it('returns true if cards contains a pair and a triple', () => {
      expect(
        isFullHouse(
          cardsByNames(
            '3 of Hearts',
            '3 of Diamonds',

            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds'
          )
        )
      ).toBe(true);

      expect(
        isFullHouse(
          cardsByNames(
            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds',

            '3 of Hearts',
            '3 of Diamonds'
          )
        )
      ).toBe(true);
    });

    it("returns false if otherwise", () => {
      expect(
        isFullHouse(
          cardsByNames(
            '3 of Hearts',
            '4 of Diamonds',
            '5 of Hearts',
            '6 of Hearts',
            '7 of Hearts'
          )
        )
      ).toBe(false);

      expect(
        isFullHouse(
          cardsByNames(
            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds',

            '3 of Hearts',
            '10 of Diamonds'
          )
        )
      ).toBe(false);

      expect(
        isFullHouse(
          cardsByNames(
            '5 of Clubs',
            '10 of Hearts',
            '5 of Diamonds',

            '3 of Hearts',
            '3 of Diamonds'
          )
        )
      ).toBe(false);

      expect(
        isFullHouse(
          cardsByNames(
            '10 of Hearts',
            '3 of Diamonds',

            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds'
          )
        )
      ).toBe(false);

      expect(
        isFullHouse(
          cardsByNames(
            '3 of Hearts',
            '3 of Diamonds',

            '5 of Clubs',
            '10 of Hearts',
            '5 of Diamonds'
          )
        )
      ).toBe(false);
    });
  });

  describe('fullHouseRank(cards)', () => {
    it('returns rank if of the triple', () => {
      expect(
        fullHouseRank(
          cardsByNames(
            '3 of Hearts',
            '3 of Diamonds',

            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds'
          )
        )
      ).toBe(cardsByNames('5 of Clubs')[0].rank);

      expect(
        fullHouseRank(
          cardsByNames(
            '3 of Clubs',
            '3 of Hearts',
            '3 of Diamonds',

            '5 of Hearts',
            '5 of Diamonds',
          )
        )
      ).toBe(cardsByNames('3 of Clubs')[0].rank);
    });
  });

  describe('constructor(cards)', () => {
    describe('type', () => {
      const type = (...cardNames) => new Play(cardsByNames(...cardNames)).type;

      it('singles', () => {
        expect(type('3 of Clubs')).toBe('SINGLES');
      });

      it('pairs', () => {
        expect(type('3 of Clubs', '3 of Hearts')).toBe('PAIRS');
      });

      it('triples', () => {
        expect(type('3 of Clubs', '3 of Hearts', '3 of Hearts')).toBe('TRIPLES');
      });

      it('bomb', () => {
        expect(
          type('3 of Clubs', '3 of Hearts', '3 of Hearts', '3 of Diamonds')
        ).toBe('BOMB');
      });

      describe('sisters', () => {
        it('pairs', () => {
          expect(
            type('3 of Clubs', '3 of Hearts', '4 of Hearts', '4 of Diamonds')
          ).toBe('PAIRS_SISTERS_X2');

          expect(
            type('4 of Hearts', '4 of Diamonds', '3 of Clubs', '3 of Hearts')
          ).toBe('PAIRS_SISTERS_X2');

          expect(
            type(
              '3 of Clubs',
              '3 of Hearts',

              '4 of Hearts',
              '4 of Diamonds',

              '5 of Hearts',
              '5 of Diamonds'
            )
          ).toBe('PAIRS_SISTERS_X3');

          expect(
            type(
              '3 of Clubs',
              '3 of Hearts',

              '4 of Hearts',
              '4 of Diamonds',

              '5 of Hearts',
              '5 of Diamonds',

              '6 of Spades',
              '6 of Clubs'
            )
          ).toBe('PAIRS_SISTERS_X4');

          // Same as previous, shuffling cards to verify detection is not order
          // dependent
          expect(
            type(
              ...shuffle([
                '3 of Clubs',
                '3 of Hearts',

                '4 of Hearts',
                '4 of Diamonds',

                '5 of Hearts',
                '5 of Diamonds',

                '6 of Spades',
                '6 of Clubs'
              ])
            )
          ).toBe('PAIRS_SISTERS_X4');
        });

        it('triples', () => {
          expect(
            type(
              '3 of Clubs',
              '3 of Hearts',
              '3 of Spades',

              '4 of Hearts',
              '4 of Diamonds',
              '4 of Clubs',
            )
          ).toBe('TRIPLES_SISTERS_X2');
        });
      });

      it('straight flush', () => {
        expect(
          type('3 of Clubs', '4 of Clubs', '5 of Clubs', '6 of Clubs', '7 of Clubs')
        ).toBe('STRAIGHT_FLUSH');

        expect(
          type('10 of Clubs', 'Jack of Clubs', 'Queen of Clubs', 'King of Clubs', 'Ace of Clubs')
        ).toBe('STRAIGHT_FLUSH');
      });

      it('full house', () => {
        expect(
          type('3 of Clubs', '3 of Hearts', '5 of Clubs', '5 of Diamonds', '5 of Spades')
        ).toBe('FULL_HOUSE');

        expect(
          type('Jack of Clubs', 'Jack of Hearts', 'Jack of Spades', '5 of Diamonds', '5 of Spades')
        ).toBe('FULL_HOUSE');
      });

      it('straight', () => {
        expect(
          type(
            '3 of Diamonds',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs'
          )
        ).toBe('STRAIGHT_X5');

        expect(
          type(
            '3 of Diamonds',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs',
            '8 of Clubs'
          )
        ).toBe('STRAIGHT_X6');

        expect(
          type(
            '3 of Diamonds',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs',
            '8 of Clubs',
            '9 of Clubs'
          )
        ).toBe('STRAIGHT_X7');

        expect(
          type(
            '3 of Diamonds',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs',
            '8 of Clubs',
            '9 of Clubs',
            '10 of Clubs',
            'Jack of Clubs',
            'Queen of Clubs',
            'King of Clubs',
            'Ace of Clubs'
          )
        ).toBe('STRAIGHT_X12');

        // TODO: @ddrscott is this right? There's no straight flush with >5 cards?
        expect(
          type(
            '3 of Clubs',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs',
            '8 of Clubs',
            '9 of Clubs',
            '10 of Clubs',
            'Jack of Clubs',
            'Queen of Clubs',
            'King of Clubs',
            'Ace of Clubs'
          )
        ).toBe('STRAIGHT_X12');
      });
    });
  });

  describe('isTrumpedBy(play)', () => {
    expect.extend({
      toTrump(received, argument) {
        const pass = playForCardNames(argument).isTrumpedBy(playForCardNames(received));
        let message = () => `expected [${received.join(', ')}] ${pass ? 'NOT ' : ''}to trump [${argument.join(', ')}]`;
        return { pass, message };
      }
    });

    it('singles', () => {
      expect([ '2 of Clubs' ]).toTrump([ '3 of Clubs' ]);
      expect([ '4 of Clubs' ]).toTrump([ '3 of Clubs' ]);
      expect([ 'Jack of Clubs' ]).toTrump([ '10 of Clubs' ]);
      expect([ 'Queen of Clubs' ]).toTrump([ 'Jack of Clubs' ]);
      expect([ 'King of Clubs' ]).toTrump([ 'Queen of Clubs' ]);
      expect([ 'Ace of Clubs' ]).toTrump([ 'King of Clubs' ]);
      expect([ '2 of Clubs' ]).toTrump([ 'Ace of Clubs' ]);
      expect([ 'Small Joker' ]).toTrump([ '2 of Clubs' ]);
      expect([ 'Big Joker' ]).toTrump([ 'Small Joker' ]);
      expect([ '5 of Hearts' ]).toTrump([ 'Big Joker' ]);

      expect(BOMB_4_OF_A_KIND).toTrump([ '5 of Hearts' ]);
      expect(BOMB_STRAIGHT_FLUSH).toTrump([ '5 of Hearts' ]);
    });

    it('pairs', () => {
      expect([
        '2 of Clubs', '2 of Spades'
      ]).toTrump([
        '3 of Clubs', '3 of Diamonds'
      ]);

      expect([
        '4 of Clubs', '4 of Spades'
      ]).toTrump([
        '3 of Clubs', '3 of Diamonds'
      ]);

      expect([
        '6 of Clubs', '6 of Spades'
      ]).toTrump([
        '5 of Hearts', '5 of Diamonds'
      ]);

      expect([
        'Jack of Clubs', 'Jack of Spades'
      ]).toTrump([
        '10 of Clubs', '10 of Diamonds'
      ]);

      expect([
        'Queen of Clubs', 'Queen of Spades'
      ]).toTrump([
        'Jack of Clubs', 'Jack of Diamonds'
      ]);

      expect([
        'King of Clubs', 'King of Spades'
      ]).toTrump([
        'Queen of Clubs', 'Queen of Diamonds'
      ]);

      expect([
        'Ace of Clubs', 'Ace of Spades'
      ]).toTrump([
        'King of Clubs', 'King of Diamonds'
      ]);

      expect([
        '2 of Clubs', '2 of Spades'
      ]).toTrump([
        'Ace of Clubs', 'Ace of Diamonds'
      ]);

      expect(['2 of Clubs', '2 of Spades'])
        .not.toTrump(BOMB_4_OF_A_KIND);
      expect(['2 of Clubs', '2 of Spades'])
        .not.toTrump(BOMB_STRAIGHT_FLUSH);
    });

    it('triples', () => {
      expect([
        '2 of Clubs', '2 of Spades', '2 of Diamonds'
      ]).toTrump([
        'Ace of Clubs', 'Ace of Diamonds', 'Ace of Hearts'
      ]);

      expect(['2 of Clubs', '2 of Spades', '2 of Diamonds'])
        .not.toTrump(BOMB_4_OF_A_KIND);
      expect(['2 of Clubs', '2 of Spades', '2 of Diamonds'])
        .not.toTrump(BOMB_STRAIGHT_FLUSH);
    });

    it('bomb', () => {
      expect([
        '2 of Clubs', '2 of Hearts', '2 of Hearts', '2 of Diamonds'
      ]).toTrump([
        '3 of Clubs', '3 of Hearts', '3 of Hearts', '3 of Diamonds'
      ]);
      expect([
        '4 of Clubs', '4 of Hearts', '4 of Hearts', '4 of Diamonds'
      ]).toTrump([
        '3 of Clubs', '3 of Hearts', '3 of Hearts', '3 of Diamonds'
      ]);
    });

    it('sisters', () => {
      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).toTrump([
        'Ace of Clubs', 'Ace of Hearts',
        'King of Hearts', 'King of Diamonds'
      ]);

      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds',
        'King of Hearts', 'King of Diamonds'
      ]).toTrump([
        'Ace of Clubs', 'Ace of Hearts',
        'King of Hearts', 'King of Diamonds',
        'Queen of Hearts', 'Queen of Diamonds'
      ]);

      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump(BOMB_4_OF_A_KIND);

      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump(BOMB_STRAIGHT_FLUSH);
    });

    it('straight flush', () => {
      expect([
        '4 of Clubs', '5 of Clubs', '6 of Clubs', '7 of Clubs', '8 of Clubs'
      ]).toTrump([
        '3 of Clubs', '4 of Clubs', '5 of Clubs', '6 of Clubs', '7 of Clubs'
      ]);
    });

    it('full house', () => {
      expect([
        'Jack of Clubs', 'Jack of Hearts', 'Jack of Spades',
        '5 of Diamonds', '5 of Spades'
      ]).toTrump([
        '3 of Clubs', '3 of Hearts',
        '5 of Clubs', '5 of Diamonds', '5 of Spades'
      ]);

      expect([
        'Jack of Clubs', 'Jack of Hearts', 'Jack of Spades',
        '5 of Diamonds', '5 of Spades'
      ]).toTrump([
        'King of Clubs', 'King of Hearts',
        '5 of Clubs', '5 of Diamonds', '5 of Spades'
      ]);

      expect([
        '2 of Clubs', '2 of Hearts', '2 of Spades',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump(BOMB_4_OF_A_KIND);

      expect([
        '2 of Clubs', '2 of Hearts', '2 of Spades',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump(BOMB_STRAIGHT_FLUSH);
    });

    it('straight', () => {
      expect([
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs',
        '8 of Diamonds'
      ]).toTrump([
        '3 of Diamonds',
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs'
      ]);

      expect([
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs',
        '8 of Diamonds'
      ]).not.toTrump(BOMB_4_OF_A_KIND);

      expect([
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs',
        '8 of Diamonds'
      ]).not.toTrump(BOMB_STRAIGHT_FLUSH);
    });
  });
});
