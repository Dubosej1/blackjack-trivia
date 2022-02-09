import * as controller from "./controller-3.js";
import * as view from "./view-3.js";
import { globalState } from "./state.js";

let guard = false;

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

export function addBeginGameOptionsBtnListener(gameState = null) {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.addEventListener(`click`, beginGameOptionsListenerCallback);
}

function startNextRoundBtnListenerCallback(event) {
  controller.clearRoundData(globalState);

  controller.startNewRound(
    controller.bankPlaceholder,
    controller.optionsPlaceholder,
    controller.specialNumPlaceholder
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

  // function addOptionsBtnListener() {
  //   let optionsModalClbkObj = {
  //     applyOptionsBtn: optionsListenerCallback,
  //   };

  //   view.optionsModal.toggleEventListeners(optionsModalClbkObj, `add`);
  // }
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
}

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

export function addInfinityDiceStopBtnListener() {
  const stopBtn = document.querySelector(`.btn-generic-modal__stop-dice`);

  stopBtn.addEventListener(`click`, displayStopInfinityDiceCallback);
}

export function addBeginGameDiceModalNextBtnListener() {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  nextBtn.addEventListener(`click`, nextBeginGameRoutineCallback);
}

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

export function addBaseRoundOutcomeModalListener() {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  nextBtn.addEventListener(`click`, roundOutcomeModalNextBtnListenerCallback);
}

export function addEarlySurrenderModalListeners(gameState) {
  const acceptBtn = document.querySelector(
    `.btn-winning-hand-modal__accept-early-surrender`
  );
  const declineBtn = document.querySelector(
    `.btn-winning-hand-modal__decline-early-surrender`
  );

  acceptBtn.addEventListener(`click`, acceptEarlySurrenderCallback);
  declineBtn.addEventListener(`click`, declineEarlySurrenderCallback);
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

export function removeBeginGameOptionsBtnListener() {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.removeEventListener(
    `click`,
    beginGameOptionsListenerCallback
  );
}

export function removeExtraBetBlackjackModalListeners() {
  const chipBtns = document.querySelectorAll(`.btn-extra-bet-modal__chip`);
  const clearBetBtn = document.querySelector(`.btn-extra-bet-modal__clear-bet`);
  const placeBetBtn = document.querySelector(
    `.btn-extra-bet-modal__place-extra-bet`
  );
  const declineBetBtn = document.querySelector(
    `.btn-extra-bet-modal__decline-bet`
  );

  chipBtns.forEach(function (elem) {
    elem.removeEventListener(`click`, updateExtraBetChipBtnCallback);
  });

  clearBetBtn.removeEventListener(`click`, clearExtraBetChipsCallback);

  placeBetBtn.removeEventListener(`click`, placeExtraBetCallback);

  declineBetBtn.removeEventListener(`click`, declineExtraBetBtnCallback);
}

function beginGameOptionsListenerCallback(event) {
  controller.submitOptions(event);
}

function optionsListenerCallback(event) {
  controller.submitOptions(event, globalState);
}

function updateBaseBetChipBtnCallback(event) {
  controller.updateBaseBetChips(event, globalState);
}

function clearBaseBetChipAmountCallback(event) {
  controller.clearBaseBetChips(event, globalState);
}

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
}

function clearAllSideBetsBtnCallback(event) {
  controller.clearAllSideBets(event, globalState);
}

function dealCardsBtnListenerCallback(event) {
  controller.startDealCardsRoutine(event, globalState);
}

function checkSideBetBtnListenerCallback(event) {
  controller.initDisplayInitialSideBetOutcome(event, globalState);
}

function initialSideBetOutcomeWinHandCallback(event) {
  view.winningHandModal.displayModal(event, globalState, `beginning`);
  // view.displayInitialSideBetOutcomeWinHand(event, globalState);
}

function endingSideBetOutcomeWinHandCallback(event) {
  // view.displayEndingSideBetOutcomeWinHand(event, globalState);
  view.winningHandModal.displayModal(event, globalState, `ending`);
}

function displayStopInfinityDiceCallback(event) {
  view.perfect11sDiceModal.displayStopInfinityDice(event);
}

function nextBeginGameRoutineCallback(event) {
  event.target.removeEventListener(`click`, nextBeginGameRoutineCallback);
  controller.beginGameRoutine(globalState);
}

function nextEndGameRoutineCallback(event) {
  event.target.removeEventListener(`click`, nextEndGameRoutineCallback);
  controller.endGameRoutine(globalState);
}

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

function decideHouseMoneyBtnsCallback(event) {
  controller.decideHouseMoney(event, globalState);
}

function acceptEvenMoneyBtnCallback(event) {
  controller.initEvenMoneyBet(event, globalState);
}

function declineEvenMoneyBtnCallback(event) {
  removeEvenMoneyModalListeners();
  popbox.close(`generic-modal`);

  controller.determineEndGameRoutineOrder(globalState);
}

function acceptInsuranceBtnCallback(event) {
  controller.initInsuranceBet(event, globalState);
}

function declineInsuranceBtnCallback(event) {
  removeInsuranceModalListeners();
  popbox.close(`generic-modal`);
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

  controller.determineEndGameRoutineOrder(globalState);
}

function nextBtnContinueRoundCallback(event) {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  removeInsuranceModalListeners();
  nextBtn.removeEventListener(`click`, nextBtnContinueRoundCallback);

  controller.beginGameRoutinePart2(globalState);
}

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

function roundOutcomeModalNextBtnListenerCallback(event) {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  nextBtn.removeEventListener(
    `click`,
    roundOutcomeModalNextBtnListenerCallback
  );

  controller.endGameRoutine(globalState);
}

function winSummaryBtnListenerCallback(event) {
  view.winSummaryModal.displayModal(globalState);
}

function winningsModalCloseBtnListenerCallback(event) {
  controller.endGameRoutine(globalState);
}

function difficultyBtnCallback(event) {
  controller.processTriviaDifficulty(event, globalState);
}

function answerBtnCallback(event) {
  controller.processTriviaAnswer(event, globalState);
}

function acceptEarlySurrenderCallback(event) {
  view.winningHandModal.resetModal();
  controller.surrenderAction(event, globalState);
}

function declineEarlySurrenderCallback(event) {
  view.winningHandModal.resetModal();
  controller.beginGameRoutinePart2(globalState);
}

function endGameBtnCallback(event) {
  controller.endGameAction(globalState);
}

function sideBetMenuBtnListener(event) {
  view.sideBetModal.updateModalInfo(globalState);
}
