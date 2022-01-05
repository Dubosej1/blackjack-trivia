import * as controller from "./controller-3.js";
import * as view from "./view-3.js";
import { globalState } from "./state.js";

export function addNewGameBtnListener() {
  const newGameBtn = document.querySelector(`.btn-system__new-game`);

  newGameBtn.addEventListener("click", controller.startNewGame);
}

export function addBeginGameOptionsBtnListener(gameState = null) {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.addEventListener(`click`, beginGameOptionsListenerCallback);
}

export function addOptionsBtnListener(gameState) {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.addEventListener(`click`, optionsListenerCallback);
}

export function addNewRoundEventListeners(gameState) {
  addOptionsBtnListener(gameState);
  addBaseBetChipBtnListeners(gameState);
  addSideBetChipBtnListeners(gameState);
  addSideBetContainerListener(gameState);
}

export function addBaseBetChipBtnListeners(gameState) {
  const baseBetChipBtns = document.querySelectorAll(
    `.btn-basic-bet-modal__chip`
  );
  const baseBetClearBtn = document.querySelector(
    `.btn-basic-bet-modal__clear-bet`
  );
  // const checkSideBetsBtn = document.querySelector(
  //   `.btn-basic-bet-modal__check-side-bets`
  // );

  baseBetChipBtns.forEach(function (elem) {
    elem.addEventListener("click", updateBaseBetChipBtnCallback);
  });

  baseBetClearBtn.addEventListener("click", clearBaseBetChipAmountCallback);

  // checkSideBetsBtn.addEventListener(`click`, checkSideBetsBtnListenerCallback);
}

export function addSideBetContainerListener() {
  const sideBetContainers = document.querySelectorAll(
    `.side-bet-modal__side-bet-div`
  );

  sideBetContainers.forEach(function (elem) {
    elem.addEventListener(`click`, sideBetContainerListenerCallback);
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

  sideBetChipBtns.forEach(function (elem) {
    elem.addEventListener("click", updateSideBetChipBtnCallback);
  });

  sideBetClearBtn.addEventListener("click", clearSideBetChipAmountCallback);

  placeSideBetsBtn.addEventListener(`click`, placeSideBetsBtnCallback);

  sideBetClearAllBtn.addEventListener(`click`, clearAllSideBetsBtnCallback);
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

export function removeBeginGameOptionsBtnListener() {
  const applyOptionsBtn = document.querySelector(
    `.btn-options-modal__submit-options`
  );

  applyOptionsBtn.removeEventListener(
    `click`,
    beginGameOptionsListenerCallback
  );
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

function clearSideBetChipAmountCallback(event) {
  controller.clearSideBetChips(event, globalState);
}

function placeSideBetsBtnCallback(event) {
  controller.placeSideBets(event, globalState);
}

function clearAllSideBetsBtnCallback(event) {
  controller.clearAllSideBets(event, globalState);
}
