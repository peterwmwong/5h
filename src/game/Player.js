export default class Player {
  constructor(id, cards=[]) {
    this.id = id;
    this.cards = cards;
  }

  hasAllCards(cardIds) {
    const playerCardIds = this.cards.map(c => c.id);
    return cardIds.every(cid =>
      playerCardIds.indexOf(cid) !== -1
    );
  }

  removeCards(cardIds) {
    this.cards = this.cards.filter(c =>
      cardIds.indexOf(c.id) === -1
    );
  }
}
