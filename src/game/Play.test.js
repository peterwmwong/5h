import Play, {
  fullHouseRank,
  groupBySize,
  isFlush,
  isFullHouse,
  isStraight,
  isSisters,
  sameRank,
  sortByRank
} from './Play';
import Card, { DECK } from './Card';

const cardByName = name => DECK.find(c => c.name === name);
const cardsByNames = (...names) => names.map(name => DECK.find(c => c.name === name));

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

  describe('sameRank(cards)', () => {
    it('returns true if all cards have the same rank', () => {
      expect(
        sameRank([])
      ).toBe(true);

      expect(
        sameRank(cardsByNames('3 of Hearts'))
      ).toBe(true);

      expect(
        sameRank(
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
        sameRank(
          cardsByNames(
            '5 of Hearts',
            '6 of Hearts'
          )
        )
      ).toBe(false);

      expect(
        sameRank(
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
      });
    });
  });

  describe('isFlush(cards)', () => {
    it('returns true if all cards have the same suit', () => {
      expect(
        isFlush(
          cardsByNames(
            '3 of Hearts'
          )
        )
      ).toBe(true);

      expect(
        isFlush(
          cardsByNames(
            '3 of Hearts',
            '4 of Hearts',
            '5 of Hearts'
          )
        )
      ).toBe(true);
    });

    it("returns false if card's suit differs from the others", () => {
      expect(
        isFlush(
          cardsByNames(
            '3 of Hearts',
            '4 of Diamonds',
            '5 of Hearts',
            '6 of Hearts'
          )
        )
      ).toBe(false);
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

      it('sisters', () => {
        expect(
          type('3 of Clubs', '3 of Hearts', '4 of Hearts', '4 of Diamonds')
        ).toBe('PAIRS_SISTERS_X2');

        expect(
          type('4 of Hearts', '4 of Diamonds', '3 of Clubs', '3 of Hearts')
        ).toBe('PAIRS_SISTERS_X2');
      });
    });
  });
});
