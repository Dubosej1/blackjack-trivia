import * as view from "./view.js";
import * as controller from "./controller.js";
import { globalState } from "./state.js";

let guard = false;

//////////Add event listeners at the beginning of game and round//////////
export function addNewGameListeners() {
  addGameInfoFieldsListeners();

  //toggleEventListeners function needs to be reworked for this function
  addOptionsMenuInputListeners();

  addTriviaBtnListeners();
  addBeginGameOptionsBtnListener();

  function addGameInfoFieldsListeners() {
    let gameInfoFieldsClbkObj = {
      newGameBtn: controller.startNewGame,
      endGameBtn: endGameBtnCallback,
      startNextRoundBtn: startNextRoundBtnListenerCallback,
      optionsBtn: optionsBtnCallback,
    };

    view.gameInfoFields.toggleEventListeners(gameInfoFieldsClbkObj, `add`);
  }

  function addTriviaBtnListeners() {
    let triviaModalClbkObj = {
      triviaDifficultyBtns: difficultyBtnCallback,
      answerBtns: answerBtnCallback,
    };

    view.triviaModal.toggleEventListeners(triviaModalClbkObj, `add`);
  }
}

export function addNewRoundEventListeners() {
  if (guard) return;

  addGameActionBtnListeners();
  addBaseBetModalBtnListeners();
  addSideBetChipBtnListeners();
  addSystemBtnListeners();
  addHouseMoneyModalBtnListeners();
  addWinningsModalListener();

  addOptionsBtnListener();
  addEarlySurrenderModalListeners();
  addExtraBetBlackjackModalListeners();

  guard = true;

  function addGameActionBtnListeners() {
    let gameActionBtnClbkObj = {
      hit: hitBtnListenerCallback,
      stand: standBtnListenerCallback,
      doubleDown: doubleDownBtnListenerCallback,
      split: splitBtnListenerCallback,
      surrender: surrenderBtnListenerCallback,
    };

    view.gameActionBtns.toggleEventListeners(gameActionBtnClbkObj, `add`);
  }

  function addBaseBetModalBtnListeners() {
    let baseBetModalClbkObj = {
      chipBtns: updateBaseBetChipBtnCallback,
      clearBetBtn: clearBaseBetChipAmountCallback,
      dealCardsBtn: dealCardsBtnListenerCallback,
      sideBetMenuBtn: sideBetMenuBtnListener,
    };

    view.baseBetModal.toggleEventListeners(baseBetModalClbkObj, `add`);
  }

  function addSideBetChipBtnListeners() {
    let sideBetModalClbkObj = {
      sideBetContainers: sideBetContainerListenerCallback,
      chipBtns: updateSideBetChipBtnCallback,
      clearBetBtn: clearSideBetChipAmountCallback,
      clearAllBetsBtn: clearAllSideBetsBtnCallback,
      placeSideBetsBtn: placeSideBetsBtnCallback,
      activateSideBetBtn: activateSideBetBtnCallback,
      exitBtn: sideBetModalExitBtnCallback,
    };

    view.sideBetModal.toggleEventListeners(sideBetModalClbkObj, `add`);
  }

  function addSystemBtnListeners() {
    let gameInfoFieldsClbkObj = {
      checkSideBetBtn: checkSideBetBtnListenerCallback,
    };

    view.gameInfoFields.toggleEventListeners(gameInfoFieldsClbkObj, `add`);
  }

  function addHouseMoneyModalBtnListeners() {
    let houseMoneyModalClbkObj = {
      actionBtns: decideHouseMoneyBtnsCallback,
    };

    view.houseMoneyModal.toggleEventListeners(houseMoneyModalClbkObj, `add`);
  }

  function addWinningsModalListener() {
    let totalWinningsModalClbkObj = {
      winSummaryBtn: winSummaryBtnListenerCallback,
      closeBtn: winningsModalCloseBtnListenerCallback,
    };

    view.totalWinningsModal.toggleEventListeners(
      totalWinningsModalClbkObj,
      `add`
    );
  }

  function addEarlySurrenderModalListeners() {
    let earlySurrenderModalClbkObj = {
      acceptBtn: acceptEarlySurrenderCallback,
      declineBtn: declineEarlySurrenderCallback,
    };

    view.earlySurrenderModal.toggleEventListeners(
      earlySurrenderModalClbkObj,
      `add`
    );
  }

  function addExtraBetBlackjackModalListeners() {
    let extraBetModalClbkObj = {
      chipBtns: updateExtraBetChipBtnCallback,
      clearBetBtn: clearExtraBetChipsCallback,
      placeBetBtn: placeExtraBetCallback,
      declineBetBtn: declineExtraBetBtnCallback,
    };

    view.extraBetModal.toggleEventListeners(extraBetModalClbkObj, `add`);
  }

  // function addOptionsBtnListener() {
  //   let optionsModalClbkObj = {
  //     applyOptionsBtn: optionsListenerCallback,
  //   };

  //   view.optionsModal.toggleEventListeners(optionsModalClbkObj, `add`);
  // }
}

//////////Adding and Removing Event Listeners from Options Btn and Modal//////////
export function addBeginGameOptionsBtnListener(gameState = null) {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.addEventListener(`click`, beginGameOptionsListenerCallback);
}

export function removeBeginGameOptionsBtnListener() {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.removeEventListener(
    `click`,
    beginGameOptionsListenerCallback
  );
}

export function addOptionsBtnListener(gameState) {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.addEventListener(`click`, optionsListenerCallback);
}

export function removeOptionsBtnListener() {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.removeEventListener(`click`, optionsListenerCallback);
}

export function addOptionsMenuInputListeners() {
  const doubleAfterSplitAcesBox = document.querySelector(
    `#double-after-split-ace`
  );
  const draw1AfterSplitAcesBox = document.querySelector(
    `#split-ace-draw-limit-on`
  );
  const resplitAcesBox = document.querySelector(`#resplit-aces-on`);
  const resplitAfterSplitAcesBox = document.querySelector(
    `#resplit-after-split-aces`
  );
  const disableSurrenderBox = document.querySelector(`#disable-surrender`);
  const resetDefaultOptionsBtn = document.querySelector(
    `.btn-options-modal__reset-default`
  );
  const closeBtn = document.querySelector(`.btn-options-modal__close`);

  doubleAfterSplitAcesBox.addEventListener(
    `click`,
    view.optionsModal.doubleAfterSplitAcesHandler
  );
  draw1AfterSplitAcesBox.addEventListener(
    `click`,
    view.optionsModal.draw1AfterSplitAcesHandler
  );
  resplitAcesBox.addEventListener(
    "click",
    view.optionsModal.resplitAcesHandler
  );
  resplitAfterSplitAcesBox.addEventListener(
    `click`,
    view.optionsModal.resplitAfterSplitAcesHandler
  );
  disableSurrenderBox.addEventListener(
    `click`,
    view.optionsModal.disableSurrenderHandler
  );
  resetDefaultOptionsBtn.addEventListener(
    `click`,
    view.optionsModal.resetOptionsMenuInputs
  );

  closeBtn.addEventListener(`click`, optionsModalCloseBtnCallback);
}

export function optionsBtnCallback(event) {
  view.optionsModal.checkNeedModalScrollbar();
}

export function optionsModalCloseBtnCallback(event) {
  view.optionsModal.toggleAddScrollbarToModal(false);
}

//////////Adding Event Listeners to Side Bet Outcome Summary Modal//////////

export function addSummaryModalDisplayHandListener(gameState) {
  const displayHandBtns = document.getElementsByClassName(
    `btn-summary-modal__display-hand`
  );
  const nextBtn = document.querySelector(`.btn-summary-modal__next`);

  Array.from(displayHandBtns).forEach(function (elem) {
    elem.addEventListener(`click`, initialSideBetOutcomeWinHandCallback);
  });

  nextBtn.addEventListener(`click`, nextBeginGameRoutineCallback);
}

export function addSummaryModalEndingDisplayHandListener(gameState) {
  const displayHandBtns = document.getElementsByClassName(
    `btn-summary-modal__display-hand`
  );
  const nextBtn = document.querySelector(`.btn-summary-modal__next`);

  Array.from(displayHandBtns).forEach(function (elem) {
    elem.addEventListener(`click`, endingSideBetOutcomeWinHandCallback);
  });

  nextBtn.addEventListener(`click`, nextEndGameRoutineCallback);
}

//////////Adding Event Listeners to Infinity Dice Modal//////////

export function addInfinityDiceStopBtnListener() {
  const stopBtn = document.querySelector(`.btn-generic-modal__stop-dice`);

  stopBtn.addEventListener(`click`, displayStopInfinityDiceCallback);
}

export function addBeginGameDiceModalNextBtnListener() {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  // nextBtn.addEventListener(`click`, nextBeginGameRoutineCallback);
  nextBtn.addEventListener(`click`, beginGameDiceModalNextBtnCallback);
}

//////////Adding Event Listeners to Extra Blackjack Modal//////////

export function addExtraBetBlackjackModalListeners() {
  const chipBtns = document.querySelectorAll(`.btn-extra-bet-modal__chip`);
  const clearBetBtn = document.querySelector(`.btn-extra-bet-modal__clear-bet`);
  const placeBetBtn = document.querySelector(
    `.btn-extra-bet-modal__place-extra-bet`
  );
  const declineBetBtn = document.querySelector(
    `.btn-extra-bet-modal__decline-bet`
  );

  chipBtns.forEach(function (elem) {
    elem.addEventListener(`click`, updateExtraBetChipBtnCallback);
  });

  clearBetBtn.addEventListener(`click`, clearExtraBetChipsCallback);

  placeBetBtn.addEventListener(`click`, placeExtraBetCallback);

  declineBetBtn.addEventListener(`click`, declineExtraBetBtnCallback);
}

//////////Adding and Removing Event Listeners from Even Money/Insurance Modal//////////
export function addEvenMoneyModalListeners() {
  const acceptBetBtn = document.querySelector(
    `.btn-side-bet-action__accept-even-money`
  );
  const declineBetBtn = document.querySelector(
    `.btn-side-bet-action__decline-even-money`
  );
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  acceptBetBtn.addEventListener(`click`, acceptEvenMoneyBtnCallback);
  declineBetBtn.addEventListener(`click`, declineEvenMoneyBtnCallback);
  nextBtn.addEventListener(`click`, nextBtnEndRoundCallback);
}

export function addInsuranceModalListeners() {
  const acceptBetBtn = document.querySelector(
    `.btn-side-bet-action__accept-insurance`
  );
  const declineBetBtn = document.querySelector(
    `.btn-side-bet-action__decline-insurance`
  );

  acceptBetBtn.addEventListener(`click`, acceptInsuranceBtnCallback);
  declineBetBtn.addEventListener(`click`, declineInsuranceBtnCallback);
}

export function addInsuranceNextBtnListener(outcome) {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);
  if (outcome == `win`)
    nextBtn.addEventListener(`click`, nextBtnEndRoundCallback);
  else nextBtn.addEventListener(`click`, nextBtnContinueRoundCallback);
}

export function removeEvenMoneyModalListeners() {
  const acceptBetBtn = document.querySelector(
    `.btn-side-bet-action__accept-even-money`
  );
  const declineBetBtn = document.querySelector(
    `.btn-side-bet-action__decline-even-money`
  );
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  acceptBetBtn.removeEventListener(`click`, acceptEvenMoneyBtnCallback);
  declineBetBtn.removeEventListener(`click`, declineEvenMoneyBtnCallback);
  nextBtn.removeEventListener(`click`, nextBtnEndRoundCallback);
}

export function removeInsuranceModalListeners() {
  const acceptBetBtn = document.querySelector(
    `.btn-side-bet-action__accept-insurance`
  );
  const declineBetBtn = document.querySelector(
    `.btn-side-bet-action__decline-insurance`
  );

  acceptBetBtn.removeEventListener(`click`, acceptInsuranceBtnCallback);
  declineBetBtn.removeEventListener(`click`, declineInsuranceBtnCallback);
}

//////////Adding Event Listener to Base Round Outcome Modal//////////

export function addBaseRoundOutcomeModalListener() {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  nextBtn.addEventListener(`click`, roundOutcomeModalNextBtnListenerCallback);
}

//////////Adding Event Listeners to Early Surrender Modal//////////

// export function addEarlySurrenderModalListeners(gameState) {
//   const acceptBtn = document.querySelector(
//     `.btn-winning-hand-modal__accept-early-surrender`
//   );
//   const declineBtn = document.querySelector(
//     `.btn-winning-hand-modal__decline-early-surrender`
//   );

//   acceptBtn.addEventListener(`click`, acceptEarlySurrenderCallback);
//   declineBtn.addEventListener(`click`, declineEarlySurrenderCallback);
// }

//////////Event Listener Callback Functions//////////

//Game Info Fields/System Btns
function startNextRoundBtnListenerCallback(event) {
  controller.clearRoundData(globalState);

  controller.startNewRound(
    controller.bankPlaceholder,
    controller.optionsPlaceholder,
    controller.specialNumPlaceholder
  );
}

function checkSideBetBtnListenerCallback(event) {
  controller.initDisplayInitialSideBetOutcome(event, globalState);
}

function endGameBtnCallback(event) {
  controller.endGameAction(globalState);
}

//Game Action Btns
function hitBtnListenerCallback(event) {
  controller.hitAction(event, globalState);
}

function standBtnListenerCallback(event) {
  controller.standAction(event, globalState);
}

function doubleDownBtnListenerCallback(event) {
  controller.doubleDownAction(event, globalState);
}

function splitBtnListenerCallback(event) {
  controller.splitAction(event, globalState);
}

function surrenderBtnListenerCallback(event) {
  controller.surrenderAction(event, globalState);
}

//General Game Flow Callbacks
function nextBeginGameRoutineCallback(event) {
  event.target.removeEventListener(`click`, nextBeginGameRoutineCallback);
  controller.beginGameRoutine(globalState);
}

function beginGameDiceModalNextBtnCallback(event) {
  event.target.removeEventListener(`click`, beginGameDiceModalNextBtnCallback);
  view.perfect11sDiceModal.toggleAddClassToModalContainer(false);
  controller.beginGameRoutine(globalState);
}

function nextEndGameRoutineCallback(event) {
  event.target.removeEventListener(`click`, nextEndGameRoutineCallback);
  controller.endGameRoutine(globalState);
}

//Options Modal
function beginGameOptionsListenerCallback(event) {
  view.optionsModal.toggleAddScrollbarToModal(false);
  controller.submitOptions(event);
}

function optionsListenerCallback(event) {
  view.optionsModal.toggleAddScrollbarToModal(false);
  controller.submitOptions(event, globalState);
}

//Base Bet Modal
function updateBaseBetChipBtnCallback(event) {
  controller.updateBaseBetChips(event, globalState);
}

function clearBaseBetChipAmountCallback(event) {
  controller.clearBaseBetChips(event, globalState);
}

function dealCardsBtnListenerCallback(event) {
  controller.startDealCardsRoutine(event, globalState);
}

function sideBetMenuBtnListener(event) {
  view.sideBetModal.updateModalInfo(globalState);
}

//Side Bet Modal
function sideBetContainerListenerCallback(event) {
  controller.updateSideBetContainer(event, globalState);
}

function updateSideBetChipBtnCallback(event) {
  controller.updateSideBetChips(event, globalState);
}

function activateSideBetBtnCallback(event) {
  controller.activateSideBet(event, globalState);
}

function clearSideBetChipAmountCallback(event) {
  controller.clearSideBetChips(event, globalState);
}

function placeSideBetsBtnCallback(event) {
  view.baseBetModal.updateModalInfo(globalState);
  controller.placeSideBets(event, globalState);
  view.sideBetModal.toggleAddScrollbarToModal(false);
}

function clearAllSideBetsBtnCallback(event) {
  controller.clearAllSideBets(event, globalState);
}

function sideBetModalExitBtnCallback(event) {
  view.sideBetModal.toggleAddScrollbarToModal(false);
}

//Infinity Dice Modal
function displayStopInfinityDiceCallback(event) {
  view.perfect11sDiceModal.displayStopInfinityDice(event);
}

//Extra Bet Modal
function updateExtraBetChipBtnCallback(event) {
  controller.updateExtraBetChips(event, globalState);
}

function clearExtraBetChipsCallback(event) {
  controller.clearExtraBetChips(event, globalState);
}

function placeExtraBetCallback(event) {
  controller.placeExtraBet(event, globalState);
}

function declineExtraBetBtnCallback(event) {
  controller.declineExtraBet(event, globalState);
}

//House Money Modal
function decideHouseMoneyBtnsCallback(event) {
  controller.decideHouseMoney(event, globalState);
}

//Even Money/Insurance Modal
function acceptEvenMoneyBtnCallback(event) {
  controller.initEvenMoneyBet(event, globalState);
}

function declineEvenMoneyBtnCallback(event) {
  removeEvenMoneyModalListeners();
  popbox.close(`generic-modal`);

  view.evenMoneyInsuranceModal.toggleAddClassToModalContainer(false);
  controller.determineEndGameRoutineOrder(globalState);
}

function acceptInsuranceBtnCallback(event) {
  controller.initInsuranceBet(event, globalState);
}

function declineInsuranceBtnCallback(event) {
  removeInsuranceModalListeners();
  popbox.close(`generic-modal`);
  view.evenMoneyInsuranceModal.toggleAddClassToModalContainer(false);
  controller.beginGameRoutinePart2(globalState);
}

function nextBtnEndRoundCallback(event) {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  if (event.target.dataset.sidebet == `evenMoney`) {
    removeEvenMoneyModalListeners();
  } else {
    removeInsuranceModalListeners();
  }

  nextBtn.removeEventListener(`click`, nextBtnEndRoundCallback);

  view.evenMoneyInsuranceModal.toggleAddClassToModalContainer(false);

  controller.determineEndGameRoutineOrder(globalState);
}

function nextBtnContinueRoundCallback(event) {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  removeInsuranceModalListeners();
  nextBtn.removeEventListener(`click`, nextBtnContinueRoundCallback);

  view.evenMoneyInsuranceModal.toggleAddClassToModalContainer(false);

  controller.beginGameRoutinePart2(globalState);
}

//Round Outcome Modal
function roundOutcomeModalNextBtnListenerCallback(event) {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  nextBtn.removeEventListener(
    `click`,
    roundOutcomeModalNextBtnListenerCallback
  );

  view.baseRoundOutcomeModal.toggleAddClassToModalContainer(false);

  controller.endGameRoutine(globalState);
}

//Side Bet Outcome Modal
function initialSideBetOutcomeWinHandCallback(event) {
  view.winningHandModal.displayModal(event, globalState, `beginning`);
  // view.displayInitialSideBetOutcomeWinHand(event, globalState);
}

function endingSideBetOutcomeWinHandCallback(event) {
  // view.displayEndingSideBetOutcomeWinHand(event, globalState);
  view.winningHandModal.displayModal(event, globalState, `ending`);
}

//Total Winnings Modal
function winSummaryBtnListenerCallback(event) {
  view.winSummaryModal.displayModal(globalState);
}

function winningsModalCloseBtnListenerCallback(event) {
  controller.endGameRoutine(globalState);
}

//Trivia Modal
function difficultyBtnCallback(event) {
  controller.processTriviaDifficulty(event, globalState);
}

function answerBtnCallback(event) {
  controller.processTriviaAnswer(event, globalState);
}

//Early Surrender Modal
function acceptEarlySurrenderCallback(event) {
  view.winningHandModal.resetModal();
  controller.surrenderAction(event, globalState);
}

function declineEarlySurrenderCallback(event) {
  view.winningHandModal.resetModal();
  controller.beginGameRoutinePart2(globalState);
}
