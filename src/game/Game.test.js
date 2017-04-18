import Game from './Game';
import Player from './Player';
import Card, { createDeck } from './Card';
import { ALL_CARD_NAMES } from './CardTestConstants';
import flatten from '../utils/flatten';

const PLAYER_1 = 'PLAYER_1';
const PLAYER_2 = 'PLAYER_2';

describe('Game', () => {
  describe('constructor({ playerIds:string[] })', () => {
    let game;
    beforeEach(() => {
      game = new Game({
        playerIds: [PLAYER_1, PLAYER_2]
      });
    });

    it('creates players', () => {
      const { players } = game;

      expect(players.length).toBe(2);
      players.forEach(p => {
        expect(p instanceof Player).toBe(true);
      });
    });

    describe('deals cards to players', () => {
      let p1Cards, p2Cards;

      beforeEach(() => {
        const { players: [ p1, p2 ] } = game;
        p1Cards = p1.cards;
        p2Cards = p2.cards;
      });

      it('all cards', () => {
        const allCards = flatten([p1Cards, p2Cards]);
        const allCardNames = allCards.map(c => c.name).sort();

        expect(allCardNames).toEqual(ALL_CARD_NAMES);
      });

      it('equal number of cards', () => {
        expect(p1Cards.length).toEqual(27);
        expect(p2Cards.length).toEqual(27);
      });

      it('not the same cards', () => {
        const p1CardNames = p1Cards.map(a => a.name).sort();
        const p2CardNames = p2Cards.map(a => a.name).sort();

        expect(p1CardNames).not.toEqual(p2CardNames);
      });
    });
  });
});

xdescribe('[Integration] Game', () => {
  const playerWith3OfHearts = game =>
    game.players.find(p =>
      p.cards.find(c => c.name === '3 of Hearts')
    );

  it('Plays a game', () => {
    const game = new Game({
      playerIds: [PLAYER_1, PLAYER_2]
    });

    // Player with the 3 of Hearts starts the game
    expect(
      !!game.currentTurnsPlayer.cards.find(c => c.name === '3 of Hearts')
    ).toBe(true);

    // Current player plays a card
    let curPlayer = game.currentTurnsPlayer;
    let playedCard = curPlayer.cards[0];
    game.play(curPlayer.id, [playedCard.id]);

    // Expect: Player no longer has the card (No player should have that card)
    expect(
      !!game.players.find(p =>
        p.cards.find(c => c.id === playedCard.id)
      )
    ).toBe(false);

    expect(game.currentTurnsPlayer.id).not.toBe(curPlayer.id);
  });
});
