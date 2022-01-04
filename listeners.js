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

export function addBaseBetChipBtnListeners(gameState) {
  const baseBetChipBtns = document.querySelectorAll(
    `.btn-basic-bet-modal__chip`
  );
  const baseBetClearBtn = document.querySelector(
    `.btn-basic-bet-modal__clear-bet`
  );

  baseBetChipBtns.forEach(function (elem) {
    elem.addEventListener(
      "click",
      function updateBaseBetChipBtnCallback(event) {
        controller.updateBaseBetChips(event, gameState);
      }
    );
  });

  baseBetClearBtn.addEventListener(
    "click",
    function clearBaseBetChipAmountCallback(event) {
      controller.clearBaseBetChips(event, gameState);
    }
  );
}

export function addSideBetContainerListener() {
  const sideBetContainers = document.querySelectorAll(
    `.side-bet-modal__side-bet-div`
  );

  sideBetContainers.forEach(function (elem) {
    elem.addEventListener(
      `click`,
      function sideBetContainerListenerCallback(event) {
        controller.updateSideBetContainer(event, gameState);
      }
    );
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
    elem.addEventListener(
      "click",
      function updateSideBetChipBtnCallback(event) {
        controller.updateSideBetChips(event, gameState);
      }
    );
  });

  sideBetClearBtn.addEventListener(
    "click",
    function clearSideBetChipAmountCallback(event) {
      controller.clearSideBetChips(event, gameState);
    }
  );
}
