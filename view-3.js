import * as listeners from "./listeners.js";

export function updateBank(bank) {
  const bankField = document.querySelector(`.bank__value`);
  bankField.textContent = bank;
}

export function updateBaseBet(bet) {
  const baseBetField = document.querySelector(`.bet__value`);
  baseBetField.textContent = bet;
}

export function toggleDoubleDownMarker(boolean) {
  const doubleDownMarker = document.querySelector(
    `.round-info__double-down-marker`
  );

  if (boolean) doubleDownMarker.style.display = `inline`;
  else doubleDownMarker.style.display = `none`;
}

export function openBaseBetModal(gameState) {
  const basicBetModal__BankValue = document.querySelector(
    ".basic-bet-modal__bank-value"
  );

  let bank = gameState.bank;

  basicBetModal__BankValue.textContent = bank;

  checkBasicBetChipBtnsValid(bank);

  popbox.open(`basic-bet-modal`);
}

export function updateBaseBetModalTotal(gameState) {
  const basicBetModal__BankValue = document.querySelector(
    ".basic-bet-modal__bank-value"
  );
  const basicBetModal__BetValue = document.querySelector(
    ".basic-bet-modal__bet-value"
  );

  // let betTotal = gameState.betObj.tempBaseBet;
  let betTotal = gameState.betObj.getTempBaseBet();
  // let bank = gameState.betObj.tempBank;
  let bank = gameState.betObj.getTempBank();

  basicBetModal__BankValue.textContent = bank;
  basicBetModal__BetValue.textContent = betTotal;

  checkBasicBetChipBtnsValid(bank);
}

export function collectSideBet() {
  const elem = document.querySelector(`.side-bet-modal__active-bet`);

  const sideBet = elem.dataset.sidebet;
  return sideBet;
}

export function addActiveElementToBetContainer(event) {
  const activeBetElem = document.querySelector(`.side-bet-modal__active-bet`);

  activeBetElem.classList.remove(`side-bet-modal__active-bet`);

  const activeValueElem = document.querySelector(
    `.side-bet-modal__active-value`
  );

  activeValueElem.classList.remove(`side-bet-modal__active-value`);

  //   const elem = event.target;
  const elem = event.target.closest(`.side-bet-modal__side-bet-div`);
  const elemBetField = elem.querySelector(`.side-bet-modal__side-bet-value`);

  if (elem.dataset.betType == `no-chip`) toggleActivateSideBetBtn(true);
  else toggleActivateSideBetBtn(false);

  elem.classList.add(`side-bet-modal__active-bet`);
  elemBetField.classList.add(`side-bet-modal__active-value`);

  function toggleActivateSideBetBtn(toggle) {
    const chipBtns = document.querySelectorAll(`.btn-side-bet-modal__chip`);
    const activateBetBtn = document.querySelector(
      `.btn-side-bet-modal__activate-bet`
    );

    if (toggle) {
      chipBtns.forEach(function (elem) {
        elem.style.display = `none`;
      });
      activateBetBtn.style.display = `inline-block`;
    } else {
      chipBtns.forEach(function (elem) {
        elem.style.display = `inline-block`;
      });
      activateBetBtn.style.display = `none`;
    }
  }
}

export function updateSideBetModalTotals(sideBet, gameState) {
  const activeSideBetValueField = document.querySelector(
    `.side-bet-modal__active-value`
  );
  const sideBetTotalField = document.querySelector(
    `.side-bet-modal__total-value`
  );

  const sideBetBankField = document.querySelector(
    `.side-bet-modal__bank-value`
  );

  let sideBetObj = gameState.betObj.getSideBet(sideBet);
  // let sideBetValue = sideBetObj.getTempTotal();
  let sideBetValue = sideBetObj.getTempBet();
  let sideBetTotalValue = gameState.betObj.getTempSideBetTotalValue();
  // let bank = gameState.betObj.tempBank;
  let bank = gameState.betObj.getTempBank();

  activeSideBetValueField.textContent = sideBetValue;
  sideBetTotalField.textContent = sideBetTotalValue;
  sideBetBankField.textContent = bank;
  checkSideBetChipBtnsValid(bank);
}

export function clearSideBetModal(gameState) {
  const sideBetTotalField = document.querySelector(
    `.side-bet-modal__total-value`
  );

  const sideBetBankField = document.querySelector(
    `.side-bet-modal__bank-value`
  );
  const sideBetValueFields = document.querySelectorAll(
    `.side-bet-modal__side-bet-value`
  );
  // const bank = gameState.betObj.getTempBank();

  sideBetTotalField.textContent = 0;
  sideBetBankField.textContent = 0;
  sideBetValueFields.forEach(function (elem) {
    elem.textContent = 0;
  });
}

export function resetSideBetModal(gameState) {
  const sideBetTotalField = document.querySelector(
    `.side-bet-modal__total-value`
  );

  const sideBetBankField = document.querySelector(
    `.side-bet-modal__bank-value`
  );
  const sideBetValueFields = document.querySelectorAll(
    `.side-bet-modal__side-bet-value`
  );
  const bank = gameState.betObj.getTempBank();

  sideBetTotalField.textContent = 0;
  sideBetBankField.textContent = bank;
  sideBetValueFields.forEach(function (elem) {
    elem.textContent = 0;
  });
}

export function toggleSideBetPlacedBtn(boolean, gameState = null) {
  const sideBetPlacedBtn = document.querySelector(
    `.btn-basic-bet-modal__side-bet-placed`
  );
  if (boolean) {
    const sideBetTotal = gameState.betObj.getTempSideBetTotalValue();
    sideBetPlacedBtn.style.display = `inline-block`;
    sideBetPlacedBtn.textContent = `Side Bets Placed $${sideBetTotal}`;
  } else {
    sideBetPlacedBtn.style.display = `none`;
    sideBetPlacedBtn.textContent = `Side Bets Placed`;
  }
}

export function activateSideBetsPlacedModal(gameState) {
  const modalTitleField = document.querySelector(`.generic-modal__title`);
  const modalTextField = document.querySelector(`.generic-modal__main`);
  const modalNextBtn = document.querySelector(`.btn-generic-modal__next`);
  const modalCloseBtn = document.querySelector(`.btn-generic-modal__close`);
  modalTitleField.textContent = `Side Bets Placed`;

  let modalText = gameState.betObj.getSideBetsPlacedModalText();
  modalTextField.innerHTML = modalText;

  modalNextBtn.style.display = `none`;
  modalCloseBtn.style.display = `inline-block`;
}

export function deactivateSideBetsPlacedModal() {
  const modalTitleField = document.querySelector(`.generic-modal__title`);
  const modalTextField = document.querySelector(`.generic-modal__main`);
  const modalNextBtn = document.querySelector(`.btn-generic-modal__next`);
  const modalCloseBtn = document.querySelector(`.btn-generic-modal__close`);
  modalTitleField.textContent = `Generic Modal`;

  modalTextField.innerHTML = ` `;

  modalNextBtn.style.display = "inline-block";
  modalCloseBtn.style.display = `inline-block`;
}

// export function updateBasicBetChipAmount(event) {
//   const basicBetModal__BankValue = document.querySelector(
//     ".basic-bet-modal__bank-value"
//   );
//   const basicBetModal__BetValue = document.querySelector(
//     ".basic-bet-modal__bet-value"
//   );
//   const chipBtnValueText = event.target.dataset.value;

//   let bank = basicBetModal__BankValue.textContent;
//   let betAmountText = basicBetModal__BetValue.textContent;
//   let betAmount = parseInt(betAmountText, 10);
//   let chipBtnValue = parseInt(chipBtnValueText, 10);

//   betAmount = betAmount + chipBtnValue;
//   bank = bank - betAmount;

//   basicBetModal__BetValue.textContent = betAmount;
//   checkBasicBetChipBtnsValid(bank);
// }

// export function updateSideBetChipAmount(event) {
//   const sideBetModal__BankValue = document.querySelector(
//     ".side-bet-modal__bank-value"
//   );
//   const sideBetModal__betValue = document.querySelector(
//     ".side-bet-modal__active-bet"
//   );

//   const baseBetModal__betValue = document.querySelector(
//     `.basic-bet-modal__bet-value`
//   );
//   const chipBtnValueText = event.target.dataset.value;

//   let baseBetAmountText = baseBetModal__betValue.textContent;
//   let bank = sideBetModal__BankValue.textContent;
//   let betAmountText = sideBetModal__betValue.textContent;
//   let baseBetAmount = parseInt(baseBetAmountText, 10);
//   let betAmount = parseInt(betAmountText, 10);
//   let chipBtnValue = parseInt(chipBtnValueText, 10);

//   betAmount = betAmount + chipBtnValue;
//   bank = bank - baseBetAmount - betAmount;

//   document.querySelector(`.side-bet-modal__active-bet`).textContent = betAmount;

//   sideBetModal__TotalValue.textContent = betAmount;
//   checkSideBetChipBtnsValid(bank);
// }

function checkBasicBetChipBtnsValid(value) {
  // const basicBetModal__BankValue = document.querySelector('.basic-bet-modal__bank-value');
  const chip5 = document.querySelector(`.btn-basic-bet-modal__5`);
  const chip10 = document.querySelector(`.btn-basic-bet-modal__10`);
  const chip25 = document.querySelector(`.btn-basic-bet-modal__25`);
  const chip100 = document.querySelector(`.btn-basic-bet-modal__100`);
  const chip500 = document.querySelector(`.btn-basic-bet-modal__500`);
  // const bank = basicBetModal__BankValue.textContent;

  value > 5 ? enableChipBtn(chip5) : disableChipBtn(chip5);
  value > 10 ? enableChipBtn(chip10) : disableChipBtn(chip10);
  value > 25 ? enableChipBtn(chip25) : disableChipBtn(chip25);
  value > 100 ? enableChipBtn(chip100) : disableChipBtn(chip100);
  value > 500 ? enableChipBtn(chip500) : disableChipBtn(chip500);
}

function checkSideBetChipBtnsValid(value) {
  // const basicBetModal__BankValue = document.querySelector('.basic-bet-modal__bank-value');
  const chip5 = document.querySelector(`.btn-side-bet-modal__5`);
  const chip10 = document.querySelector(`.btn-side-bet-modal__10`);
  const chip25 = document.querySelector(`.btn-side-bet-modal__25`);
  const chip100 = document.querySelector(`.btn-side-bet-modal__100`);
  // const bank = basicBetModal__BankValue.textContent;

  value > 5 ? enableChipBtn(chip5) : disableChipBtn(chip5);
  value > 10 ? enableChipBtn(chip10) : disableChipBtn(chip10);
  value > 25 ? enableChipBtn(chip25) : disableChipBtn(chip25);
  value > 100 ? enableChipBtn(chip100) : disableChipBtn(chip100);
}

function checkExtraBetChipBtnsValid(value, sideBet, baseBet) {
  // const basicBetModal__BankValue = document.querySelector('.basic-bet-modal__bank-value');
  const chip5 = document.querySelector(`.btn-extra-bet-modal__5`);
  const chip10 = document.querySelector(`.btn-extra-bet-modal__10`);
  const chip25 = document.querySelector(`.btn-extra-bet-modal__25`);
  const chip100 = document.querySelector(`.btn-extra-bet-modal__100`);
  const chip500 = document.querySelector(`.btn-extra-bet-modal__500`);
  // const bank = basicBetModal__BankValue.textContent;
  let maxValue = baseBet * 5;

  value > 5 ? enableChipBtn(chip5) : disableChipBtn(chip5);
  value > 10 ? enableChipBtn(chip10) : disableChipBtn(chip10);
  value > 25 ? enableChipBtn(chip25) : disableChipBtn(chip25);
  value > 100 ? enableChipBtn(chip100) : disableChipBtn(chip100);
  value > 500 ? enableChipBtn(chip500) : disableChipBtn(chip500);
  sideBet >= maxValue
    ? toggleDisableExtraBetChips(true)
    : toggleDisableExtraBetChips(false);

  function toggleDisableExtraBetChips(toggle) {
    const chipBtns = document.querySelectorAll(`.btn-extra-bet-modal__chip`);

    if (toggle) {
      chipBtns.forEach(function (elem) {
        elem.disabled = true;
      });
    } else {
      chipBtns.forEach(function (elem) {
        elem.disabled = false;
      });
    }
  }
}

function enableChipBtn(element) {
  element.disabled = false;
  if (element.classList.contains(`disabled`))
    element.classList.remove("disabled");
}

function disableChipBtn(element) {
  element.disabled = true;
  element.classList.add(`disabled`);
}

// export function clearBaseBetModalTotal(gameState) {
//   document.querySelector(`.basic-bet-modal__bet-value`).textContent = 0;
// }

// export function clearSideBetChipAmount(event, gameState) {
//   const betAmount = document.querySelector(
//     `.side-bet-modal__active-bet`
//   ).textContent;

//   const betTotal = document.querySelector(
//     `.side-bet-modal__total-value`
//   ).textContent;

//   let bank = document.querySelector(`.side-bet-modal__bank-value`).textContent;

//   bank = bank + betTotal;

//   checkSideBetChipBtnsValid(bank);

//   document.querySelector(`.side-bet-modal__total-value`).textContent =
//     betTotal - betAmount;

//   document.querySelector(`.side-bet-modal__active-bet`).textContent = 0;
// }

// export function clearAllSideBetChipAmounts(event, gameState) {
//   document.querySelector(`.side-bet-modal__total-value`).textContent = 0;
//   document.querySelector(`.side-bet-modal__active-bet`).textContent = 0;
// }

export function collectOptions() {
  let options = {};

  let form = document.querySelector(`.options-modal__form`);
  let formData = new FormData(form);

  if (formData.get(`toggle-trivia`) == `trivia-off`) options.triviaMode = false;
  else options.triviaMode = true;

  if (formData.get(`toggle-side-bets`) == `side-bets-off`)
    options.sideBets = false;
  else options.sideBets = true;

  if (formData.get(`blackjack-payout`) == `blackjack-2-to-1`)
    options.blackjackPayout = `2:1`;
  else if (formData.get(`blackjack-payout`) == `blackjack-6-to-5`)
    options.blackjackPayout = `6:5`;
  else options.blackjackPayout = `3:2`;

  if (formData.get(`dealer-stands`) == `soft-16`)
    options.dealerStandsOn = `soft16`;
  else if (formData.get(`dealer-stands`) == `hard-16`)
    options.dealerStandsOn = `hard16`;
  else if (formData.get(`dealer-stands`) == `hard-17`)
    options.dealerStandsOn = `hard17`;
  else options.dealerStandsOn = `soft17`;

  let deckCount = formData.get(`deck-count`);
  if (deckCount) options.deckCount = deckCount;
  else options.deckCount = 6;

  if (formData.get(`disable-five-card-charlie`) == `true`)
    options.fiveCardCharlie = false;
  else options.fiveCardCharlie = true;

  if (formData.get(`split-any-ten`) == `true`) options.splitAnyTens = true;
  else options.splitAnyTens = false;

  if (formData.get(`double-after-split`) == `true`)
    options.doubleAfterSplit = true;
  else options.doubleAfterSplit = false;

  if (formData.get(`resplit-on`) == `true`) options.resplitting = true;
  else options.resplitting = false;

  if (formData.get(`resplit-aces-on`) == `true`) options.resplitAces = true;
  else options.resplitAces = false;

  if (formData.get(`split-aces-on`) == `true`) options.splitAces = true;
  else options.splitAces = false;

  if (formData.get(`split-ace-draw-limit-on`) == `true`)
    options.draw1SplitAce = true;
  else options.draw1SplitAce = false;

  if (formData.get(`double-after-split-ace`) == `true`)
    options.doubleAfterSplitAces = true;
  else options.doubleAfterSplitAces = false;

  if (formData.get(`resplit-after-split-aces`) == `true`)
    options.resplitAfterSplitAces = true;
  else options.resplitAfterSplitAces = false;

  if (formData.get(`disable-surrender`) == `true`)
    options.surrenderEnabled = false;
  else options.surrenderEnabled = true;

  if (formData.get(`surrender-options`) == `early-surrender`)
    options.surrenderType = `early`;
  else options.surrenderType = `late`;

  if (formData.get(`disable-insurance`) == `true`)
    options.insuranceEnabled = false;
  else options.insuranceEnabled = true;

  if (formData.get(`disable-even-money`) == `true`)
    options.evenMoneyEnabled = false;
  else options.evenMoneyEnabled = true;

  return options;
}

export function doubleAfterSplitAcesHandler(event) {
  const doubleAfterSplitBox = document.querySelector(`#double-after-split`);
  const splitAcesBox = document.querySelector(`#split-aces-on`);

  if (event.target.checked) {
    doubleAfterSplitBox.checked = true;
    splitAcesBox.checked = true;
  }
}

export function draw1AfterSplitAcesHandler(event) {
  const splitAcesBox = document.querySelector(`#split-aces-on`);

  if (event.target.checked) {
    splitAcesBox.checked = true;
  }
}

export function resplitAcesHandler(event) {
  const resplitBox = document.querySelector(`#resplit-on`);
  const splitAcesBox = document.querySelector(`#split-aces-on`);

  if (event.target.checked) {
    resplitBox.checked = true;
    splitAcesBox.checked = true;
  }
}

export function resplitAfterSplitAcesHandler(event) {
  const resplitBox = document.querySelector(`#resplit-on`);
  const splitAcesBox = document.querySelector(`#split-aces-on`);

  if (event.target.checked) {
    resplitBox.checked = true;
    splitAcesBox.checked = true;
  }
}

export function disableSurrenderHandler(event) {
  const earlySurrenderRadio = document.querySelector(`#early-surrender`);
  const lateSurrenderRadio = document.querySelector(`#late-surrender`);

  if (event.target.checked) {
    earlySurrenderRadio.disabled = true;
    lateSurrenderRadio.disabled = true;
  } else {
    earlySurrenderRadio.disabled = false;
    lateSurrenderRadio.disabled = false;
  }
}

export function resetOptionsMenuInputs(event) {
  const triviaOnRadio = document.querySelector(`#trivia-on`);
  const sideBetsOnRadio = document.querySelector(`#side-bets-on`);
  const blackjack3To2Radio = document.querySelector(`#blackjack-3-to-2`);
  const dealerSoft17Radio = document.querySelector(`#soft-17`);
  const sixDeckRadio = document.querySelector(`#six-deck`);
  const disableFiveCharlieBox = document.querySelector(
    `#disable-five-card-charlie`
  );

  const splitAnyTenBox = document.querySelector(`#split-any-ten`);

  const doubleAfterSplitBox = document.querySelector(`#double-after-split`);
  const resplitBox = document.querySelector(`#resplit-on`);
  const splitAcesBox = document.querySelector(`#split-aces-on`);
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
  const earlySurrenderRadio = document.querySelector(`#early-surrender`);
  const lateSurrenderRadio = document.querySelector(`#late-surrender`);
  const disableInsuranceBox = document.querySelector(`#disable-insurance`);
  const disableEvenMoneyBox = document.querySelector(`#disable-even-money`);

  triviaOnRadio.checked = true;
  sideBetsOnRadio.checked = true;
  blackjack3To2Radio.checked = true;
  dealerSoft17Radio.checked = true;
  sixDeckRadio.checked = true;
  disableFiveCharlieBox.checked = false;
  splitAnyTenBox.checked = false;
  doubleAfterSplitBox.checked = false;
  resplitBox.checked = false;
  splitAcesBox.checked = false;
  doubleAfterSplitAcesBox.checked = false;
  draw1AfterSplitAcesBox.checked = false;
  resplitAcesBox.checked = false;
  resplitAfterSplitAcesBox.checked = false;
  disableInsuranceBox.checked = false;
  disableEvenMoneyBox.checked = false;

  if (disableSurrenderBox.checked) {
    disableSurrenderBox.checked = false;
    earlySurrenderRadio.disabled = false;
    lateSurrenderRadio.disabled = false;
  }

  lateSurrenderRadio.checked = true;
}

export function renderPlayerHands(player, reset = null) {
  let active = player.currentSplitHand;
  let count;
  if (player.type == "split player") count = player.splitHands.length;

  if (reset) resetOutcomeField(0);

  if (active == 0) {
    renderPlayerField(player.hand);
    return;
  }
  let splitHand1, splitHand2, splitHand3, splitHand4;

  splitHand1 = player.getSplitHand(1);
  splitHand2 = player.getSplitHand(2);
  if (count >= 3) splitHand3 = player.getSplitHand(3);
  if (count == 4) splitHand4 = player.getSplitHand(4);

  switch (active) {
    case 1:
      renderPlayerField(splitHand1);
      if (count == 4) renderSplitStage(splitHand4, 3);
      if (count >= 3) renderSplitStage(splitHand3, 2);
      if (count >= 2) renderSplitStage(splitHand2, 1);
      break;
    case 2:
      renderPlayerField(splitHand2);
      renderSplitStage(splitHand1, 1);
      if (count == 4) renderSplitStage(splitHand4, 3);
      if (count >= 3) renderSplitStage(splitHand3, 2);
      break;
    case 3:
      renderPlayerField(splitHand3);
      renderSplitStage(splitHand1, 1);
      renderSplitStage(splitHand2, 2);
      if (count == 4) renderSplitStage(splitHand4, 3);
      break;
    case 4:
      renderPlayerField(splitHand4);
      renderSplitStage(splitHand1, 1);
      renderSplitStage(splitHand2, 2);
      renderSplitStage(splitHand3, 3);
      break;
    default:
      console.log(`ERROR: Rendering split hands to view`);
  }
}

export function renderPlayerHandOutcome(hand, field) {
  // let active = player.currentSplitHand;
  // let count;
  // if (player.type == "split player") count = player.splitHands.length;

  // if (active == 0) {
  //   renderPlayerField(player.hand);
  //   return;
  // }
  // let splitHand1, splitHand2, splitHand3, splitHand4;

  let outcome = hand.outcome;
  let outcomeText;

  if (outcome == `bust`) outcomeText = `Bust`;
  if (outcome == `charlie`) outcomeText = `${hand.charlieType} Card Charlie`;
  if (outcome == `natural`) outcomeText = `Blackjack!`;
  if (outcome == `stand`) outcomeText = `Stand`;
  if (outcome == `dealerHit`) outcomeText = `Hitting...`;

  switch (field) {
    case `player`:
      document
        .querySelector(`.player-message__container`)
        .classList.add(`player-message__container--${outcome}`);
      document.querySelector(`.player-message__text`).textContent = outcomeText;
      break;
    case `split-1`:
      const splitStage1Result = document.querySelector(
        `.split-stage-1__result`
      );
      splitStage1Result.classList.add(`split-stage-1__result--${outcome}`);
      splitStage1Result.textContent = outcomeText;
      break;
    case `split-2`:
      const splitStage2Result = document.querySelector(
        `.split-stage-2__result`
      );
      splitStage2Result.classList.add(`split-stage-2__result--${outcome}`);
      splitStage2Result.textContent = outcomeText;
      break;
    case `split-3`:
      const splitStage3Result = document.querySelector(
        `.split-stage-3__result`
      );
      splitStage3Result.classList.add(`split-stage-3__result--${outcome}`);
      splitStage3Result.textContent = outcomeText;
      break;
    case `dealer`:
      document
        .querySelector(`.dealer-message__container`)
        .classList.add(`dealer-message__container--${outcome}`);
      document.querySelector(`.dealer-message__text`).textContent = outcomeText;
      break;
    default:
      console.log(`ERROR: Rendering Outcome Fields`);
  }
}

export function resetOutcomeField(stageNum) {
  const playerMessageContainer = document.querySelector(
    `.player-message__container`
  );
  const playerMessageText = document.querySelector(`.player-message__text`);
  const splitStage1Result = document.querySelector(`.split-stage-1__result`);
  const splitStage2Result = document.querySelector(`.split-stage-2__result`);
  const splitStage3Result = document.querySelector(`.split-stage-3__result`);
  const dealerMessageContainer = document.querySelector(
    `.dealer-message__container`
  );
  const dealerMessageText = document.querySelector(`.dealer-message__text`);

  switch (stageNum) {
    case 0:
      removeOutcomeModifierClasses(playerMessageContainer);
      playerMessageText.textContent = ``;
      break;
    case 10:
      removeOutcomeModifierClasses(dealerMessageContainer);
      dealerMessageText.textContent = ``;
      break;
    case 1:
      removeOutcomeModifierClasses(splitStage1Result);
      splitStage1Result.textContent = ``;
      break;
    case 2:
      removeOutcomeModifierClasses(splitStage2Result);
      splitStage2Result.textContent = ``;
      break;
    case 3:
      removeOutcomeModifierClasses(splitStage3Result);
      splitStage3Result.textContent = ``;
      break;
    default:
      removeOutcomeModifierClasses(splitStage1Result);
      splitStage1Result.textContent = ``;

      removeOutcomeModifierClasses(splitStage2Result);
      splitStage2Result.textContent = ``;

      removeOutcomeModifierClasses(splitStage3Result);
      splitStage3Result.textContent = ``;
  }
}

function removeOutcomeModifierClasses(elem) {
  let classesArr = [`natural`, `bust`, `charlie`, `stand`];

  classesArr.forEach(function (str) {
    elem.classList.remove(`player-message__container--${str}`);
  });
}

export function renderPlayerField(hand) {
  let handNum = hand.handNum;
  let finalImages = [...hand.images, ...hand.endTags];

  document.querySelector(".player-cards__container").innerHTML =
    finalImages.join(``);
  document.querySelector(".player-total__value").textContent = hand.total;

  if (handNum > 0) togglePlayerFieldLabel(handNum);

  if (hand.outcome) renderPlayerHandOutcome(hand, `player`);
  // else resetPlayerHandOutcome(hand, `reset`);
}

function togglePlayerFieldLabel(handNum) {
  const playerLabel = document.querySelector(`.player-total__label`);
  const handNumField = document.querySelector(`.player-total__hand-num`);

  if (handNum == 0) {
    playerLabel.textContent = `Player `;
    handNumField.style.display = `none`;
  } else {
    playerLabel.textContent = `Hand `;
    handNumField.style.display = `inline`;
    handNumField.textContent = handNum;
  }
}

export function renderDealerField(hand) {
  let finalImages = [...hand.images, ...hand.endTags];
  //   document.querySelector(".dealer-cards__container").innerHTML = hand.images.join();
  document.querySelector(".dealer-cards__container").innerHTML =
    finalImages.join(``);
  document.querySelector(".dealer-total__value").textContent =
    hand.visibleTotal;

  // if (hand.outcome) renderPlayerHandOutcome(hand, `dealer`);
}

export function renderSplitStage(hand, stageNum) {
  const splitStageField = document.querySelector(
    `.grid__split-stages-container`
  );
  let { handNum, codes, total } = hand;

  splitStageField.style.display = `flex`;

  switch (stageNum) {
    case 1:
      document.querySelector(
        `.split-stage-1__container`
      ).style.display = `block`;
      document.querySelector(`.split-stage-1__hand-num`).textContent = handNum;
      document.querySelector(`.split-stage-1__cards`).textContent =
        codes.join(` `);
      document.querySelector(`.split-stage-1__total`).textContent = total;
      if (hand.outcome) renderPlayerHandOutcome(hand, `split-1`);
      break;
    case 2:
      document.querySelector(
        `.split-stage-2__container`
      ).style.display = `block`;
      document.querySelector(`.split-stage-2__hand-num`).textContent = handNum;
      document.querySelector(`.split-stage-2__cards`).textContent =
        codes.join(` `);
      document.querySelector(`.split-stage-2__total`).textContent = total;
      if (hand.outcome) renderPlayerHandOutcome(hand, `split-2`);
      break;
    case 3:
      document.querySelector(
        `.split-stage-3__container`
      ).style.display = `block`;
      document.querySelector(`.split-stage-3__hand-num`).textContent = handNum;
      document.querySelector(`.split-stage-3__cards`).textContent =
        codes.join(` `);
      document.querySelector(`.split-stage-3__total`).textContent = total;
      if (hand.outcome) renderPlayerHandOutcome(hand, `split-3`);
      break;
    default:
      console.log(`ERROR: Rendering Split Stage`);
  }
}

// export function renderSplitStage1(hand) {
//   // let finalImages = [...hand.images, ...hand.endTags];
//   const container = document.querySelector(`.split-stage-1__container`);
//   const handNumField = document.querySelector(`.split-stage-1__hand-num`);
//   const cardsField = document.querySelector(`.split-stage-1__cards`);
//   const totalField = document.querySelector(`.split-stage-1__total`);

//   // let outcome = hand.outcome;

//   container.style.display = `block`;
//   handNumField.textContent = hand.handNum;
//   cardsField.textContent = hand.codes.join(` `);
//   totalField.textContent = hand.total;

//   // if (!hand.outcome) return;

//   //Outcomes: Bust, # Card Charlie, Stand, Win, Lose, Push
// }

// export function renderSplitStage2(hand) {
//   // let finalImages = [...hand.images, ...hand.endTags];
//   const container = document.querySelector(`.split-stage-2__container`);
//   const handNumField = document.querySelector(`.split-stage-2__hand-num`);
//   const cardsField = document.querySelector(`.split-stage-2__cards`);
//   const totalField = document.querySelector(`.split-stage-2__total`);

//   // let outcome = hand.outcome;

//   container.style.display = `block`;
//   handNumField.textContent = hand.handNum;
//   cardsField.textContent = hand.codes.join(` `);
//   totalField.textContent = hand.total;

//   // if (!hand.outcome) return;

//   //Outcomes: Bust, # Card Charlie, Stand, Win, Lose, Push
// }

// export function renderSplitStage3(hand) {
//   // let finalImages = [...hand.images, ...hand.endTags];
//   const container = document.querySelector(`.split-stage-3__container`);
//   const handNumField = document.querySelector(`.split-stage-3__hand-num`);
//   const cardsField = document.querySelector(`.split-stage-3__cards`);
//   const totalField = document.querySelector(`.split-stage-3__total`);

//   // let outcome = hand.outcome;

//   container.style.display = `block`;
//   handNumField.textContent = hand.handNum;
//   cardsField.textContent = hand.codes.join(` `);
//   totalField.textContent = hand.total;

//   // if (!hand.outcome) return;

//   //Outcomes: Bust, # Card Charlie, Stand, Win, Lose, Push
// }

export function toggleCheckSideBetBtn(toggle) {
  const checkSideBetBtn = document.querySelector(
    `.btn-system__check-side-bet-outcome`
  );

  toggle
    ? (checkSideBetBtn.style.display = `inline-block`)
    : (checkSideBetBtn.style.display = `none`);
}

export function displayInitialSideBetOutcome(gameState) {
  const summaryField = document.querySelector(`.summary-modal__main`);
  const summaryTitle = document.querySelector(`.summary-modal__title`);
  const closeBtn = document.querySelector(`.btn-summary-modal__close`);
  const nextBtn = document.querySelector(`.btn-summary-modal__next`);

  closeBtn.style.display = "none";
  nextBtn.style.display = `inline-block`;
  //   let buttonCountArr = [];

  summaryTitle.textContent = `Side Bet Outcome`;

  summaryField.innerHTML = ` `;

  let outcomeArr = gameState.betObj.initialOutcomePackages;
  let totalWinnings = gameState.betObj.getInitialSideBetWinnings();

  outcomeArr.forEach(function (obj) {
    let [outcomeElem, buttonCount] = createSummaryFieldElements(obj);

    //   buttonCountArr.push(buttonCount);

    summaryField.appendChild(outcomeElem);
  });

  let winningsField = document.createElement(`h1`);
  let winningsFieldContent = document.createTextNode(
    `Total Winnings: ${totalWinnings}`
  );
  winningsField.appendChild(winningsFieldContent);
  summaryField.appendChild(winningsField);

  listeners.addSummaryModalDisplayHandListener(gameState);
  popbox.open(`summary-modal`);
}

function createSummaryFieldElements(outcomeObj) {
  const summaryField = document.querySelector(`.summary-modal__main`);
  let buttonCount;

  let { name, outcome, winCondition } = outcomeObj;

  const newDiv = document.createElement(`div`);

  const nameSpan = document.createElement(`span`);
  let nameSpanContent = document.createTextNode(`${name} `);
  nameSpan.appendChild(nameSpanContent);

  const outcomeDiv = document.createElement(`div`);
  outcomeDiv.classList.add(`summary-modal__outcome--${outcome}`);
  let outcomeDivContent = document.createTextNode(`${outcome} `);
  outcomeDiv.appendChild(outcomeDivContent);

  const winConditionSpan = document.createElement(`span`);
  const winConditionSpanContent = document.createTextNode(`${winCondition}  `);
  winConditionSpan.appendChild(winConditionSpanContent);

  // summaryField.appendChild(newDiv);
  newDiv.appendChild(nameSpan);
  newDiv.appendChild(outcomeDiv);
  newDiv.appendChild(outcomeDivContent);
  // newDiv.insertAdjacentHTML(`afterend` `<br>`);

  if (outcome == `lose`) {
    let { sideBetKey } = outcomeObj;

    const checkHandBtn = document.createElement(`button`);
    checkHandBtn.classList.add(`btn-summary-modal__display-hand`);
    checkHandBtn.dataset.sideBet = sideBetKey;
    checkHandBtn.dataset.popboxTarget = `winning-hand-modal`;
    let checkHandBtnContent = document.createTextNode(`Check Hand`);
    checkHandBtn.appendChild(checkHandBtnContent);

    newDiv.appendChild(winConditionSpan);
    newDiv.appendChild(checkHandBtn);
    winConditionSpan.insertAdjacentHTML(`beforebegin`, `<br>`);

    buttonCount = 0;

    return [newDiv, buttonCount];
  }

  let { winnings, sideBetKey } = outcomeObj;

  const checkHandBtn = document.createElement(`button`);
  checkHandBtn.classList.add(`btn-summary-modal__display-hand`);
  //   checkHandBtn.classList.add(`${sideBetKey}`);
  checkHandBtn.dataset.sideBet = sideBetKey;
  //   checkHandBtn.dataset.popboxTarget = `winning-hand-modal`;
  let checkHandBtnContent = document.createTextNode(`Check Hand`);
  checkHandBtn.appendChild(checkHandBtnContent);

  //summary-modal__winnings-value
  const winningsSpan = document.createElement(`span`);
  winningsSpan.classList.add(`summary-modal__winnings-value`);
  let winningsSpanContent = document.createTextNode(`${winnings}`);
  winningsSpan.appendChild(winningsSpanContent);

  newDiv.appendChild(checkHandBtn);
  newDiv.appendChild(winConditionSpan);
  winConditionSpan.insertAdjacentHTML(`beforebegin`, `<br>`);
  newDiv.appendChild(winningsSpan);

  buttonCount = 1;

  return [newDiv, buttonCount];
}

// let str;
// let { name, outcome, winCondition } = obj;

// if (outcome == `lose`) {
//   str = `<span>${name}  <div class="summary-modal__outcome--lose"> ${outcome} </div><br><span>"${winCondition}"</span><br>`;
// } else {
//   let { winnings } = obj;
//   str = `<span>${name} </span><div class="summary-modal__outcome--${outcome}"> ${outcome} </div><button class="btn-summary-modal__display-hand" data-sideBet="${sideBetKey}" data-popbox-target="winning-hand-modal">Hand / Payout</button><br><span>${winCondition} </span><span class="summary-modal__winnings-value"> ${winnings}</span><br>`;
// }
// contentStr.push(str);

export function displayInitialSideBetOutcomeWinHand(event, gameState) {
  //   const displayHandBtn = document.querySelector(
  //     `.btn-summary-modal__display-hand`
  //   );
  const titleField = document.querySelector(`.winning-hand-modal__title`);
  const sideBetNameField = document.querySelector(
    `.winning-hand-modal__side-bet-name`
  );
  const dealerCardsContainer = document.querySelector(
    `.winning-hand-modal__dealer-cards-container`
  );
  const playerCardsContainer = document.querySelector(
    `.winning-hand-modal__player-cards-container`
  );
  const dealerCardsField = document.querySelector(
    `.winning-hand-modal__dealer-cards`
  );
  const playerCardsField = document.querySelector(
    `.winning-hand-modal__player-cards`
  );
  const payoutField = document.querySelector(`.winning-hand-modal__payout`);
  const winConditionField = document.querySelector(
    `.winning-hand-modal__winning-hand-name`
  );

  let outcomeArr = gameState.betObj.initialOutcomePackages;
  let key = event.target.dataset.sideBet;

  let [outcomeObj] = outcomeArr.filter((obj) => obj.sideBetKey == key);

  titleField.textContent = `Winning Hand Info`;
  sideBetNameField.textContent = outcomeObj.name;

  //   if (outcomeObj.winHand.playersArr.includes(`dealer`)) dealerCardsContainer.style.display = `block`;
  //   else dealerCardsContainer.style.display = `none`;

  //   if (outcomeObj.winHand.playersArr.includes(`player`)) playerCardsContainer.style.display = `block`;
  //   else playerCardsContainer.style.display = `none`;

  if (outcomeObj.outcome != `lose`) {
    outcomeObj.winHand.playersArr.includes(`dealer`)
      ? (dealerCardsContainer.style.display = `block`)
      : (dealerCardsContainer.style.display = `none`);
    outcomeObj.winHand.playersArr.includes(`player`)
      ? (playerCardsContainer.style.display = `block`)
      : (playerCardsContainer.style.display = `none`);

    if (outcomeObj.winHand.player) {
      playerCardsField.innerHTML = gameState.player.hand.simpleImages.join();
    }

    if (outcomeObj.winHand.dealer) {
      dealerCardsField.innerHTML = gameState.dealer.hand.simpleImages.join();
    }
  }

  payoutField.textContent = outcomeObj.payout;
  winConditionField.textContent = outcomeObj.winCondition;

  popbox.open(`winning-hand-modal`);
}

export function displayEndingSideBetOutcomeWinHand(event, gameState) {
  //   const displayHandBtn = document.querySelector(
  //     `.btn-summary-modal__display-hand`
  //   );
  const titleField = document.querySelector(`.winning-hand-modal__title`);
  const sideBetNameField = document.querySelector(
    `.winning-hand-modal__side-bet-name`
  );
  const dealerCardsContainer = document.querySelector(
    `.winning-hand-modal__dealer-cards-container`
  );
  const playerCardsContainer = document.querySelector(
    `.winning-hand-modal__player-cards-container`
  );
  const dealerCardsField = document.querySelector(
    `.winning-hand-modal__dealer-cards`
  );
  const playerCardsField = document.querySelector(
    `.winning-hand-modal__player-cards`
  );
  const payoutField = document.querySelector(`.winning-hand-modal__payout`);
  const winConditionField = document.querySelector(
    `.winning-hand-modal__winning-hand-name`
  );

  let outcomeArr = gameState.betObj.endingOutcomePackages;
  let key = event.target.dataset.sideBet;

  let [outcomeObj] = outcomeArr.filter((obj) => obj.sideBetKey == key);

  titleField.textContent = `Winning Hand Info`;
  sideBetNameField.textContent = outcomeObj.name;

  //   if (outcomeObj.winHand.playersArr.includes(`dealer`)) dealerCardsContainer.style.display = `block`;
  //   else dealerCardsContainer.style.display = `none`;

  //   if (outcomeObj.winHand.playersArr.includes(`player`)) playerCardsContainer.style.display = `block`;
  //   else playerCardsContainer.style.display = `none`;

  if (outcomeObj.outcome != `lose`) {
    outcomeObj.winHand.playersArr.includes(`dealer`)
      ? (dealerCardsContainer.style.display = `block`)
      : (dealerCardsContainer.style.display = `none`);
    outcomeObj.winHand.playersArr.includes(`player`)
      ? (playerCardsContainer.style.display = `block`)
      : (playerCardsContainer.style.display = `none`);

    if (outcomeObj.winHand.player) {
      playerCardsField.innerHTML = gameState.player.hand.simpleImages.join();
    }

    if (outcomeObj.winHand.dealer) {
      dealerCardsField.innerHTML = gameState.dealer.hand.simpleImages.join();
    }
  }

  payoutField.textContent = outcomeObj.payout;
  winConditionField.textContent = outcomeObj.winCondition;

  popbox.open(`winning-hand-modal`);
}

export function displayPerfect11sDiceRoll(diceRolls) {
  const modalTitle = document.querySelector(`.generic-modal__title`);
  const displayField = document.querySelector(`.generic-modal__main`);
  const closeBtn = document.querySelector(`.btn-generic-modal__close`);
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  closeBtn.style.display = `none`;
  nextBtn.style.display = `none`;
  displayField.innerHTML = ` `;

  modalTitle.textContent = `Perfect 11s Dice Roll`;

  let directionsHeading = document.createElement(`h2`);
  let directionsHeadingContent = document.createTextNode(
    `Your hand is a suited 11, so you get to roll the Infinity Dice! `
  );
  directionsHeading.appendChild(directionsHeadingContent);

  let diceContainer = document.createElement(`div`);

  let infinityDice1 = document.createElement(`h3`);
  let infinityDice2 = document.createElement(`h3`);
  let infinityDice3 = document.createElement(`h3`);

  let stopBtn = document.createElement(`button`);
  stopBtn.classList.add(`btn-generic-modal__stop-dice`);
  stopBtn.dataset.diceCounter = 1;
  let stopBtnContent = document.createTextNode(`Stop Dice!`);
  stopBtn.appendChild(stopBtnContent);

  let directionsFooter = document.createElement(`h2`);
  directionsFooter.innerHTML = `Press STOP button to stop dice roll.<br>Roll 2 or more infinities to win the BONUS`;

  displayField.appendChild(directionsHeading);
  displayField.appendChild(diceContainer);
  diceContainer.appendChild(infinityDice1);
  diceContainer.appendChild(infinityDice2);
  diceContainer.appendChild(infinityDice3);
  displayField.appendChild(stopBtn);
  stopBtn.insertAdjacentHTML(`afterend`, `<br>`);
  displayField.appendChild(directionsFooter);

  let diceFields = diceContainer.querySelectorAll(`h3`);

  Array.from(diceFields).forEach(function (elem, index) {
    elem.classList.add(`infinity-dice-${index + 1}`);
    elem.classList.add(`infinity-dice`);
    elem.dataset.diceRoll = diceRolls[index];
  });

  listeners.addInfinityDiceStopBtnListener();
  popbox.open(`generic-modal`);
}

export function displayStopInfinityDice(event) {
  const dice1 = document.querySelector(`.infinity-dice-1`);
  const dice2 = document.querySelector(`.infinity-dice-2`);
  const dice3 = document.querySelector(`.infinity-dice-3`);
  const stopBtn = document.querySelector(`.btn-generic-modal__stop-dice`);
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  let num = parseInt(event.target.dataset.diceCounter, 10);
  let diceRoll;

  switch (num) {
    case 1:
      applyDiceRoll(dice1, num);
      num++;
      stopBtn.dataset.diceCounter = num;
      break;
    case 2:
      applyDiceRoll(dice2, num);
      num++;
      stopBtn.dataset.diceCounter = num;
      break;
    case 3:
      applyDiceRoll(dice3, num);
      num++;
      stopBtn.disabled = true;
      nextBtn.style.display = `inline-block`;
      listeners.addBeginGameDiceModalNextBtnListener();
      break;
    default:
      console.log(`Infinity Dice Roll Error`);
  }

  function applyDiceRoll(elem, diceCounter) {
    let diceRoll = elem.dataset.diceRoll;
    elem.innerHTML = `DICE ${diceCounter}: ${diceRoll}`;
  }
}

export function displayExtraBetModal(gameState) {
  const titleField = document.querySelector(`.extra-bet-modal__title-text`);
  const bankField = document.querySelector(`.extra-bet-modal__bank-value`);
  const baseBetField = document.querySelector(`.extra-bet-modal__bet-value`);
  const mainContainer = document.querySelector(`.extra-bet-modal__main`);
  const placeExtraBetBtn = document.querySelector(
    `.btn-extra-bet-modal__place-extra-bet`
  );
  const raiseTheRoofBtn = document.querySelector(
    `.btn-extra-bet-modal__raise-the-roof`
  );

  placeExtraBetBtn.style.display = `inline-block`;
  raiseTheRoofBtn.style.display = `none`;

  titleField.textContent = `Extra Bet Blackjack`;
  bankField.textContent = gameState.bank;
  baseBetField.textContent = gameState.betObj.baseBet;
  mainContainer.dataset.sidebet = `extraBetBlackjack`;

  listeners.addExtraBetBlackjackModalListeners();
  popbox.open(`extra-bet-modal`);
}

export function updateExtraBetModalTotal(sideBetObj, gameState) {
  const bankField = document.querySelector(".extra-bet-modal__bank-value");
  const betField = document.querySelector(".extra-bet-modal__bet-value");
  const feeField = document.querySelector(`.extra-bet-modal__fee-value`);

  // let betTotal = sideBetObj.tempTotal;
  let betTotal = sideBetObj.getTempBet();
  // let bank = sideBetObj.tempBank;
  let bank = sideBetObj.getTempBank();
  let fee = sideBetObj.fee;
  let baseBet = gameState.betObj.baseBet;

  bankField.textContent = bank;
  betField.textContent = betTotal;
  feeField.textContent = fee;

  checkExtraBetChipBtnsValid(bank, betTotal, baseBet);
}

export function deactivateExtraBetModal() {
  const bankField = document.querySelector(".extra-bet-modal__bank-value");
  const betField = document.querySelector(".extra-bet-modal__bet-value");
  const feeField = document.querySelector(`.extra-bet-modal__fee-value`);
  const mainContainer = document.querySelector(`.extra-bet-modal__main`);

  bankField.textContent = 0;
  betField.textContent = 0;
  feeField.textContent = 0;

  mainContainer.dataset.sidebet = ` `;

  listeners.removeExtraBetBlackjackModalListeners();
}

export function displayHouseMoneyModal(gameState) {
  const sideBetField = document.querySelector(
    `.house-money-modal__side-bet-value`
  );
  const baseBetField = document.querySelector(
    `.house-money-modal__base-bet-value`
  );
  const winningsField = document.querySelector(
    `.house-money-modal__winnings-value`
  );
  const parlayWinningsField = document.querySelector(
    `.house-money-modal__parlay-winnings-value`
  );
  const parlayBetField = document.querySelector(
    `.house-money-modal__parlay-bet-value`
  );
  const parlayAllField = document.querySelector(
    `.house-money-modal__parlay-all-value`
  );

  let houseMoneyObj = gameState.betObj.getSideBet(`houseMoney`);
  let baseBet = gameState.betObj.baseBet;
  let sideBet = houseMoneyObj.total;
  let parlayPackage = houseMoneyObj.parlayPackage;

  sideBetField.textContent = sideBet;
  baseBetField.textContent = baseBet;
  winningsField.textContent = parlayPackage.winnings;
  parlayWinningsField.textContent = parlayPackage.parlayWinnings;
  parlayBetField.textContent = parlayPackage.parlayBet;
  parlayAllField.textContent = parlayPackage.parlayAll;

  popbox.open(`house-money-modal`);
}

export function renderGameActionBtns(btnState) {
  const hitBtn = document.querySelector(`.btn-action__hit`);
  const standBtn = document.querySelector(`.btn-action__stand`);
  const doubleDownBtn = document.querySelector(`.btn-action__doubleDown`);
  const splitBtn = document.querySelector(`.btn-action__split`);
  const surrenderBtn = document.querySelector(`.btn-action__surrender`);

  // const actionBtns = document.querySelectorAll(`.btn-action`);

  // actionBtns.forEach(function (elem) {
  //   let toggle = btnState
  // })

  btnState.hit ? toggleEnableBtn(hitBtn, true) : toggleEnableBtn(hitBtn, false);
  btnState.stand
    ? toggleEnableBtn(standBtn, true)
    : toggleEnableBtn(standBtn, false);
  btnState.doubleDown
    ? toggleEnableBtn(doubleDownBtn, true)
    : toggleEnableBtn(doubleDownBtn, false);
  btnState.split
    ? toggleEnableBtn(splitBtn, true)
    : toggleEnableBtn(splitBtn, false);
  btnState.surrender
    ? toggleEnableBtn(surrenderBtn, true)
    : toggleEnableBtn(surrenderBtn, false);

  function toggleEnableBtn(elem, boolean) {
    elem.disabled = !boolean;
  }
}

export function renderNoticeText(str) {
  const noticeField = document.querySelector(`.game-message__text`);

  noticeField.textContent = str;
}

export function activateEvenMoneyModal() {
  const modalContainer = document.querySelector(`.generic-modal__main`);
  modalContainer.innerHTML = ` `;
  const modalTitle = document.querySelector(`.generic-modal__title`);
  modalTitle.textContent = `Decide Side Bet`;
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);
  const closeBtn = document.querySelector(`.btn-generic-modal__close`);

  nextBtn.dataset.sidebet = `evenMoney`;

  nextBtn.style.display = "none";
  closeBtn.style.display = "none";

  const headingElem = document.createElement(`h1`);
  const headingText = document.createTextNode(`Even Money?`);
  headingElem.appendChild(headingText);

  const btnContainer = document.createElement(`div`);
  const acceptBetBtn = document.createElement(`button`);
  const declineBetBtn = document.createElement(`button`);

  const acceptBetContent = document.createTextNode(`Accept Bet`);
  const declineBetContent = document.createTextNode(`Decline Bet`);
  acceptBetBtn.appendChild(acceptBetContent);
  declineBetBtn.appendChild(declineBetContent);

  const outcomeElem = document.createElement(`h1`);
  const outcomeContent = document.createTextNode(` `);
  outcomeElem.classList.add(`generic-modal__outcome-text`);

  btnContainer.classList.add(`generic-modal__side-bet-title`);
  acceptBetBtn.classList.add(`btn-side-bet-action__accept-even-money`);
  acceptBetBtn.classList.add(`btn-side-bet-action`);
  declineBetBtn.classList.add(`btn-side-bet-action__decline-even-money`);
  declineBetBtn.classList.add(`btn-side-bet-action`);

  btnContainer.appendChild(acceptBetBtn);
  btnContainer.appendChild(declineBetBtn);

  modalContainer.appendChild(headingElem);
  modalContainer.appendChild(btnContainer);
  modalContainer.appendChild(outcomeElem);

  listeners.addEvenMoneyModalListeners();

  popbox.open(`generic-modal`);
}

export function activateInsuranceModal() {
  const modalContainer = document.querySelector(`.generic-modal__main`);
  modalContainer.innerHTML = ` `;
  const modalTitle = document.querySelector(`.generic-modal__title`);
  modalTitle.textContent = `Decide Side Bet`;
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);
  const closeBtn = document.querySelector(`.btn-generic-modal__close`);

  nextBtn.dataset.sidebet = `insurance`;

  nextBtn.style.display = "none";
  closeBtn.style.display = "none";

  const headingElem = document.createElement(`h1`);
  const headingText = document.createTextNode(`Insurance?`);
  headingElem.appendChild(headingText);

  const btnContainer = document.createElement(`div`);
  const acceptBetBtn = document.createElement(`button`);
  const declineBetBtn = document.createElement(`button`);

  const acceptBetContent = document.createTextNode(`Accept Bet`);
  const declineBetContent = document.createTextNode(`Decline Bet`);
  acceptBetBtn.appendChild(acceptBetContent);
  declineBetBtn.appendChild(declineBetContent);

  const outcomeElem = document.createElement(`h1`);
  const outcomeContent = document.createTextNode(` `);
  outcomeElem.appendChild(outcomeContent);
  outcomeElem.classList.add(`generic-modal__outcome-text`);

  btnContainer.classList.add(`generic-modal__side-bet-title`);
  acceptBetBtn.classList.add(`btn-side-bet-action__accept-insurance`);
  acceptBetBtn.classList.add(`btn-side-bet-action`);
  declineBetBtn.classList.add(`btn-side-bet-action__decline-insurance`);
  declineBetBtn.classList.add(`btn-side-bet-action`);

  btnContainer.appendChild(acceptBetBtn);
  btnContainer.appendChild(declineBetBtn);

  modalContainer.appendChild(headingElem);
  modalContainer.appendChild(btnContainer);
  modalContainer.appendChild(outcomeElem);

  listeners.addInsuranceModalListeners();

  popbox.open(`generic-modal`);
}

export function renderEvenMoneyOutcome(outcome) {
  const outcomeField = document.querySelector(`.generic-modal__outcome-text`);
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  nextBtn.style.display = `inline-block`;

  if (outcome == `win`) {
    outcomeField.textContent = `Dealer Blackjack, Round Over.  You win Even Money!`;
  } else {
    outcomeField.textContent = `Round Over.  You lose Even Money`;
  }
}

export function renderInsuranceOutcome(outcome) {
  const outcomeField = document.querySelector(`.generic-modal__outcome-text`);
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);

  nextBtn.style.display = `inline-block`;

  if (outcome == `win`) {
    outcomeField.textContent = `Dealer Blackjack, Round Over.  You win Insurance Bet!`;
    listeners.addInsuranceNextBtnListener(outcome);
  } else {
    outcomeField.textContent = `You lose Insurance Bet.  Round continues...`;
    listeners.addInsuranceNextBtnListener(outcome);
  }

  // listeners.removeInsuranceModalListeners();
}

export function renderSingleHandOutcome(gameState) {
  let player = gameState.player;
  let outcomePackage = player.hand.outcomePackage;
  let roundOutcome = outcomePackage.roundOutcome;
  let noticeText;

  const displayField = document.querySelector(`.generic-modal__main`);
  const displayTitle = document.querySelector(`.generic-modal__title`);
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);
  const closeBtn = document.querySelector(`.btn-generic-modal__close`);

  nextBtn.style.display = `inline-block`;
  closeBtn.style.display = `none`;

  if (roundOutcome == `win`) noticeText = `WIN!`;
  if (roundOutcome == `lose`) noticeText = `Lose`;
  if (roundOutcome == `push`) noticeText = `Push`;
  if (roundOutcome == `natural`) noticeText = `Blackjack!!!`;
  if (roundOutcome == `surrender`) noticeText = `Surrender`;

  displayTitle.textContent = `Round Outcome`;

  displayField.innerHTML = ` `;

  const roundOutcomeHeading = document.createElement(`h1`);
  const roundOutcomeHeadingContent = document.createTextNode(noticeText);
  roundOutcomeHeading.appendChild(roundOutcomeHeadingContent);

  const outcomeHeading = document.createElement(`h2`);
  const outcomeHeadingContent = document.createTextNode(
    outcomePackage.outcomeText
  );
  outcomeHeading.appendChild(outcomeHeadingContent);

  const winningsHeading = document.createElement(`h2`);
  const winningsHeadingContent = document.createTextNode(
    `Winnings: ${outcomePackage.winnings}`
  );
  winningsHeading.appendChild(winningsHeadingContent);

  // displayTitle.insertAdjacentElement(`afterend`, outcomeHeading);
  // outcomeHeading.insertAdjacentElement(`afterend`, winningsHeading);

  displayField.appendChild(roundOutcomeHeading);
  displayField.appendChild(outcomeHeading);
  displayField.appendChild(winningsHeading);

  listeners.addBaseRoundOutcomeModalListener();

  popbox.open(`generic-modal`);
}

export function renderSplitHandOutcome(gameState) {
  let player = gameState.player;
  let splitHands = player.splitHands;

  const displayField = document.querySelector(`.generic-modal__main`);
  const displayTitle = document.querySelector(`.generic-modal__title`);
  const nextBtn = document.querySelector(`.btn-generic-modal__next`);
  const closeBtn = document.querySelector(`.btn-generic-modal__close`);

  nextBtn.style.display = `inline-block`;
  closeBtn.style.display = `none`;

  displayTitle.textContent = `Round Outcome`;

  displayField.innerHTML = ` `;

  let handElems = splitHands.map((obj) => renderSplitOutcomeText(obj));

  handElems.forEach(function (elem, index, array) {
    // if (index == 0) noticeTitle.insertAdjacentElement(`afterend`, elem);
    // else array[index - 1].insertAdjacentElement(`afterend`, elem);
    displayField.appendChild(elem);
  });

  listeners.addBaseRoundOutcomeModalListener();

  popbox.open(`generic-modal`);

  function renderSplitOutcomeText(hand) {
    let handNum = hand.handNum;
    let roundOutcome = hand.roundOutcome;
    let outcomeText = hand.outcomePackage.outcomeText;
    let winnings = hand.outcomePackage.winnings;
    let noticeText;

    if (roundOutcome == `win`) noticeText = `WIN!`;
    if (roundOutcome == `lose`) noticeText = `Lose.`;
    if (roundOutcome == `push`) noticeText = `Push.`;
    if (roundOutcome == `natural`) noticeText = `Blackjack!!!`;
    if (roundOutcome == `surrender`) noticeText = `Surrender.`;

    const outcomeHeading = document.createElement(`h2`);
    const outcomeHeadingContent = document.createTextNode(
      `Hand ${handNum}: ${noticeText}  ${outcomeText}  Winnings: $${winnings}`
    );
    outcomeHeading.appendChild(outcomeHeadingContent);

    return outcomeHeading;
  }
}

export function displayEndingSideBetOutcome(gameState) {
  const summaryField = document.querySelector(`.summary-modal__main`);
  const summaryTitle = document.querySelector(`.summary-modal__title`);
  const closeBtn = document.querySelector(`.btn-summary-modal__close`);
  const nextBtn = document.querySelector(`.btn-summary-modal__next`);

  closeBtn.style.display = "none";
  nextBtn.style.display = `inline-block`;
  //   let buttonCountArr = [];

  summaryTitle.textContent = `Side Bet Outcome`;

  summaryField.innerHTML = ` `;

  let outcomeArr = gameState.betObj.endingOutcomePackages;
  let totalWinnings = gameState.betObj.getEndingSideBetWinnings();

  outcomeArr.forEach(function (obj) {
    let [outcomeElem, buttonCount] = createSummaryFieldElements(obj);

    //   buttonCountArr.push(buttonCount);

    summaryField.appendChild(outcomeElem);
  });

  let winningsField = document.createElement(`h1`);
  let winningsFieldContent = document.createTextNode(
    `Total Winnings: ${totalWinnings}`
  );
  winningsField.appendChild(winningsFieldContent);
  summaryField.appendChild(winningsField);

  listeners.addSummaryModalEndingDisplayHandListener(gameState);
  popbox.open(`summary-modal`);
}

export function displayTotalWinningsModal(gameState) {
  const winningsField = document.querySelector(
    `.winnings-modal__winnings-value`
  );

  winningsField.textContent = gameState.totalWinnings;

  popbox.open(`winnings-modal`);
}

export function displayWinSummaryModal(gameState) {
  const summaryField = document.querySelector(`.summary-modal__main`);
  const summaryTitle = document.querySelector(`.summary-modal__title`);
  const closeBtn = document.querySelector(`.btn-summary-modal__close`);
  const nextBtn = document.querySelector(`.btn-summary-modal__next`);

  let initialOutcomePackages = gameState.betObj.initialOutcomePackages;
  let endingOutcomePackages = gameState.betObj.endingOutcomePackages;

  closeBtn.style.display = "inline-block";
  nextBtn.style.display = `none`;

  summaryTitle.textContent = `Win Summary`;

  summaryField.innerHTML = ` `;

  let baseGameDiv = createBaseGameSummaryElements(gameState);

  summaryField.appendChild(baseGameDiv);

  if (initialOutcomePackages)
    initialOutcomePackages.forEach(generateSummaryElements);

  if (endingOutcomePackages)
    endingOutcomePackages.forEach(generateSummaryElements);

  function generateSummaryElements(outcomeObj) {
    let sideBetDiv = createSideBetSummaryElements(outcomeObj);

    summaryField.appendChild(sideBetDiv);
  }

  popbox.open(`summary-modal`);
}

function createSideBetSummaryElements(outcomeObj) {
  let { name, outcome, payout, winCondition, winnings } = outcomeObj;

  const newDiv = document.createElement(`div`);

  const nameSpan = document.createElement(`span`);
  const nameSpanContent = document.createTextNode(`${name}`);
  nameSpan.appendChild(nameSpanContent);

  const outcomeDiv = document.createElement(`div`);
  outcomeDiv.classList.add(`summary-modal__outcome--${outcome}`);
  outcomeDiv.style.display = `inline-block`;
  let outcomeDivContent = document.createTextNode(`${outcome} `);
  outcomeDiv.appendChild(outcomeDivContent);

  const payoutSpan = document.createElement(`span`);
  const payoutSpanContent = document.createTextNode(`Payout: ${payout}`);
  payoutSpan.appendChild(payoutSpanContent);

  const winConditionSpan = document.createElement(`span`);
  const winConditionSpanContent = document.createTextNode(`${winCondition}`);
  winConditionSpan.appendChild(winConditionSpanContent);

  const winningsSpan = document.createElement(`span`);
  const winningsSpanContent = document.createTextNode(`+ $${winnings}`);
  winningsSpan.appendChild(winningsSpanContent);

  newDiv.appendChild(nameSpan);
  newDiv.appendChild(outcomeDiv);
  newDiv.appendChild(payoutSpan);
  payoutSpan.insertAdjacentHTML(`afterend`, `<br>`);
  newDiv.appendChild(winConditionSpan);
  newDiv.appendChild(winningsSpan);

  return newDiv;
}

function createBaseGameSummaryElements(gameState) {
  let player = gameState.player;
  let activeHand = player.currentSplitHand;
  let outcomeObj;
  let blackjackPayout = gameState.options.blackjackPayout;

  const newDiv = document.createElement(`div`);

  const roundLabel = document.createElement(`span`);
  let roundLabelContent = document.createTextNode(`Base Round`);
  roundLabel.appendChild(roundLabelContent);

  newDiv.appendChild(roundLabel);
  roundLabel.insertAdjacentHTML(`afterend`, `<br>`);

  if (activeHand == 0) {
    let hand = player.hand;
    let outcomeElem = createPlayerSummaryFieldElements(hand, blackjackPayout);

    newDiv.appendChild(outcomeElem);
  } else {
    player.splitHands.forEach(function (hand) {
      let outcomeElem = createPlayerSummaryFieldElements(hand, blackjackPayout);

      newDiv.appendChild(outcomeElem);
    });
  }

  return newDiv;
}

function createPlayerSummaryFieldElements(hand, blackjackPayout) {
  let { name, roundOutcome, winnings } = hand.outcomePackage;

  let payout;
  if (roundOutcome == `win`) payout = `2:1`;
  else if (roundOutcome == `natural`) payout = blackjackPayout;
  else if (roundOutcome == `push`) payout = `Bet Returned`;
  else if (roundOutcome == `surrender`) payout = `1/2 Bet Returned`;
  else payout = `0:0`;

  const playerDiv = document.createElement(`div`);

  const nameSpan = document.createElement(`span`);
  let nameSpanContent = document.createTextNode(`${name} `);
  nameSpan.appendChild(nameSpanContent);

  const outcomeDiv = document.createElement(`div`);
  outcomeDiv.classList.add(`summary-modal__outcome--${roundOutcome}`);
  let outcomeDivContent = document.createTextNode(`${roundOutcome} `);
  outcomeDiv.style.display = `inline-block`;
  outcomeDiv.appendChild(outcomeDivContent);

  const payoutSpan = document.createElement(`span`);
  let payoutSpanContent = document.createTextNode(`Payout: ${payout}`);
  payoutSpan.appendChild(payoutSpanContent);

  const winningsSpan = document.createElement(`span`);
  let winningsSpanContent = document.createTextNode(`+ $${winnings}`);
  winningsSpan.appendChild(winningsSpanContent);

  playerDiv.appendChild(nameSpan);
  playerDiv.appendChild(outcomeDiv);
  playerDiv.appendChild(payoutSpan);
  playerDiv.appendChild(winningsSpan);

  return playerDiv;
}

export function resetUI() {
  const dealerCardsField = document.querySelector(`.dealer-cards__container`);
  const playerCardsField = document.querySelector(`.player-cards__container`);
  const betField = document.querySelector(`.bet__value`);
  const dealerTotalField = document.querySelector(`.dealer-total__value`);
  const playerTotalField = document.querySelector(`.player-total__value`);
  const splitStageCardFields = document.querySelectorAll(`.split-stage__cards`);
  const splitStageTotalFields =
    document.querySelectorAll(`.split-stage__total`);
  const splitStageField = document.querySelector(
    `.grid__split-stages-container`
  );

  clearSideBetModal();

  toggleDoubleDownMarker(false);

  betField.textContent = 0;

  dealerCardsField.innerHTML = ` `;
  playerCardsField.innerHTML = ` `;
  splitStageCardFields.forEach(function (elem) {
    elem.innerHTML = ` `;
  });

  dealerTotalField.textContent = 0;
  playerTotalField.textContent = 0;
  splitStageTotalFields.forEach(function (elem) {
    elem.textContent = 0;
  });

  resetMessageFieldUI();

  splitStageField.style.display = `none`;

  function resetMessageFieldUI() {
    const dealerMessageText = document.querySelector(`.dealer-message__text`);
    const dealerMessageField = document.querySelector(
      `.dealer-message__container`
    );
    const playerMessageText = document.querySelector(`.player-message__text`);
    const playerMessageField = document.querySelector(
      `.player-message__container`
    );
    const splitStage1ResultField = document.querySelector(
      `.split-stage-1__result`
    );
    const splitStage2ResultField = document.querySelector(
      `.split-stage-2__result`
    );
    const splitStage3ResultField = document.querySelector(
      `.split-stage-3__result`
    );

    dealerMessageText.textContent = ` `;
    playerMessageText.textContent = ` `;
    splitStage1ResultField.textContent = ` `;
    splitStage2ResultField.textContent = ` `;
    splitStage3ResultField.textContent = ` `;

    let outcomeArr = [
      `bust`,
      `charlie`,
      `natural`,
      `stand`,
      `surrender`,
      `dealerHit`,
    ];

    outcomeArr.forEach(function (str) {
      dealerMessageField.classList.remove(`dealer-message__container--${str}`);
      playerMessageField.classList.remove(`player-message__container--${str}`);
      splitStage1ResultField.classList.remove(`split-stage-1__result--${str}`);
      splitStage2ResultField.classList.remove(`split-stage-2__result--${str}`);
      splitStage3ResultField.classList.remove(`split-stage-3__result--${str}`);
    });
  }
}

export function toggleDisplayStartNextRoundBtn(boolean) {
  const startNextRoundBtn = document.querySelector(
    `.btn-system__start-next-round`
  );

  boolean
    ? (startNextRoundBtn.style.display = `inline-block`)
    : (startNextRoundBtn.style.display = `none`);
}

export function toggleDisplayNewGameBtn(boolean) {
  const newGameBtn = document.querySelector(`.btn-system__new-game`);

  boolean
    ? (newGameBtn.style.display = `inline-block`)
    : (newGameBtn.style.display = `none`);
}

export function renderTriviaQuestion(questionObj) {
  const labelContainer = document.querySelector(
    `.trivia-modal__label-container`
  );
  const categoryField = document.querySelector(`.trivia__category`);
  const difficultyField = document.querySelector(`.trivia__difficulty`);
  const questionField = document.querySelector(`.trivia__question`);

  const answerTableItems = document.querySelectorAll(
    `.trivia-modal__answer-table-item`
  );

  toggleDisplayTriviaDifficultyBtns(false);

  labelContainer.style.display = `flex`;

  categoryField.textContent = questionObj.category;
  difficultyField.textContent = questionObj.difficulty;
  questionField.innerHTML = questionObj.question;

  console.log(questionObj.correctAnswer);

  if (questionObj.type == `multiple`) {
    renderMultipleChoiceAnswers(questionObj);
  } else {
    renderBooleanChoiceAnswers(questionObj);
  }

  function renderMultipleChoiceAnswers(questionObj) {
    const answerTableField = document.querySelector(
      `.trivia-modal__answer-table`
    );

    const multChoiceAnswerBtns = document.querySelectorAll(
      `.btn__answer-multiple`
    );

    const answerABtn = document.querySelector(`.btn__answer-a`);
    const answerBBtn = document.querySelector(`.btn__answer-b`);
    const answerCBtn = document.querySelector(`.btn__answer-c`);
    const answerDBtn = document.querySelector(`.btn__answer-d`);

    const answerAField = document.querySelector(`.trivia-modal__answer-a`);
    const answerBField = document.querySelector(`.trivia-modal__answer-b`);
    const answerCField = document.querySelector(`.trivia-modal__answer-c`);
    const answerDField = document.querySelector(`.trivia-modal__answer-d`);

    answerABtn.setAttribute(`data-ans`, questionObj.answerChoices[0]);
    answerBBtn.setAttribute(`data-ans`, questionObj.answerChoices[1]);
    answerCBtn.setAttribute(`data-ans`, questionObj.answerChoices[2]);
    answerDBtn.setAttribute(`data-ans`, questionObj.answerChoices[3]);

    answerAField.innerHTML = questionObj.answerChoices[0];
    answerBField.innerHTML = questionObj.answerChoices[1];
    answerCField.innerHTML = questionObj.answerChoices[2];
    answerDField.innerHTML = questionObj.answerChoices[3];

    multChoiceAnswerBtns.forEach(function (btn) {
      let answer = btn.getAttribute("data-ans");
      if (answer == questionObj.correctAnswer) {
        btn.classList.add("correctAnswer");
      }

      btn.style.display = `inline-block`;
    });

    answerTableField.style.display = `flex`;
  }

  function renderBooleanChoiceAnswers(questionObj) {
    const trueBtn = document.querySelector(`.btn__answer-true`);
    const falseBtn = document.querySelector(`.btn__answer-false`);
    const boolChoiceAnswerBtns =
      document.querySelectorAll(`.btn__answer-boolean`);

    if (questionObj.correctAnswer == `True`) {
      trueBtn.classList.add("correctAnswer");
      trueBtn.setAttribute(`data-ans`, `True`);
    } else {
      falseBtn.classList.add("correctAnswer");
      falseBtn.setAttribute(`data-ans`, "False");
    }

    boolChoiceAnswerBtns.forEach(function (btn) {
      btn.style.display = `inline-block`;
    });
  }
}

function toggleDisplayTriviaDifficultyBtns(toggle) {
  const triviaDifficultyBtns = document.querySelectorAll(
    `.btn__trivia-difficulty`
  );

  if (toggle) {
    triviaDifficultyBtns.forEach(function (btn) {
      btn.style.display = `inline-block`;
    });
  } else {
    triviaDifficultyBtns.forEach(function (btn) {
      btn.style.display = "none";
    });
  }
}

export function displayTriviaCorrectAnswer(questionObj) {
  const correctAnswerField = document.querySelector(
    `.trivia-modal__answer-correct-container`
  );
  const correctAnswerText = document.querySelector(
    `.trivia-modal__answer-correct`
  );

  correctAnswerField.style.display = `inline-block`;
  correctAnswerText.innerHTML = questionObj.correctAnswer;
}

export function renderTriviaCorrectAnswer() {
  const titleField = document.querySelector(`.trivia-modal__title`);

  document.querySelector(".correctAnswer").style.backgroundColor = `green`;
  titleField.textContent = `Correct Answer!`;
  titleField.style.color = `green`;
}

export function renderTriviaIncorrectAnswer(event) {
  const titleField = document.querySelector(`.trivia-modal__title`);

  document.querySelector(".correctAnswer").style.backgroundColor = `green`;
  event.target.id = `incorrectAnswer`;

  titleField.textContent = `Wrong Answer...`;
  titleField.style.color = `red`;
}

export function resetTriviaModal(answerCorrectly) {
  clearTriviaUI();
  clearAnswerBtnData(answerCorrectly);
  // toggleDisableTriviaAnswerBtns(true);
  toggleDisplayTriviaDifficultyBtns(true);
  resetTriviaBtns();
  popbox.close(`trivia-modal`);
}

function clearTriviaUI() {
  const categoryField = document.querySelector(`.trivia__category`);
  const difficultyField = document.querySelector(`.trivia__difficulty`);
  const labelContainer = document.querySelector(
    `.trivia-modal__label-container`
  );
  const questionField = document.querySelector(`.trivia__question`);
  const answerFields = document.querySelectorAll(`.trivia-modal__answer`);
  const correctAnswerField = document.querySelector(
    `.trivia-modal__answer-correct-container`
  );
  const correctAnswerText = document.querySelector(
    `.trivia-modal__answer-correct`
  );
  const answerTableField = document.querySelector(
    `.trivia-modal__answer-table`
  );
  const titleField = document.querySelector(`.trivia-modal__title`);

  categoryField.textContent = ``;
  difficultyField.textContent = ``;
  // choiceATriviaUI.innerHTML = ``;
  // choiceBTriviaUI.innerHTML = ``;
  // choiceCTriviaUI.innerHTML = ``;
  // choiceDTriviaUI.innerHTML = ``;
  correctAnswerText.innerHTML = ` `;
  labelContainer.style.display = `none`;
  correctAnswerField.style.display = `none`;
  answerTableField.style.display = `none`;
  titleField.textContent = `Hit Trivia Question`;
  titleField.style.color = `white`;
  questionField.textContent = `Select Trivia Difficulty`;

  answerFields.forEach(function (elem) {
    elem.textContent = ` `;
  });
}

function clearAnswerBtnData(answerCorrectly) {
  const multChoiceAnswerBtns = document.querySelectorAll(
    `.btn__answer-multiple`
  );

  multChoiceAnswerBtns.forEach(function (elem) {
    elem.removeAttribute(`data-ans`);
  });
  // answerABtn.removeAttribute(`data-ans`);
  // answerBBtn.removeAttribute(`data-ans`);
  // answerCBtn.removeAttribute(`data-ans`);
  // answerDBtn.removeAttribute(`data-ans`);
  // correctAnswer = ``;
  // currentTriviaDifficulty = ``;

  document.querySelector(".correctAnswer").style.backgroundColor = `grey`;
  document.querySelector(`.correctAnswer`).classList.remove(`correctAnswer`);

  if (!answerCorrectly) {
    document.querySelector(`#incorrectAnswer`).removeAttribute(`id`);
  }
}

function resetTriviaBtns() {
  const answerBtns = document.querySelectorAll(`.btn__answer`);
  toggleDisableTriviaAnswerBtns(false);

  answerBtns.forEach(function (btn) {
    btn.style.display = `none`;
  });
}

export function toggleDisableTriviaAnswerBtns(toggle) {
  const answerBtns = document.querySelectorAll(`.btn__answer`);
  if (toggle) {
    answerBtns.forEach(function (btn) {
      btn.disabled = true;
    });
  } else {
    answerBtns.forEach(function (btn) {
      btn.disabled = false;
    });
  }
}

// export function resetSideBetModal() {
//   const sideBetValueFields = document.querySelectorAll(
//     `.side-bet-modal__side-bet-value`
//   );

//   sideBetValueFields.forEach(function (elem) {
//     elem.textContent = 0;
//   });
// }

// if (document.querySelector(`#trivia-on`).value == true) options.triviaModeEnabled = true;
// if (document.querySelector(`#trivia-off`).value == true) options.triviaModeEnabled = false;
// if (document.querySelector(`#side-bet-on`).value == true) options.sideBetsEnabled = true;
// if (document.querySelector(`#side-bet-off`).value == true) options.sideBetsEnabled = false;
// if (document.querySelector(`#blackjack-2-to-1`).value == true) options.blackjackPayout = `2:1`;
// if (document.querySelector(`#blackjack-2-to-1`).value == true) options.blackjackPayout = `2:1`;

// options.triviaModeEnabled = document.querySelector(`#trivia-on`).value;
// options.sideBetsEnabled = document.querySelector(`#trivia-on`).value;
// blackjackWinnings: `3:2`,
// dealerStandsOn: `hard17`,
// deckCount: 6,
// fiveCardCharlieEnabled: true,
// doubleAfterSplitEnabled: false,
// splitAnyTensEnabled: false,
// resplittingEnabled: false,
// resplittingAcesEnabled: false,
// draw1AfterSplitAceEnabled: false,
// redoubleAfterSplitAcesEnabled: false,
// resplitAfterSplitAcesEnabled: false,
// surrenderEnabled: true,
// earlySurrenderEnabled: false,
// lateSurrenderEnabled: true,
// evenMoneyEnabled: true,

// options.
