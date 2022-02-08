import * as view from "./view-3.js";
export let globalState;

let roundNumber = 1;
let log = [];

class State {
  betObj;
  player;
  dealer;
  gameActive;
  cardsDealt;
  remainingCards;
  beginGameRoutineOrder = {};
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

  updateBank(bank) {
    this.bank = bank;
    view.gameInfoFields.updateBank(this.bank);
  }

  updateWinningsToBank(winnings) {
    this.bank = this.bank + winnings;
    view.gameInfoFields.updateBank(this.bank);
  }

  addBetObj(betObj) {
    this.betObj = betObj;
  }

  toggleGameActive(toggle) {
    toggle ? (this.gameActive = true) : (this.gameActive = false);
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
    let hand;

    let activeHand = player.currentSplitHand;

    if (activeHand == 0) hand = player.hand;
    else hand = player.getSplitHand(activeHand);

    console.log(hand);

    this.checkForJackpotAce(hand);
    view.gameField.renderPlayerHands(this.player);
  }

  set updateDealer(dealer) {
    this.dealer = dealer;
    this.checkForJackpotAce(this.dealer.hand);
    view.dealerField.renderField(this.dealer.hand);
    console.log(this.dealer.hand);
  }

  checkForJackpotAce(cardPlayerHand) {
    let count = 0;
    let aceSpadeFound;
    let cards = cardPlayerHand.cards;

    cards.forEach(function (card) {
      card.value == `ACE` &&
        card.suit == `SPADES` &&
        card.checked != true &&
        count++;
    });

    aceSpadeFound = count > 0 ? true : false;

    if (aceSpadeFound) this.specialNum.trackJackpotAce(cardPlayerHand);
  }

  checkForNaturalHands() {
    let player = this.player;
    let activeHand = player.currentSplitHand;
    let hand;

    if (activeHand == 0) hand = player.hand;
    else hand = player.splitHands[0];

    return hand.outcome == `natural` || this.dealer.hand.outcome == `natural`
      ? true
      : false;
  }

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

    if (this.player.currentSplitHand == 0)
      this.player.checkValidSplit(hand, this.options);

    if (hand.splitValid) this.splitAvailable = true;
    else this.splitAvailable = false;
  }

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
    let dealerInitialFaceUpCard = this.dealer.hand.cards[1].value;
    let bank = this.player.bank;
    let betAmount = this.betObj.baseBet;

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
    view.gameActionBtns.renderBtns(this.actionBtnState);
  }

  set updateNoticeText(str) {
    this.noticeText = str;
    view.gameInfoFields.renderNoticeText(str);
  }

  subtractBaseBetFromBank() {
    let betAmount = this.betObj.baseBet;
    this.bank = this.bank - betAmount;
    this.updateBank(this.bank);
  }

  updateSplitBet() {
    let currentSplitHand = this.player.currentSplitHand;
    let totalSplitHands = this.player.splitHands.length;

    this.betObj.splitBet(currentSplitHand, totalSplitHands);
    this.subtractBaseBetFromBank();
  }

  updateDoubleDownBet() {
    this.betObj.applyDoubleDown(this.player.currentSplitHand);
    this.subtractBaseBetFromBank();
    view.gameInfoFields.toggleDoubleDownMarker(true);
  }

  determineBaseRoundOutcome() {
    let player = this.player;
    let dealer = this.dealer;
    let dealerHand = dealer.hand;
    let activeHand = player.currentSplitHand;
    let betObj = this.betObj;
    let gameState = this;
    let winnings = [];

    if (activeHand == 0) {
      let hand = player.hand;
      this.calculateHandMatchup(hand, dealerHand);
      hand.calculateWinnings(this.options, this.betObj.baseBet);
      hand.generateOutcomePackage();
      winnings.push(hand.winnings);
    } else {
      player.splitHands.forEach(function (hand, index) {
        let bet;

        if (index == 0) bet = betObj.baseBet;
        else if (index == 1) bet = betObj.splitBets.splitHand2;
        else if (index == 2) bet = betObj.splitBets.splitHand3;
        else bet = betObj.splitBets.splitHand4;

        gameState.calculateHandMatchup(hand, dealerHand);
        hand.calculateWinnings(gameState.options, bet);
        hand.generateOutcomePackage();
        winnings.push(hand.winnings);
      });
    }

    this.playerWinnings = winnings.reduce((prev, curr) => prev + curr);
  }

  calculateHandMatchup(hand, dealerHand) {
    let playerOutcome = hand.getFinalOutcome();
    let dealerOutcome = dealerHand.getFinalOutcome();
    let roundOutcome;
    let roundOutcomeText;
    let handNum = hand.handNum;

    switch (true) {
      case playerOutcome == `surrender`:
        roundOutcome = `surrender`;
        roundOutcomeText = `Player has surrendered`;
        break;
      case playerOutcome == `surrenderFail`:
        roundOutcome = `lose`;
        roundOutcomeText = `Failed surrender.  Dealer has Blackjack.`;
        break;
      case playerOutcome == dealerOutcome:
        if (playerOutcome == `bust`) {
          roundOutcome = `lose`;
          roundOutcomeText = `Player busts...`;
        } else roundOutcome = "push";
        break;
      case playerOutcome == `bust`:
        roundOutcome = `lose`;
        roundOutcomeText = `Player busts...`;
        break;
      case dealerOutcome == `bust`:
        roundOutcome = `win`;
        roundOutcomeText = `Dealer busts.`;
        break;
      case playerOutcome == `natural`:
        roundOutcome = `natural`;
        roundOutcomeText = `Player has Blackjack!!!`;
        break;
      case dealerOutcome == `natural`:
        roundOutcome = `lose`;
        roundOutcomeText = `Dealer has Blackjack...`;
        break;
      case playerOutcome == `charlie`:
        roundOutcome = `win`;
        roundOutcomeText = `Player has ${hand.charlieType} Card Charlie`;
        break;
      case dealerOutcome == `charlie`:
        roundOutcome = `lose`;
        roundOutcomeText = `Dealer has ${dealerHand.charlieType} Card Charlie`;
        break;
      default:
        hand.outcome = null;
        dealerHand.outcome = null;

        if (hand.total == dealerHand.total) roundOutcome = `push`;
        else if (dealerHand.total > hand.total) roundOutcome = `lose`;
        else roundOutcome = `win`;

        if (roundOutcome == `win`) roundOutcomeText = `Dealer Loses!`;
        else if (roundOutcome == `lose`) roundOutcomeText = `Dealer Wins...`;
    }

    hand.roundOutcome = roundOutcome;

    if (roundOutcome == `push`) {
      let qualifier;

      roundOutcomeText = `Player Push.  `;

      if (playerOutcome == `charlie` || playerOutcome == `natural`) {
        if (playerOutcome == `charlie`) qualifier = `Charlies`;
        if (playerOutcome == `natural`) qualifier = `Blackjack`;

        roundOutcomeText = roundOutcomeText + `Both players have ${qualifier}`;
      }
    }

    hand.roundOutcomeText = roundOutcomeText;
  }

  revealDealerFaceDown() {
    this.dealer.hand.revealFaceDownCard();
    view.dealerField.renderField(this.dealer.hand);
  }

  calculateTotalWinnings() {
    this.playerWinnings += this.betObj.initialSideBetWinnings;
    this.playerWinnings += this.betObj.endingSideBetWinnings;

    this.totalWinnings = this.playerWinnings;
  }

  set addRoundNumber(num) {
    this.roundNumber = num;
  }

  abortGame() {
    this.gameAborted = true;
  }

  deductHalfBetFromBank() {
    let newBank = this.bank - Math.round(this.betObj.baseBet / 2);
    this.updateBank(newBank);
  }
}

export function addStateToLog(gameState) {
  gameState.addRoundNumber = roundNumber;
  log.push(gameState);
  roundNumber++;
  console.log(log);
}

export function initNewState(bank, options, specialNum) {
  let gameState = new State(bank, options, specialNum);
  globalState = gameState;
  return gameState;
}
