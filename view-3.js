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

  let betTotal = gameState.betObj.tempBaseBet;
  let bank = gameState.betObj.tempBank;

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

  elem.classList.add(`side-bet-modal__active-bet`);
  elemBetField.classList.add(`side-bet-modal__active-value`);
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
  let sideBetValue = sideBetObj.getTempTotal();
  let sideBetTotalValue = gameState.betObj.getTempSideBetTotalValue();
  let bank = gameState.betObj.tempBank;

  activeSideBetValueField.textContent = sideBetValue;
  sideBetTotalField.textContent = sideBetTotalValue;
  sideBetBankField.textContent = bank;
  checkSideBetChipBtnsValid(bank);
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
