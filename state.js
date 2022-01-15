import * as view from "./view-3.js";
export let globalState;

class State {
  betObj;
  player;
  dealer;
  gameActive;
  cardsDealt;
  remainingCards;
  actionBtnState = {
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    surrender: false,
  };

  constructor(bank, options, specialNum) {
    this.specialNum = specialNum;
    this.bank = bank;
    this.options = options;
  }

  initialAddPlayers(arr) {
    let [player, dealer] = arr;
    this.player = player;
    this.dealer = dealer;
  }

  // addWinnings(winnings) {
  //   this.bank = this.bank + winnings;
  //   view.updateBank(bank);
  // }

  updateBank(bank) {
    this.bank = bank;
    view.updateBank(this.bank);
  }

  updateWinningsToBank(winnings) {
    this.bank = this.bank + winnings;
    view.updateBank(this.bank);
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
    view.renderPlayerHands(this.player);
    // view.renderPlayerField(this.player.hand);
  }

  set updateDealer(dealer) {
    this.dealer = dealer;
    view.renderDealerField(this.dealer.hand);
  }

  // checkSplitAvailable() {
  //   if (this.bank - this.betObj.baseBet <= 0) {
  //     this.splitAvailable = false;
  //     return;
  //   }

  //   if (this.player.checkValidSplit(this.options)) this.splitAvailable = true;
  //   else this.splitAvailable = false;
  // }

  checkSplitAvailable(hand) {
    let player = this.player;
    let activeHand = player.currentSplitHand;

    if (this.bank - this.betObj.baseBet <= 0) {
      this.splitAvailable = false;
      return;
    }

    if (activeHand > 0) {
      if (player.splitHands.length >= 4) {
        this.splitAvailable = false;
        return;
      }
    }

    // let hand = this.player.hand;

    if (this.player.currentSplitHand == 0)
      this.player.checkValidSplit(hand, this.options);

    if (hand.splitValid) this.splitAvailable = true;
    else this.splitAvailable = false;
  }

  // checkDoubleDownAvailable() {
  //   if (this.bank - this.betObj.baseBet < 0) this.doubleDownAvailable = false;
  //   else this.doubleDownAvailable = true;
  // }

  checkDoubleDownAvailable(hand) {
    if (this.bank - this.betObj.baseBet < 0) {
      this.doubleDownAvailable = false;
      return;
    }

    if (this.player.currentSplitHand != 0) {
      if (hand.resplitDoubleValid) this.doubleDownAvailable = true;
      else this.doubleDownAvailable = false;
      return;
    }

    this.doubleDownAvailable = true;
  }

  checkValidInsurance() {
    // if (insuranceAlreadyChecked) return;
    // insuranceAlreadyChecked = true;
    let dealerInitialFaceUpCard = this.dealer.hand.cards[1].value;
    let bank = this.player.bank;
    let betAmount = this.betObj.baseBet;

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

  updateHouseMoneyModalNeeded(boolean) {
    boolean
      ? (this.beginGameRoutineOrder.houseMoney = true)
      : (this.beginGameRoutineOrder.houseMoney = false);
  }

  set toggleEnableActionBtns(obj) {
    this.actionBtnState = { ...this.actionBtnState, ...obj };
    view.renderGameActionBtns(this.actionBtnState);
  }

  set updateNoticeText(str) {
    this.noticeText = str;
    view.renderNoticeText(str);
  }

  subtractBaseBetFromBank() {
    let betAmount = this.betObj.baseBet;
    this.bank = this.bank - betAmount;
    this.updateBank(this.bank);
  }

  // updateSplitBet() {
  //   let currentSplitHand = this.player.currentSplitHand;
  //   let totalSplitHands = this.player.totalSplitHands;

  //   this.betObj.splitBet(currentSplitHand, totalSplitHands);
  //   this.subtractSplitBetFromBank();
  // }
  updateSplitBet() {
    let currentSplitHand = this.player.currentSplitHand;
    let totalSplitHands = this.player.splitHands.length;

    this.betObj.splitBet(currentSplitHand, totalSplitHands);
    this.subtractBaseBetFromBank();
  }

  updateDoubleDownBet() {
    this.betObj.applyDoubleDown(this.player.currentSplitHand);
    this.subtractBaseBetFromBank();
    // view.updateBaseBet(this.betObj.baseBet);
    view.toggleDoubleDownMarker(true);
  }
}

export function initNewState(bank, options) {
  let gameState = new State(bank, options);
  globalState = gameState;
  return gameState;
}
