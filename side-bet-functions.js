import * as betModel from "./bet-model.js";

export function initBaseSideBetSequence(gameState) {
  let baseBet = gameState.betObj.baseBet;
  let playerHand = gameState.player.hand;
  let dealerHand = gameState.dealer.hand;

  this.baseBet = baseBet;
  this.calcSideBet(playerHand, dealerHand);
  this.calcPayout();
  this.getConditionText();
  this.generateOutcomePackage();
}

export function checkValidExtraBetBlackjack(playerHand) {
  let playerCards = playerHand.cards;

  let valueArr = playerCards.map((obj) => obj.value);

  let tensArr = valueArr.map((value) => this.convertCardToTenValue(value));

  return tensArr.some((value) => value == 10);
}

export function initHouseMoney(gameState) {
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

export function calcHouseMoney(playerHand) {
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
    let kingExists = this.checkIncludesCardValue(playerCards, `KING`);
    let aceExists = this.checkIncludesCardValue(playerCards, `ACE`);
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

export function calcPerfectPair(playerHand, dealerHand) {
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

export function calc21Plus3(playerHand, dealerHand) {
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
export function checkSuited11(playerHand) {
  let playerCards = playerHand.cards;
  let total = playerHand.total;
  let natural;

  playerHand.outcome == `natural` ? (natural = true) : (natural = false);

  if (total == 11 || natural) return this.checkSuitMatch(playerCards);
  else return false;
}

export function checkPerfect11sDiceRollNeeded(playerHand) {
  return this.checkSuited11(playerHand);
}

export function rollInfinityDice() {
  let diceArr = [];
  for (let i = 1; i <= 3; i++) {
    diceArr.push(betModel.generateRandomNum(1, 6));
  }
  let finalArr = diceArr.map((num) => (num == 6 ? `INFINITY` : `BLANK`));

  this.infinityCount = finalArr.filter((value) => value == `INFINITY`).length;
  //   this.diceRoll = finalArr;
  return finalArr;
}

export function calcPerfect11s(playerHand) {
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
      winKey = `jackpot_ace_king_spade`;
      break;
    case jackpotAce && kingExists:
      winKey = `jackpot_ace_king`;
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

export function checkHouseMoneyModalNeeded(dealerHand, gameState) {
  if (dealerHand.outcome == `natural`) return;
  if (this.outcome == `lose`) return;
  gameState.updateHouseMoneyModalNeeded(true);
  this.generateParlayPackage(gameState);
}

// function generateParlayPackage(gameState) {
//   let baseBet = gameState.betObj.baseBet;

//   this.parlayPackage = {
//     winnings: this.winnings,
//   };

//   let parlayWinnings = baseBet + this.winnings;
//   let parlayBet = baseBet + this.total;
//   let parlayAll = baseBet + this.winnings + this.total;

//   this.parlayPackage.parlayWinnings = parlayWinnings;
//   this.parlayPackage.parlayBet = parlayBet;
//   this.parlayPackage.parlayAll = parlayAll;
// }

export function generateParlayPackage(gameState) {
  let baseBet = gameState.betObj.baseBet;

  this.parlayPackage = {
    winnings: this.winnings,
  };

  let parlayWinnings = baseBet + this.winnings;
  let parlayBet = baseBet + this.bet;
  let parlayAll = baseBet + this.winnings + this.bet;

  this.parlayPackage.parlayWinnings = parlayWinnings;
  this.parlayPackage.parlayBet = parlayBet;
  this.parlayPackage.parlayAll = parlayAll;
}

function calcExtraBetBlackjack() {}

// function calcExtraBetFee() {
//   this.fee = this.tempTotal * 0.2;
//   this.tempBank = this.tempBank - this.fee;
// }
export function calcExtraBetFee() {
  this.fee = this.tempValue.bet * 0.2;
  this.tempValue.bank = this.tempValue.bet - this.fee;
}