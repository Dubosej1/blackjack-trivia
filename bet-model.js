class Bet {
  bank;
  tempBank;
  baseBet = 0;
  tempBaseBet = 0;
  sideBetTotal = 0;
  tempSideBetTotal = 0;
  sideBet = [];
  sideBetPlacedModalActive;
  initialSideBetSequence;
  initialOutcomePackages;

  constructor(bank) {
    this.bank = bank;
    this.tempBank = bank;
  }

  updateTempBaseBet(addend) {
    this.tempBaseBet = this.tempBaseBet + addend;
    this.tempBank = this.tempBank - addend;
  }

  clearTempBaseBet() {
    this.tempBaseBet = 0;
    this.tempBank = this.bank;
  }

  addSideBetObj(sideBetObj) {
    this.sideBet.push(sideBetObj);
  }

  checkSideBetExists(sideBet) {
    if (this.getSideBet(sideBet)) return true;
    else return false;
  }

  updateSideBetAmount(sideBet, addend) {
    let sideBetObj = this.getSideBet(sideBet);

    sideBetObj.updateTempBetTotal(addend);
    this.tempSideBetTotal = this.tempSideBetTotal + addend;
    this.tempBank = this.tempBank - addend;
  }

  clearTempSideBetAmount(sideBet) {
    let sideBetObj = this.getSideBet(sideBet);

    let sideBetIndvTotal = sideBetObj.getTempTotal();

    this.tempSideBetTotal = this.tempSideBetTotal - sideBetIndvTotal;
    this.tempBank = this.tempBank + sideBetIndvTotal;

    sideBetObj.clearTempBet();
  }

  getSideBet(sideBet) {
    return this.sideBet.find((obj) => obj.key === sideBet);
  }

  getTempSideBetTotalValue() {
    return this.tempSideBetTotal;
  }

  getTempBank() {
    return this.tempBank;
  }

  getSideBetsPlacedModalText() {
    let modalText = [];
    this.sideBet.forEach(function (obj) {
      modalText.push(obj.getSideBetAmountInfoText());
    });
    return modalText.join();
  }

  clearSideBets() {
    //   let length = this.sideBet.length;

    for (let i = 0; i <= this.sideBet.length; i++) {
      this.sideBet.pop();
    }
    this.tempBank = this.tempBank + this.tempSideBetTotal;
    this.tempSideBetTotal = 0;
  }

  toggleSideBetPlacedModalActive(boolean) {
    if (boolean) this.sideBetPlacedModalActive = true;
    else this.sideBetPlacedModalActive = false;
  }

  lockInBets() {
    this.bank = this.tempBank;
    this.baseBet = this.tempBaseBet;
    this.sideBetTotal = this.tempSideBetTotal;

    if (this.sideBet) {
      this.sideBet.forEach(function (obj) {
        obj.lockInSideBet();
      });
    }

    this.tempBank = 0;
    this.tempBaseBet = 0;
    this.tempSideBetTotal = 0;
  }
  initInitialSideBetSequence(sideBetPackage) {
    this.initialSideBetSequence = this.sideBet.filter(
      (obj) => obj.sequencePlacement == `initial`
    );
    if (!this.initialSideBetSequence) return;

    this.initialSideBetSequence.forEach(function (obj) {
      obj.initSideBet(sideBetPackage);
    });

    this.initialOutcomePackages = this.sideBet.map((obj) => obj.outcomePackage);

    console.log(this.initialOutcomePackages);
  }
}

class SideBet extends Bet {
  total = 0;
  tempTotal = 0;
  name;
  key;
  rules;
  payout;

  constructor(obj) {
    let {
      name,
      key,
      rules,
      outcomeTable,
      initSideBet,
      calcSideBet,
      sequencePlacement,
      test,
    } = obj;
    super();
    this.name = name;
    this.key = key;
    this.rules = rules;
    this.outcomeTable = outcomeTable;
    this.initSideBet = initSideBet;
    this.calcSideBet = calcSideBet;
    this.sequencePlacement = sequencePlacement;
    // this.test = test;
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
    this.checkCardPropMatch(colorArr);
  }

  //   checkSuitMatch(card1, card2) {
  //       return card1.suit == card2.suit ? true : false;
  //   }

  //   checkRankMatch(card1, card2) {
  //       return card1.value == card2.value ? true : false;
  //   }

  //   checkExactMatch(card1, card2) {
  //       let rankMatch = this.checkRankMatch(card1, card2);
  //       let suitMatch = this.checkSuitMatch(card1, card2);

  //       return rankMatch == suitMatch ? true : false;
  //   }

  updateTempBetTotal(addend) {
    this.tempTotal = this.tempTotal + addend;
  }

  clearTempBet() {
    this.tempTotal = 0;
  }

  getTempTotal() {
    return this.tempTotal;
  }

  getSideBetAmountInfoText() {
    let text = `${this.name} : $${this.tempTotal} Bet <br>`;
    return text;
  }

  lockInSideBet() {
    this.total = this.tempTotal;
    this.tempTotal = 0;
    // this.test();
  }

  calcPayout() {
    if (this.winKey == `lose`) return;
    this.winPayout = this.outcomeTable[this.winKey].payout;

    this.getWinnings();
  }

  getWinnings() {
    let num = this.winPayout.split(`:`).map((num) => parseInt(num, 10));
    let multiplier = num[0];
    let divider = num[1];

    this.winnings =
      Math.round((this.baseBet * multiplier) / divider) + this.baseBet;
  }

  getConditionText() {
    this.winCondition = this.outcomeTable[this.winKey].text;
  }

  generateOutcomePackage() {
    this.outcomePackage = {
      name: this.name,
      betAmount: this.total,
      outcome: this.outcome,
      winCondition: this.winCondition,
      //   payout: this.winPayout,
      //   winnings: this.winnings,
      //   winHand: this.winHand,
    };

    if (this.outcome != `lose`) {
      this.outcomePackage.payout = this.winPayout;
      this.outcomePackage.winnings = this.winnings;
      this.outcomePackage.winHand = this.winHand;
    }
  }

  generateWinHand(playersArr, cardsArr) {
    let winHand = {};

    if (playersArr.includes(`player`)) {
      winHand.player = cardsArr.find((obj) => obj.playerType == "player");
    }
    if (playersArr.includes(`dealer`)) {
      winHand.dealer = cardsArr.find((obj) => obj.playerType == "dealer");
    }

    this.winHand = winHand;
  }
}

const perfectPair = {
  name: `Perfect Pair`,
  key: `perfectPair`,
  rules: `rules`,
  sequencePlacement: `initial`,
  outcomeTable: {
    perfect_pair_2: { payout: `200:1`, text: `2 Perfect Pairs` },
    perfect_pair_1: { payout: `25:1`, text: `1 Perfect Pair` },
    colored_pair: { payout: `10:1`, text: `Colored Pair` },
    red_black_pair: { payout: `5:1`, text: `Red/Black Pair` },
    lose: { payout: `n/a`, text: `Lose: No Pairs...` },
  },
  initSideBet: initPerfectPair,
  calcSideBet: calcPerfectPair,
};

const twentyOnePlusThree = {
  name: `21 + 3`,
  key: `21Plus3`,
  rules: `rules`,
  payout: `payout`,
};

function initPerfectPair(obj) {
  this.baseBet = obj.baseBet;
  this.calcSideBet(obj.playerHand, obj.dealerHand);
  this.calcPayout();
  this.getConditionText();
  this.generateOutcomePackage();
}

function calcPerfectPair(playerHand, dealerHand) {
  playerHand.playerType = `player`;
  dealerHand.playerType = `dealer`;
  let cardsArr = [playerHand, dealerHand];
  let playerCard1 = playerHand[0];
  let playerCard2 = playerHand[1];
  //   let dealerCard1 = dealerHand.cards[0];
  //   let dealerCard2 = dealerHand.cards[1];
  let dealerPerfectMatch = false;
  let playerPerfectMatch = false;
  let playerRankMatch = false;
  let playerColorMatch = false;
  let playerOppMatch = false;
  let winKey;
  let winHand;

  playerCard1.color = this.getCardColor(playerCard1.suit);
  playerCard2.color = this.getCardColor(playerCard2.suit);

  this.checkExactMatch(dealerHand)
    ? (dealerPerfectMatch = true)
    : (dealerPerfectMatch = false);
  this.checkExactMatch(playerHand)
    ? (playerPerfectMatch = true)
    : (playerPerfectMatch = false);
  this.checkRankMatch(playerHand)
    ? (playerRankMatch = true)
    : (playerRankMatch = false);
  if (playerRankMatch)
    this.checkColorMatch(playerHand)
      ? (playerColorMatch = true)
      : (playerOppMatch = false);

  switch (true) {
    case dealerPerfectMatch && playerPerfectMatch:
      winKey = `perfect_pairs_2`;
      winHand = [`player`, `dealer`];
      break;
    case dealerPerfectMatch:
      winKey = `perfect_pair_2`;
      winHand = [`dealer`];
      break;
    case playerPerfectMatch:
      winKey = `perfect_pair_1`;
      winHand = [`player`];
    case playerColorMatch:
      winKey = `colored_pair`;
      winHand = [`player`];
      break;
    case playerOppMatch:
      winKey = `black_red_pair`;
      winHand = [`player`];
      break;
    default:
      winKey = "lose";
      this.outcome = `lose`;
  }

  if (winKey != `lose`) {
    this.outcome = `win`;
    this.generateWinHand(winHand, cardsArr);
  }
  this.winKey = winKey;
}

export function initBaseBet(bank) {
  let bet = new Bet(bank);
  return bet;
}

export function generateSideBetObj(name) {
  let sideBet;

  switch (name) {
    case "perfectPair":
      sideBet = new SideBet(perfectPair);
      break;
    case `21Plus3`:
      sideBet = new SideBet(twentyOnePlusThree);
      break;
    default:
      console.log(`no side bet`);
  }

  return sideBet;
}

export function startSideBetInitialCardsRoutine(gameState) {}
