import * as bjModel from "./blackjack-model-2.js";
import * as triviaModel from "./trivia-model-2.js";
import * as view from "./view-2.js";
import { renderBetAmount } from "./view-2.js";

export const btnsArr = [
  { name: "newGame", class: "btn__newGame", callback: startNewGame },
  { name: "endGame", class: "btn__endGame", callback: applyEndGameBtn },
  { name: "submitBet", class: "btn__submitBetValue", callback: submitBetValue },
  { name: "dealCards", class: "btn__deal-cards", callback: applyInitialCards },
  { name: "hit", class: "btn__hit", callback: hitAction },
  { name: "stand", class: "btn__stand", callback: standAction },
  { name: "doubleDown", class: "btn__doubleDown", callback: doubleDownAction },
  { name: "split", class: "btn__split", callback: splitAction },
  { name: "insurance", class: "btn__insurance", callback: insuranceAction },
  { name: "evenMoney", class: "btn__evenMoney", callback: evenMoneyAction },
  { name: "surrender", class: "btn__surrender", callback: surrenderAction },
  { name: "easy", class: "btn__easy", callback: applyEasyQuestionDifficulty },
  {
    name: "medium",
    class: "btn__medium",
    callback: applyMediumQuestionDifficulty,
  },
  { name: "hard", class: "btn__hard", callback: applyHardQuestionDifficulty },
  { name: "answerA", class: "btn__answer-a", callback: collectTriviaAnswer },
  { name: "answerB", class: "btn__answer-b", callback: collectTriviaAnswer },
  { name: "answerC", class: "btn__answer-c", callback: collectTriviaAnswer },
  { name: "answerD", class: "btn__answer-d", callback: collectTriviaAnswer },
  {
    name: "answerTrue",
    class: "btn__answer-true",
    callback: collectTriviaAnswer,
  },
  {
    name: "answerFalse",
    class: "btn__answer-false",
    callback: collectTriviaAnswer,
  },
];

export default class State {
  navBtnVisible = { array: btnsArr, newGame: true, endGame: false };
  gameBtnVisible = {
    array: btnsArr,
    submitBet: false,
    dealCards: false,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
    evenMoney: false,
    surrender: false,
  };
  noticeText;
  round;
  // betAmount;
  gameMode = { split: false, doubleDown: false, insurance: false };
  fiveCardCharlie;
  gameActive;
  splitAvailable;
  // playerHand = { cards: [], images: [], total: 0 };

  //   test = `testing 1`;

  constructor() {
    // this.bank = bank;
    // this.noticeText = noticeText;
    // this.betAmount = betAmount;
    // this.navBtnVisible = navBtnVisible;
    // this.gameBtnVisible = gameBtnVisible;
    // this.gameMode = gameMode;
    // this.fiveCardCharlie = fiveCardCharlie;
    // this.gameActive = gameActive;
  }

  toggleGameActive(toggle) {
    toggle ? (this.gameActive = true) : (this.gameActive = false);
    bjModel.updateGameActive(toggle);
  }

  initialAddPlayers(arr) {
    let [player, dealer] = arr;
    this.player = player;
    this.dealer = dealer;
  }

  set addRoundNumber(num) {
    this.round = num;
  }

  set updateBank(bank) {
    // this.bank = bank;
    // bjModel.updateBank(bank);
    this.player.bank = bank;
    view.renderBank(bank);
  }

  set updateBetAmount(betAmount) {
    // this.betAmount = betAmount;
    // bjModel.updateBetAmount(betAmount);
    this.player.betAmount = betAmount;
    renderBetAmount(betAmount);
  }

  set updateInsuranceBetAmount(betAmount) {
    this.player.updateInsuranceBetAmount = betAmount;
    view.renderInsuranceBetField(betAmount);
  }

  updateUI() {
    let bank = this.player.bank;
    let betAmount = this.player.betAmount;
    view.renderBank(bank);
    view.renderBetAmount(betAmount);
    if (this.gameMode.split)
      view.renderSplitBetAmount(this.player.splitBetAmount);
  }

  // set currentBank(bank) {
  //   // this.bank = bank;
  //   this.player.bank = bank;
  // }

  set updateNoticeText(str) {
    this.noticeText = str;
    view.renderNoticeText(str);
  }

  set updateVisibleGameBtns(obj) {
    this.gameBtnVisible = { ...this.gameBtnVisible, ...obj };
    view.renderBtnVisibility(this.gameBtnVisible);
  }

  set updateVisibleNavBtns(obj) {
    this.navBtnVisible = { ...this.navBtnVisible, ...obj };
    view.renderBtnVisibility(this.navBtnVisible);
  }

  // set updatePlayerHand(hand) {
  //   // this.playerHand.cards = [...this.playerHand.cards, ...hand.cards];
  //   // this.playerHand.images = [...this.playerHand.images, ...hand.images];
  //   // this.playerHand.total = hand.total;
  //   view.renderPlayerHand(hand);
  // }

  set updatePlayer(player) {
    this.player = player;
    view.renderPlayerHand(this.player.hand);
  }

  set updateDealer(dealer) {
    this.dealer = dealer;
    view.renderDealerHand(this.dealer.hand);
  }

  set updateSplitHand1(player) {
    this.player = player;
    view.renderPlayerHand(this.player.splitHand1);
  }

  set updateSplitHand2(player) {
    this.player = player;
    view.renderPlayerSplitHand(this.player.splitHand2);
  }

  set updateSplitAvailable(result) {
    this.splitAvailable = result;

    if (this.splitAvailable)
      this.gameBtnVisible = { ...this.gameBtnVisible, ...{ split: true } };
    else this.gameBtnVisible = { ...this.gameBtnVisible, ...{ split: false } };

    view.renderBtnVisibility(this.gameBtnVisible);
  }

  set updateDoubleDownAvailable(result) {
    this.doubleDownAvailable = result;

    if (this.doubleDownAvailable)
      this.gameBtnVisible = { ...this.gameBtnVisible, ...{ doubleDown: true } };
    else
      this.gameBtnVisible = {
        ...this.gameBtnVisible,
        ...{ doubleDown: false },
      };

    view.renderBtnVisibility(this.gameBtnVisible);
  }

  set updateEvenMoneyAvailable(result) {
    this.evenMoneyAvailable = result;

    if (this.evenMoneyAvailable)
      this.gameBtnVisible = { ...this.gameBtnVisible, ...{ evenMoney: true } };
    else
      this.gameBtnVisible = {
        ...this.gameBtnVisible,
        ...{ evenMoney: false },
      };

    view.renderBtnVisibility(this.gameBtnVisible);
  }

  set updateSurrenderAvailable(result) {
    this.surrenderAvailable = result;

    if (this.surrenderAvailable)
      this.gameBtnVisible = { ...this.gameBtnVisible, ...{ surrender: true } };
    else
      this.gameBtnVisible = {
        ...this.gameBtnVisible,
        ...{ surrender: false },
      };

    view.renderBtnVisibility(this.gameBtnVisible);
  }

  set updateInsuranceAvailable(result) {
    this.insuranceAvailable = result;

    if (this.insuranceAvailable)
      this.gameBtnVisible = { ...this.gameBtnVisible, ...{ insurance: true } };
    else
      this.gameBtnVisible = { ...this.gameBtnVisible, ...{ insurance: false } };

    view.renderBtnVisibility(this.gameBtnVisible);
  }

  set updateGameMode(mode) {
    if (mode == `split`) this.gameMode.split = true;
    if (mode == `doubleDown`) this.gameMode.doubleDown = true;
    if (mode == `insurance`) this.gameMode.insurance = true;
  }

  updateNaturalChecked() {
    this.naturalChecked = true;
  }

  checkValidInsurance() {
    // if (insuranceAlreadyChecked) return;
    // insuranceAlreadyChecked = true;
    let dealerInitialFaceUpCard = this.dealer.hand.cards[1].value;
    let bank = this.player.bank;
    let betAmount = this.player.betAmount;

    if (this.evenMoneyAvailable == true) return;

    if (dealerInitialFaceUpCard == "ACE" && bank >= 1 && betAmount >= 2)
      this.updateInsuranceAvailable = true;
  }

  checkValidEvenMoney() {
    // if (insuranceAlreadyChecked) return;
    // insuranceAlreadyChecked = true;
    let dealerInitialFaceUpCard = this.dealer.hand.cards[1].value;
    let playerHandOutcome = this.player.hand.outcome;

    if (dealerInitialFaceUpCard == "ACE" && playerHandOutcome == `natural`)
      this.updateEvenMoneyAvailable = true;
  }

  updateInitialSplit(player) {
    this.updateSplitHand1 = player;
    this.updateSplitHand2 = player;
    this.updateVisibleGameBtns = { split: false };
  }

  endGameBtnPressed() {
    this.gameAborted = true;
  }
}

// renderUIFields(on, obj = null) {
//   let changeObj = { ...obj };

//   if (on == false) return;
//   if (changeObj.uiAll)
//     changeObj = { noticeText: true, bank: true, betAmount: true };
//   if (changeObj.all)
//     changeObj = {
//       noticeText: true,
//       bank: true,
//       betAmount: true,
//       gameBtn: true,
//       navBtn: true,
//     };
//   if (changeObj.noticeText) view.renderNoticeText(this.noticeText);
//   if (changeObj.bank) view.renderBank(this.bank);
//   if (changeObj.betAmount)
//     view.renderBetAmount(
//       this.betAmount,
//       this.splitBetAmount,
//       this.insuranaceBetAmount
//     );
//   if (changeObj.gameBtn) view.renderBtnVisibility(this.gameBtnVisible);
//   if (changeObj.navBtn) view.renderBtnVisibility(this.navBtnVisible);
// }

// renderGameCards(on) {
//   if (on == false) return;
//   view.renderPlayerHand(this.playerHand);
//   view.renderDealerHand(this.dealerHand);
//   if (this.splitMode) {
//     view.renderSplitHand1(this.splitHand1);
//     view.renderSplitHand2(this.splitHand2);
//   }
//   set updateTest(str) {
//     this.test = str;
//   }

export function startNewGame(e) {
  let bank = 1000;
  //   triviaModel.generateTriviaQuestions();
  view.renderBtnVisibility({ array: btnsArr, newGame: false, endGame: true });
  startNewRound(bank);
}

export function startNewRound(bank) {
  let gameState = new State(bank);

  let players = bjModel.initPlayers(bank);

  gameState.initialAddPlayers(players);
  // gameState.updateBank = bank;

  view.addHandlerListeners(btnsArr, gameState);

  gameState.toggleGameActive(true);
  gameState.updateNoticeText = `Place an amount to bet`;
  gameState.updateVisibleGameBtns = { submitBet: true };
  // gameState.renderUIFields(true, { all: true });

  bjModel.initDeck();
}

export function submitBetValue(e, gameState) {
  let betAmount = view.collectBetSubmitted();
  let bank = gameState.player.bank;

  // if (applyInsuranceLogic(betAmount, gameState)) return;

  if (gameState.gameMode.insurance) {
    applyInsuranceLogic(betAmount, gameState);
    return;
  }

  if (!bjModel.checkValidBet(betAmount, bank)) {
    gameState.updateNoticeText = `Invalid Bet.  Please try again.`;
    view.renderBetValueField(null);
    return;
  }

  view.renderBetValueField(null);

  gameState.updateBetAmount = betAmount;

  // let updatedBank = bjModel.applySubmittedBet(betAmount, gameState);

  gameState.updateBank = bank - betAmount;

  gameState.updateVisibleGameBtns = { submitBet: false, dealCards: true };
  gameState.updateNoticeText = `Bet Placed. Deal cards to continue...`;

  bjModel.dealInitialCards(gameState);
}

function applyInsuranceLogic(betAmount, gameState) {
  let validBet = bjModel.checkValidInsuranceBet(betAmount, gameState);

  if (!validBet) {
    gameState.updateNoticeText = `Invalid Insurance Bet.  Please try again.`;
    view.renderBetValueField(null);
    return;
  }

  gameState.updateInsuranceBetAmount = betAmount;

  checkInsuranceBetOutcome(betAmount, gameState);

  return;

  function checkInsuranceBetOutcome(betAmount, gameState) {
    bjModel.insuranceLogic(betAmount, gameState);

    gameState.updateUI();

    if (gameState.player.hand.insuranceWon) endRound(gameState);
    else applyLosingInsBetSeq(gameState);
  }

  function applyLosingInsBetSeq(gameState) {
    gameState.gameMode.insurance = false;
    gameState.updateNoticeText = `Lost Insurance Bet.  Player's Turn.`;
    gameState.updateNaturalChecked();
    gameState.updateVisibleGameBtns = { hit: true, stand: true };

    if (gameState.splitAvailable)
      gameState.updateVisibleGameBtns = { split: true };
    if (gameState.doubleDownAvailable)
      gameState.updateVisibleGameBtns = { doubleDown: true };
  }
}

// function applyInsuranceLogic(betAmount, gameState) {
//   let player = gameState.player;

//   if (!gameState.gameMode.insurance) return true;

//   if (!checkForInsuranceBet(betAmount, gameState)) return false;

//   checkInsuranceBetOutcome(betAmount, gameState);

//   return false;

//   function checkForInsuranceBet(betAmount, gameState) {
//     if (!bjModel.checkValidInsuranceBet(betAmount, gameState)) {
//       gameState.updateNoticeText = `Invalid Insurance Bet.  Please try again.`;
//       view.renderBetValueField(null);
//       return false;
//     } else {
//       gameState.updateVisibleGameBtns = { submitBet: false };
//       gameState.updateInsuranceBetAmount = betAmount;
//       return true;
//     }
//   }

//   function checkInsuranceBetOutcome(betAmount, gameState) {
//     bjModel.insuranceLogic(betAmount, gameState);

//     gameState.updateStateUI();

//     if (gameState.player.hand.insuranceOutcome == `win`) {
//       endRound(gameState);
//     } else {
//       applyLosingInsBetSeq(gameState);
//     }
//   }

//   function applyLosingInsBetSeq(gameState) {
//     gameState.gameMode.insurance = false;
//     gameState.updateNoticeText = `Lost Insurance Bet.  Player's Turn.`;

//     if (gameState.gameMode.split)
//       gameState.updateVisibleGameBtns = { split: true };
//   }
// }

export function updateStatePlayers(player, gameState) {
  // if ((hand.type = `player`)) gameState.updatePlayerHand = hand;
  // if ((hand.type = `dealer`)) gameState.updateDealerHand = hand;

  if (player.type == "player") gameState.updatePlayer = player;
  if (player.type == `dealer`) gameState.updateDealer = player;
  if (player.type == `split player`) {
    if (player.currentSplitHand == 1) gameState.updateSplitHand1 = player;
    else gameState.updateSplitHand2 = player;
  }
}

export function updateStateUI(gameState) {
  gameState.updateUI();
}

export function updateStateInitialSplit(player, gameState) {
  gameState.updateUI();
  gameState.updateInitialSplit(player);
}

export function enableBeginRoundBtns(gameState) {
  gameState.updateNoticeText = `Player's Turn...`;
  gameState.updateVisibleGameBtns = {
    dealCards: false,
    hit: true,
    stand: true,
  };
  if (!gameState.evenMoneyAvailable) gameState.updateSurrenderAvailable = true;
}

export function updateSplitToken(boolean, gameState) {
  gameState.updateSplitAvailable = boolean;
}

export function updateDoubleDownToken(boolean, gameState) {
  gameState.updateDoubleDownAvailable = boolean;
}

export function splitAction(e, gameState) {
  if (checkForNaturals(gameState)) return;
  changeBtnsAvailable(gameState);

  gameState.updateNoticeText = `Player splits...Please play Hand 1`;
  gameState.updateGameMode = `split`;
  bjModel.splitPlayerHand(gameState);
}

export function doubleDownAction(e, gameState) {
  if (checkForNaturals(gameState)) return;
  changeBtnsAvailable(gameState);

  gameState.gameMode.doubleDown = true;
  gameState.updateVisibleGameBtns = {
    hit: false,
    stand: false,
  };

  bjModel.applyDoubleDown(gameState);

  gameState.updateNoticeText = `Player doubles down...`;
  let gameTimer = setTimeout(bjModel.executePlayerHit, 3000, gameState);

  // initTriviaMode();
}

export function checkPlayerNextAvailableAction(gameState) {
  let endHandToken;
  let changeHandToken;
  let dealerTurnToken;
  let gameTimer;
  let player = gameState.player;

  let handOutcome = player.hand.outcome;
  let splitHand1Outcome = player.splitHand1.outcome;
  let splitHand2Outcome = player.splitHand2.outcome;

  if (
    handOutcome == `bust` ||
    handOutcome == `charlie` ||
    handOutcome == `natural`
  )
    endHandToken = true;
  if (gameState.gameMode.doubleDown) dealerTurnToken = true;

  if (gameState.player.splitHand1.splitAces) changeHandToken = true;
  if (gameState.player.splitHand2.splitAces) endHandToken = true;

  if (splitHand1Outcome == `bust` || splitHand1Outcome == `charlie`)
    changeHandToken = true;

  if (changeHandToken && splitHand2Outcome == `bust`) endHandToken = true;
  if (changeHandToken && splitHand2Outcome == `charlie`) endHandToken = true;
  if (splitHand2Outcome == `bust` || splitHand2Outcome == `charlie`)
    dealerTurnToken = true;

  if (changeHandToken) player.updateCurrentSplitHand = 2;
  if (endHandToken) {
    gameState.updateNoticeText = `Round ends...`;
    gameTimer = setTimeout(endRound, 5000, gameState);
    return;
  } else if (dealerTurnToken) {
    gameTimer = setTimeout(executeDealerTurn, 5000, gameState);
    return;
  }

  continuePlayerTurn(gameState);

  // switch (true) {
  //   case player.currentSplitHand == 0:
  //     if (endHandToken) gameTimer = setTimeout(endRound, 5000);
  //     else if (dealerTurnToken)
  //       gameTimer = setTimeout(executeDealerTurn, 5000, gameState);
  //     else continuePlayerTurn(gameState);
  //     break;
  //   case player.currentSplitHand == 1:
  //     if (changeHandToken) player.updateCurrentSplitHand = 2;
  //     continuePlayerTurn(gameState);
  //     break;
  //   case player.currentSplitHand == 2:
  //     if (endHandToken) gameTimer = setTimeout(endRound, 5000, gameState);
  //     else if (dealerTurnToken)
  //       gameTimer = setTimeout(executeDealerTurn, 5000, gameState);
  //     else continuePlayerTurn(gameState);
  //     break;
  //   default:
  //     continuePlayerTurn(gameState);
  // }
}

function continuePlayerTurn(gameState) {
  let player = gameState.player;

  if (player.currentSplitHand == 0)
    gameState.updateNoticeText = `Player's Turn...`;
  if (player.currentSplitHand == 1)
    gameState.updateNoticeText = `Please play Hand 1...`;
  if (player.currentSplitHand == 2)
    gameState.updateNoticeText = `Please play Hand 2...`;

  gameState.updateVisibleGameBtns = { hit: true, stand: true };
}

function executeDealerTurn(gameState) {
  gameState.updateNoticeText = `Dealer's Turn...`;
  gameState.updateVisibleGameBtns = {
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
  };
  checkDealerNextAvailableAction(gameState);
}

export function checkDealerNextAvailableAction(gameState) {
  let endHandToken;
  let gameTimer;
  let dealer = gameState.dealer;

  let handOutcome = dealer.hand.outcome;

  // dealer.hand.total = 15;

  if (handOutcome == `bust` || handOutcome == `charlie`) endHandToken = true;
  if (dealer.hand.total > 16) endHandToken = true;

  if (endHandToken) {
    gameState.updateNoticeText = `Dealer's Turn ends...`;
    gameTimer = setTimeout(endRound, 5000, gameState);
  } else {
    gameState.updateNoticeText = `Dealer hits...`;
    gameTimer = setTimeout(bjModel.executeDealerHit, 5000, gameState);
  }
}

export function hitAction(e, gameState) {
  if (checkForNaturals(gameState)) return;
  changeBtnsAvailable(gameState);

  if (gameState.player.currentSplitHand == 0)
    gameState.updateNoticeText = `Player hits...`;
  if (gameState.player.currentSplitHand == 1)
    gameState.updateNoticeText = `Hand 1 hits...`;
  if (gameState.player.currentSplitHand == 1)
    gameState.updateNoticeText = `Hand 1 hits...`;

  let gameTimer = setTimeout(bjModel.executePlayerHit, 3000, gameState);
}

export function standAction(e, gameState) {
  if (checkForNaturals(gameState)) return;
  changeBtnsAvailable(gameState);

  let player = gameState.player;

  if (player.currentSplitHand == 1) {
    executeStandForSplitHand1();
    return;
  }

  executeDealerTurn(gameState);

  function executeStandForSplitHand1() {
    player.updateCurrentSplitHand = 2;
    gameState.updateNoticeText = `Please play 2nd split hand`;
    gameState.updateVisibleGameBtns = { hit: true, stand: true };
  }
}

function checkForNaturals(gameState) {
  if (gameState.naturalChecked) return false;

  gameState.updateNaturalChecked();

  let dealer = gameState.dealer;
  let player = gameState.player;

  dealer.checkHandForNatural(dealer.hand);

  // let dealerHand = gameState.dealer.hand;
  // let faceUpCard = [dealerHand.cards[1]];

  // let faceUpCardValue = gameState.dealer.calculateHandTotal(faceUpCard);

  // if (faceUpCardValue >= 10) endRound(gameState);
  if (dealer.hand.outcome == `natural` || player.hand.outcome == `natural`) {
    endRound(gameState);
    return true;
  }
  return false;
}

function changeBtnsAvailable(gameState) {
  if (gameState.splitAvailable) gameState.updateSplitAvailable = false;
  if (gameState.insuranceAvailable) gameState.updateInsuranceAvailable = false;
  if (gameState.doubleDownAvailable)
    gameState.updateDoubleDownAvailable = false;

  if (gameState.evenMoneyAvailable) gameState.updateEvenMoneyAvailable = false;
  else gameState.updateSurrenderAvailable = false;
}

export function insuranceAction(e, gameState) {
  gameState.gameMode.insurance = true;
  if (gameState.insuranceAvailable)
    gameState.updateVisibleGameBtns = { insurance: false };
  gameState.updateSurrenderAvailable = false;

  gameState.updateNoticeText = `Please submit an amount up to half your original bet`;

  gameState.updateVisibleGameBtns = {
    submitBet: true,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
  };
}

// function endRound(gameState) {
//   //reveal dealer cards
//   //check special circumstances (bust, charlie, blackjack/insurance)
//   //check regular circumstances (whoever has higher total)
//   //calculate new player bank
//   //display winner outcome
//   //clear UI
//   //init next Round
// }

export function evenMoneyAction(event, gameState) {
  gameState.updateVisibleGameBtns = {
    hit: false,
    stand: false,
  };
  changeBtnsAvailable(gameState);

  let dealerOutcome = gameState.dealer.hand.outcome;
  let player = gameState.player;
  let gameTimer;

  //Apply Even Money
  gameState.updateBank = player.bank - player.betAmount / 2;
  // bjModel.applyEvenMoneyBet(gameState);

  gameState.updateNoticeText = `Player takes Even Money option...`;

  if (dealerOutcome == `natural`) player.applyEvenMoneyOutcome = `win`;
  else player.applyEvenMoneyOutcome = `lose`;

  gameTimer = setTimeout(endRound, 3000, gameState);
}

export function surrenderAction(event, gameState) {
  gameState.updateVisibleGameBtns = { hit: false, stand: false };
  changeBtnsAvailable(gameState);

  let dealer = gameState.dealer;
  let player = gameState.player;
  let gameTimer;

  gameState.updateNoticeText = `Player has surrendered hand...`;

  // dealer.checkHandForNatural();

  if (dealer.hand.outcome == `natural`) player.applySurrenderOutcome = `fail`;
  else player.applySurrenderOutcome = `pass`;

  gameTimer = setTimeout(endRound, 3000, gameState);
}

function endRound(gameState) {
  let playerHand = gameState.player.hand;
  let dealer = gameState.dealer;
  let dealerHand = dealer.hand;
  let splitHand1 = gameState.player.splitHand1;
  let splitHand2 = gameState.player.splitHand2;

  gameState.updateVisibleGameBtns = {
    hit: false,
    stand: false,
    split: false,
    insurance: false,
  };

  gameState.gameActive = false;

  dealer.revealFaceDownCard();

  gameState.updateDealer = dealer;

  if (gameState.gameMode.split) {
    determineWinner(splitHand1, gameState);
    determineWinner(splitHand2, gameState);
  } else determineWinner(playerHand, gameState);

  view.displayGameOutcome(gameState);

  let gameTimer = setTimeout(clearRoundData, 5000, gameState);
  return;

  // if (state.gameMode.split) {
  //   let playerSplitHand1 = chooseWinner(
  //     state.playerHandTotal,
  //     state.betAmount,
  //     `hand1`
  //   );
  //   let playerSplitHand2 = chooseWinner(
  //     state.playerSplitHandTotal,
  //     state.splitBetAmount,
  //     `hand2`
  //   );

  displayGameOutcome(state, playerSplitHand1, playerSplitHand2);

  // }

  // let playerSplitHand1 = chooseWinner(state.playerHandTotal, state.betAmount);
  // displayGameOutcome(state, playerSplitHand1);
  // gameTimer = setTimeout(clearRoundData, 5000);
}

function determineWinner(hand, gameState) {
  //natural, charlie, bust, regular
  let handOutcome = hand.outcome;
  let dealerHand = gameState.dealer.hand;
  let dealerOutcome = dealerHand.outcome;

  switch (true) {
    case handOutcome == `even money win`:
      hand.payoutResult = `blackjack`;
      hand.resultText = `Dealer Blackjack.  Player wins Even Money Bet.`;
      break;
    case handOutcome == `even money lose`:
      hand.payoutResult = `blackjack`;
      hand.resultText = `Player Blackjack!!! Player loses Even Money Bet.`;
      break;
    case handOutcome == `surrender`:
      hand.payoutResult = `surrender`;
      hand.resultText = `Surrender passed.  Player receives half bet back.`;
      break;
    case handOutcome == `surrender failed`:
      hand.payoutResult = `lose`;
      hand.resultText = `Dealer Blackjack.  Surrender failed...`;
      break;
    case handOutcome == `natural` && dealerOutcome == `natural`:
      hand.payoutResult = `push`;
      hand.resultText = `Push.  Both Players have natural blackjack...`;
      break;
    case handOutcome == `natural`:
      hand.payoutResult = `blackjack`;
      hand.resultText = `Blackjack!!! Payout doubled!`;
      break;
    case dealerOutcome == `natural`:
      hand.payoutResult = `lose`;
      hand.resultText = `Lose...  Dealer has blackjack...`;
      break;
    case dealerOutcome == `natural`: //insurancebet
      hand.payoutResult = `lose`;
      hand.resultText = `Dealer has blackjack.  Player wins insurance bet only.`;
      break;
    case handOutcome == `charlie`:
      hand.payoutResult = `win`;
      hand.resultText = `Win! 5 Card Charlie!`;
      break;
    case dealerOutcome == `charlie`:
      hand.payoutResult = `lose`;
      hand.resultText = `Lose... Dealer has 5 Card Charlie...`;
      break;
    case dealerOutcome == `bust`:
      hand.payoutResult = `win`;
      hand.resultText = `Win!  Dealer busts.`;
      break;
    case handOutcome == `bust`:
      hand.payoutResult = `lose`;
      hand.resultText = `Lose... Hand busts.`;
      break;
    case dealerHand.total > hand.total:
      hand.payoutResult = `lose`;
      hand.resultText = `Dealer Wins...`;
      break;
    case hand.total == dealerHand.total:
      hand.payoutResult = `push`;
      hand.resultText = `Push.`;
      break;
    case hand.total > dealerHand.total:
      hand.payoutResult = `win`;
      hand.resultText = `Hand Wins!`;
      break;
  }

  gameState.updateBank = bjModel.calculatePlayerWinnings(
    hand.payoutResult,
    gameState
  );
}

function clearRoundData(gameState) {
  view.clearGameCards();
  view.clearUI();
  bjModel.resetGameInfo();
  bjModel.addStateToLog(gameState);
  view.removeEventListeners(btnsArr);

  if (gameState.gameAborted) {
    view.renderNoticeText(`Game Ended.  Select New Game...`);
    let bank = 0;
    view.renderBank(bank);
    gameState.updateVisibleNavBtns = {
      newGame: true,
      endGame: false,
    };
    gameState.updateVisibleGameBtns = {
      submitBet: false,
      dealCards: false,
      hit: false,
      stand: false,
      doubleDown: false,
      split: false,
      insurance: false,
    };
    // init();
  } else startNewRound(gameState.player.bank);
}

export function applyEndGameBtn(e, gameState) {
  gameState.endGameBtnPressed();
  clearRoundData(gameState);
}

function init(startNewGame) {
  view.addNewGameHandler(startNewGame);
  // console.log(arr);
}

init(startNewGame);

export function applyInitialCards(event, gameState) {}
// export function hitAction(event, gameState) {}
// export function standAction(event, gameState) {}
// export function splitAction(event, gameState) {}
// export function insuranceAction(event, gameState) {}
// export function doubleDownAction(event, gameState) {}
// export function evenMoneyAction(event, gameState) {}
// export function surrenderAction(event, gameState) {}
export function applyEasyQuestionDifficulty(event, gameState) {}
export function applyMediumQuestionDifficulty(event, gameState) {}
export function applyHardQuestionDifficulty(event, gameState) {}
export function collectTriviaAnswer(event, gameState) {}
// export function applyEndGameBtn(event, gameState) {}
