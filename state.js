import * as view from "./view-3.js";
export let globalState;

class State {
  betObj;
  player;
  dealer;
  gameActive;
  cardsDealt;
  remainingCards;

  constructor(bank, options) {
    this.bank = bank;
    this.options = options;
  }

  initialAddPlayers(arr) {
    let [player, dealer] = arr;
    this.player = player;
    this.dealer = dealer;
  }

  addBetObj(betObj) {
    this.betObj = betObj;
  }

  toggleGameActive(toggle) {
    toggle ? (this.gameActive = true) : (this.gameActive = false);
    // bjModel.updateGameActive(toggle);
  }

  updateOptions(optionsObj) {
    this.options = optionsObj;
  }

  updateCardsDealt(boolean) {
    if (boolean) this.cardsDealt = true;
    else this.cardsDealt = false;
  }
  set updateRemainingCards(num) {
    this.remainingCards = num;
    if (this.remainingCards <= 2) bjModel.shuffleCards(this.options.deckCount);
  }

  set updatePlayer(player) {
    this.player = player;
    view.renderPlayerField(this.player.hand);
  }

  set updateDealer(dealer) {
    this.dealer = dealer;
    view.renderDealerField(this.dealer.hand);
  }
}

export function initNewState(bank, options) {
  let gameState = new State(bank, options);
  globalState = gameState;
  return gameState;
}
