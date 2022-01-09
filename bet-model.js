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
    let bank = this.bank;
    this.baseBet = this.tempBaseBet;
    this.sideBetTotal = this.tempSideBetTotal;

    if (this.sideBet) {
      this.sideBet.forEach(function (obj) {
        obj.lockInSideBet(bank);
      });
    }

    this.tempBank = 0;
    this.tempBaseBet = 0;
    this.tempSideBetTotal = 0;
  }

  checkForBeginningSideBetBtn() {
    this.checkSideBetBtnObjsArr = this.sideBet.filter(
      (obj) => obj.beginningSideBetCheck == true
    );
    return this.checkSideBetBtnObjsArr.length != 0 ? true : false;
  }

  checkForInitialSideBetSequence() {
    this.initialSideBetSequence = this.sideBet.filter(
      (obj) => obj.sequencePlacement == `initial`
    );
    return this.initialSideBetSequence.length != 0 ? true : false;
  }

  initInitialSideBetSequence(sideBetPackage) {
    this.initialSideBetSequence = this.sideBet.filter(
      (obj) => obj.sequencePlacement == `initial`
    );
    if (!this.initialSideBetSequence) return false;

    this.initialSideBetSequence.forEach(function (obj) {
      obj.initSideBet(sideBetPackage);
    });

    this.initialOutcomePackages = this.initialSideBetSequence.map(
      (obj) => obj.outcomePackage
    );

    // console.log(this.initialOutcomePackages);
    return true;
  }

  checkHasPerfect11sBet() {
    let perfect11sObj = this.sideBet.filter((obj) => obj.key == `perfect11s`);
    if (perfect11sObj) return [true, perfect11sObj];
    else {
      perfect11sObj = ` `;
      return [false, perfect11sObj];
    }
  }

  checkHasSideBet(key) {
    let hasSideBet = this.sideBet.filter((obj) => obj.key == key);
    return perfect11sObj ? true : false;
  }

  getSideBetObj(key) {
    return this.sideBet.filter((obj) => obj.key == key);
  }

  //   checkPerfect11DiceRollNeeded(playerHand) {
  //     let sideBetObj = this.sideBet.filter((obj) => obj.key == `perfect11s`);

  //     if (!sideBetObj) return false;

  //     return sideBetObj.checkSuited11(playerHand);
  //   }

  //   collectPerfect11DiceRolls(diceRolls) {
  //     let sideBetObj = this.sideBet.filter((obj) => obj.key == `perfect11s`);
  //   }
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
      beginningSideBetCheck,
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
    (this.beginningSideBetCheck = beginningSideBetCheck),
      (this.sequencePlacement = sequencePlacement);
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

  updateTempExtraBetTotal(addend) {
    this.updateTempBetTotal(addend);
    this.tempBank = this.tempBank - addend;
  }

  clearTempBet() {
    this.tempTotal = 0;
  }

  clearTempExtraBetBlackjackTotal() {
    this.tempBank = this.tempBank + this.tempTotal + this.fee;
    this.fee = 0;
    this.clearTempBet();
  }

  lockInExtraBet() {
    this.bank = this.tempBank;
    this.total = this.tempTotal;
    this.tempTotal = 0;
    return this.bank;
  }

  getTempTotal() {
    return this.tempTotal;
  }

  getSideBetAmountInfoText() {
    let text = `${this.name} : $${this.tempTotal} Bet <br>`;
    return text;
  }

  lockInSideBet(bank) {
    this.bank = bank;
    this.tempBank = bank;
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
    if (this.winPayout == "jackpot") {
      this.winnings = 1000000;
      return;
    }

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

function generateRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const perfectPair = {
  name: `Perfect Pair`,
  key: `perfectPair`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `initial`,
  outcomeTable: {
    perfect_pair_2: { payout: `200:1`, text: `2 Perfect Pairs` },
    perfect_pair_1: { payout: `25:1`, text: `1 Perfect Pair` },
    colored_pair: { payout: `10:1`, text: `Colored Pair` },
    red_black_pair: { payout: `5:1`, text: `Red/Black Pair` },
    lose: { payout: `n/a`, text: `Lose: No Pairs...` },
  },
  initSideBet: initBaseSideBetSequence,
  calcSideBet: calcPerfectPair,
};

const twentyOnePlusThree = {
  name: `21 + 3`,
  key: `21Plus3`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `initial`,
  outcomeTable: {
    jackpot_3_kind: { payout: `jackpot`, text: `Suited 3 of a Kind (Q - A)` },
    suited_3_kind: { payout: `100:1`, text: `Suited 3 of a Kind (2 - Jack)` },
    kind_3: { payout: `33:1`, text: `3 of a Kind` },
    straight_flush: { payout: `35:1`, text: `Straight Flush` },
    straight: { payout: `10:1`, text: `Straight` },
    flush: { payout: `5:1`, text: `Flush` },
    lose: { payout: `n/a`, text: `Lose` },
  },
  initSideBet: initBaseSideBetSequence,
  calcSideBet: calc21Plus3,
};

const perfect11s = {
  name: `Perfect 11s`,
  key: `perfect11s`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `initial`,
  outcomeTable: {
    jackpot_Ace_King_Spade: {
      payout: `720:10`,
      text: `Jackpot Ace and King of Spades`,
    },
    jackpot_Ace_King: { payout: `130:10`, text: `Jackpot Ace and King` },
    suited_11_3_infinity: {
      payout: `25:10`,
      text: `Suited 11 and 3 Infinities`,
    },
    suited_11_2_infinity: {
      payout: `16:1`,
      text: `Suited 11 and 2 Infinities`,
    },
    suited_11: { payout: `15:1`, text: `Suited 11` },
    colored_11: { payout: `10:1`, text: `Colored 11` },
    mixed_11: { payout: `3:1`, text: `Mixed 11` },
    lose: { payout: `n/a`, text: `Lose` },
  },
  initSideBet: initBaseSideBetSequence,
  calcSideBet: calcPerfect11s,
};

const extraBetBlackjack = {
  name: `Extra Bet Blackjack`,
  key: `extraBetBlackjack`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `end`,
  outcomeTable: { payout: `n/a`, text: `n/a` },
  initSideBet: checkValidExtraBetBlackjack,
  calcSideBet: calcExtraBetBlackjack,
};

const houseMoney = {
  name: `House Money`,
  key: `houseMoney`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `initial`,
  outcomeTable: {
    suited_Ace_King: { payout: `9:1`, text: `Suited Ace and King` },
    straight_flush: { payout: `4:1`, text: `Straight Flush` },
    pair: { payout: `3:1`, text: `Pair` },
    straight: { payout: `1:1`, text: `Straight` },
    lose: { payout: `n/a`, text: `Lose` },
  },
  initSideBet: initHouseMoney,
  calcSideBet: calcHouseMoney,
};

function initBaseSideBetSequence(gameState) {
  let baseBet = gameState.betObj.baseBet;
  let playerHand = gameState.player.hand;
  let dealerHand = gameState.dealer.hand;

  this.baseBet = baseBet;
  this.calcSideBet(playerHand, dealerHand);
  this.calcPayout();
  this.getConditionText();
  this.generateOutcomePackage();
}

function checkValidExtraBetBlackjack(playerHand) {
  let playerCards = playerHand.cards;

  let valueArr = playerCards.map((obj) => obj.value);

  let tensArr = valueArr.map((value) => this.convertCardToTenValue(value));

  return tensArr.some((value) => value == 10);
}

function initHouseMoney(gameState) {
  let baseBet = gameState.betObj.baseBet;
  let playerHand = gameState.player.hand;
  let dealerHand = gameState.dealer.hand;

  this.baseBet = baseBet;
  this.calcSideBet(playerHand);
  this.calcPayout();
  this.getConditionText();
  this.generateOutcomePackage();
  this.checkModalNeeded(dealerHand, gameState);
}

function calcHouseMoney(playerHand) {
  playerHand.playerType = `player`;
  let playerCards = playerHand.cards;
  let cardsArr = [playerHand];

  let suitedAceKing = false;
  let pair = false;
  let straight = false;
  let flush = false;
  let winKey;
  let winHand;

  this.checkRankMatch(playerCards) ? (pair = true) : (pair = false);

  this.checkSuitMatch(playerCards) ? (flush = true) : (flush = false);

  this.checkStraightSequence(playerCards)
    ? (straight = true)
    : (straight = false);

  if (flush) {
    let kingExists = this.checkIncludesCardValue(`KING`);
    let aceExists = this.checkIncludesCardValue(`ACE`);
    kingExists && aceExists ? (suitedAceKing = true) : (suitedAceKing = false);
  }

  switch (true) {
    case suitedAceKing:
      winKey = `suited_ace_king`;
      break;
    case straight && flush:
      winKey = `straight_flush`;
      break;
    case straight:
      winKey = `straight`;
      break;
    case pair:
      winKey = `pair`;
      break;
    default:
      winKey = "lose";
      this.outcome = `lose`;
  }

  this.winKey = winKey;

  if (winKey == `lose`) return;

  this.outcome = `win`;
  winHand = [`player`];
  this.generateWinHand(winHand, cardsArr);
}

function calcPerfectPair(playerHand, dealerHand) {
  playerHand.playerType = `player`;
  dealerHand.playerType = `dealer`;
  let playerCards = playerHand.cards;
  let dealerCards = dealerHand.cards;

  let handArr = [playerHand, dealerHand];
  let playerCard1 = playerCards[0];
  let playerCard2 = playerCards[1];
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

  this.checkExactMatch(dealerCards)
    ? (dealerPerfectMatch = true)
    : (dealerPerfectMatch = false);
  this.checkExactMatch(playerCards)
    ? (playerPerfectMatch = true)
    : (playerPerfectMatch = false);
  this.checkRankMatch(playerCards)
    ? (playerRankMatch = true)
    : (playerRankMatch = false);
  if (playerRankMatch)
    this.checkColorMatch(playerCards)
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

function calc21Plus3(playerHand, dealerHand) {
  playerHand.playerType = `player`;
  dealerHand.playerType = `dealer`;
  let playerCards = playerHand.cards;
  let dealerCards = dealerHand.cards;
  let handArr = [playerHand, dealerHand];
  let targetArr = [playerCards[0], playerCards[1], dealerCards[1]];

  //   let dealerCard2 = dealerHand.cards[1];
  let flush = false;
  let straight = false;
  let threeKind = false;
  let suitedThreeKind = false;
  let jackpotThreeKind = false;
  let winKey;
  let winHand;

  this.checkSuitMatch(targetArr) ? (flush = true) : (flush = false);
  this.checkStraightSequence(targetArr)
    ? (straight = true)
    : (straight = false);
  this.checkRankMatch(targetArr) ? (threeKind = true) : (threeKind = false);

  if (threeKind && flush) {
    let jackpotSuits = [`QUEEN`, `KING`, `ACE`];
    jackpotSuits.includes(playerCards[0].value)
      ? (jackpotThreeKind = true)
      : (suitedThreeKind = true);
  }

  switch (true) {
    case jackpotThreeKind:
      winKey = `jackpot_3_kind`;
      break;
    case suitedThreeKind:
      winKey = `suited_3_kind`;
      break;
    case threeKind:
      winKey = `kind_3`;
    case flush && straight:
      winKey = `straight_flush`;
      break;
    case straight:
      winKey = `straight`;
      break;
    case flush:
      winKey = `flush`;
      break;
    default:
      winKey = "lose";
      this.outcome = `lose`;
  }

  this.winKey = winKey;

  if (winKey == `lose`) return;

  this.outcome = `win`;
  winHand = [`player`, `dealer`];
  this.generateWinHand(winHand, handArr);
}

//Perfect 11s
function checkSuited11(playerHand) {
  let playerCards = playerHand.cards;
  let total = playerHand.total;
  let natural;

  playerHand.outcome == `natural` ? (natural = true) : (natural = false);

  if (total == 11 || natural) return this.checkSuitMatch(playerCards);
  else return false;
}

function checkPerfect11sDiceRollNeeded(playerHand) {
  return this.checkSuited11(playerHand);
}

function rollInfinityDice() {
  let diceArr = [];
  for (let i = 1; i <= 3; i++) {
    diceArr.push(generateRandomNum(1, 6));
  }
  let finalArr = diceArr.map((num) => (num == 6 ? `INFINITY` : `BLANK`));

  this.infinityCount = finalArr.filter((value) => value == `INFINITY`).length;
  //   this.diceRoll = finalArr;
  return finalArr;
}

function calcPerfect11s(playerHand) {
  playerHand.playerType = `player`;

  let playerCards = playerHand.cards;
  let playerTotal = playerHand.total;

  let handArr = [playerHand];

  let jackpotAce = false;
  let kingSpade = false;
  let flush = false;
  let colored = false;
  let mixed = false;

  let winKey;
  let winHand;
  let natural;
  let infinityCount = this.infinityCount;

  playerHand.outcome == `natural` ? (natural = true) : (natural = false);

  if (playerTotal == 11 || natural) {
    this.checkColorMatch(playerCards) ? (colored = true) : (mixed = true);

    this.checkSuitMatch(playerCards) ? (flush = true) : (flush = false);

    checkJackpotAceExists(playerCards)
      ? (jackpotAce = true)
      : (jackpotAce = false);

    if (jackpotAce) {
      this.checkIncludesCardValue(playerCards, `KING`)
        ? (kingExists = true)
        : (kingExists = false);
      this.checkForExactCard(playerCards, `KING`, `SPADES`)
        ? (kingSpade = true)
        : (kingSpade = false);
    }
  }

  switch (true) {
    case jackpotAce && kingSpade:
      winKey = `jackpot_Ace_King_Spade`;
      break;
    case jackpotAce && kingExists:
      winKey = `jackpot_Ace_King`;
      break;
    case flush && infinityCount == 3:
      winKey = `suited_11_3_infinity`;
      break;
    case flush && infinityCount == 2:
      winKey = `suited_11_2_infinity`;
      break;
    case flush:
      winKey = `suited_11`;
      break;
    case colored:
      winKey = `colored_11`;
      break;
    case mixed:
      winKey = `mixed_11`;
      break;
    default:
      winKey = "lose";
      this.outcome = `lose`;
  }

  this.winKey = winKey;

  if (winKey == `lose`) return;

  this.outcome = `win`;
  winHand = [`player`];
  this.generateWinHand(winHand, handArr);

  function checkJackpotAceExists(cardArr) {
    return cardArr.some((obj) => obj.jackpot == true);
  }
}

function checkHouseMoneyModalNeeded(dealerHand, gameState) {
  if (dealerHand.outcome == `natural`) gameState.updateHouseMoneyModalNeeded();
}

function calcExtraBetBlackjack() {}

function calcExtraBetFee() {
  this.fee = this.tempTotal * 0.2;
  this.tempBank = this.tempBank - this.fee;
}

// function collectDiceRolls(diceRolls) {
//   let sideBetObj = this.sideBet.filter((obj) => obj.key == `perfect11s`);
//   this.diceRolls = diceRolls;
// }

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
    case `perfect11s`:
      sideBet = new SideBet(perfect11s);
      sideBet.checkSuited11 = checkSuited11;
      sideBet.checkDiceRollNeeded = checkPerfect11sDiceRollNeeded;
      sideBet.rollInfinityDice = rollInfinityDice;
      break;
    case `extraBetBlackjack`:
      sideBet = new SideBet(extraBetBlackjack);
      sideBet.calcExtraBetFee = calcExtraBetFee;
      break;
    case `houseMoney`:
      sideBet = new SideBet(houseMoney);
      sideBet.checkModalNeeded = checkHouseMoneyModalNeeded;
      break;
    default:
      console.log(`no side bet`);
  }

  return sideBet;
}
