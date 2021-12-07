import {
  checkValidInsuranceBet,
  clearRoundModelData,
  checkValidBet,
  updateBetAmount,
  dealInitialCards,
  shuffleCards,
  initDeck,
  collectDealedCards,
  executeDealerHit,
  revealDealerCards,
  applyDoubleDown,
  insuranceLogic,
  splitPlayerHand,
  changeCurrentSplitHand,
  makeGameInactive,
  calculatePlayerWinnings,
} from "./blackjack-model.js";
import {
  addHandlerListeners,
  collectBetSubmitted,
  renderBetValueField,
  renderBtnVisibility,
  renderGameCards,
  renderUIFields,
  toggleSplitHandLabel,
  displayGameOutcome,
  clearGameCards,
  toggleTriviaModal,
  renderTriviaQuestionUI,
  disableTriviaAnswerBtns,
  renderTriviaCorrectAnswer,
  renderTriviaIncorrectAnswer,
  resetTriviaMode,
  displayTriviaCorrectAnswer,
  renderInsuranceBetField,
  hideInsuranceBetField,
} from "./view.js";
import {
  selectTriviaDifficulty,
  determineCorrectAnswer,
} from "./trivia-model.js";
import * as bjModel from "/blackjack-model.js";
import * as triviaModel from "/trivia-model.js";

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

// const btnsArr = [
//   { event: "newGameBtn", callback: startNewGame },
//   { event: "endGameBtn", callback: applyEndGameBtn },
//   { event: "submitBetBtn", callback: submitBet },
//   { event: "dealCardsBtn", callback: applyInitialCards },
//   { event: "hitBtn", callback: hitAction },
//   { event: "standBtn", callback: standAction },
//   { event: "doubleDownBtn", callback: doubleDownAction },
//   { event: "splitBtn", callback: splitAction },
//   { event: "insuranceBtn", callback: insuranceAction },
//   { event: "easyDifficultyBtn", callback: applyEasyQuestionDifficulty },
//   { event: "mediumDifficultyBtn", callback: applyMediumQuestionDifficulty },
//   { event: "hardDifficultyBtn", callback: applyHardQuestionDifficulty },
//   { event: "answerABtn", callback: collectTriviaAnswer },
//   { event: "answerBBtn", callback: collectTriviaAnswer },
//   { event: "answerCBtn", callback: collectTriviaAnswer },
//   { event: "answerDBtn", callback: collectTriviaAnswer },
//   { event: "answerTrueBtn", callback: collectTriviaAnswer },
//   { event: "answerFalseBtn", callback: collectTriviaAnswer },
// ];

let state = {
  bank: 0,
  // noticeText: ``,
  betAmount: 0,
  playerCurrentAction: ``,
  navBtnVisible: { array: btnsArr, newGame: true, endGame: false },
  gameBtnVisible: {
    array: btnsArr,
    submitBet: false,
    dealCards: false,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
  },
  gameMode: { doubleDown: false, split: false, insurance: false },
  fiveCardCharlie: {
    player: false,
    dealer: false,
    splitHand1: false,
    splitHand2: false,
  },
};

let endGameBtnPressed;
let dealerTimer, gameTimer;

export function startNewGame() {
  state.bank = bjModel.resetBank();
  triviaModel.generateTriviaQuestions();
  state.navBtnVisible = {
    ...state.navBtnVisible,
    newGame: false,
    endGame: true,
  };

  renderBtnVisibility(state.navBtnVisible);
  startNewRound();
}

function startNewRound() {
  state.gameActive = true;
  state.noticeText = `Place an amount to bet`;
  state.gameBtnVisible = { ...state.gameBtnVisible, submitBet: true };

  renderUIFields(state);
  renderBtnVisibility(state.navBtnVisible);
  renderBtnVisibility(state.gameBtnVisible);
  initDeck();
}

export function submitBetValue() {
  let betAmount = collectBetSubmitted();

  if (!applyInsuranceLogic(betAmount)) return;

  if (!checkValidBet(betAmount)) {
    state.noticeText = `Invalid Bet.  Please try again.`;
    renderUIFields(state, true);
    renderBetValueField(null);
    return;
  }

  let updatedInfoArr = updateBetAmount(betAmount);
  renderSubmitBet(updatedInfoArr);

  dealInitialCards();

  function renderSubmitBet(arr) {
    let [bank, betAmount] = arr;
    state.bank = bank;
    state.betAmount = betAmount;
    state.gameBtnVisible = {
      ...state.gameBtnVisible,
      submitBet: false,
      dealCards: true,
    };
    state.noticeText = `Bet Placed.  Deal cards to continue...`;
    renderBetValueField(null);
    renderUIFields(state);
    renderBtnVisibility(state.gameBtnVisible);
  }
}

function applyInsuranceLogic(betAmount) {
  if (!state.gameMode.insurance) return true;

  if (!checkForInsuranceBet(betAmount)) return false;

  checkInsuranceBetOutcome(betAmount);

  return false;

  function checkForInsuranceBet(betAmount) {
    if (!checkValidInsuranceBet(betAmount)) {
      state.noticeText = `Invalid Insurance Bet.  Please try again.`;
      renderUIFields(state);
      renderBetValueField(null);
      return false;
    } else {
      state.gameBtnVisible = { ...state.gameBtnVisible, submitBet: false };
      state.insuranceBetAmount = betAmount;
      renderInsuranceBetField(state.insuranceBetAmount, state.gameBtnVisible);
      return true;
    }
  }

  function checkInsuranceBetOutcome() {
    let insuranceOutcome = insuranceLogic(betAmount);

    let [insBank, outcome] = insuranceOutcome;

    if (outcome) {
      state.bank = insBank;
      renderUIFields(state);
      endRound();
    } else {
      state.bank = insBank;
      renderUIFields(state);
      applyLosingInsBetSeq();
    }
  }

  function applyLosingInsBetSeq() {
    state.gameMode.insurance = false;
    state.noticeText = `Lost Insurance Bet.  Player's Turn.`;
    if (state.splitBtnActive)
      state.gameBtnVisible = { ...state.gameBtnVisible, split: true };
    state.gameBtnVisible = {
      ...state.gameBtnVisible,
      hit: true,
      stand: true,
      doubleDown: true,
    };
    renderUIFields(state, true);
    renderBtnVisibility(state.gameBtnVisible);
  }
}

export function applyInitialCards() {
  let gameCards = collectDealedCards();

  applyCardsToState(gameCards);
  state.noticeText = `Player's Turn...`;
  state.gameBtnVisible = {
    ...state.gameBtnVisible,
    dealCards: false,
    hit: true,
    stand: true,
    doubleDown: true,
  };
  if (gameCards.token.split) {
    state.splitBtnActive = true;
    state.gameBtnVisible = { ...state.gameBtnVisible, split: true };
  }

  if (gameCards.token.insurance)
    state.gameBtnVisible = { ...state.gameBtnVisible, insurance: true };

  renderGameCards(state);

  if (gameCards.token.naturalBlackJack) endRound();
  else {
    renderUIFields(state, true);
    renderBtnVisibility(state.gameBtnVisible);
  }
}

function applyCardsToState(obj) {
  state.playerCardImgs = obj.playerCardImgs;
  state.playerHandTotal = obj.playerHandTotal;
  state.playerSplitCardImgs = obj.playerSplitCardImgs;
  state.playerSplitHandTotal = obj.playerSplitHandTotal;
  state.dealerCardImgs = obj.dealerCardImgs;
  state.dealerHandTotal = obj.dealerHandTotal;
  state.visibleDealerHandTotal = obj.visibleDealerHandTotal;
}

export function hitAction() {
  state.gameBtnVisible = {
    ...state.gameBtnVisible,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
  };
  renderBtnVisibility(state.gameBtnVisible);
  initTriviaMode();
}

export function doubleDownAction() {
  state.gameMode.doubleDown = true;

  let updatedInfo = applyDoubleDown();

  let [updatedBank, updatedBet] = updatedInfo;

  state.bank = updatedBank;
  state.betAmount = updatedBet;
  state.noticeText = `Player doubles down...`;
  state.gameBtnVisible = {
    ...state.gameBtnVisible,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
  };

  renderBtnVisibility(state.gameBtnVisible);
  renderUIFields(state);

  initTriviaMode();
}

export function insuranceAction() {
  state.gameMode.insurance = true;

  state.noticeText = `Please submit an amount up to half your original bet`;
  state.gameBtnVisible = {
    ...state.gameBtnVisible,
    submitBet: true,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
  };

  renderBtnVisibility(state.gameBtnVisible);
  renderUIFields(state, true);
}

export function standAction() {
  if (state.gameMode.split && state.currentSplitHand == 1) {
    executeStandForSplitHand1();
    return;
  }

  executeDealerTurn();

  function executeStandForSplitHand1() {
    state.currentSplitHand = changeCurrentSplitHand();
    state.gameBtnVisible = { ...state.gameBtnVisible, hit: true, stand: true };
    state.noticeText = `Please play 2nd split hand`;
    renderBtnVisibility(state.gameBtnVisible);
    renderUIFields(state, true);
    return;
  }
}

export function executeDealerTurn() {
  state.noticeText = `Dealer's Turn...`;
  state.gameBtnVisible = {
    ...state.gameBtnVisible,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
  };
  renderBtnVisibility(state.gameBtnVisible);
  renderUIFields(state, true);
  dealerTimer = setTimeout(dealerTurn, 3000);
}
export function updateControllerCardInfo(gameCards) {
  applyCardsToState(gameCards);
  renderGameCards(state);
  renderUIFields(state, true);
}

export function updateControllerNextDealerTurn() {
  if (!state.gameActive) {
    endRound();
    return;
  }
  dealerTimer = setTimeout(dealerTurn, 3000);
}

function dealerTurn() {
  // hitBtn.style.display = "none";
  // standBtn.style.display = "none";
  // doubleDownBtn.style.display = "none";

  if (state.dealerHandTotal <= 16) {
    state.noticeText = `Dealer Hits...`;
    executeDealerHit();
    // applyCardsToState(gameCards);
    // renderGameCards(state);
    // renderUIFields(state, true);
    return;
  } else {
    state.noticeText = `Dealer's Turn Ends...`;
    renderUIFields(state, true);
    dealerTimer = setTimeout(endRound, 3000);
    return;
  }
}

export function splitAction() {
  let errorState = false;
  if (!errorState) {
    splitPlayerHand();
  }
}

export function updateControllerSplitCardInfo(gameInfo) {
  let { bank, splitBetAmount, currentSplitHand, gameCards } = gameInfo;
  state.bank = bank;
  state.splitBetAmount = splitBetAmount;
  state.currentSplitHand = currentSplitHand;
  applyCardsToState(gameCards);
  state.gameMode.split = true;
  state.noticeText = `Please play Hand 1`;
  state.gameBtnVisible = {
    ...state.gameBtnVisible,
    split: false,
    doubleDown: false,
    insurance: false,
  };

  toggleSplitHandLabel(true);
  renderGameCards(state);
  renderBtnVisibility(state.gameBtnVisible);
  renderUIFields(state);
}

export function updateController(token, value = null) {
  switch (token) {
    case `split hand 1 bust`:
      state.currentSplitHand = 2;
      state.noticeText = `Hand 1 busts...Please play Hand 2.`;
      state.gameBtnVisible = {
        ...state.gameBtnVisible,
        hit: true,
        stand: true,
      };
      renderUIFields(state);
      renderBtnVisibility(state.gameBtnVisible);
      break;
    case `bust`:
      endRound();
      break;
    case `split hand 2 bust`:
      state.noticeText = `Dealer's Turn...`;
      renderUIFields(state);
      dealerTimer = setTimeout(dealerTurn, 3000);
      break;
    case `continue`:
      state.noticeText = `Player's Turn...`;
      state.gameBtnVisible = {
        ...state.gameBtnVisible,
        hit: true,
        stand: true,
      };
      renderUIFields(state);
      renderBtnVisibility(state.gameBtnVisible);
      break;
    case `split hand 1 charlie`:
      state.playerHandTotal = ``;
      state.fiveCardCharlie.splitHand1 = true;
      state.currentSplitHand = 2;
      state.gameBtnVisible = {
        ...state.gameBtnVisible,
        hit: true,
        stand: true,
      };
      renderUIFields(state);
      renderBtnVisibility(state.gameBtnVisible);
      break;
    case `split hand 2 charlie`:
      state.playerSplitHandTotal = ``;
      state.fiveCardCharlie.splitHand2 = true;
      // endRound();
      state.noticeText = `Dealer's Turn...`;
      renderUIFields(state);
      dealerTimer = setTimeout(dealerTurn, 3000);
      break;
    case `player charlie`:
      state.playerHandTotal = ``;
      state.fiveCardCharlie.player = true;
      endRound();
      break;
    case `dealer charlie`:
      state.dealerHandTotal = ``;
      state.fiveCardCharlie.dealer = true;
      state.gameActive = false;
      makeGameInactive();
      renderUIFields(state);
      break;
    case `hand 2 continue`:
      state.noticeText = `Please play Hand 2...`;
      renderUIFields(state, true);
      break;
    default:
      break;
  }
}

function endRound() {
  state.gameActive = false;
  let gameCards = revealDealerCards();

  applyCardsToState(gameCards);
  renderGameCards(state);

  if (state.gameMode.split) {
    let playerSplitHand1 = chooseWinner(
      state.playerHandTotal,
      state.betAmount,
      `hand1`
    );
    let playerSplitHand2 = chooseWinner(
      state.playerSplitHandTotal,
      state.splitBetAmount,
      `hand2`
    );

    displayGameOutcome(state, playerSplitHand1, playerSplitHand2);

    gameTimer = setTimeout(clearRoundData, 5000);
    return;
  }

  let playerSplitHand1 = chooseWinner(state.playerHandTotal, state.betAmount);
  displayGameOutcome(state, playerSplitHand1);
  gameTimer = setTimeout(clearRoundData, 5000);
}

function chooseWinner(playerHandTotal, betAmount, hand = null) {
  let outcomeNoticeText;

  switch (true) {
    case state.fiveCardCharlie.player:
      outcomeNoticeText = `Player Wins!  Five Card Charlie!`;
      state.bank = calculatePlayerWinnings(betAmount, `win`);
      break;
    case state.fiveCardCharlie.splitHand1 && hand === `hand1`:
      outcomeNoticeText = `Player Wins!  Five Card Charlie!`;
      state.bank = calculatePlayerWinnings(betAmount, `win`);
      break;
    case state.fiveCardCharlie.splitHand2 && hand === `hand2`:
      outcomeNoticeText = `Player Wins!  Five Card Charlie!`;
      state.bank = calculatePlayerWinnings(betAmount, `win`);
      break;
    case state.fiveCardCharlie.dealer:
      outcomeNoticeText = `Player Loses.  Dealer Five Card Charlie...`;
      break;
    case playerHandTotal > 21:
      outcomeNoticeText = `Player loses. Bust...`;
      break;
    case state.dealerHandTotal > 21:
      outcomeNoticeText = `Player Wins!  Dealer busts...`;
      state.bank = calculatePlayerWinnings(betAmount, `win`);
      // state.bank = state.bank + betAmount * 2;
      break;
    case state.dealerHandTotal == 21 &&
      playerHandTotal == 21 &&
      !state.gameMode.insurance:
      outcomeNoticeText = `Push.  Both players have blackjack`;
      state.bank = calculatePlayerWinnings(betAmount, `push`);
      // state.bank = state.bank + betAmount;
      break;
    case state.dealerHandTotal == 21 &&
      playerHandTotal == 21 &&
      state.gameMode.insurance:
      outcomeNoticeText = `Push.  Both players have blackjack. Player wins insurance bet.`;
      state.bank = calculatePlayerWinnings(betAmount, `push`);
      // state.bank = state.bank + betAmount;
      break;
    case playerHandTotal == 21:
      outcomeNoticeText = `Player Wins!  Blackjack!`;
      state.bank = calculatePlayerWinnings(betAmount, `blackjack`);
      // state.bank = state.bank + betAmount * 2 + Math.round(betAmount / 2);
      break;
    case state.dealerHandTotal == 21 && !state.gameMode.insurance:
      outcomeNoticeText = `Player Loses.  Dealer Blackjack.`;
      break;
    case state.dealerHandTotal == 21 && state.gameMode.insurance:
      outcomeNoticeText = `Dealer Blackjack.  Player wins insurance bet only.`;
      break;
    case state.dealerHandTotal > playerHandTotal:
      outcomeNoticeText = `Dealer Wins.`;
      break;
    case state.dealerHandTotal == playerHandTotal:
      outcomeNoticeText = `Push.`;
      state.bank = calculatePlayerWinnings(betAmount, `push`);
      // state.bank = state.bank + betAmount;
      break;
    default:
      outcomeNoticeText = `Player Wins!`;
      state.bank = calculatePlayerWinnings(betAmount, `win`);
      // state.bank = state.bank + betAmount * 2;
      break;
  }

  renderUIFields(state);

  let player = { gameOutcome: outcomeNoticeText, betAmount: betAmount };

  return player;
}

function clearRoundData(endGameBtnPressed = null) {
  clearRoundModelData();
  state.betAmount = ``;
  state.splitBetAmount = ``;
  state.insuranceBetAmount = ``;
  state.dealerCardImgs = ``;
  state.visibleDealerHandTotal = ``;
  state.playerCardImgs = `---`;
  state.playerHandTotal = ``;
  state.playerSplitCardImgs = ``;
  state.playerSplitHandTotal = ``;
  state.gameMode.split = false;
  state.gameMode.insurance = false;
  state.gameMode.doubleDown = false;
  state.fiveCardCharlie.dealer = false;
  state.fiveCardCharlie.player = false;
  state.fiveCardCharlie.splitHand1 = false;
  state.fiveCardCharlie.splitHand2 = false;
  state.splitBtnActive = false;
  state.gameBtnVisible = {
    ...state.gameBtnVisible,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    insurance: false,
  };
  renderUIFields(state);
  hideInsuranceBetField(state.insuranceBetAmount);
  renderBtnVisibility(state.gameBtnVisible);
  clearGameCards(state);
  toggleSplitHandLabel(false);

  if (endGameBtnPressed == true) {
    state.noticeText = `Game Ended.  Select New Game...`;
    state.bank = 0;
    state.navBtnVisible = {
      ...state.navBtnVisible,
      newGame: true,
      endGame: false,
    };
    state.gameBtnVisible = {
      submitBet: false,
      dealCards: false,
      hit: false,
      stand: false,
      doubleDown: false,
      split: false,
      insurance: false,
    };
    renderUIFields(state);
    renderBtnVisibility(state.navBtnVisible);
    renderBtnVisibility(state.gameBtnVisible);
    endGameBtnPressed = false;
  } else startNextRound();
}

function startNextRound() {
  if (state.bank > 0) {
    state.noticeText = "Place an amount to bet";
    state.gameBtnVisible = { ...state.gameBtnVisible, submitBet: true };
    renderUIFields(state);
    renderBtnVisibility(state.gameBtnVisible);
  } else {
    state.noticeText = "No more money.  Game Over...";
    state.navBtnVisible = { newGame: true, endGame: false };
    renderUIFields(state);
    renderBtnVisibility(state.gameBtnVisible);
  }
}

export function applyEndGameBtn() {
  endGameBtnPressed = true;
  clearRoundData(endGameBtnPressed);
}

export function applyEasyQuestionDifficulty() {
  selectTriviaDifficulty(`easy`);
}

export function applyMediumQuestionDifficulty() {
  selectTriviaDifficulty(`medium`);
}

export function applyHardQuestionDifficulty() {
  selectTriviaDifficulty(`hard`);
}

function initTriviaMode() {
  state.noticeText = ` `;
  state.triviaMode = true;
  renderUIFields(state);
  toggleTriviaModal(state.triviaMode);
}

export function updateTriviaQuestions(questionObj) {
  state.triviaData = questionObj;
  renderTriviaQuestionUI(questionObj);
}

export function collectTriviaAnswer(e) {
  const btnEvent = e;
  disableTriviaAnswerBtns();

  state.triviaData.selectedAnswer = this.getAttribute("data-ans");

  determineCorrectAnswer(state, btnEvent);

  // renderTriviaCorrectAnswer(state);
}

export function updateTriviaResult(playerCorrect, bank, event) {
  let gameTimer, playerTimer;
  displayTriviaCorrectAnswer(state);

  if (playerCorrect) {
    if (state.gameMode.doubleDown) state.noticeText = "Player Doubles Down...";
    state.bank = bank;
    renderUIFields(state);
    renderTriviaCorrectAnswer(state);
    gameTimer = setTimeout(function () {
      resetTriviaMode(playerCorrect);
    }, 4000);
  } else {
    renderTriviaIncorrectAnswer(event);
    gameTimer = setTimeout(function () {
      resetTriviaMode(playerCorrect);
    }, 4000);
    playerTimer = setTimeout(standAction, 5000);
  }
}

// function init() {
//   let handlerMap = new Map();
//   btnsArr.forEach(function (obj) {
//     // map[obj.event] = obj.callback;
//     handlerMap.set(obj.event, obj.callback);
//     // return map;
//   }, {});

//   addHandlerListeners(handlerMap);
// }

// function init() {
//   let handlerMap = new Map();
//   btnsArr.forEach(function (obj) {
//     // map[obj.event] = obj.callback;
//     handlerMap.set(obj.class, obj.callback);
//     // return map;
//   }, {});

//   addHandlerListeners(handlerMap);
// }

function init() {
  addHandlerListeners(btnsArr);
}

init();
