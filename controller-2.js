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
  };
  noticeText;
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
    if (this.splitAvailable) {
      this.gameBtnVisible = { ...this.gameBtnVisible, ...{ split: true } };
      view.renderBtnVisibility(this.gameBtnVisible);
    }
  }

  set updateGameMode(mode) {
    if (mode == `split`) this.gameMode.split = true;
    if (mode == `doubleDown`) this.gameMode.doubleDown = true;
    if (mode == `insurance`) this.gameMode.insurance = true;
  }

  checkValidInsurance() {
    // if (insuranceAlreadyChecked) return;
    // insuranceAlreadyChecked = true;
    let dealerInitialFaceUpCard = this.dealer.hand.cards[1].value;
    let bank = this.player.bank;
    let betAmount = this.player.betAmount;

    if (dealerInitialFaceUpCard == "ACE" && bank >= 1 && betAmount >= 2)
      this.updateVisibleGameBtns = { insurance: true };
  }

  updateInitialSplit(player) {
    this.updateSplitHand1 = player;
    this.updateSplitHand2 = player;
    this.updateVisibleGameBtns = { split: false };
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

export function startNewGame(e, gameState) {
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

  //   if (!bjModel.applyInsuranceLogic(betAmount)) return;

  if (!bjModel.checkValidBet(betAmount, bank)) {
    gameState.updateNoticeText = `Invalid Bet.  Please try again.`;
    view.renderBetValueField(null);
    return;
  }

  gameState.updateBetAmount = betAmount;

  // let updatedBank = bjModel.applySubmittedBet(betAmount, gameState);

  gameState.updateBank = bank - betAmount;

  gameState.updateVisibleGameBtns = { submitBet: false, dealCards: true };
  gameState.updateNoticeText = `Bet Placed. Deal cards to continue...`;

  bjModel.dealInitialCards(gameState);
}

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

export function updateStateInitialSplit(player, gameState) {
  gameState.updateInitialSplit(player);
}

export function enableBeginRoundBtns(gameState) {
  gameState.updateNoticeText = `Player's Turn...`;
  gameState.updateVisibleGameBtns = {
    dealCards: false,
    hit: true,
    stand: true,
    doubleDown: true,
  };
}

export function updateSplitToken(boolean, gameState) {
  gameState.updateSplitAvailable = boolean;
}

export function splitAction(e, gameState) {
  bjModel.splitPlayerHand(gameState);
}

function init() {
  let arr = [
    { name: "newGame", class: "btn__newGame", callback: startNewGame },
  ];
  view.addHandlerListeners(arr);
  // console.log(arr);
}

init();

export function applyInitialCards(event, gameState) {}
export function hitAction(event, gameState) {}
export function standAction(event, gameState) {}
// export function splitAction(event, gameState) {}
export function insuranceAction(event, gameState) {}
export function doubleDownAction(event, gameState) {}
export function applyEasyQuestionDifficulty(event, gameState) {}
export function applyMediumQuestionDifficulty(event, gameState) {}
export function applyHardQuestionDifficulty(event, gameState) {}
export function collectTriviaAnswer(event, gameState) {}
export function applyEndGameBtn(event, gameState) {}
