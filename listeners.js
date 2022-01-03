import * as controller from "./controller.js";

export function addNewGameBtnListener() {
  const newGameBtn = document.querySelector(`.btn-system__new-game`);

  newGameBtn.addEventListener("click", controller.startNewGame);
}

export function addOptionsBtnListener(gameState = null) {
  const optionsBtn = document.querySelector(`.btn-system__settings`);

  if (gameState) {
    optionsBtn.addEventListener(
      `click`,
      function optionsListenerCallback(event) {
        controller.submitOptions(gameState);
      }
    );
  } else {
    optionsBtn.addEventListener(
      `click`,
      function optionsListenerCallback(event) {
        controller.submitOptions();
      }
    );
  }
}

export function addBasicBetChipBtnListeners() {
  const basicBetChipBtns = document.querySelectorAll(
    `.btn-basic-bet-modal__chip`
  );
  const basicBetClearBtn = document.querySelector(
    `.btn-basic-bet-modal__clear-bet`
  );

  basicBetChipBtns.forEach(function (elem) {
    elem.addEventListener("click", controller.updateBasicBetChipBtnCallback);
  });

  basicBetClearBtn.addEventListener(
    "click",
    controller.clearBasicBetChipAmountCallback
  );
}
