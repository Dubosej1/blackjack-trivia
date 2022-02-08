import * as view from "./view-3.js";
import * as sideBetMod from "./side-bet-objs.js";
import * as sideBetFunc from "./side-bet-functions.js";

class Bet {
  bank;
  baseBet = 0;
  sideBetTotal = 0;
  sideBetObjs = [];
  sideBetPlacedModalActive;
  initialSideBetSequence;
  initialOutcomePackages;
  initialSideBetWinnings = 0;
  endingSideBetSequence;
  endingOutcomePackages;
  endingSideBetWinnings = 0;
  tempValue = { bank: 0, baseBet: 0, sideBetTotal: 0, bet: 0 };
  splitBets = {};

  constructor(bank) {
    this.bank = bank;
    this.tempValue.bank = bank;
  }

  //Manipulate Bank and Base Bet

  addToTempBaseBet(addend) {
    this.tempValue.baseBet = this.tempValue.baseBet + addend;
    this.tempValue.bank = this.tempValue.bank - addend;
  }

  clearTempBaseBet() {
    this.tempValue.baseBet = 0;
    this.tempValue.bank = this.bank;
  }

  parlayToBaseBet(value) {
    this.baseBet = this.baseBet + value;
    view.gameInfoFields.updateBaseBet(this.baseBet);
  }

  addWinningsToBank(winnings) {
    this.bank = this.bank + winnings;
  }

  //Lock in Values from Temp
  lockInBets() {
    this.bank = this.tempValue.bank;
    let bank = this.bank;
    this.baseBet = this.tempValue.baseBet;
    this.sideBetTotal = this.tempValue.sideBetTotal;

    if (this.sideBetObjs) {
      this.sideBetObjs.forEach(function (obj) {
        obj.lockInSideBet(bank);
      });
    }

    this.tempValue.bank = 0;
    this.tempValue.baseBet = 0;
    this.tempValue.sideBetTotal = 0;
  }

  // Get Values
  getBank() {
    return this.bank;
  }

  getBaseBet() {
    return this.baseBet;
  }

  getTempBank() {
    return this.tempValue.bank;
  }

  getTempBaseBet() {
    return this.tempValue.baseBet;
  }

  getTempSideBetTotalValue() {
    return this.tempValue.sideBetTotal;
  }

  getSideBet(sideBet) {
    return this.sideBetObjs.find((obj) => obj.key === sideBet);
  }

  getSideBetObj(key) {
    return this.sideBetObjs.filter((obj) => obj.key == key);
  }

  getTotalSideBetWinnings() {
    return this.totalSideBetWinnings;
  }

  getInitialSideBetWinnings() {
    return this.initialSideBetWinnings;
  }

  getEndingSideBetWinnings() {
    return this.endingSideBetWinnings;
  }

  //Side Bet Obj Methods
  addSideBetObj(sideBetObj) {
    this.sideBetObjs.push(sideBetObj);
  }

  checkSideBetExists(sideBet) {
    if (this.getSideBet(sideBet)) return true;
    else return false;
  }

  removeSideBetObj(sideBet) {
    this.sideBetObjs.forEach(function (obj, index, arr) {
      if (obj.key == sideBet) arr.splice(index, 1);
    });
  }

  clearSideBetObjs() {
    for (let i = 0; i <= this.sideBetObjs.length; i++) {
      this.sideBetObjs.pop();
    }
    this.tempValue.bank = this.tempValue.bank + this.tempValue.sideBetTotal;
    this.tempValue.sideBetTotal = 0;
  }

  //Manipulate Side Bet Total
  updateSideBetAmount(sideBet, addend) {
    let sideBetObj = this.getSideBet(sideBet);

    sideBetObj.addToTempBet(addend);
    this.tempValue.sideBetTotal = this.tempValue.sideBetTotal + addend;
    this.tempValue.bank = this.tempValue.bank - addend;
  }

  clearTempSideBetAmount(sideBet) {
    let sideBetObj = this.getSideBet(sideBet);

    let sideBetIndvTotal = sideBetObj.getTempBet();

    this.tempValue.sideBetTotal =
      this.tempValue.sideBetTotal - sideBetIndvTotal;
    this.tempValue.bank = this.tempValue.bank + sideBetIndvTotal;

    sideBetObj.clearTempBet();
  }

  //Game Flow Related Methods
  getSideBetsPlacedModalText() {
    let modalText = [];
    this.sideBetObjs.forEach(function (obj) {
      modalText.push(obj.getSideBetAmountInfoText());
    });
    return modalText.join();
  }

  splitBet(currentSplitHand, totalSplitHands) {
    let splitBets = {};

    switch (currentSplitHand) {
      case 0:
        splitBets.splitHand2 = this.baseBet;
        break;
      case 1:
        if (totalSplitHands == 2) splitBets.splitHand3 = this.baseBet;
        if (totalSplitHands == 3) splitBets.splitHand4 = this.baseBet;
        break;
      case 2:
        if (totalSplitHands == 2) splitBets.splitHand3 = this.baseBet;
        if (totalSplitHands == 3) splitBets.splitHand4 = this.baseBet;
        break;
      case 3:
        splitBets.splitHand4 = this.baseBet;
      default:
        console.log(`ERROR: Split Bets`);
    }

    this.bank = this.bank - this.baseBet;
    this.splitBets = splitBets;
  }

  applyDoubleDown(activeHand) {
    let newBet = this.baseBet * 2;

    if (activeHand <= 1) this.baseBet = newBet;
    if (activeHand == 2) this.splitBets.splitHand2 = newBet;
    if (activeHand == 3) this.splitBets.splitHand3 = newBet;
    if (activeHand == 4) this.splitBets.splitHand4 = newBet;

    this.bank = this.bank - this.baseBet;
  }

  toggleSideBetPlacedModalActive(boolean) {
    if (boolean) this.sideBetPlacedModalActive = true;
    else this.sideBetPlacedModalActive = false;
  }

  checkForBeginningSideBetBtn() {
    this.checkSideBetBtnObjsArr = this.sideBetObjs.filter(
      (obj) => obj.beginningSideBetCheck == true
    );
    return this.checkSideBetBtnObjsArr.length != 0 ? true : false;
  }

  checkForInitialSideBetSequence() {
    this.initialSideBetSequence = this.sideBetObjs.filter(
      (obj) => obj.sequencePlacement == `initial`
    );
    return this.initialSideBetSequence.length != 0 ? true : false;
  }

  initInitialSideBetSequence(gameState) {
    let dealerNatural = false;

    if (gameState.dealer.hand.outcome == `natural`) dealerNatural = true;

    this.initialSideBetSequence = this.sideBetObjs.filter(
      (obj) => obj.sequencePlacement == `initial`
    );

    if (!this.initialSideBetSequence) return false;

    this.initialSideBetSequence.forEach(function (obj) {
      if (obj.key == `houseMoney`) return;
      obj.initSideBet(gameState);
    });

    this.initialOutcomePackages = this.initialSideBetSequence.map(
      (obj) => obj.outcomePackage
    );

    let winningsArr = this.initialSideBetSequence.map(function (obj) {
      return obj.winnings;
    });

    this.initialSideBetWinnings = winningsArr.reduce(
      (prev, curr) => prev + curr
    );

    return true;
  }

  checkForEndingSideBetSequence(gameState) {
    this.endingSideBetSequence = this.sideBetObjs.filter(
      (obj) => obj.sequencePlacement == `ending`
    );

    return this.endingSideBetSequence.length != 0 ? true : false;
  }

  initEndingSideBetSequence(gameState) {
    this.endingSideBetSequence = this.sideBetObjs.filter(
      (obj) => obj.sequencePlacement == `ending`
    );

    if (!this.endingSideBetSequence) return false;

    this.endingSideBetSequence.forEach(function (obj) {
      if (obj.key == `evenMoney` || obj.key == `insurance`) return;

      obj.initSideBet(gameState);
    });

    this.endingOutcomePackages = this.endingSideBetSequence.map(
      (obj) => obj.outcomePackage
    );

    let winningsArr = this.endingSideBetSequence.map(function (obj) {
      if (obj.key == `houseMoney`) return false;
      return obj.winnings;
    });

    this.endingSideBetWinnings = winningsArr.reduce(
      (prev, curr) => prev + curr
    );

    return true;
  }
}

class SideBet extends Bet {
  bet = 0;
  payout;

  constructor(obj) {
    let {
      name,
      key,
      rules,
      outcomeTable,
      initSideBet,
      calcSideBet,
      beginningSideBetCheck,
      sequencePlacement,
      naturalEnd,
    } = obj;
    super();
    this.name = name;
    this.key = key;
    this.rules = rules;
    this.outcomeTable = outcomeTable;
    this.initSideBet = initSideBet;
    this.calcSideBet = calcSideBet;
    this.beginningSideBetCheck = beginningSideBetCheck;
    this.sequencePlacement = sequencePlacement;
    this.naturalEnd = naturalEnd;
  }

  //Manipulate Bet
  addToTempBet(addend) {
    this.tempValue.bet = this.tempValue.bet + addend;
  }

  clearTempBet() {
    this.tempValue.bet = 0;
  }

  //Get Values
  getTempBet() {
    return this.tempValue.bet;
  }

  getSideBetAmountInfoText() {
    let text;

    if (this.key == `extraBetBlackjack`)
      text = `${this.name} : Bet Activated <br>`;
    else text = `${this.name} : $${this.tempValue.bet} Bet <br>`;

    return text;
  }

  //Extra Bet Methods
  updateTempExtraBetTotal(addend) {
    this.addToTempBet(addend);
    this.tempValue.bank = this.tempValue.bank - addend;
  }

  clearTempExtraBetBlackjackTotal() {
    this.tempValue.bank = this.tempValue.bank + this.tempValue.bet + this.fee;
    this.fee = 0;
    this.clearTempBet();
  }

  //Lock in Values from Temp
  lockInSideBet(bank) {
    this.bank = bank;
    this.tempValue.bank = bank;
    this.bet = this.tempValue.bet;
    this.tempValue.bet = 0;
  }

  lockInExtraBet() {
    this.bank = this.tempValue.bank;
    this.bet = this.tempValue.bet;
    this.tempValue.bet = 0;
    return this.bank;
  }

  //Determine Outcome Helper Methods

  //Check Match for Specific Properties
  checkExactValueMatch(cardArr, value) {
    return cardArr.every((obj) => obj.value == value);
  }

  checkExactSuitMatch(cardArr, suit) {
    return cardArr.every((obj) => obj.suit == suit);
  }

  checkForExactCardMatch(cardArr, value, suit) {
    let rankMatch = this.checkExactValueMatch(cardArr, value);
    let suitMatch = this.checkExactSuitMatch(cardArr, suit);

    return rankMatch && suitMatch;
  }

  //Check for Counts of Specific Properties

  checkForPropCount(cardArr, prop, value, num) {
    let count = this.getPropCount(cardArr, prop, value);

    return count == num;
  }

  checkForExactCardCount(cardArr, value, suit, num) {
    let exactCount = 0;
    let suitMatch, rankMatch;

    cardArr.forEach(function (card) {
      let suitMatch, rankMatch;

      card.value == value ? (rankMatch = true) : (rankMatch = false);
      card.suit == suit ? (suitMatch = true) : (suitMatch = false);

      if (suitMatch && rankMatch) exactCount++;
    });

    return exactCount == num;
  }

  getPropCount(cardArr, prop, value) {
    let count = 0;

    cardArr.forEach(function (obj) {
      if (obj[prop] == value) count++;
    });

    return count;
  }

  //Check if Specific Card Exists
  checkIncludesCardValue(cardArr, value) {
    return cardArr.some((obj) => obj.value == value);
  }

  checkForExactCard(cardArr, value, suit) {
    return cardArr.some((obj) => obj.value == value && obj.suit == suit);
  }

  //Check for General Property Matches

  checkSuitMatch(cardArr) {
    let suitArr = cardArr.map((obj) => obj.suit);
    return this.checkCardPropMatch(suitArr);
  }

  checkRankMatch(cardArr) {
    let rankArr = cardArr.map((obj) => obj.value);
    return this.checkCardPropMatch(rankArr);
  }

  checkExactMatch(cardArr) {
    let rankMatch = this.checkRankMatch(cardArr);
    let suitMatch = this.checkSuitMatch(cardArr);

    return rankMatch && suitMatch ? true : false;
  }

  checkColorMatch(cardArr) {
    let colorArr = cardArr.map((obj) => this.getCardColor(obj.suit));
    return this.checkCardPropMatch(colorArr);
  }

  getCardColor(suit) {
    let color;
    if (suit == "CLUBS") color = "BLACK";
    if (suit == "SPADES") color = "BLACK";
    if (suit == "HEARTS") color = "RED";
    if (suit == "DIAMONDS") color = "RED";
    return color;
  }

  checkCardPropMatch(propArr) {
    return propArr.every((prop) => prop === propArr[0]);
  }

  //Check For Specific Sequence of properties

  checkStraightSequence(cardArr) {
    let straightMatch, straightAceLowMatch, straightAceHighMatch;
    let aceInHand = cardArr.some((obj) => obj.value == "ACE");

    if (aceInHand) {
      let valueArrAceLow = cardArr.map((obj) =>
        this.convertCardValue(obj.value, `acelow`)
      );
      let valueArrAceHigh = cardArr.map((obj) =>
        this.convertCardValue(obj.value, `acehigh`)
      );
      this.checkOrder(valueArrAceLow)
        ? (straightAceLowMatch = true)
        : (straightAceLowMatch = false);
      this.checkOrder(valueArrAceHigh)
        ? (straightAceHighMatch = true)
        : (straightAceHighMatch = false);

      straightAceLowMatch || straightAceHighMatch
        ? (straightMatch = true)
        : (straightMatch = false);
    } else {
      let valueArr = cardArr.map((obj) => this.convertCardValue(obj.value));
      this.checkOrder(valueArr)
        ? (straightMatch = true)
        : (straightMatch = false);
    }
    return straightMatch;
  }

  checkOrder(valueArr) {
    valueArr.sort(function (a, b) {
      return a - b;
    });
    let result = valueArr.every(function (value, index, array) {
      if (index == array.length - 1) return true;
      let nextValue = value + 1;
      return array[index + 1] == nextValue;
    });

    return result;
  }

  convertCardValue(value, aceLevel = null) {
    switch (value) {
      case "JACK":
        value = 11;
        break;
      case `QUEEN`:
        value = 12;
        break;
      case `KING`:
        value = 13;
        break;
      case `ACE`:
        if (aceLevel == `acelow`) value = 1;
        if (aceLevel == `acehigh`) value = 14;
        break;
      default:
        value = parseInt(value, 10);
    }
    return value;
  }

  convertCardToTenValue(value, aceLevel = null) {
    switch (value) {
      case "JACK":
        value = 10;
        break;
      case `QUEEN`:
        value = 10;
        break;
      case `KING`:
        value = 10;
        break;
      case `ACE`:
        if (aceLevel == `acelow`) value = 1;
        if (aceLevel == `acehigh`) value = 14;
        break;
      default:
        value = parseInt(value, 10);
    }
    return value;
  }

  //Calculating Outcome Methods
  calcPayout() {
    this.winPayout = this.outcomeTable[this.winKey].payout;

    this.getWinnings();
  }

  getWinnings() {
    if (this.winPayout == "jackpot") {
      this.winnings = 10000;
      return;
    }

    if (this.winPayout == "0") {
      this.winnings = 0;
      return;
    }

    let num = this.winPayout.split(`:`).map((num) => parseInt(num, 10));
    let multiplier = num[0];
    let divider = num[1];

    let winnings = Math.round((this.bet * multiplier) / divider) + this.bet;

    this.winnings = winnings;
  }

  collectWinnings() {
    return this.winnings;
  }

  getConditionText() {
    this.winCondition = this.outcomeTable[this.winKey].text;
  }

  generateOutcomePackage() {
    this.outcomePackage = {
      name: this.name,
      sideBetKey: this.key,
      betAmount: this.bet,
      outcome: this.outcome,
      winCondition: this.winCondition,
      payout: this.winPayout,
      winnings: this.winnings,
      winHand: this.winHand,
    };

    if (this.outcome != `lose`) {
      this.outcomePackage.payout = this.winPayout;
      this.outcomePackage.winnings = this.winnings;
      this.outcomePackage.winHand = this.winHand;
    }
  }

  generateWinHand(playersArr, handArr) {
    let winHand = {};

    if (playersArr.includes(`player`)) {
      let hand = handArr.find((obj) => obj.playerType == "player");
      winHand.player = hand.cards;
    }
    if (playersArr.includes(`dealer`)) {
      let hand = handArr.find((obj) => obj.playerType == "dealer");
      winHand.dealer = hand.cards;
    }

    winHand.playersArr = playersArr;

    this.winHand = winHand;
  }
}

export function generateSpecialNums() {
  let mysteryJackpotNumber = generateRandomNum(1, 100);
  let jackpotAceNum = generateRandomNum(1, 6);

  let specialNum = {
    mysteryJackpot: mysteryJackpotNumber,
    jackpotAce: jackpotAceNum,
    jackpotAceCounter: 1,
    jackpotAceFound: false,

    trackJackpotAce(hand) {
      let jackpotNum = this.jackpotAce;
      let counter = this.jackpotAceCounter;
      let jackpotFound = false;

      let cardsArr = hand.cards;

      cardsArr.forEach(function (card) {
        if (card.value == "ACE" && card.suit == "SPADES") {
          if (jackpotNum == counter) {
            card.jackpot = true;
            jackpotFound = true;
          }
          card.checked = true;
          counter++;
        }
      });

      this.jackpotAceFound = jackpotFound;
      this.jackpotAceCounter = counter;

      if (this.jackpotAceCounter == 6) this.jackpotAceCounter = 1;
    },
  };

  return specialNum;
}

export function generateRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function initBaseBet(bank) {
  let bet = new Bet(bank);
  return bet;
}

export function generateEvenMoneyObj(gameState) {
  let evenMoneyObj = new SideBet(sideBetMod.evenMoney);
  evenMoneyObj.addHalfBet = sideBetFunc.addHalfBet;

  evenMoneyObj.bank = gameState.bank;
  evenMoneyObj.baseBet = gameState.betObj.baseBet;
  gameState.betObj.addSideBetObj(evenMoneyObj);
  evenMoneyObj.initSideBet(gameState);
  return evenMoneyObj.outcome;
}

export function generateInsuranceObj(gameState) {
  let insuranceObj = new SideBet(sideBetMod.insurance);
  insuranceObj.addHalfBet = sideBetFunc.addHalfBet;

  insuranceObj.bank = gameState.bank;
  insuranceObj.baseBet = gameState.betObj.baseBet;
  gameState.betObj.addSideBetObj(insuranceObj);
  insuranceObj.initSideBet(gameState);
  return insuranceObj.outcome;
}

export function generateSideBetObj(name) {
  let sideBet;

  switch (name) {
    case "perfectPair":
      sideBet = new SideBet(sideBetMod.perfectPair);
      break;
    case `21Plus3`:
      sideBet = new SideBet(sideBetMod.twentyOnePlusThree);
      break;
    case `perfect11s`:
      sideBet = new SideBet(sideBetMod.perfect11s);
      sideBet.checkSuited11 = sideBetFunc.checkSuited11;
      sideBet.checkDiceRollNeeded = sideBetFunc.checkPerfect11sDiceRollNeeded;
      sideBet.rollInfinityDice = sideBetFunc.rollInfinityDice;
      break;
    case `extraBetBlackjack`:
      sideBet = new SideBet(sideBetMod.extraBetBlackjack);
      sideBet.checkValidBet = sideBetFunc.checkValidExtraBetBlackjack;
      sideBet.calcExtraBetFee = sideBetFunc.calcExtraBetFee;
      break;
    case `houseMoney`:
      sideBet = new SideBet(sideBetMod.houseMoney);
      sideBet.checkModalNeeded = sideBetFunc.checkHouseMoneyModalNeeded;
      sideBet.generateParlayPackage = sideBetFunc.generateParlayPackage;
      sideBet.changeWinnings = sideBetFunc.changeHouseMoneyWinnings;
      break;
    case `luckyLadies`:
      sideBet = new SideBet(sideBetMod.luckyLadies);
    default:
      console.log(`no side bet`);
  }

  return sideBet;
}
