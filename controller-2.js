import * as bjModel from "/blackjack-model-2.js";
import * as triviaModel from "/trivia-model-2.js";
import * as view from "/view-2.js";

const btnsArr = [
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

class State {
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

  constructor(bank) {
    this.bank = bank;
    this.noticeText = noticeText;
    this.betAmount = betAmount;
    this.navBtnVisible = navBtnVisible;
    this.gameBtnVisible = gameBtnVisible;
    this.gameMode = gameMode;
    this.fiveCardCharlie = fiveCardCharlie;
    this.gameActive = gameActive;
  }

  toggleGameActive(toggle) {
    toggle ? (this.gameActive = true) : (this.gameActive = false);
  }

  set updateBank(bank) {
    this.bank = bank;
    bjModel.updateBank(bank);
    view.renderBank(bank);
  }

  set updateBetAmount(betAmount) {
    this.betAmount = betAmount;
    bjModel.updateBetAmount(betAmount);
    view.renderBetAmount(betAmount);
  }

  set currentBank(bank) {
    this.bank = bank;
  }

  set updateNoticeText(str) {
    this.noticeText = str;
    view.renderNoticeText(str);
  }

  set updateVisibleGameBtns(obj) {
    this.gameBtnVisible = { ...this.gameBtnVisible, ...obj };
    view.renderBtnVisibility(this.gameBtnVisible);
  }
}

export function startNewGame() {
  let bank = 1000;
  triviaModel.generateTriviaQuestions();
  view.renderBtnVisibility({ newGame: false, endGame: true });
  startNewRound(bank);
}

function startNewRound(bank) {
  let gameState = new State(bank);

  gameState.toggleGameActive(true);
  gameState.updateNoticeText = `Place an amount to bet`;
  gameState.updateVisibleGameBtns = { submitBet: true };

  bjModel.initDeck();
}

export function submitBetValue() {
  let betAmount = view.collectBetSubmitted();

  if (!bjModel.applyInsuranceLogic(betAmount)) return;

  if (!bjModel.checkValidBet(betAmount)) {
    gameState.updateNoticeText = `Invalid Bet.  Please try again.`;
    view.renderBetValueField(null);
    return;
  }

  let updatedInfoArr = bjModel.collectBankBetAmount();
  renderSubmitBet(updatedInfoArr);

  bjModel.dealInitialCards();

  function renderSubmitBet(arr) {
    let [bank, betAmount] = arr;
    gameState.updateBank = bank;
    gameState.updateBetAmount = betAmount;
    gameState.updateVisibleGameBtns = { submitBet: false, dealCards: true };
    gameState.updateNoticeText = `Bet Placed. Deal cards to continue...`;
  }
}

function init() {
  view.addHandlerListeners(btnsArr);
}

init();
