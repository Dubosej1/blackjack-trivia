import * as controller from "./controller-3.js";
import * as view from "./view-3.js";
import { globalState } from "./state.js";

export function addNewGameBtnListener() {
  const newGameBtn = document.querySelector(`.btn-system__new-game`);

  newGameBtn.addEventListener("click", controller.startNewGame);
}

export function addEndGameBtnListener() {
  const endGameBtn = document.querySelector(`.btn-system__end-game`);

  endGameBtn.addEventListener("click", endGameBtnCallback);
}

export function addBeginGameOptionsBtnListener(gameState = null) {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.addEventListener(`click`, beginGameOptionsListenerCallback);
}

export function addStartNextRoundBtnListener() {
  const startNextRoundBtn = document.querySelector(
    `.btn-system__start-next-round`
  );

  startNextRoundBtn.addEventListener(
    `click`,
    startNextRoundBtnListenerCallback
  );
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

export function addTriviaBtnListeners() {
  const difficultyBtns = document.querySelectorAll(`.btn__trivia-difficulty`);
  const answerBtns = document.querySelectorAll(`.btn__answer`);

  difficultyBtns.forEach(function (elem) {
    elem.addEventListener(`click`, difficultyBtnCallback);
  });

  answerBtns.forEach(function (elem) {
    elem.addEventListener(`click`, answerBtnCallback);
  });
}

export function addNewRoundEventListeners(gameState) {
  addOptionsBtnListener(gameState);
  addBaseBetModalBtnListeners(gameState);
  addSideBetChipBtnListeners(gameState);
  addSideBetContainerListener(gameState);
  addSystemBtnListeners(gameState);
  addHouseMoneyModalBtnListeners(gameState);
  // addGameActionBtnListeners(gameState);
  addWinningsModalListener(gameState);
  addEarlySurrenderModalListeners(gameState);
  // addModalListeners(gameState);

  let gameActionBtnClbkObj = {
    hit: hitBtnListenerCallback,
    stand: standBtnListenerCallback,
    doubleDown: doubleDownBtnListenerCallback,
    split: splitBtnListenerCallback,
    surrender: surrenderBtnListenerCallback,
  };

  view.gameActionBtns.toggleEventListeners(gameActionBtnClbkObj, `add`);
}

export function removeRoundEventListeners() {
  removeBaseBetModalBtnListeners();
  removeSideBetChipBtnListeners();
  removeSideBetContainerListener();
  removeSystemBtnListeners();
  removeHouseMoneyModalBtnListeners();
  removeGameActionBtnListeners();
  removeWinningsModalListener();
  removeEarlySurrenderModalListeners();
}

export function addBaseBetModalBtnListeners(gameState) {
  const baseBetChipBtns = document.querySelectorAll(
    `.btn-basic-bet-modal__chip`
  );
  const baseBetClearBtn = document.querySelector(
    `.btn-basic-bet-modal__clear-bet`
  );
  const baseBetDealCardsBtn = document.querySelector(
    `.btn-basic-bet-modal__deal-cards`
  );

  const sideBetMenuBtn = document.querySelector(
    `.btn-basic-bet-modal__place-side-bets`
  );
  // const checkSideBetsBtn = document.querySelector(
  //   `.btn-basic-bet-modal__check-side-bets`
  // );

  baseBetChipBtns.forEach(function (elem) {
    elem.addEventListener("click", updateBaseBetChipBtnCallback);
  });

  baseBetClearBtn.addEventListener("click", clearBaseBetChipAmountCallback);

  baseBetDealCardsBtn.addEventListener(`click`, dealCardsBtnListenerCallback);

  sideBetMenuBtn.addEventListener(`click`, sideBetMenuBtnListener);

  // checkSideBetsBtn.addEventListener(`click`, checkSideBetsBtnListenerCallback);
}

function removeBaseBetModalBtnListeners() {
  const baseBetChipBtns = document.querySelectorAll(
    `.btn-basic-bet-modal__chip`
  );
  const baseBetClearBtn = document.querySelector(
    `.btn-basic-bet-modal__clear-bet`
  );
  const baseBetDealCardsBtn = document.querySelector(
    `.btn-basic-bet-modal__deal-cards`
  );
  // const checkSideBetsBtn = document.querySelector(
  //   `.btn-basic-bet-modal__check-side-bets`
  // );

  baseBetChipBtns.forEach(function (elem) {
    elem.removeEventListener("click", updateBaseBetChipBtnCallback);
  });

  baseBetClearBtn.removeEventListener("click", clearBaseBetChipAmountCallback);

  baseBetDealCardsBtn.removeEventListener(
    `click`,
    dealCardsBtnListenerCallback
  );
}

export function addSideBetContainerListener() {
  const sideBetContainers = document.querySelectorAll(
    `.side-bet-modal__side-bet-div`
  );

  sideBetContainers.forEach(function (elem) {
    elem.addEventListener(`click`, sideBetContainerListenerCallback);
  });
}

export function removeSideBetContainerListener() {
  const sideBetContainers = document.querySelectorAll(
    `.side-bet-modal__side-bet-div`
  );

  sideBetContainers.forEach(function (elem) {
    elem.removeEventListener(`click`, sideBetContainerListenerCallback);
  });
}

export function addSideBetChipBtnListeners() {
  const sideBetChipBtns = document.querySelectorAll(
    `.btn-side-bet-modal__chip`
  );
  const sideBetClearBtn = document.querySelector(
    `.btn-side-bet-modal__clear-bet`
  );
  const placeSideBetsBtn = document.querySelector(
    `.btn-side-bet-modal__place-bets`
  );
  const sideBetClearAllBtn = document.querySelector(
    `.btn-side-bet-modal__clear-all`
  );
  const activateBetBtn = document.querySelector(
    `.btn-side-bet-modal__activate-bet`
  );

  sideBetChipBtns.forEach(function (elem) {
    elem.addEventListener("click", updateSideBetChipBtnCallback);
  });

  activateBetBtn.addEventListener(`click`, activateSideBetBtnCallback);

  sideBetClearBtn.addEventListener("click", clearSideBetChipAmountCallback);

  placeSideBetsBtn.addEventListener(`click`, placeSideBetsBtnCallback);

  sideBetClearAllBtn.addEventListener(`click`, clearAllSideBetsBtnCallback);
}

export function removeSideBetChipBtnListeners() {
  const sideBetChipBtns = document.querySelectorAll(
    `.btn-side-bet-modal__chip`
  );
  const sideBetClearBtn = document.querySelector(
    `.btn-side-bet-modal__clear-bet`
  );
  const placeSideBetsBtn = document.querySelector(
    `.btn-side-bet-modal__place-bets`
  );
  const sideBetClearAllBtn = document.querySelector(
    `.btn-side-bet-modal__clear-all`
  );
  const activateBetBtn = document.querySelector(
    `.btn-side-bet-modal__activate-bet`
  );

  sideBetChipBtns.forEach(function (elem) {
    elem.removeEventListener("click", updateSideBetChipBtnCallback);
  });

  activateBetBtn.removeEventListener(`click`, activateSideBetBtnCallback);

  sideBetClearBtn.removeEventListener("click", clearSideBetChipAmountCallback);

  placeSideBetsBtn.removeEventListener(`click`, placeSideBetsBtnCallback);

  sideBetClearAllBtn.removeEventListener(`click`, clearAllSideBetsBtnCallback);
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
    view.doubleAfterSplitAcesHandler
  );
  draw1AfterSplitAcesBox.addEventListener(
    `click`,
    view.draw1AfterSplitAcesHandler
  );
  resplitAcesBox.addEventListener("click", view.resplitAcesHandler);
  resplitAfterSplitAcesBox.addEventListener(
    `click`,
    view.resplitAfterSplitAcesHandler
  );
  disableSurrenderBox.addEventListener(`click`, view.disableSurrenderHandler);
  resetDefaultOptionsBtn.addEventListener(`click`, view.resetOptionsMenuInputs);
}

export function addSystemBtnListeners(gameState) {
  const checkSideBetBtn = document.querySelector(
    `.btn-system__check-side-bet-outcome`
  );

  checkSideBetBtn.addEventListener(`click`, checkSideBetBtnListenerCallback);
}

export function removeSystemBtnListeners(gameState) {
  const checkSideBetBtn = document.querySelector(
    `.btn-system__check-side-bet-outcome`
  );

  checkSideBetBtn.removeEventListener(`click`, checkSideBetBtnListenerCallback);
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

function addHouseMoneyModalBtnListeners() {
  const actionBtns = document.querySelectorAll(
    `.btn-house-money-modal__action`
  );

  actionBtns.forEach(function (elem) {
    elem.addEventListener(`click`, decideHouseMoneyBtnsCallback);
  });
}

function removeHouseMoneyModalBtnListeners() {
  const actionBtns = document.querySelectorAll(
    `.btn-house-money-modal__action`
  );

  actionBtns.forEach(function (elem) {
    elem.removeEventListener(`click`, decideHouseMoneyBtnsCallback);
  });
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

export function addGameActionBtnListeners(gameState) {
  const hitBtn = document.querySelector(`.btn-action__hit`);
  const standBtn = document.querySelector(`.btn-action__stand`);
  const doubleDownBtn = document.querySelector(`.btn-action__doubleDown`);
  const splitBtn = document.querySelector(`.btn-action__split`);
  const surrenderBtn = document.querySelector(`.btn-action__surrender`);

  hitBtn.addEventListener(`click`, hitBtnListenerCallback);
  standBtn.addEventListener(`click`, standBtnListenerCallback);
  doubleDownBtn.addEventListener(`click`, doubleDownBtnListenerCallback);
  splitBtn.addEventListener(`click`, splitBtnListenerCallback);
  surrenderBtn.addEventListener(`click`, surrenderBtnListenerCallback);
}

export function addBaseRoundOutcomeModalListener() {
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  nextBtn.addEventListener(`click`, roundOutcomeModalNextBtnListenerCallback);
}

export function addWinningsModalListener(gameState) {
  const winSummaryBtn = document.querySelector(
    `.btn-winnings-modal__win-summary`
  );
  const closeBtn = document.querySelector(`.btn-winnings-modal__close`);

  winSummaryBtn.addEventListener(`click`, winSummaryBtnListenerCallback);
  closeBtn.addEventListener(`click`, winningsModalCloseBtnListenerCallback);
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

export function removeEarlySurrenderModalListeners(gameState) {
  const acceptBtn = document.querySelector(
    `.btn-winning-hand-modal__accept-early-surrender`
  );
  const declineBtn = document.querySelector(
    `.btn-winning-hand-modal__decline-early-surrender`
  );

  acceptBtn.removeEventListener(`click`, acceptEarlySurrenderCallback);
  declineBtn.removeEventListener(`click`, declineEarlySurrenderCallback);
}

export function removeWinningsModalListener(gameState) {
  const winSummaryBtn = document.querySelector(
    `.btn-winnings-modal__win-summary`
  );
  const closeBtn = document.querySelector(`.btn-winnings-modal__close`);

  winSummaryBtn.removeEventListener(`click`, winSummaryBtnListenerCallback);
  closeBtn.removeEventListener(`click`, winningsModalCloseBtnListenerCallback);
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

export function removeGameActionBtnListeners() {
  const hitBtn = document.querySelector(`.btn-action__hit`);
  const standBtn = document.querySelector(`.btn-action__stand`);
  const doubleDownBtn = document.querySelector(`.btn-action__doubleDown`);
  const splitBtn = document.querySelector(`.btn-action__split`);
  const surrenderBtn = document.querySelector(`.btn-action__surrender`);

  hitBtn.removeEventListener(`click`, hitBtnListenerCallback);
  standBtn.removeEventListener(`click`, standBtnListenerCallback);
  doubleDownBtn.removeEventListener(`click`, doubleDownBtnListenerCallback);
  splitBtn.removeEventListener(`click`, splitBtnListenerCallback);
  surrenderBtn.removeEventListener(`click`, surrenderBtnListenerCallback);
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
  view.displayInitialSideBetOutcomeWinHand(event, globalState);
}

function endingSideBetOutcomeWinHandCallback(event) {
  view.displayEndingSideBetOutcomeWinHand(event, globalState);
}

function displayStopInfinityDiceCallback(event) {
  view.displayStopInfinityDice(event);
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
  //Remove Even Money Info from Generic Modal
  // controller.beginGameRoutinePart2(globalState);

  controller.determineEndGameRoutineOrder(globalState);
}

function acceptInsuranceBtnCallback(event) {
  controller.initInsuranceBet(event, globalState);
}

function declineInsuranceBtnCallback(event) {
  removeInsuranceModalListeners();
  popbox.close(`generic-modal`);
  //Remove Insurance Info from Generic Modal
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
  view.displayWinSummaryModal(globalState);
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
  view.resetWinningHandModal();
  controller.surrenderAction(event, globalState);
}

function declineEarlySurrenderCallback(event) {
  view.resetWinningHandModal();
  controller.beginGameRoutinePart2(globalState);
}

function endGameBtnCallback(event) {
  controller.endGameAction(globalState);
}

function sideBetMenuBtnListener(event) {
  view.updateSideBetModalInfo(globalState);
}
