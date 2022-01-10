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
  tempValue = { bank: 0, baseBet: 0, sideBetTotal: 0, bet: 0 };

  constructor(bank) {
    this.bank = bank;
    // this.tempBank = bank;
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
    view.updateBaseBet(this.baseBet);
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

  //Side Bet Obj Methods
  addSideBetObj(sideBetObj) {
    this.sideBetObjs.push(sideBetObj);
  }

  checkSideBetExists(sideBet) {
    if (this.getSideBet(sideBet)) return true;
    else return false;
  }

  clearSideBetObjs() {
    //   let length = this.sideBet.length;

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

    let sideBetIndvTotal = sideBetObj.getTempTotal();

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

  initInitialSideBetSequence(sideBetPackage) {
    this.initialSideBetSequence = this.sideBetObjs.filter(
      (obj) => obj.sequencePlacement == `initial`
    );
    if (!this.initialSideBetSequence) return false;

    this.initialSideBetSequence.forEach(function (obj) {
      obj.initSideBet(sideBetPackage);
    });

    this.initialOutcomePackages = this.initialSideBetSequence.map(
      (obj) => obj.outcomePackage
    );

    let winningsArr = this.initialSideBetSequence.map(function (obj) {
      if (obj.key == `houseMoney`) return false;
      return obj.winnings;
    });

    this.totalSideBetWinnings = winningsArr.reduce((prev, curr) => prev + curr);
    // console.log(this.totalSideBetWinnings);

    // console.log(this.initialOutcomePackages);
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
    let text = `${this.name} : $${this.tempValue.bet} Bet <br>`;
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

  checkIncludesCardValue(cardArr, value) {
    return cardArr.some((obj) => obj.value == value);
  }

  checkForExactCard(cardArr, value, suit) {
    return cardArr.some((obj) => obj.value == value && obj.suit == suit);
  }

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

  checkStraightSequence(cardArr) {
    let straightMatch;
    let aceInHand = cardArr.some((obj) => obj.value == "ACE");

    if (aceInHand) {
      let valueArrAceLow = cardArr.map((obj) =>
        this.convertCardValue(obj.value, `acelow`)
      );
      let valueArrAceHigh = cardArr.map((obj) =>
        this.convertCardValue(obj.value, `acehigh`)
      );
      this.checkOrder(valueArrAceLow)
        ? (straightMatch = true)
        : (straightMatch = false);
      this.checkOrder(valueArrAceHigh)
        ? (straightMatch = true)
        : (straightMatch = false);
    }

    let valueArr = cardArr.map((obj) => this.convertCardValue(obj.value));
    this.checkOrder(valueArr)
      ? (straightMatch = true)
      : (straightMatch = false);
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
    // if (this.winKey == `lose`) return;
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

    let winnings =
      Math.round((this.baseBet * multiplier) / divider) + this.baseBet;

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
      betAmount: this.total,
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
    jackpotAceCounter: 0,
    jackpotAceFound: false,

    trackJackpotAce() {
      let playerCards = this.player.hand.cards;
      let dealerCards = this.dealer.hand.cards;

      checkJackpotAce(playerCards);
      checkJackpotAce(dealerCards);

      function checkJackpotAce(cardsArr) {
        cardsArr.forEach(function (card) {
          if (card.checked) return;
          if (card.value == "ACE" && card.suit == "SPADES") {
            if (this.jackpotAceNum == this.jackpotAceCounter) {
              card.jackpot = true;
              this.jackpotAceFound = true;
            }
            card.checked = true;
            this.jackpotAceCounter++;
            if (this.jackpotAceCounter > 6) this.jackpotAceCounter = 0;
          }
        });
      }
    },
  };

  return specialNum;
}

export function generateRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function collectDiceRolls(diceRolls) {
//   let sideBetObj = this.sideBet.filter((obj) => obj.key == `perfect11s`);
//   this.diceRolls = diceRolls;
// }

export function initBaseBet(bank) {
  let bet = new Bet(bank);
  return bet;
}

// export function generateSideBetObj(name) {
//   let sideBet;

//   switch (name) {
//     case "perfectPair":
//       sideBet = new SideBet(perfectPair);
//       break;
//     case `21Plus3`:
//       sideBet = new SideBet(twentyOnePlusThree);
//       break;
//     case `perfect11s`:
//       sideBet = new SideBet(perfect11s);
//       sideBet.checkSuited11 = checkSuited11;
//       sideBet.checkDiceRollNeeded = checkPerfect11sDiceRollNeeded;
//       sideBet.rollInfinityDice = rollInfinityDice;
//       break;
//     case `extraBetBlackjack`:
//       sideBet = new SideBet(extraBetBlackjack);
//       sideBet.calcExtraBetFee = calcExtraBetFee;
//       break;
//     case `houseMoney`:
//       sideBet = new SideBet(houseMoney);
//       sideBet.checkModalNeeded = checkHouseMoneyModalNeeded;
//       sideBet.generateParlayPackage = generateParlayPackage;
//       // sideBet.collectHouseMoneyWinnings = collectHouseMoneyWinnings;
//       break;
//     default:
//       console.log(`no side bet`);
//   }

//   return sideBet;
// }

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
      sideBet.calcExtraBetFee = sideBetFunc.calcExtraBetFee;
      break;
    case `houseMoney`:
      sideBet = new SideBet(sideBetMod.houseMoney);
      sideBet.checkModalNeeded = sideBetFunc.checkHouseMoneyModalNeeded;
      sideBet.generateParlayPackage = sideBetFunc.generateParlayPackage;
      // sideBet.collectHouseMoneyWinnings = collectHouseMoneyWinnings;
      break;
    default:
      console.log(`no side bet`);
  }

  return sideBet;
}
