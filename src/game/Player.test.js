import Player from './Player';
import Card, { DECK } from './Card';

const PLAYER_1 = 'PLAYER_1';

const cardsByIds = (...ids) => ids.map(id => DECK.find(c => c.id === id));

describe('Player', () => {
  describe('hasAllCards(cardIds)', () => {
    let player;
    beforeEach(() => {
      player = new Player(
        PLAYER_1,
        cardsByIds(
          '3 of Hearts',
          '4 of Diamonds',
          '5 of Clubs'
        )
      );
    });

    it('returns true if player has all cardIds', () => {
      expect(
        player.hasAllCards(['3 of Hearts'])
      ).toBe(true);

      expect(
        player.hasAllCards([
          '3 of Hearts',
          '4 of Diamonds',
          '5 of Clubs'
        ])
      ).toBe(true);
    });

    it("returns false if player doesn't have all cardIds", () => {
      expect(
        player.hasAllCards(['3 of Diamonds'])
      ).toBe(false);

      expect(
        player.hasAllCards([
          '3 of Hearts',
          '4 of Diamonds',
          '5 of Clubs',
          '6 of Spades'
        ])
      ).toBe(false);
    });
  });

  describe('removeCards(cardIds)', () => {
    let player;
    beforeEach(() => {
      player = new Player(
        PLAYER_1,
        cardsByIds(
          '3 of Hearts',
          '4 of Diamonds',
          '5 of Clubs'
        )
      );
    });

    it('removes all cards with matching ids', () => {
      player.removeCards(['4 of Diamonds']);
      expect(player.cards).toEqual(
        cardsByIds(
          '3 of Hearts',
          '5 of Clubs'
        )
      );

      player.removeCards([
        '3 of Hearts',
        '5 of Clubs'
      ]);
      expect(player.cards).toEqual([]);
    });
  });
});
