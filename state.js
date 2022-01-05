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

  checkSplitAvailable() {
    if (this.player.checkValidSplit(this.options)) this.splitAvailable = true;
    if (this.bank - this.betObj.baseBet > 0) this.splitAvailable = true;
    else this.splitAvailable = false;
  }

  checkDoubleDownAvailable() {
    if (this.bank - this.betObj.baseBet < 0) this.doubleDownAvailable = false;
    else this.doubleDownAvailable = true;
  }

  checkValidInsurance() {
    // if (insuranceAlreadyChecked) return;
    // insuranceAlreadyChecked = true;
    let dealerInitialFaceUpCard = this.dealer.hand.cards[1].value;
    let bank = this.player.bank;
    let betAmount = this.player.betObj.baseBet;

    // if (this.evenMoneyAvailable == true) return;
    if (this.evenMoneyAvailable || !this.options.insuranceEnabled) {
      this.insuranceAvailable = false;
      return;
    }

    if (dealerInitialFaceUpCard == "ACE" && bank >= 1 && betAmount >= 2) {
      this.insuranceAvailable = true;
      return;
    }

    this.insuranceAvailable = false;
  }

  checkValidEvenMoney() {
    // if (insuranceAlreadyChecked) return;
    // insuranceAlreadyChecked = true;
    let dealerInitialFaceUpCard = this.dealer.hand.cards[1].value;
    let playerHandOutcome = this.player.hand.outcome;

    if (this.options.evenMoneyEnabled) {
      if (dealerInitialFaceUpCard == "ACE" && playerHandOutcome == `natural`) {
        this.evenMoneyAvailable = true;
        return;
      }
    }

    this.evenMoneyAvailable = false;
  }
}

export function initNewState(bank, options) {
  let gameState = new State(bank, options);
  globalState = gameState;
  return gameState;
}
