export function openBasicBetModal(gameState) {
  const basicBetModal__BankValue = document.querySelector(
    ".basic-bet-modal__bank-value"
  );

  let bank = gameState.bank;

  basicBetModal__BankValue.textContent = bank;

  checkBasicBetChipBtnsValid(bank);

  popbox.open(`basic-bet-modal`);
}

export function updateBasicBetChipAmount(event) {
  // const basicBetModal__BankValue = document.querySelector('.basic-bet-modal__bank-value');
  const basicBetModal__BetValue = document.querySelector(
    ".basic-bet-modal__bet-value"
  );
  const chipBtnValueText = event.target.dataset.value;

  // let bank = basicBetModal__BankValue.textContent;
  let betAmountText = basicBetModal__BetValue.textContent;
  let betAmount = parseInt(betAmountText, 10);
  let chipBtnValue = parseInt(chipBtnValueText, 10);

  betAmount = betAmount + chipBtnValue;
  bank = bank - betAmount;

  basicBetModal__BetValue.textContent = betAmount;
  checkBasicBetChipBtnsValid(bank);
}

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

function enableChipBtn(element) {
  element.disabled = false;
  if (element.classList.contains(`disabled`))
    element.classList.remove("disabled");
}

function disableChipBtn(element) {
  element.disabled = true;
  element.classList.add(`disabled`);
}

export function clearBasicBetChipAmount(event, gameState) {
  document.querySelector(`.basic-bet-modal__bet-value`).textContent = 0;
}

export function collectOptions() {
  let options = {};

  let form = document.querySelector(`.options-modal__form`);
  let formData = new FormData(form);

  if (formData.get(`toggle-trivia`) == `trivia-off`)
    options.triviaModeEnabled = true;
  else options.triviaMode = true;

  if (formData.get(`toggle-side-bets`) == `side-bets-off`)
    options.sideBetsEnabled = false;
  else options.sideBets = true;

  if (formData.get(`blackjack-payout`) == `blackjack-2-to-1`)
    options.blackjackPayout = `2:1`;
  else if (formData.get(`blackjack-payout`) == `blackjack-6-to-5`)
    options.blackjackPayout = `6:5`;
  else options.blackjackPayout = `3:2`;

  if (formData.get(`dealer-stands`) == `soft16`)
    options.dealerStandsOn = `soft16`;
  else if (formData.get(`dealer-stands`) == `hard16`)
    options.dealerStandsOn = `hard16`;
  else if (formData.get(`dealer-stands`) == `soft17`)
    options.dealerStandsOn = `soft17`;
  else options.dealerStandsOn = `hard17`;

  let deckCount = formData.get(`deck-count`);
  if (deckCount) options.deckCount = deckCount;
  else options.deckCount = 6;

  if (formData.get(`disable-five-card-charlie`) == `true`)
    options.fiveCardCharlieEnabled = true;
  else options.fiveCardCharlie = false;

  if (formData.get(`split-any-ten`) == `true`)
    options.splitAnyTensEnabled = true;
  else options.splitAnyTens = false;

  if (formData.get(`double-after-split`) == `true`)
    options.doubleAfterSplitEnabled = true;
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
}
