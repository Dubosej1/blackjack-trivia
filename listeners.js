import * as controller from "./controller-3.js";
import { globalState } from "./state.js";

export function addNewGameBtnListener() {
  const newGameBtn = document.querySelector(`.btn-system__new-game`);

  newGameBtn.addEventListener("click", controller.startNewGame);
}

export function addBeginGameOptionsBtnListener(gameState = null) {
  const optionsBtn = document.querySelector(`.btn-system__settings`);

  optionsBtn.addEventListener(`click`, beginGameOptionsListenerCallback);
}

export function addOptionsBtnListener(gameState) {
  const optionsBtn = document.querySelector(`.btn-system__settings`);

  optionsBtn.addEventListener(`click`, optionsListenerCallback);
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

  baseBetChipBtns.forEach(function (elem) {
    elem.addEventListener("click", updateBaseBetChipBtnCallback);
  });

  baseBetClearBtn.addEventListener("click", clearBaseBetChipAmountCallback);
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

  sideBetChipBtns.forEach(function (elem) {
    elem.addEventListener("click", updateSideBetChipBtnCallback);
  });

  sideBetClearBtn.addEventListener("click", clearSideBetChipAmountCallback);
}

export function removeBeginGameOptionsBtnListener() {
  const optionsBtn = document.querySelector(`.btn-system__settings`);

  optionsBtn.removeEventListener(`click`, beginGameOptionsListenerCallback);
}

function beginGameOptionsListenerCallback(event) {
  controller.submitOptions();
}

function optionsListenerCallback(event) {
  controller.submitOptions(globalState);
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
