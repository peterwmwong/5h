import Player from './Player';
import { createDeck } from './Card';
import shuffle from '../utils/shuffle';

const dealCardsToPlayers = (players) => {
  const numPlayers = players.length;

  shuffle(createDeck()).forEach((card, i) => {
    const player = players[i % numPlayers];
    player.cards.push(card);
  })
};

const playerWith3OfHearts = players =>
  players.find(p =>
    p.cards.find(c => c.name === '3 of Hearts')
  )

const PLAY_TYPE_INVALID = 'INVALID';

const cardsPlayType = cards => {
  // Singles
  switch(cards.length){
    case 0: return PLAY_TYPE_INVALID;
  }
  if (cards.length === 1) return 'Singles';
  if (cards.length === 2) return 'Singles';
}

export default class Game {
  constructor({ playerIds }) {
    const players = this.players = playerIds.map(id => new Player(id));
    dealCardsToPlayers(players);
    this.currentTurnsPlayer = playerWith3OfHearts(players);
    this.currentTurnsCards = [];
  }

  play(playerId, cardIds){
    const { currentTurnsPlayer, players } = this;

    // Verify player is current player
    if (currentTurnsPlayer.id !== playerId)
      throw `Player ${playerId} is not the current turn's player ${currentTurnsPlayer.id}`;

    // Verify current player has all cards
    if (!currentTurnsPlayer.hasAllCards(cardIds))
      throw `Player ${playerId} does not have the ${cardId} card.`;

    // Take card from player
    currentTurnsPlayer.removeCards(cardIds);

    // Next player's turn
    const nextPlayerIndex = (players.indexOf(currentTurnsPlayer) + 1) % players.length;
    this.currentTurnsPlayer = players[nextPlayerIndex];
  }
}
