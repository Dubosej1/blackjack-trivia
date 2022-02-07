import * as listeners from "./listeners.js";

export let gameActionBtns = {
  hit: document.querySelector(`.btn-action__hit`),
  stand: document.querySelector(`.btn-action__stand`),
  doubleDown: document.querySelector(`.btn-action__doubleDown`),
  split: document.querySelector(`.btn-action__split`),
  surrender: document.querySelector(`.btn-action__surrender`),

  renderBtns(btnState) {
    let changeArr = Object.entries(btnState);

    changeArr.forEach(function (arr) {
      let [key, boolean] = arr;

      this.toggleEnableBtn(this[key], boolean);
    }, this);
  },

  toggleEnableBtn(prop, boolean) {
    prop.disabled = !boolean;
  },

  toggleEventListeners(funcObj, toggle) {
    let keysArr = Object.entries(funcObj);

    keysArr.forEach(function (arr) {
      let [key, clbk] = arr;

      if (toggle == `add`) this[key].addEventListener(`click`, clbk);
      else this[key].removeEventListener(`click`, clbk);
    }, this);
  },
};

export let gameInfoFields = {
  bankField: document.querySelector(`.bank__value`),
  baseBetField: document.querySelector(`.bet__value`),
  doubleDownMarker: document.querySelector(`.round-info__double-down-marker`),

  updateBank(bank) {
    this.bankField.textContent = bank;
  },

  updateBaseBet(bet) {
    this.baseBetField.textContent = bet;
  },

  toggleDoubleDownMarker(toggle) {
    if (toggle) this.doubleDownMarker.style.display = `inline`;
    else this.doubleDownMarker.style.display = `none`;
  },
};

export let baseBetModal = {
  bankValue: document.querySelector(`.basic-bet-modal__bank-value`),
  baseBetValue: document.querySelector(`.basic-bet-modal__bet-value`),
  sideBetPlacedBtn: document.querySelector(
    `.btn-basic-bet-modal__side-bet-placed`
  ),
  chipBtns: document.querySelectorAll(`.btn-basic-bet-modal__chip`),

  enableChipBtn: enableChipBtn,
  disableChipBtn: disableChipBtn,

  //replaces openBaseBetModal
  openModal(gameState) {
    let bank = gameState.bank;

    this.bankValue.textContent = bank;

    this.checkChipBtnsValid(bank);

    popbox.open(`basic-bet-modal`);
  },

  //replace checkBasicBetChipBtnsValid
  checkChipBtnsValid(value) {
    this.chipBtns.forEach(function (btn) {
      value >= btn.dataset.value
        ? this.enableChipBtn(btn)
        : this.disableChipBtn(btn);
    }, this);
  },

  //replaces updateBaseBetModalTotal
  updateModalTotal(gameState) {
    let betTotal = gameState.betObj.getTempBaseBet();
    this.baseBetValue.textContent = betTotal;

    let bank = gameState.betObj.getTempBank();
    this.bankValue.textContent = bank;

    this.checkChipBtnsValid(bank);
  },

  //replaces updateBasicBetInfo
  updateModalInfo(gameState) {
    this.bankValue.textContent = gameState.bank;
  },

  //replaces resetBasicBetModal
  resetModal(gameState) {
    this.bankValue.textContent = gameState.bank;
    this.baseBetValue.textContent = 0;
    this.toggleSideBetPlacedBtn(false);
  },

  //replaces toggleSideBetPlacedBtn
  toggleSideBetPlacedBtn(toggle, gameState = null) {
    if (toggle) {
      const sideBetTotal = gameState.betObj.getTempSideBetTotalValue();
      this.sideBetPlacedBtn.style.display = `inline-block`;
      this.sideBetPlacedBtn.textContent = `Side Bets Placed $${sideBetTotal}`;
    } else {
      this.sideBetPlacedBtn.style.display = `none`;
      this.sideBetPlacedBtn.textContent = `Side Bets Placed`;
    }
  },
};

export let sideBetModal = {
  bankValue: document.querySelector(`.side-bet-modal__bank-value`),
  totalValue: document.querySelector(`.side-bet-modal__total-value`),
  activeBetElem: document.querySelector(`.side-bet-modal__active-bet`),
  activeValueElem: document.querySelector(`.side-bet-modal__active-value`),
  chipBtns: document.querySelectorAll(`.btn-side-bet-modal__chip`),
  activateBetBtn: document.querySelector(`.btn-side-bet-modal__activate-bet`),
  sideBetValueFields: document.querySelectorAll(
    `.side-bet-modal__side-bet-value`
  ),
  chipBtns: document.querySelectorAll(`.btn-side-bet-modal__chip`),
  enableChipBtn: enableChipBtn,
  disableChipBtn: disableChipBtn,

  //replaces updateSideBetModalInfo
  updateModalInfo(gameState) {
    this.bankValue.textContent = gameState.betObj.tempValue.bank;
  },

  //replaces clearSideBetModal
  clearModal(gameState) {
    this.totalValue.textContent = 0;
    this.bankValue.textContent = 0;
    this.sideBetValueFields.forEach(function (elem) {
      elem.textContent = 0;
    });
  },

  //replaces resetSideBetModal
  resetModal(gameState) {
    const bank = gameState.betObj.getTempBank();

    this.totalValue.textContent = 0;
    this.bankValue.textContent = bank;
    this.sideBetValueFields.forEach(function (elem) {
      elem.textContent = 0;
    });
  },

  //replaces updateSideBetModalTotals
  updateModalTotals(sideBet, gameState) {
    let sideBetObj = gameState.betObj.getSideBet(sideBet);
    let sideBetValue = sideBetObj.getTempBet();
    let sideBetTotalValue = gameState.betObj.getTempSideBetTotalValue();
    let bank = gameState.betObj.getTempBank();

    this.activeValueElem.textContent = sideBetValue;
    this.totalValue.textContent = sideBetTotalValue;
    this.bankValue.textContent = bank;
    this.checkChipBtnsValid(bank);
  },

  collectSideBet() {
    const elem = document.querySelector(`.side-bet-modal__active-bet`);

    const sideBet = elem.dataset.sidebet;
    return sideBet;
  },

  activateSideBetSelectedText(sideBet) {
    switch (sideBet) {
      case "extraBetBlackjack":
        document.querySelector(
          `.extra-bet-blackjack__value`
        ).textContent = `Activated`;
        break;
      default:
        console.log(`ERROR: activateSideBetSelectedText`);
    }
  },

  addActiveElementToBetContainer(event) {
    removeActiveFieldClasses(this);

    const elem = event.target.closest(`.side-bet-modal__side-bet-div`);
    const elemBetField = elem.querySelector(`.side-bet-modal__side-bet-value`);

    if (elem.dataset.betType == `no-chip`) toggleActivateSideBetBtn(true, this);
    else toggleActivateSideBetBtn(false, this);

    elem.classList.add(`side-bet-modal__active-bet`);
    elemBetField.classList.add(`side-bet-modal__active-value`);

    this.activeBetElem = elem;
    this.activeValueElem = elemBetField;

    function removeActiveFieldClasses(modalObj) {
      modalObj.activeBetElem.classList.remove(`side-bet-modal__active-bet`);
      modalObj.activeValueElem.classList.remove(`side-bet-modal__active-value`);
    }

    function toggleActivateSideBetBtn(toggle, modalObj) {
      if (toggle) {
        modalObj.chipBtns.forEach(function (elem) {
          elem.style.display = `none`;
        });
        modalObj.activateBetBtn.style.display = `inline-block`;
      } else {
        modalObj.chipBtns.forEach(function (elem) {
          elem.style.display = `inline-block`;
        });
        modalObj.activateBetBtn.style.display = `none`;
      }
    }
  },

  checkChipBtnsValid(value) {
    this.chipBtns.forEach(function (btn) {
      value >= btn.dataset.value
        ? this.enableChipBtn(btn)
        : this.disableChipBtn(btn);
    }, this);
  },
};

export let sideBetPlacedModal = {
  titleField: document.querySelector(`.generic-modal__title`),
  mainContainer: document.querySelector(`.generic-modal__main`),
  nextBtn: document.querySelector(`.btn-generic-modal__next`),
  closeBtn: document.querySelector(`.btn-generic-modal__close`),
  toggleDisplayBtn: toggleDisplayBtn,

  //replaces both activateSideBetPlacedModal (true) & deactivateSideBetPlacedModal (false)
  toggleActivateModal(toggle, gameState = null) {
    let dataObj = {
      closeBtn: true,
    };

    if (toggle) {
      dataObj.titleText = `Side Bets Placed`;
      dataObj.modalText = gameState.betObj.getSideBetsPlacedModalText();
      dataObj.nextBtn = false;
    } else {
      dataObj.titleText = `Generic Modal`;
      dataObj.modalText = ` `;
      dataObj.nextBtn = true;
    }

    this.renderModalFields(dataObj);
  },

  renderModalFields(dataObj) {
    this.titleField.textContent = dataObj.titleText;
    this.mainContainer.innerHTML = dataObj.modalText;

    this.toggleDisplayBtn(this.nextBtn, dataObj.nextBtn);
    this.toggleDisplayBtn(this.closeBtn, dataObj.closeBtn);
  },
};

function toggleDisplayBtn(elem, toggle) {
  toggle
    ? (elem.style.display = `inline-block`)
    : (elem.style.display = `none`);
}

// export function collectSideBet() {
//   const elem = document.querySelector(`.side-bet-modal__active-bet`);

//   const sideBet = elem.dataset.sidebet;
//   return sideBet;
// }

// export function activateSideBetSelectedText(sideBet) {
//   switch (sideBet) {
//     case "extraBetBlackjack":
//       document.querySelector(
//         `.extra-bet-blackjack__value`
//       ).textContent = `Activated`;
//       break;
//     default:
//       console.log(`ERROR: activateSideBetSelectedText`);
//   }
// }

// export function addActiveElementToBetContainer(event) {
//   const activeBetElem = document.querySelector(`.side-bet-modal__active-bet`);

//   activeBetElem.classList.remove(`side-bet-modal__active-bet`);

//   const activeValueElem = document.querySelector(
//     `.side-bet-modal__active-value`
//   );

//   activeValueElem.classList.remove(`side-bet-modal__active-value`);

//   const elem = event.target.closest(`.side-bet-modal__side-bet-div`);
//   const elemBetField = elem.querySelector(`.side-bet-modal__side-bet-value`);

//   if (elem.dataset.betType == `no-chip`) toggleActivateSideBetBtn(true);
//   else toggleActivateSideBetBtn(false);

//   elem.classList.add(`side-bet-modal__active-bet`);
//   elemBetField.classList.add(`side-bet-modal__active-value`);

//   function toggleActivateSideBetBtn(toggle) {
//     const chipBtns = document.querySelectorAll(`.btn-side-bet-modal__chip`);
//     const activateBetBtn = document.querySelector(
//       `.btn-side-bet-modal__activate-bet`
//     );

//     if (toggle) {
//       chipBtns.forEach(function (elem) {
//         elem.style.display = `none`;
//       });
//       activateBetBtn.style.display = `inline-block`;
//     } else {
//       chipBtns.forEach(function (elem) {
//         elem.style.display = `inline-block`;
//       });
//       activateBetBtn.style.display = `none`;
//     }
//   }
// }

// export function updateSideBetModalTotals(sideBet, gameState) {
//   const activeSideBetValueField = document.querySelector(
//     `.side-bet-modal__active-value`
//   );
//   const sideBetTotalField = document.querySelector(
//     `.side-bet-modal__total-value`
//   );

//   const sideBetBankField = document.querySelector(
//     `.side-bet-modal__bank-value`
//   );

//   let sideBetObj = gameState.betObj.getSideBet(sideBet);
//   let sideBetValue = sideBetObj.getTempBet();
//   let sideBetTotalValue = gameState.betObj.getTempSideBetTotalValue();
//   let bank = gameState.betObj.getTempBank();

//   activeSideBetValueField.textContent = sideBetValue;
//   sideBetTotalField.textContent = sideBetTotalValue;
//   sideBetBankField.textContent = bank;
//   checkSideBetChipBtnsValid(bank);
// }

// export function updateSideBetModalInfo(gameState) {
//   const sideBetBankField = document.querySelector(
//     `.side-bet-modal__bank-value`
//   );

//   sideBetBankField.textContent = gameState.betObj.tempValue.bank;
// }

// export function clearSideBetModal(gameState) {
//   const sideBetTotalField = document.querySelector(
//     `.side-bet-modal__total-value`
//   );

//   const sideBetBankField = document.querySelector(
//     `.side-bet-modal__bank-value`
//   );
//   const sideBetValueFields = document.querySelectorAll(
//     `.side-bet-modal__side-bet-value`
//   );

//   sideBetTotalField.textContent = 0;
//   sideBetBankField.textContent = 0;
//   sideBetValueFields.forEach(function (elem) {
//     elem.textContent = 0;
//   });
// }

// export function resetSideBetModal(gameState) {
//   const sideBetTotalField = document.querySelector(
//     `.side-bet-modal__total-value`
//   );

//   const sideBetBankField = document.querySelector(
//     `.side-bet-modal__bank-value`
//   );
//   const sideBetValueFields = document.querySelectorAll(
//     `.side-bet-modal__side-bet-value`
//   );
//   const bank = gameState.betObj.getTempBank();

//   sideBetTotalField.textContent = 0;
//   sideBetBankField.textContent = bank;
//   sideBetValueFields.forEach(function (elem) {
//     elem.textContent = 0;
//   });
// }

// export function activateSideBetsPlacedModal(gameState) {
//   const modalTitleField = document.querySelector(`.generic-modal__title`);
//   const modalTextField = document.querySelector(`.generic-modal__main`);
//   const modalNextBtn = document.querySelector(`.btn-generic-modal__next`);
//   const modalCloseBtn = document.querySelector(`.btn-generic-modal__close`);
//   modalTitleField.textContent = `Side Bets Placed`;

//   let modalText = gameState.betObj.getSideBetsPlacedModalText();
//   modalTextField.innerHTML = modalText;

//   modalNextBtn.style.display = `none`;
//   modalCloseBtn.style.display = `inline-block`;
// }

// export function deactivateSideBetsPlacedModal() {
//   const modalTitleField = document.querySelector(`.generic-modal__title`);
//   const modalTextField = document.querySelector(`.generic-modal__main`);
//   const modalNextBtn = document.querySelector(`.btn-generic-modal__next`);
//   const modalCloseBtn = document.querySelector(`.btn-generic-modal__close`);
//   modalTitleField.textContent = `Generic Modal`;

//   modalTextField.innerHTML = ` `;

//   modalNextBtn.style.display = "inline-block";
//   modalCloseBtn.style.display = `inline-block`;
// }

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

// function checkBasicBetChipBtnsValid(value) {
//   // const basicBetModal__BankValue = document.querySelector('.basic-bet-modal__bank-value');
//   const chip1 = document.querySelector(`.btn-basic-bet-modal__1`);
//   const chip5 = document.querySelector(`.btn-basic-bet-modal__5`);
//   const chip10 = document.querySelector(`.btn-basic-bet-modal__10`);
//   const chip25 = document.querySelector(`.btn-basic-bet-modal__25`);
//   const chip100 = document.querySelector(`.btn-basic-bet-modal__100`);
//   const chip500 = document.querySelector(`.btn-basic-bet-modal__500`);
//   // const bank = basicBetModal__BankValue.textContent;

//   value >= 1 ? enableChipBtn(chip1) : disableChipBtn(chip1);
//   value >= 5 ? enableChipBtn(chip5) : disableChipBtn(chip5);
//   value >= 10 ? enableChipBtn(chip10) : disableChipBtn(chip10);
//   value >= 25 ? enableChipBtn(chip25) : disableChipBtn(chip25);
//   value >= 100 ? enableChipBtn(chip100) : disableChipBtn(chip100);
//   value >= 500 ? enableChipBtn(chip500) : disableChipBtn(chip500);
// }

// function checkSideBetChipBtnsValid(value) {
//   // const basicBetModal__BankValue = document.querySelector('.basic-bet-modal__bank-value');
//   const chip1 = document.querySelector(`.btn-side-bet-modal__1`);
//   const chip5 = document.querySelector(`.btn-side-bet-modal__5`);
//   const chip10 = document.querySelector(`.btn-side-bet-modal__10`);
//   const chip25 = document.querySelector(`.btn-side-bet-modal__25`);
//   const chip100 = document.querySelector(`.btn-side-bet-modal__100`);
//   // const bank = basicBetModal__BankValue.textContent;

//   value >= 1 ? enableChipBtn(chip1) : disableChipBtn(chip1);
//   value >= 5 ? enableChipBtn(chip5) : disableChipBtn(chip5);
//   value >= 10 ? enableChipBtn(chip10) : disableChipBtn(chip10);
//   value >= 25 ? enableChipBtn(chip25) : disableChipBtn(chip25);
//   value >= 100 ? enableChipBtn(chip100) : disableChipBtn(chip100);
// }

function checkExtraBetChipBtnsValid(value, sideBet, baseBet) {
  // const basicBetModal__BankValue = document.querySelector('.basic-bet-modal__bank-value');
  const chip1 = document.querySelector(`.btn-extra-bet-modal__1`);
  const chip5 = document.querySelector(`.btn-extra-bet-modal__5`);
  const chip10 = document.querySelector(`.btn-extra-bet-modal__10`);
  const chip25 = document.querySelector(`.btn-extra-bet-modal__25`);
  const chip100 = document.querySelector(`.btn-extra-bet-modal__100`);
  const chip500 = document.querySelector(`.btn-extra-bet-modal__500`);
  // const bank = basicBetModal__BankValue.textContent;
  let maxValue = baseBet * 5;

  value >= 1 ? enableChipBtn(chip1) : disableChipBtn(chip1);
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

export const optionsModal = {
  formElem: document.querySelector(`.options-modal__form`),
  // formData,
  // options,
  // optionsTemplate: {
  //   triviaMode: [`trivia-on`, true],
  //   sideBets: [`side-bets-on`, true],
  //   blackjackPayout: [`blackjack-3-to-2`, null],
  //   dealerStandsOn: [`soft-16`, null],
  //   deckCount: [6, null],
  //   fiveCardCharlie: [`disable-five-card-charlie`, false],
  //   splitAnyTen: []
  //   doubleAfterSplit:

  // },

  get inputElems() {
    return this.formElem.querySelectorAll(`input`);
  },

  collectOptions() {
    // let options = {};
    let formData = new FormData(this.formElem);
    this.formData = formData;

    this.generateNewOptionsObj();

    return this.options;
  },

  generateNewOptionsObj() {
    this.options = {};

    this.generateOptionsProps();

    // Object.entries(this.optionsTemplate).forEach(this.forEachCallback, this);
  },

  generateOptionsProps() {
    if (this.formData.get(`toggle-trivia`) == `trivia-off`)
      this.options.triviaMode = false;
    else this.options.triviaMode = true;

    if (this.formData.get(`toggle-side-bets`) == `side-bets-off`)
      this.options.sideBets = false;
    else this.options.sideBets = true;

    if (this.formData.get(`blackjack-payout`) == `blackjack-2-to-1`)
      this.options.blackjackPayout = `2:1`;
    else if (this.formData.get(`blackjack-payout`) == `blackjack-6-to-5`)
      this.options.blackjackPayout = `6:5`;
    else this.options.blackjackPayout = `3:2`;

    if (this.formData.get(`dealer-stands`) == `soft-16`)
      this.options.dealerStandsOn = `soft16`;
    else if (this.formData.get(`dealer-stands`) == `hard-16`)
      this.options.dealerStandsOn = `hard16`;
    else if (this.formData.get(`dealer-stands`) == `hard-17`)
      this.options.dealerStandsOn = `hard17`;
    else this.options.dealerStandsOn = `soft17`;

    let deckCount = this.formData.get(`deck-count`);
    if (deckCount) this.options.deckCount = deckCount;
    else this.options.deckCount = 6;

    if (this.formData.get(`disable-five-card-charlie`) == `true`)
      this.options.fiveCardCharlie = false;
    else this.options.fiveCardCharlie = true;

    if (this.formData.get(`split-any-ten`) == `true`)
      this.options.splitAnyTens = true;
    else this.options.splitAnyTens = false;

    if (this.formData.get(`double-after-split`) == `true`)
      this.options.doubleAfterSplit = true;
    else this.options.doubleAfterSplit = false;

    if (this.formData.get(`resplit-on`) == `true`)
      this.options.resplitting = true;
    else this.options.resplitting = false;

    if (this.formData.get(`resplit-aces-on`) == `true`)
      this.options.resplitAces = true;
    else this.options.resplitAces = false;

    if (this.formData.get(`split-aces-on`) == `true`)
      this.options.splitAces = true;
    else this.options.splitAces = false;

    if (this.formData.get(`split-ace-draw-limit-on`) == `true`)
      this.options.draw1SplitAce = true;
    else this.options.draw1SplitAce = false;

    if (this.formData.get(`double-after-split-ace`) == `true`)
      this.options.doubleAfterSplitAces = true;
    else this.options.doubleAfterSplitAces = false;

    if (this.formData.get(`resplit-after-split-aces`) == `true`)
      this.options.resplitAfterSplitAces = true;
    else this.options.resplitAfterSplitAces = false;

    if (this.formData.get(`disable-surrender`) == `true`)
      this.options.surrenderEnabled = false;
    else this.options.surrenderEnabled = true;

    if (this.formData.get(`surrender-options`) == `early-surrender`)
      this.options.surrenderType = `early`;
    else this.options.surrenderType = `late`;

    if (this.formData.get(`disable-insurance`) == `true`)
      this.options.insuranceEnabled = false;
    else this.options.insuranceEnabled = true;

    if (this.formData.get(`disable-even-money`) == `true`)
      this.options.evenMoneyEnabled = false;
    else this.options.evenMoneyEnabled = true;
  },

  doubleAfterSplitAcesHandler(event) {
    if (!event.target.checked) return;

    optionsModal.inputElems.forEach(function (elem) {
      if (elem.id == `double-after-split`) elem.checked = true;
      if (elem.id == `split-aces-on`) elem.checked = true;
      if (elem.id == `split-ace-draw-limit-on`) elem.checked = true;
    });
  },

  draw1AfterSplitAcesHandler(event) {
    if (!event.target.checked) return;

    optionsModal.inputElems.forEach(function (elem) {
      if (elem.id == `double-after-split-ace`) elem.checked = false;
      if (elem.id == `split-aces-on`) elem.checked = true;
    });
  },

  resplitAcesHandler(event) {
    if (!event.target.checked) return;

    optionsModal.inputElems.forEach(function (elem) {
      if (elem.id == `resplit-on`) elem.checked = true;
      if (elem.id == `split-aces-on`) elem.checked = true;
    });
  },

  resplitAfterSplitAcesHandler(event) {
    if (!event.target.checked) return;

    optionsModal.inputElems.forEach(function (elem) {
      if (elem.id == `resplit-on`) elem.checked = true;
      if (elem.id == `split-aces-on`) elem.checked = true;
    });
  },

  disableSurrenderHandler(event) {
    // if (event.target.checked) return;

    optionsModal.inputElems.forEach(function (elem) {
      // if (elem.id != `early-surrender` || elem.id != `late-surrender`)
      let guard = xor(
        elem.id != `early-surrender`,
        elem.id != `late-surrender`
      );
      if (!guard) return;

      if (event.target.checked) optionsModal.toggleDisableInputElem(elem, true);
      else optionsModal.toggleDisableInputElem(elem, false);
    });

    function xor(a, b) {
      return (a || b) && !(a && b);
    }
  },

  toggleDisableInputElem(elem, toggle) {
    elem.disabled = toggle;
  },

  resetOptionsMenuInputs(event) {
    optionsModal.inputElems.forEach(checkDefaultOptions);

    function checkDefaultOptions(elem) {
      switch (elem.id) {
        case `trivia-on`:
          elem.checked = true;
          break;
        case `side-bets-on`:
          elem.checked = true;
          break;
        case `blackjack-3-to-2`:
          elem.checked = true;
          break;
        case `soft-17`:
          elem.checked = true;
          break;
        case `six-deck`:
          elem.checked = true;
          break;
        case `disable-surrender`:
          elem.checked = false;
          document.querySelector(`#early-surrender`).disabled = false;
          document.querySelector(`#late-surrender`).disabled = false;
          break;
        case `late-surrender`:
          elem.checked = true;
          break;
        default:
          elem.checked = false;
      }
    }
  },

  // forEachCallback(item) {
  //   let [key, value] = item;
  //   let result;

  //   if (key == `blackjack-payout`) result = this.getBlackjackPayout();
  //   else if (key == `dealerStandsOn`) result = this.getDealerStandsOn();
  //   else result = this.checkFormValueExists(value);

  //   this.options[key] = result;
  // },

  // checkFormValueExists(value) {
  //   let arr = this.formData.values();
  //   let valuesArr = Array.from(arr);

  //   return valuesArr.includes(value);
  // },

  // getBlackjackPayout() {
  //   let valuesArr = this.formData.values();
  //   let result;

  //   let compareArr = [
  //     [`blackjack-2-to-1`, `2:1`],
  //     [`blackjack-3-to-2`, `3:2`],
  //     [`blackjack-6-to-5`, `6:5`],
  //   ];

  //   compareArr.forEach(function (item) {
  //     let [formValue, payout] = item;

  //     if (valuesArr.includes(formValue)) result = payout;
  //   });

  //   return result;
  // },

  // getDealerStandsOn() {
  //   let valuesArr = this.formData.values();
  //   let result;

  //   let compareArr = [
  //     [`soft-16`, `soft16`],
  //     [`hard-16`, `hard16`],
  //     [`soft-17`, `soft17`],
  //     [`hard-17`, `hard17`],
  //   ];

  //   compareArr.forEach(function (item) {
  //     let [formValue, payout] = item;

  //     if (valuesArr.includes(formValue)) result = payout;
  //   });

  //   return result;
  // },
};

// export function collectOptions() {
//   let options = {};

//   let form = document.querySelector(`.options-modal__form`);
//   let formData = new FormData(form);

//   if (formData.get(`toggle-trivia`) == `trivia-off`) options.triviaMode = false;
//   else options.triviaMode = true;

//   if (formData.get(`toggle-side-bets`) == `side-bets-off`)
//     options.sideBets = false;
//   else options.sideBets = true;

//   if (formData.get(`blackjack-payout`) == `blackjack-2-to-1`)
//     options.blackjackPayout = `2:1`;
//   else if (formData.get(`blackjack-payout`) == `blackjack-6-to-5`)
//     options.blackjackPayout = `6:5`;
//   else options.blackjackPayout = `3:2`;

//   if (formData.get(`dealer-stands`) == `soft-16`)
//     options.dealerStandsOn = `soft16`;
//   else if (formData.get(`dealer-stands`) == `hard-16`)
//     options.dealerStandsOn = `hard16`;
//   else if (formData.get(`dealer-stands`) == `hard-17`)
//     options.dealerStandsOn = `hard17`;
//   else options.dealerStandsOn = `soft17`;

//   let deckCount = formData.get(`deck-count`);
//   if (deckCount) options.deckCount = deckCount;
//   else options.deckCount = 6;

//   if (formData.get(`disable-five-card-charlie`) == `true`)
//     options.fiveCardCharlie = false;
//   else options.fiveCardCharlie = true;

//   if (formData.get(`split-any-ten`) == `true`) options.splitAnyTens = true;
//   else options.splitAnyTens = false;

//   if (formData.get(`double-after-split`) == `true`)
//     options.doubleAfterSplit = true;
//   else options.doubleAfterSplit = false;

//   if (formData.get(`resplit-on`) == `true`) options.resplitting = true;
//   else options.resplitting = false;

//   if (formData.get(`resplit-aces-on`) == `true`) options.resplitAces = true;
//   else options.resplitAces = false;

//   if (formData.get(`split-aces-on`) == `true`) options.splitAces = true;
//   else options.splitAces = false;

//   if (formData.get(`split-ace-draw-limit-on`) == `true`)
//     options.draw1SplitAce = true;
//   else options.draw1SplitAce = false;

//   if (formData.get(`double-after-split-ace`) == `true`)
//     options.doubleAfterSplitAces = true;
//   else options.doubleAfterSplitAces = false;

//   if (formData.get(`resplit-after-split-aces`) == `true`)
//     options.resplitAfterSplitAces = true;
//   else options.resplitAfterSplitAces = false;

//   if (formData.get(`disable-surrender`) == `true`)
//     options.surrenderEnabled = false;
//   else options.surrenderEnabled = true;

//   if (formData.get(`surrender-options`) == `early-surrender`)
//     options.surrenderType = `early`;
//   else options.surrenderType = `late`;

//   if (formData.get(`disable-insurance`) == `true`)
//     options.insuranceEnabled = false;
//   else options.insuranceEnabled = true;

//   if (formData.get(`disable-even-money`) == `true`)
//     options.evenMoneyEnabled = false;
//   else options.evenMoneyEnabled = true;

//   return options;
// }

// export function doubleAfterSplitAcesHandler(event) {
//   const doubleAfterSplitBox = document.querySelector(`#double-after-split`);
//   const splitAcesBox = document.querySelector(`#split-aces-on`);
//   const draw1AfterSplitAceBox = document.querySelector(
//     `#split-ace-draw-limit-on`
//   );

//   if (event.target.checked) {
//     doubleAfterSplitBox.checked = true;
//     splitAcesBox.checked = true;
//     draw1AfterSplitAceBox.checked = false;
//   }
// }

// export function draw1AfterSplitAcesHandler(event) {
//   const splitAcesBox = document.querySelector(`#split-aces-on`);
//   const doubleAfterSplitAcesBox = document.querySelector(
//     `#double-after-split-ace`
//   );

//   if (event.target.checked) {
//     splitAcesBox.checked = true;
//     doubleAfterSplitAcesBox.checked = false;
//   }
// }

// export function resplitAcesHandler(event) {
//   const resplitBox = document.querySelector(`#resplit-on`);
//   const splitAcesBox = document.querySelector(`#split-aces-on`);

//   if (event.target.checked) {
//     resplitBox.checked = true;
//     splitAcesBox.checked = true;
//   }
// }

// export function resplitAfterSplitAcesHandler(event) {
//   const resplitBox = document.querySelector(`#resplit-on`);
//   const splitAcesBox = document.querySelector(`#split-aces-on`);

//   if (event.target.checked) {
//     resplitBox.checked = true;
//     splitAcesBox.checked = true;
//   }
// }

// export function disableSurrenderHandler(event) {
//   const earlySurrenderRadio = document.querySelector(`#early-surrender`);
//   const lateSurrenderRadio = document.querySelector(`#late-surrender`);

//   if (event.target.checked) {
//     earlySurrenderRadio.disabled = true;
//     lateSurrenderRadio.disabled = true;
//   } else {
//     earlySurrenderRadio.disabled = false;
//     lateSurrenderRadio.disabled = false;
//   }
// }

// export function resetOptionsMenuInputs(event) {
//   const triviaOnRadio = document.querySelector(`#trivia-on`);
//   const sideBetsOnRadio = document.querySelector(`#side-bets-on`);
//   const blackjack3To2Radio = document.querySelector(`#blackjack-3-to-2`);
//   const dealerSoft17Radio = document.querySelector(`#soft-17`);
//   const sixDeckRadio = document.querySelector(`#six-deck`);
//   const disableFiveCharlieBox = document.querySelector(
//     `#disable-five-card-charlie`
//   );

//   const splitAnyTenBox = document.querySelector(`#split-any-ten`);

//   const doubleAfterSplitBox = document.querySelector(`#double-after-split`);
//   const resplitBox = document.querySelector(`#resplit-on`);
//   const splitAcesBox = document.querySelector(`#split-aces-on`);
//   const doubleAfterSplitAcesBox = document.querySelector(
//     `#double-after-split-ace`
//   );
//   const draw1AfterSplitAcesBox = document.querySelector(
//     `#split-ace-draw-limit-on`
//   );
//   const resplitAcesBox = document.querySelector(`#resplit-aces-on`);
//   const resplitAfterSplitAcesBox = document.querySelector(
//     `#resplit-after-split-aces`
//   );
//   const disableSurrenderBox = document.querySelector(`#disable-surrender`);
//   const earlySurrenderRadio = document.querySelector(`#early-surrender`);
//   const lateSurrenderRadio = document.querySelector(`#late-surrender`);
//   const disableInsuranceBox = document.querySelector(`#disable-insurance`);
//   const disableEvenMoneyBox = document.querySelector(`#disable-even-money`);

//   triviaOnRadio.checked = true;
//   sideBetsOnRadio.checked = true;
//   blackjack3To2Radio.checked = true;
//   dealerSoft17Radio.checked = true;
//   sixDeckRadio.checked = true;
//   disableFiveCharlieBox.checked = false;
//   splitAnyTenBox.checked = false;
//   doubleAfterSplitBox.checked = false;
//   resplitBox.checked = false;
//   splitAcesBox.checked = false;
//   doubleAfterSplitAcesBox.checked = false;
//   draw1AfterSplitAcesBox.checked = false;
//   resplitAcesBox.checked = false;
//   resplitAfterSplitAcesBox.checked = false;
//   disableInsuranceBox.checked = false;
//   disableEvenMoneyBox.checked = false;

//   if (disableSurrenderBox.checked) {
//     disableSurrenderBox.checked = false;
//     earlySurrenderRadio.disabled = false;
//     lateSurrenderRadio.disabled = false;
//   }

//   lateSurrenderRadio.checked = true;
// }
export let playerField = {
  cardsContainer: document.querySelector(".player-cards__container"),
  total: document.querySelector(".player-total__value"),
  label: document.querySelector(`.player-total__label`),
  handNum: document.querySelector(`.player-total__hand-num`),
  messageContainer: document.querySelector(`.player-message__container`),
  messageText: document.querySelector(`.player-message__text`),
  renderOutcome: renderCardHolderOutcome,
  removeOutcomeModifierClass: removeOutcomeModifierClass,

  //replaces renderPlayerField
  renderField(hand) {
    let handNum = hand.handNum;
    let finalImages = [...hand.images, ...hand.endTags];

    this.cardsContainer.innerHTML = finalImages.join(``);

    this.total.textContent = hand.total;

    if (handNum > 0) this.togglePlayerFieldLabel(handNum);
  },

  togglePlayerFieldLabel(handNum) {
    let dataObj = {};

    if (handNum == 0) {
      dataObj.playerLabel = `Player`;
      dataObj.handNumDisplay = `none`;
    } else {
      dataObj.playerLabel = `Hand `;
      dataObj.handNumDisplay = `inline`;
      dataObj.handNumText = handNum;
    }

    renderPlayerLabelField(dataObj, this);

    function renderPlayerLabelField(dataObj, gameField) {
      gameField.label.textContent = dataObj.playerLabel;
      gameField.handNum.style.display = dataObj.handNumDisplay;
      gameField.handNum.textContent = dataObj.handNumText;
    }
  },

  resetOutcomeField() {
    this.removeOutcomeModifierClass(this.messageContainer);
    this.messageText.textContent = ``;
  },
};

export let dealerField = {
  cardsContainer: document.querySelector(".dealer-cards__container"),
  total: document.querySelector(".dealer-total__value"),
  messageContainer: document.querySelector(`.dealer-message__container`),
  messageText: document.querySelector(`.dealer-message__text`),

  renderOutcome: renderCardHolderOutcome,
  removeOutcomeModifierClass: removeOutcomeModifierClass,

  renderField(hand) {
    let finalImages = [...hand.images, ...hand.endTags];

    this.cardsContainer.innerHTML = finalImages.join(``);
    this.total.textContent = hand.visibleTotal;
  },

  resetOutcomeField() {
    this.removeOutcomeModifierClass(this.messageContainer);
    this.messageText.textContent = ``;
  },
};

export let splitStageField = {
  stageContainer: document.querySelector(`.grid__split-stages-container`),
  stage1: {
    container: document.querySelector(`.split-stage-1__container`),
    handNum: document.querySelector(`.split-stage-1__hand-num`),
    cards: document.querySelector(`.split-stage-1__cards`),
    total: document.querySelector(`.split-stage-1__total`),
    result: document.querySelector(`.split-stage-1__result`),
  },

  stage2: {
    container: document.querySelector(`.split-stage-2__container`),
    handNum: document.querySelector(`.split-stage-2__hand-num`),
    cards: document.querySelector(`.split-stage-1__cards`),
    total: document.querySelector(`.split-stage-1__total`),
    result: document.querySelector(`.split-stage-2__result`),
  },

  stage3: {
    container: document.querySelector(`.split-stage-3__container`),
    handNum: document.querySelector(`.split-stage-2__hand-num`),
    cards: document.querySelector(`.split-stage-1__cards`),
    total: document.querySelector(`.split-stage-1__total`),
    result: document.querySelector(`.split-stage-3__result`),
  },
  removeOutcomeModifierClass: removeOutcomeModifierClass,

  renderOutcome(splitStageNum, outcome, outcomeText) {
    if (splitStageNum == 1)
      changeSplitStageResult(this.stage1.result, outcome, outcomeText);
    if (splitStageNum == 2)
      changeSplitStageResult(this.stage2.result, outcome, outcomeText);
    if (splitStageNum == 3)
      changeSplitStageResult(this.stage3.result, outcome, outcomeText);

    function changeSplitStageResult(elem, outcome, outcomeText) {
      elem.classList.add(`split-stage__result--${outcome}`);
      elem.textContent = outcomeText;
    }
  },

  renderStage(hand, stageNum) {
    this.stageContainer.style.display = `flex`;

    if (stageNum == 1) changeSplitStageField(this.stage1, hand, `split-1`);
    if (stageNum == 2) changeSplitStageField(this.stage2, hand, `split-2`);
    if (stageNum == 3) changeSplitStageField(this.stage3, hand, `split-3`);

    function changeSplitStageField(elemObj, hand, splitHandField) {
      let { handNum, codes, total } = hand;

      elemObj.container.style.display = `block`;
      elemObj.handNum.textContent = handNum;
      elemObj.cards.textContent = codes.join(` `);
      elemObj.total.textContent = total;
    }
  },

  resetOutcomeField(stageNum) {
    if (stageNum == 1) changeOutcomeField(this.split1.result);
    if (stageNum == 2) changeOutcomeField(this.split2.result);
    if (stageNum == 3) changeOutcomeField(this.split3.result);

    function changeOutcomeField(elem) {
      splitStageField.removeOutcomeModifierClass(elem);
      elem.textContent = ``;
    }
  },
};

function renderCardHolderOutcome(outcome, outcomeText) {
  this.messageContainer.classList.add(`--${outcome}`);
  this.messageText.textContent = outcomeText;
}

export let gameField = {
  player: playerField,
  dealer: dealerField,
  splitStages: splitStageField,

  //replaces renderPlayerHandOutcome
  renderHandOutcome(hand, field) {
    if (!hand.outcome) return;

    let outcome = hand.outcome;
    let outcomeText = chooseOutcomeText(outcome, hand);

    if (field == `player`) this.player.renderOutcome(outcome, outcomeText);
    if (field == `dealer`) this.dealer.renderOutcome(outcome, outcomeText);
    if (field == `split-stage-1`)
      this.splitStages.renderOutcome(1, outcome, outcomeText);
    if (field == `split-stage-2`)
      this.splitStages.renderOutcome(2, outcome, outcomeText);
    if (field == `split-stage-3`)
      this.splitStages.renderOutcome(3, outcome, outcomeText);

    function chooseOutcomeText(outcome, hand) {
      let outcomeText;

      if (outcome == `bust`) outcomeText = `Bust`;
      if (outcome == `charlie`)
        outcomeText = `${hand.charlieType} Card Charlie`;
      if (outcome == `natural`) outcomeText = `Blackjack!`;
      if (outcome == `stand`) outcomeText = `Stand`;
      if (outcome == `dealerHit`) outcomeText = `Hitting...`;

      return outcomeText;
    }
  },

  //replaces renderPlayerHands
  renderPlayerHands(player, reset = null) {
    let active = player.currentSplitHand;
    let count;
    if (player.type == "split player") count = player.splitHands.length;

    if (reset) this.resetOutcomeField(0);

    if (active == 0) {
      this.player.renderField(player.hand);
      this.renderHandOutcome(player.hand, `player`);
      return;
    }

    let stageOrderArr = createStageOrderArr(player, count);

    reorderStageOrderArr(stageOrderArr, active);

    renderCardFields(stageOrderArr);

    renderOutcomeFields(stageOrderArr);

    function renderCardFields(stageOrderArr) {
      gameField.player.renderField(stageOrderArr[0]);
      gameField.splitStages.renderStage(stageOrderArr[1], 1);
      if (count >= 3) gameField.splitStages.renderStage(stageOrderArr[2], 2);
      if (count == 4) gameField.splitStages.renderStage(stageOrderArr[3], 3);
    }

    function renderOutcomeFields(stageOrderArr) {
      gameField.renderHandOutcome(stageOrderArr[0], `player`);
      gameField.renderHandOutcome(stageOrderArr[1], `split-stage-1`);
      if (count >= 3)
        gameField.renderHandOutcome(stageOrderArr[2], `split-stage-2`);
      if (count == 4)
        gameField.renderHandOutcome(stageOrderArr[3], `split-stage-3`);
    }

    function createStageOrderArr(player, count) {
      let stageOrderArr = [];

      stageOrderArr.push(player.getSplitHand(1));
      stageOrderArr.push(player.getSplitHand(2));
      if (count >= 3) stageOrderArr.push(player.getSplitHand(3));
      if (count == 4) stageOrderArr.push(player.getSplitHand(4));

      return stageOrderArr;
    }

    function reorderStageOrderArr(stageOrderArr, active) {
      if (active == 1) return;
      if (active == 2) changeArrOrder(1, stageOrderArr);
      if (active == 3) changeArrOrder(2, stageOrderArr);
      if (active == 4) changeArrOrder(3, stageOrderArr);

      function changeArrOrder(index, arr) {
        let handArr = arr.splice(index, 1);
        arr.unshift(handArr[0]);
      }
    }
  },

  //replaces resetOutcomeField
  resetOutcomeField(stageNum) {
    if (stageNum == 0) this.player.resetOutcomeField();
    if (stageNum == 10) this.dealer.resetOutcomeField();
    if (stageNum == 1) this.splitStages.resetOutcomeField(1);
    if (stageNum == 2) this.splitStages.resetOutcomeField(2);
    if (stageNum == 3) this.splitStages.resetOutcomeField(3);
  },
};

function removeOutcomeModifierClass(elem) {
  let classesArr = [`natural`, `bust`, `charlie`, `stand`];

  classesArr.forEach(function (str) {
    elem.classList.remove(`--${str}`);
  });
}

// export function renderPlayerHands(player, reset = null) {
//   let active = player.currentSplitHand;
//   let count;
//   if (player.type == "split player") count = player.splitHands.length;

//   if (reset) resetOutcomeField(0);

//   if (active == 0) {
//     renderPlayerField(player.hand);
//     return;
//   }
//   let splitHand1, splitHand2, splitHand3, splitHand4;

//   splitHand1 = player.getSplitHand(1);
//   splitHand2 = player.getSplitHand(2);
//   if (count >= 3) splitHand3 = player.getSplitHand(3);
//   if (count == 4) splitHand4 = player.getSplitHand(4);

//   switch (active) {
//     case 1:
//       renderPlayerField(splitHand1);
//       if (count == 4) renderSplitStage(splitHand4, 3);
//       if (count >= 3) renderSplitStage(splitHand3, 2);
//       if (count >= 2) renderSplitStage(splitHand2, 1);
//       break;
//     case 2:
//       renderPlayerField(splitHand2);
//       renderSplitStage(splitHand1, 1);
//       if (count == 4) renderSplitStage(splitHand4, 3);
//       if (count >= 3) renderSplitStage(splitHand3, 2);
//       break;
//     case 3:
//       renderPlayerField(splitHand3);
//       renderSplitStage(splitHand1, 1);
//       renderSplitStage(splitHand2, 2);
//       if (count == 4) renderSplitStage(splitHand4, 3);
//       break;
//     case 4:
//       renderPlayerField(splitHand4);
//       renderSplitStage(splitHand1, 1);
//       renderSplitStage(splitHand2, 2);
//       renderSplitStage(splitHand3, 3);
//       break;
//     default:
//       console.log(`ERROR: Rendering split hands to view`);
//   }
// }

// export function renderPlayerHandOutcome(hand, field) {
//   let outcome = hand.outcome;
//   let outcomeText;

//   if (outcome == `bust`) outcomeText = `Bust`;
//   if (outcome == `charlie`) outcomeText = `${hand.charlieType} Card Charlie`;
//   if (outcome == `natural`) outcomeText = `Blackjack!`;
//   if (outcome == `stand`) outcomeText = `Stand`;
//   if (outcome == `dealerHit`) outcomeText = `Hitting...`;

//   switch (field) {
//     case `player`:
//       document
//         .querySelector(`.player-message__container`)
//         .classList.add(`player-message__container--${outcome}`);
//       document.querySelector(`.player-message__text`).textContent = outcomeText;
//       break;
//     case `split-1`:
//       const splitStage1Result = document.querySelector(
//         `.split-stage-1__result`
//       );
//       splitStage1Result.classList.add(`split-stage-1__result--${outcome}`);
//       splitStage1Result.textContent = outcomeText;
//       break;
//     case `split-2`:
//       const splitStage2Result = document.querySelector(
//         `.split-stage-2__result`
//       );
//       splitStage2Result.classList.add(`split-stage-2__result--${outcome}`);
//       splitStage2Result.textContent = outcomeText;
//       break;
//     case `split-3`:
//       const splitStage3Result = document.querySelector(
//         `.split-stage-3__result`
//       );
//       splitStage3Result.classList.add(`split-stage-3__result--${outcome}`);
//       splitStage3Result.textContent = outcomeText;
//       break;
//     case `dealer`:
//       document
//         .querySelector(`.dealer-message__container`)
//         .classList.add(`dealer-message__container--${outcome}`);
//       document.querySelector(`.dealer-message__text`).textContent = outcomeText;
//       break;
//     default:
//       console.log(`ERROR: Rendering Outcome Fields`);
//   }
// }

// export function resetOutcomeField(stageNum) {
//   const playerMessageContainer = document.querySelector(
//     `.player-message__container`
//   );
//   const playerMessageText = document.querySelector(`.player-message__text`);
//   const splitStage1Result = document.querySelector(`.split-stage-1__result`);
//   const splitStage2Result = document.querySelector(`.split-stage-2__result`);
//   const splitStage3Result = document.querySelector(`.split-stage-3__result`);
//   const dealerMessageContainer = document.querySelector(
//     `.dealer-message__container`
//   );
//   const dealerMessageText = document.querySelector(`.dealer-message__text`);

//   switch (stageNum) {
//     case 0:
//       removeOutcomeModifierClasses(playerMessageContainer);
//       playerMessageText.textContent = ``;
//       break;
//     case 10:
//       removeOutcomeModifierClasses(dealerMessageContainer);
//       dealerMessageText.textContent = ``;
//       break;
//     case 1:
//       removeOutcomeModifierClasses(splitStage1Result);
//       splitStage1Result.textContent = ``;
//       break;
//     case 2:
//       removeOutcomeModifierClasses(splitStage2Result);
//       splitStage2Result.textContent = ``;
//       break;
//     case 3:
//       removeOutcomeModifierClasses(splitStage3Result);
//       splitStage3Result.textContent = ``;
//       break;
//     default:
//       removeOutcomeModifierClasses(splitStage1Result);
//       splitStage1Result.textContent = ``;

//       removeOutcomeModifierClasses(splitStage2Result);
//       splitStage2Result.textContent = ``;

//       removeOutcomeModifierClasses(splitStage3Result);
//       splitStage3Result.textContent = ``;
//   }
// }

// function removeOutcomeModifierClasses(elem) {
//   let classesArr = [`natural`, `bust`, `charlie`, `stand`];

//   classesArr.forEach(function (str) {
//     elem.classList.remove(`player-message__container--${str}`);
//   });
// }

// export function renderPlayerField(hand) {
//   let handNum = hand.handNum;
//   let finalImages = [...hand.images, ...hand.endTags];

//   document.querySelector(".player-cards__container").innerHTML =
//     finalImages.join(``);
//   document.querySelector(".player-total__value").textContent = hand.total;

//   if (handNum > 0) togglePlayerFieldLabel(handNum);

//   if (hand.outcome) renderPlayerHandOutcome(hand, `player`);
// }

// function togglePlayerFieldLabel(handNum) {
//   const playerLabel = document.querySelector(`.player-total__label`);
//   const handNumField = document.querySelector(`.player-total__hand-num`);

//   if (handNum == 0) {
//     playerLabel.textContent = `Player `;
//     handNumField.style.display = `none`;
//   } else {
//     playerLabel.textContent = `Hand `;
//     handNumField.style.display = `inline`;
//     handNumField.textContent = handNum;
//   }
// }

// export function renderDealerField(hand) {
//   let finalImages = [...hand.images, ...hand.endTags];
//   document.querySelector(".dealer-cards__container").innerHTML =
//     finalImages.join(``);
//   document.querySelector(".dealer-total__value").textContent =
//     hand.visibleTotal;
// }

// export function renderSplitStage(hand, stageNum) {
//   const splitStageField = document.querySelector(
//     `.grid__split-stages-container`
//   );
//   let { handNum, codes, total } = hand;

//   splitStageField.style.display = `flex`;

//   switch (stageNum) {
//     case 1:
//       document.querySelector(
//         `.split-stage-1__container`
//       ).style.display = `block`;
//       document.querySelector(`.split-stage-1__hand-num`).textContent = handNum;
//       document.querySelector(`.split-stage-1__cards`).textContent =
//         codes.join(` `);
//       document.querySelector(`.split-stage-1__total`).textContent = total;
//       if (hand.outcome) renderPlayerHandOutcome(hand, `split-1`);
//       break;
//     case 2:
//       document.querySelector(
//         `.split-stage-2__container`
//       ).style.display = `block`;
//       document.querySelector(`.split-stage-2__hand-num`).textContent = handNum;
//       document.querySelector(`.split-stage-2__cards`).textContent =
//         codes.join(` `);
//       document.querySelector(`.split-stage-2__total`).textContent = total;
//       if (hand.outcome) renderPlayerHandOutcome(hand, `split-2`);
//       break;
//     case 3:
//       document.querySelector(
//         `.split-stage-3__container`
//       ).style.display = `block`;
//       document.querySelector(`.split-stage-3__hand-num`).textContent = handNum;
//       document.querySelector(`.split-stage-3__cards`).textContent =
//         codes.join(` `);
//       document.querySelector(`.split-stage-3__total`).textContent = total;
//       if (hand.outcome) renderPlayerHandOutcome(hand, `split-3`);
//       break;
//     default:
//       console.log(`ERROR: Rendering Split Stage`);
//   }
// }

export function toggleCheckSideBetBtn(toggle) {
  const checkSideBetBtn = document.querySelector(
    `.btn-system__check-side-bet-outcome`
  );

  toggle
    ? (checkSideBetBtn.style.display = `inline-block`)
    : (checkSideBetBtn.style.display = `none`);
}

export let sideBetOutcomeModal = {
  mainContainer: document.querySelector(`.summary-modal__main`),
  titleField: document.querySelector(`.summary-modal__title`),
  closeBtn: document.querySelector(`.btn-summary-modal__close`),
  nextBtn: document.querySelector(`.btn-summary-modal__next`),

  //replaces displayInitialSideBetOutcome and displayEndingSideBetOutcome
  displayModal(gameState, phase) {
    let betObj = gameState.betObj;

    //clears modal content from previous use
    this.clearModal();

    createSummaryField(betObj, phase);

    createWinningsField(betObj, phase);

    addCheckHandBtnListeners(gameState, phase);

    initModal();

    function initModal() {
      sideBetOutcomeModal.closeBtn.style.display = "none";
      sideBetOutcomeModal.nextBtn.style.display = `inline-block`;

      sideBetOutcomeModal.titleField.textContent = `Side Bet Outcome`;

      popbox.open(`summary-modal`);
    }

    function createSummaryField(betObj, phase) {
      let outcomeArr;

      phase == `beginning`
        ? (outcomeArr = betObj.initialOutcomePackages)
        : (outcomeArr = betObj.endingOutcomePackages);

      outcomeArr.forEach(function (obj) {
        let outcomeElem = sideBetOutcomeModal.createSummaryElements(obj);

        sideBetOutcomeModal.mainContainer.appendChild(outcomeElem);
      });
    }

    function createWinningsField(betObj, phase) {
      let totalWinnings = getWinnings(betObj, phase);

      let winningsField = document.createElement(`h1`);
      let winningsFieldContent = document.createTextNode(
        `Total Winnings: ${totalWinnings}`
      );
      winningsField.appendChild(winningsFieldContent);
      sideBetOutcomeModal.mainContainer.appendChild(winningsField);

      function getWinnings(betObj, phase) {
        let winnings;

        phase == `beginning`
          ? (winnings = betObj.getInitialSideBetWinnings())
          : (winnings = betObj.getEndingSideBetWinnings());

        return winnings;
      }
    }

    function addCheckHandBtnListeners(gameState, phase) {
      phase == `beginning`
        ? listeners.addSummaryModalDisplayHandListener(gameState)
        : listeners.addSummaryModalEndingDisplayHandListener(gameState);
    }
  },

  //replaces createSummaryFieldElements
  createSummaryElements(outcomeObj) {
    let { name, outcome, winCondition } = outcomeObj;

    const newDiv = document.createElement(`div`);

    const nameSpan = createNameElement(name);

    const outcomeDiv = createOutcomeElement(outcome);

    const winConditionSpan = createWinConditionElement(winCondition);

    newDiv.appendChild(nameSpan);
    newDiv.appendChild(outcomeDiv);
    // newDiv.appendChild(outcomeDivContent);

    if (outcome == `lose`) {
      newDiv.appendChild(winConditionSpan);
      winConditionSpan.insertAdjacentHTML(`beforebegin`, `<br>`);
      return newDiv;
    }

    let { winnings, sideBetKey } = outcomeObj;

    const checkHandBtn = createCheckHandBtnElement(sideBetKey);

    const winningsSpan = createWinningsElement(winnings);

    newDiv.appendChild(checkHandBtn);
    newDiv.appendChild(winConditionSpan);
    winConditionSpan.insertAdjacentHTML(`beforebegin`, `<br>`);
    newDiv.appendChild(winningsSpan);

    return newDiv;

    function createNameElement(name) {
      const nameSpan = document.createElement(`span`);
      let nameSpanContent = document.createTextNode(`${name} `);
      nameSpan.appendChild(nameSpanContent);

      return nameSpan;
    }

    function createOutcomeElement(outcome) {
      const outcomeDiv = document.createElement(`div`);
      outcomeDiv.classList.add(`summary-modal__outcome--${outcome}`);
      let outcomeDivContent = document.createTextNode(`${outcome} `);
      outcomeDiv.appendChild(outcomeDivContent);

      return outcomeDiv;
    }

    function createWinConditionElement(winCondition) {
      const winConditionSpan = document.createElement(`span`);
      const winConditionSpanContent = document.createTextNode(
        `${winCondition}  `
      );
      winConditionSpan.appendChild(winConditionSpanContent);

      return winConditionSpan;
    }

    function createCheckHandBtnElement(sideBetKey) {
      const checkHandBtn = document.createElement(`button`);
      checkHandBtn.classList.add(`btn-summary-modal__display-hand`);
      checkHandBtn.dataset.sideBet = sideBetKey;
      let checkHandBtnContent = document.createTextNode(`Check Hand`);
      checkHandBtn.appendChild(checkHandBtnContent);

      return checkHandBtn;
    }

    function createWinningsElement(winnings) {
      const winningsSpan = document.createElement(`span`);
      winningsSpan.classList.add(`summary-modal__winnings-value`);
      let winningsSpanContent = document.createTextNode(`${winnings}`);
      winningsSpan.appendChild(winningsSpanContent);

      return winningsSpan;
    }
  },

  clearModal() {
    this.mainContainer.innerHTML = ` `;
  },
};

// export function displayInitialSideBetOutcome(gameState) {
//   const summaryField = document.querySelector(`.summary-modal__main`);
//   const summaryTitle = document.querySelector(`.summary-modal__title`);
//   const closeBtn = document.querySelector(`.btn-summary-modal__close`);
//   const nextBtn = document.querySelector(`.btn-summary-modal__next`);

//   closeBtn.style.display = "none";
//   nextBtn.style.display = `inline-block`;

//   summaryTitle.textContent = `Side Bet Outcome`;

//   summaryField.innerHTML = ` `;

//   let outcomeArr = gameState.betObj.initialOutcomePackages;
//   let totalWinnings = gameState.betObj.getInitialSideBetWinnings();

//   outcomeArr.forEach(function (obj) {
//     let [outcomeElem, buttonCount] = createSummaryFieldElements(obj);

//     summaryField.appendChild(outcomeElem);
//   });

//   let winningsField = document.createElement(`h1`);
//   let winningsFieldContent = document.createTextNode(
//     `Total Winnings: ${totalWinnings}`
//   );
//   winningsField.appendChild(winningsFieldContent);
//   summaryField.appendChild(winningsField);

//   listeners.addSummaryModalDisplayHandListener(gameState);
//   popbox.open(`summary-modal`);
// }

// function createSummaryFieldElements(outcomeObj) {
//   const summaryField = document.querySelector(`.summary-modal__main`);
//   let buttonCount;

//   let { name, outcome, winCondition } = outcomeObj;

//   const newDiv = document.createElement(`div`);

//   const nameSpan = document.createElement(`span`);
//   let nameSpanContent = document.createTextNode(`${name} `);
//   nameSpan.appendChild(nameSpanContent);

//   const outcomeDiv = document.createElement(`div`);
//   outcomeDiv.classList.add(`summary-modal__outcome--${outcome}`);
//   let outcomeDivContent = document.createTextNode(`${outcome} `);
//   outcomeDiv.appendChild(outcomeDivContent);

//   const winConditionSpan = document.createElement(`span`);
//   const winConditionSpanContent = document.createTextNode(`${winCondition}  `);
//   winConditionSpan.appendChild(winConditionSpanContent);

//   newDiv.appendChild(nameSpan);
//   newDiv.appendChild(outcomeDiv);
//   newDiv.appendChild(outcomeDivContent);

//   if (outcome == `lose`) {

//     newDiv.appendChild(winConditionSpan);

//     winConditionSpan.insertAdjacentHTML(`beforebegin`, `<br>`);

//     buttonCount = 0;

//     return [newDiv, buttonCount];
//   }

//   let { winnings, sideBetKey } = outcomeObj;

//   const checkHandBtn = document.createElement(`button`);
//   checkHandBtn.classList.add(`btn-summary-modal__display-hand`);

//   checkHandBtn.dataset.sideBet = sideBetKey;

//   let checkHandBtnContent = document.createTextNode(`Check Hand`);
//   checkHandBtn.appendChild(checkHandBtnContent);

//   //summary-modal__winnings-value
//   const winningsSpan = document.createElement(`span`);
//   winningsSpan.classList.add(`summary-modal__winnings-value`);
//   let winningsSpanContent = document.createTextNode(`${winnings}`);
//   winningsSpan.appendChild(winningsSpanContent);

//   newDiv.appendChild(checkHandBtn);
//   newDiv.appendChild(winConditionSpan);
//   winConditionSpan.insertAdjacentHTML(`beforebegin`, `<br>`);
//   newDiv.appendChild(winningsSpan);

//   buttonCount = 1;

//   return [newDiv, buttonCount];
// }

export const winningHandModal = {
  titleField: document.querySelector(`.winning-hand-modal__title`),
  sideBetContainer: document.querySelector(
    `.winning-hand-modal__side-bet-name-container`
  ),
  sideBetNameField: document.querySelector(
    `.winning-hand-modal__side-bet-name`
  ),
  dealerContainer: document.querySelector(
    `.winning-hand-modal__dealer-cards-container`
  ),
  playerContainer: document.querySelector(
    `.winning-hand-modal__player-cards-container`
  ),
  dealerCardsField: document.querySelector(`.winning-hand-modal__dealer-cards`),
  playerCardsField: document.querySelector(`.winning-hand-modal__player-cards`),
  winningsContainer: document.querySelector(
    `.winning-hand-modal__winnings-info-container`
  ),
  payoutField: document.querySelector(`.winning-hand-modal__payout`),
  winConditionField: document.querySelector(
    `.winning-hand-modal__winning-hand-name`
  ),
  closeBtn: document.querySelector(`.btn-winning-hand-modal__close`),
  nextBtn: document.querySelector(`.btn-winning-hand-modal__next`),
  acceptEarlySurrenderBtn: document.querySelector(
    `.btn-winning-hand-modal__accept-early-surrender`
  ),
  declineEarlySurrenderBtn: document.querySelector(
    `.btn-winning-hand-modal__decline-early-surrender`
  ),

  //replaces both initialSideBetOutcomeWinHand and endingsideBetOutcomeWinHand
  displayModal(event, gameState, phase) {
    let key = event.target.dataset.sideBet;

    let outcomeObj = generateOutcomeObj(key, phase, gameState);

    this.titleField.textContent = `Winning Hand Info`;
    this.sideBetNameField.textContent = outcomeObj.name;
    this.payoutField.textContent = outcomeObj.payout;
    this.winConditionField.textContent = outcomeObj.winCondition;

    renderCardField(outcomeObj, gameState, phase);

    popbox.open(`winning-hand-modal`);

    function generateOutcomeObj(key, phase, gameState) {
      let betObj = gameState.betObj;
      let outcomeArr;

      phase == `beginning`
        ? (outcomeArr = betObj.initialOutcomePackages)
        : (outcomeArr = betObj.endingOutcomePackages);
      let [outcomeObj] = outcomeArr.filter((obj) => obj.sideBetKey == key);

      return outcomeObj;
    }

    function renderCardField(outcomeObj, gameState, phase) {
      if (outcomeObj.outcome == `lose`) return;

      outcomeObj.winHand.playersArr.includes(`dealer`)
        ? toggleDisplayField(winningHandModal.dealerContainer, true)
        : toggleDisplayField(winningHandModal.dealerContainer, false);
      outcomeObj.winHand.playersArr.includes(`player`)
        ? toggleDisplayField(winningHandModal.playerContainer, true)
        : toggleDisplayField(winningHandModal.playerContainer, false);

      if (outcomeObj.winHand.player) {
        let playerHand = gameState.player.hand;
        displayCards(winningHandModal.playerCardsField, playerHand, phase);
      }

      if (outcomeObj.winHand.dealer) {
        let dealerHand = gameState.dealer.hand;
        displayCards(winningHandModal.dealerCardsField, dealerHand, phase);
      }

      function toggleDisplayField(elem, toggle) {
        toggle ? (elem.style.display = `block`) : (elem.style.display = `none`);
      }

      function displayCards(elem, hand, phase) {
        if (phase == `ending`) hand.simpleImages[0] = hand.simpleUnrevealedCard;
        elem.innerHTML = hand.simpleImages.join();
      }
    }
  },

  resetModal() {
    this.titleField.textContent = `Winning Hand`;

    this.sideBetContainer.style.display = `block`;
    this.dealerContainer.style.display = `block`;
    this.playerContainer.style.display = `block`;
    this.winningsContainer.style.display = `block`;
    this.closeBtn.style.display = `inline`;
    this.nextBtn.style.display = `none`;
    this.acceptEarlySurrenderBtn.style.display = `none`;
    this.declineEarlySurrenderBtn.style.display = `none`;

    this.dealerCardsField.innerHTML = ` `;
    this.playerCardsField.innerHTML = ` `;
  },
};

// export function displayInitialSideBetOutcomeWinHand(event, gameState) {
//   const titleField = document.querySelector(`.winning-hand-modal__title`);
//   const sideBetNameField = document.querySelector(
//     `.winning-hand-modal__side-bet-name`
//   );
//   const dealerCardsContainer = document.querySelector(
//     `.winning-hand-modal__dealer-cards-container`
//   );
//   const playerCardsContainer = document.querySelector(
//     `.winning-hand-modal__player-cards-container`
//   );
//   const dealerCardsField = document.querySelector(
//     `.winning-hand-modal__dealer-cards`
//   );
//   const playerCardsField = document.querySelector(
//     `.winning-hand-modal__player-cards`
//   );
//   const payoutField = document.querySelector(`.winning-hand-modal__payout`);
//   const winConditionField = document.querySelector(
//     `.winning-hand-modal__winning-hand-name`
//   );

//   let outcomeArr = gameState.betObj.initialOutcomePackages;
//   let key = event.target.dataset.sideBet;

//   let [outcomeObj] = outcomeArr.filter((obj) => obj.sideBetKey == key);

//   titleField.textContent = `Winning Hand Info`;
//   sideBetNameField.textContent = outcomeObj.name;

//   if (outcomeObj.outcome != `lose`) {
//     outcomeObj.winHand.playersArr.includes(`dealer`)
//       ? (dealerCardsContainer.style.display = `block`)
//       : (dealerCardsContainer.style.display = `none`);
//     outcomeObj.winHand.playersArr.includes(`player`)
//       ? (playerCardsContainer.style.display = `block`)
//       : (playerCardsContainer.style.display = `none`);

//     if (outcomeObj.winHand.player) {
//       playerCardsField.innerHTML = gameState.player.hand.simpleImages.join();
//     }

//     if (outcomeObj.winHand.dealer) {
//       dealerCardsField.innerHTML = gameState.dealer.hand.simpleImages.join();
//     }
//   }

//   payoutField.textContent = outcomeObj.payout;
//   winConditionField.textContent = outcomeObj.winCondition;

//   popbox.open(`winning-hand-modal`);
// }

// export function displayEndingSideBetOutcomeWinHand(event, gameState) {
//   const titleField = document.querySelector(`.winning-hand-modal__title`);
//   const sideBetNameField = document.querySelector(
//     `.winning-hand-modal__side-bet-name`
//   );
//   const dealerCardsContainer = document.querySelector(
//     `.winning-hand-modal__dealer-cards-container`
//   );
//   const playerCardsContainer = document.querySelector(
//     `.winning-hand-modal__player-cards-container`
//   );
//   const dealerCardsField = document.querySelector(
//     `.winning-hand-modal__dealer-cards`
//   );
//   const playerCardsField = document.querySelector(
//     `.winning-hand-modal__player-cards`
//   );
//   const payoutField = document.querySelector(`.winning-hand-modal__payout`);
//   const winConditionField = document.querySelector(
//     `.winning-hand-modal__winning-hand-name`
//   );

//   let dealerHand = gameState.dealer.hand;

//   let outcomeArr = gameState.betObj.endingOutcomePackages;
//   let key = event.target.dataset.sideBet;

//   let [outcomeObj] = outcomeArr.filter((obj) => obj.sideBetKey == key);

//   titleField.textContent = `Winning Hand Info`;
//   sideBetNameField.textContent = outcomeObj.name;

//   if (outcomeObj.outcome != `lose`) {
//     outcomeObj.winHand.playersArr.includes(`dealer`)
//       ? (dealerCardsContainer.style.display = `block`)
//       : (dealerCardsContainer.style.display = `none`);
//     outcomeObj.winHand.playersArr.includes(`player`)
//       ? (playerCardsContainer.style.display = `block`)
//       : (playerCardsContainer.style.display = `none`);

//     if (outcomeObj.winHand.player) {
//       playerCardsField.innerHTML = gameState.player.hand.simpleImages.join();
//     }

//     if (outcomeObj.winHand.dealer) {
//       dealerHand.simpleImages[0] = dealerHand.simpleUnrevealedCard;
//       dealerCardsField.innerHTML = dealerHand.simpleImages.join();
//     }
//   }

//   payoutField.textContent = outcomeObj.payout;
//   winConditionField.textContent = outcomeObj.winCondition;

//   popbox.open(`winning-hand-modal`);
// }

export const perfect11sDiceModal = {
  title: document.querySelector(`.generic-modal__title`),
  //replaces displayField
  mainContainer: document.querySelector(`.generic-modal__main`),
  closeBtn: document.querySelector(`.btn-generic-modal__close`),
  nextBtn: document.querySelector(`.btn-generic-modal__next`),

  //replaces displayPerfect11sDiceRoll
  displayModal(diceRolls) {
    this.clearModal();

    prepareModal();

    let directionsHeading = createDirectionsElement();

    let diceContainer = createDiceElements(diceRolls);

    let stopBtn = createStopBtnElement();

    let directionsFooter = createDirectionsFooterElement();

    this.mainContainer.appendChild(directionsHeading);
    this.mainContainer.appendChild(diceContainer);
    this.mainContainer.appendChild(stopBtn);
    stopBtn.insertAdjacentHTML(`afterend`, `<br>`);
    this.mainContainer.appendChild(directionsFooter);

    listeners.addInfinityDiceStopBtnListener();
    popbox.open(`generic-modal`);

    function prepareModal() {
      perfect11sDiceModal.closeBtn.style.display = `none`;
      perfect11sDiceModal.nextBtn.style.display = `none`;

      perfect11sDiceModal.title.textContent = `Perfect 11s Dice Roll`;
    }

    function createDirectionsElement() {
      let directionsHeading = document.createElement(`h2`);
      let directionsHeadingContent = document.createTextNode(
        `Your hand is a suited 11, so you get to roll the Infinity Dice! `
      );
      directionsHeading.appendChild(directionsHeadingContent);

      return directionsHeading;
    }

    function createDiceElements(diceRolls) {
      let diceContainer = document.createElement(`div`);

      let infinityDice1 = document.createElement(`h3`);
      let infinityDice2 = document.createElement(`h3`);
      let infinityDice3 = document.createElement(`h3`);

      diceContainer.appendChild(infinityDice1);
      diceContainer.appendChild(infinityDice2);
      diceContainer.appendChild(infinityDice3);

      let diceFields = diceContainer.querySelectorAll(`h3`);

      addDataToDiceElements(diceFields, diceRolls);

      return diceContainer;

      function addDataToDiceElements(diceFields, diceRolls) {
        Array.from(diceFields).forEach(function (elem, index) {
          elem.classList.add(`infinity-dice-${index + 1}`);
          elem.classList.add(`infinity-dice`);
          elem.dataset.diceRoll = diceRolls[index];
        });
      }
    }

    function createStopBtnElement() {
      let stopBtn = document.createElement(`button`);
      stopBtn.classList.add(`btn-generic-modal__stop-dice`);
      stopBtn.dataset.diceCounter = 1;
      let stopBtnContent = document.createTextNode(`Stop Dice!`);
      stopBtn.appendChild(stopBtnContent);

      return stopBtn;
    }

    function createDirectionsFooterElement() {
      let directionsFooter = document.createElement(`h2`);
      directionsFooter.innerHTML = `Press STOP button to stop dice roll.<br>Roll 2 or more infinities to win the BONUS`;

      return directionsFooter;
    }
  },

  //replaces displayStopInfinityDice
  displayStopInfinityDice(event) {
    const dice1 = document.querySelector(`.infinity-dice-1`);
    const dice2 = document.querySelector(`.infinity-dice-2`);
    const dice3 = document.querySelector(`.infinity-dice-3`);
    const stopBtn = document.querySelector(`.btn-generic-modal__stop-dice`);

    let diceCounter = parseInt(event.target.dataset.diceCounter, 10);

    switch (diceCounter) {
      case 1:
        applyDiceRoll(dice1, diceCounter);
        increaseDiceCounter(diceCounter, stopBtn);
        break;
      case 2:
        applyDiceRoll(dice2, diceCounter);
        increaseDiceCounter(diceCounter, stopBtn);
        break;
      case 3:
        applyDiceRoll(dice3, diceCounter);
        // diceCounter++;
        changeBtnsStatus(stopBtn, this.nextBtn);
        listeners.addBeginGameDiceModalNextBtnListener();
        break;
      default:
        console.log(`Infinity Dice Roll Error`);
    }

    function applyDiceRoll(elem, diceCounter) {
      let diceRoll = elem.dataset.diceRoll;
      elem.innerHTML = `DICE ${diceCounter}: ${diceRoll}`;
    }

    function increaseDiceCounter(diceCounter, stopBtn) {
      diceCounter++;
      stopBtn.dataset.diceCounter = diceCounter;
    }

    function changeBtnsStatus(stopBtn, nextBtn) {
      stopBtn.disabled = true;
      nextBtn.style.display = `inline-block`;
    }
  },

  clearModal() {
    this.mainContainer.innerHTML = ` `;
  },
};

// export function displayPerfect11sDiceRoll(diceRolls) {
//   const modalTitle = document.querySelector(`.generic-modal__title`);
//   const displayField = document.querySelector(`.generic-modal__main`);
//   const closeBtn = document.querySelector(`.btn-generic-modal__close`);
//   const nextBtn = document.querySelector(`.btn-generic-modal__next`);

//   closeBtn.style.display = `none`;
//   nextBtn.style.display = `none`;
//   displayField.innerHTML = ` `;

//   modalTitle.textContent = `Perfect 11s Dice Roll`;

//   let directionsHeading = document.createElement(`h2`);
//   let directionsHeadingContent = document.createTextNode(
//     `Your hand is a suited 11, so you get to roll the Infinity Dice! `
//   );
//   directionsHeading.appendChild(directionsHeadingContent);

//   let diceContainer = document.createElement(`div`);

//   let infinityDice1 = document.createElement(`h3`);
//   let infinityDice2 = document.createElement(`h3`);
//   let infinityDice3 = document.createElement(`h3`);

//   let stopBtn = document.createElement(`button`);
//   stopBtn.classList.add(`btn-generic-modal__stop-dice`);
//   stopBtn.dataset.diceCounter = 1;
//   let stopBtnContent = document.createTextNode(`Stop Dice!`);
//   stopBtn.appendChild(stopBtnContent);

//   let directionsFooter = document.createElement(`h2`);
//   directionsFooter.innerHTML = `Press STOP button to stop dice roll.<br>Roll 2 or more infinities to win the BONUS`;

//   displayField.appendChild(directionsHeading);
//   displayField.appendChild(diceContainer);
//   diceContainer.appendChild(infinityDice1);
//   diceContainer.appendChild(infinityDice2);
//   diceContainer.appendChild(infinityDice3);
//   displayField.appendChild(stopBtn);
//   stopBtn.insertAdjacentHTML(`afterend`, `<br>`);
//   displayField.appendChild(directionsFooter);

//   let diceFields = diceContainer.querySelectorAll(`h3`);

//   Array.from(diceFields).forEach(function (elem, index) {
//     elem.classList.add(`infinity-dice-${index + 1}`);
//     elem.classList.add(`infinity-dice`);
//     elem.dataset.diceRoll = diceRolls[index];
//   });

//   listeners.addInfinityDiceStopBtnListener();
//   popbox.open(`generic-modal`);
// }

// export function displayStopInfinityDice(event) {
//   const dice1 = document.querySelector(`.infinity-dice-1`);
//   const dice2 = document.querySelector(`.infinity-dice-2`);
//   const dice3 = document.querySelector(`.infinity-dice-3`);
//   const stopBtn = document.querySelector(`.btn-generic-modal__stop-dice`);
//   const nextBtn = document.querySelector(`.btn-generic-modal__next`);

//   let num = parseInt(event.target.dataset.diceCounter, 10);
//   let diceRoll;

//   switch (num) {
//     case 1:
//       applyDiceRoll(dice1, num);
//       num++;
//       stopBtn.dataset.diceCounter = num;
//       break;
//     case 2:
//       applyDiceRoll(dice2, num);
//       num++;
//       stopBtn.dataset.diceCounter = num;
//       break;
//     case 3:
//       applyDiceRoll(dice3, num);
//       num++;
//       stopBtn.disabled = true;
//       nextBtn.style.display = `inline-block`;
//       listeners.addBeginGameDiceModalNextBtnListener();
//       break;
//     default:
//       console.log(`Infinity Dice Roll Error`);
//   }

//   function applyDiceRoll(elem, diceCounter) {
//     let diceRoll = elem.dataset.diceRoll;
//     elem.innerHTML = `DICE ${diceCounter}: ${diceRoll}`;
//   }
// }

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

export const houseMoneyModal = {
  sideBetField: document.querySelector(`.house-money-modal__side-bet-value`),
  baseBetField: document.querySelector(`.house-money-modal__base-bet-value`),
  valueFields: {
    winnings: document.querySelector(`.house-money-modal__winnings-value`),
    parlayWinnings: document.querySelector(
      `.house-money-modal__parlay-winnings-value`
    ),
    parlayBet: document.querySelector(`.house-money-modal__parlay-bet-value`),
    parlayAll: document.querySelector(`.house-money-modal__parlay-all-value`),
  },

  playerCardsField: document.querySelector(`.house-money-modal__player-cards`),
  winConditionField: document.querySelector(
    `.house-money-modal__win-condition`
  ),
  payoutField: document.querySelector(`.house-money-modal__payout`),

  //replaces displayHouseMoneyModal
  displayModal(gameState) {
    let houseMoneyObj = gameState.betObj.getSideBet(`houseMoney`);
    let baseBet = gameState.betObj.baseBet;
    let sideBet = houseMoneyObj.bet;
    let parlayPackage = houseMoneyObj.parlayPackage;
    let playerHand = gameState.player.hand;

    renderSideBetInfo(houseMoneyObj, playerHand);

    renderParlayInfo(sideBet, baseBet, parlayPackage);

    popbox.open(`house-money-modal`);

    function renderSideBetInfo(houseMoneyObj, playerHand) {
      houseMoneyModal.playerCardsField.innerHTML =
        playerHand.simpleImages.join();
      houseMoneyModal.winConditionField.textContent =
        houseMoneyObj.outcomePackage.winCondition;
      houseMoneyModal.payoutField.textContent =
        houseMoneyObj.outcomePackage.payout;
    }

    function renderParlayInfo(sideBet, baseBet, parlayPackage) {
      houseMoneyModal.sideBetField.textContent = sideBet;
      houseMoneyModal.baseBetField.textContent = baseBet;
      houseMoneyModal.valueFields.winnings.textContent = parlayPackage.winnings;
      houseMoneyModal.valueFields.parlayWinnings.textContent =
        parlayPackage.parlayWinnings;
      houseMoneyModal.valueFields.parlayBet.textContent =
        parlayPackage.parlayBet;
      houseMoneyModal.valueFields.parlayAll.textContent =
        parlayPackage.parlayAll;
    }
  },
};

// export function displayHouseMoneyModal(gameState) {
//   const sideBetField = document.querySelector(
//     `.house-money-modal__side-bet-value`
//   );
//   const baseBetField = document.querySelector(
//     `.house-money-modal__base-bet-value`
//   );
//   const winningsField = document.querySelector(
//     `.house-money-modal__winnings-value`
//   );
//   const parlayWinningsField = document.querySelector(
//     `.house-money-modal__parlay-winnings-value`
//   );
//   const parlayBetField = document.querySelector(
//     `.house-money-modal__parlay-bet-value`
//   );
//   const parlayAllField = document.querySelector(
//     `.house-money-modal__parlay-all-value`
//   );
//   const playerCardsField = document.querySelector(
//     `.house-money-modal__player-cards`
//   );
//   const winConditionField = document.querySelector(
//     `.house-money-modal__win-condition`
//   );
//   const payoutField = document.querySelector(`.house-money-modal__payout`);

//   let houseMoneyObj = gameState.betObj.getSideBet(`houseMoney`);
//   let baseBet = gameState.betObj.baseBet;
//   let sideBet = houseMoneyObj.bet;
//   let parlayPackage = houseMoneyObj.parlayPackage;
//   let playerHand = gameState.player.hand;

//   playerCardsField.innerHTML = playerHand.simpleImages.join();
//   winConditionField.textContent = houseMoneyObj.outcomePackage.winCondition;
//   payoutField.textContent = houseMoneyObj.outcomePackage.payout;

//   sideBetField.textContent = sideBet;
//   baseBetField.textContent = baseBet;
//   winningsField.textContent = parlayPackage.winnings;
//   parlayWinningsField.textContent = parlayPackage.parlayWinnings;
//   parlayBetField.textContent = parlayPackage.parlayBet;
//   parlayAllField.textContent = parlayPackage.parlayAll;

//   popbox.open(`house-money-modal`);
// }

// export function renderGameActionBtns(btnState) {
//   const hitBtn = document.querySelector(`.btn-action__hit`);
//   const standBtn = document.querySelector(`.btn-action__stand`);
//   const doubleDownBtn = document.querySelector(`.btn-action__doubleDown`);
//   const splitBtn = document.querySelector(`.btn-action__split`);
//   const surrenderBtn = document.querySelector(`.btn-action__surrender`);

//   // const actionBtns = document.querySelectorAll(`.btn-action`);

//   // actionBtns.forEach(function (elem) {
//   //   let toggle = btnState
//   // })

//   btnState.hit ? toggleEnableBtn(hitBtn, true) : toggleEnableBtn(hitBtn, false);
//   btnState.stand
//     ? toggleEnableBtn(standBtn, true)
//     : toggleEnableBtn(standBtn, false);
//   btnState.doubleDown
//     ? toggleEnableBtn(doubleDownBtn, true)
//     : toggleEnableBtn(doubleDownBtn, false);
//   btnState.split
//     ? toggleEnableBtn(splitBtn, true)
//     : toggleEnableBtn(splitBtn, false);
//   btnState.surrender
//     ? toggleEnableBtn(surrenderBtn, true)
//     : toggleEnableBtn(surrenderBtn, false);

//   function toggleEnableBtn(elem, boolean) {
//     elem.disabled = !boolean;
//   }
// }

export function renderNoticeText(str) {
  const noticeField = document.querySelector(`.game-message__text`);

  noticeField.textContent = str;
}

export const evenMoneyInsuranceModal = {
  modalContainer: document.querySelector(`.generic-modal__main`),
  title: document.querySelector(`.generic-modal__title`),
  nextBtn: document.querySelector(`.btn-generic-modal__next`),
  closeBtn: document.querySelector(`.btn-generic-modal__close`),

  //replaces activateEvenMoneyModal and activateInsuranceModal
  activateModal(modalType) {
    //modalType either evenMoney or insurance
    this.title.textContent = `Decide Side Bet`;

    changeModalBtnStatus(modalType);

    let headingElem = createHeadingElement(modalType);

    let btnContainer = createBtnElements(modalType);

    let outcomeElem = createOutcomeElement();

    this.modalContainer.appendChild(headingElem);
    this.modalContainer.appendChild(btnContainer);
    this.modalContainer.appendChild(outcomeElem);

    addModalBtnListeners(modalType);

    popbox.open(`generic-modal`);

    function changeModalBtnStatus(modalType) {
      evenMoneyInsuranceModal.nextBtn.dataset.sidebet = modalType;

      evenMoneyInsuranceModal.nextBtn.style.display = "none";
      evenMoneyInsuranceModal.closeBtn.style.display = "none";
    }

    function createHeadingElement(modalType) {
      const headingElem = document.createElement(`h1`);
      headingElem.classList.add(`generic-modal__side-bet-heading`);

      let text;

      modalType == `evenMoney` ? (text = `Even Money?`) : (text = `Insurance?`);

      const headingText = document.createTextNode(text);

      headingElem.appendChild(headingText);

      return headingElem;
    }

    function createBtnElements() {
      const btnContainer = document.createElement(`div`);
      btnContainer.classList.add(`generic-modal__side-bet-title`);

      let acceptBetBtn = createBtn(modalType, `Accept`);

      let declineBetBtn = createBtn(modalType, `Decline`);

      btnContainer.appendChild(acceptBetBtn);
      btnContainer.appendChild(declineBetBtn);

      return btnContainer;

      function createBtn(modalType, btnType) {
        const btn = document.createElement(`button`);

        const btnContent = document.createTextNode(`${btnType} Bet`);
        btn.appendChild(btnContent);

        let actionName = btnType.toLowerCase();

        let sideBetName;

        modalType == `evenMoney`
          ? (sideBetName = `even-money`)
          : (sideBetName = `insurance`);

        btn.classList.add(`btn-side-bet-action__${actionName}-${sideBetName}`);
        btn.classList.add(`btn-side-bet-action`);

        return btn;
      }
    }

    function createOutcomeElement() {
      const outcomeElem = document.createElement(`h1`);
      outcomeElem.classList.add(`generic-modal__outcome-text`);

      return outcomeElem;
    }

    function addModalBtnListeners(modalType) {
      if (modalType == `evenMoney`) listeners.addEvenMoneyModalListeners();
      else listeners.addInsuranceModalListeners();
    }
  },

  //replaces renderEvenMoneyOutcome and renderInsuranceOutcome
  renderOutcome(modalType, outcome, gameState) {
    const outcomeField = document.querySelector(`.generic-modal__outcome-text`);
    const headingElem = document.querySelector(
      `.generic-modal__side-bet-heading`
    );
    let dealerHand = gameState.dealer.hand;

    this.nextBtn.style.display = `inline-block`;

    gameField.renderHandOutcome(dealerHand, `dealer`);

    changeHeadingElem(headingElem, outcome, modalType);

    changeOutcomeElem(outcomeField, outcome, modalType);

    if (modalType == `insurance`)
      listeners.addInsuranceNextBtnListener(outcome);

    function changeHeadingElem(headingElem, outcome, modalType) {
      let text;
      modalType == `evenMoney` ? (text = `Even Money`) : (text = `Insurance`);
      headingElem.textContent = `You ${outcome} ${text} Bet`;
    }

    function changeOutcomeElem(outcomeField, outcome, modalType) {
      let outcomeText;
      let roundStatusText = `Ends`;

      if (outcome == `lose` && modalType == `insurance`)
        roundStatusStr = `Continues`;

      outcome == `win`
        ? (outcomeText = `Dealer Blackjack, Round Ends...`)
        : (outcomeText = `No Dealer Blackjack.  Round ${roundStatusText}...`);

      outcomeField.textContent = outcomeText;
    }
  },

  //replaces removeSideBetDecideBtns
  removeSideBetDecideBtns() {
    const btnContainer = document.querySelector(
      `.generic-modal__side-bet-title`
    );

    btnContainer.style.display = `none`;
  },

  clearModal() {
    this.modalContainer.innerHTML = ` `;
  },
};

// export function activateEvenMoneyModal() {
//   const modalContainer = document.querySelector(`.generic-modal__main`);
//   modalContainer.innerHTML = ` `;
//   const modalTitle = document.querySelector(`.generic-modal__title`);
//   modalTitle.textContent = `Decide Side Bet`;
//   const nextBtn = document.querySelector(`.btn-generic-modal__next`);
//   const closeBtn = document.querySelector(`.btn-generic-modal__close`);

//   nextBtn.dataset.sidebet = `evenMoney`;

//   nextBtn.style.display = "none";
//   closeBtn.style.display = "none";

//   const headingElem = document.createElement(`h1`);
//   const headingText = document.createTextNode(`Even Money?`);
//   headingElem.appendChild(headingText);

//   const btnContainer = document.createElement(`div`);
//   const acceptBetBtn = document.createElement(`button`);
//   const declineBetBtn = document.createElement(`button`);

//   const acceptBetContent = document.createTextNode(`Accept Bet`);
//   const declineBetContent = document.createTextNode(`Decline Bet`);
//   acceptBetBtn.appendChild(acceptBetContent);
//   declineBetBtn.appendChild(declineBetContent);

//   const outcomeElem = document.createElement(`h1`);
//   const outcomeContent = document.createTextNode(` `);
//   outcomeElem.classList.add(`generic-modal__outcome-text`);

//   headingElem.classList.add(`generic-modal__side-bet-heading`);
//   btnContainer.classList.add(`generic-modal__side-bet-title`);
//   acceptBetBtn.classList.add(`btn-side-bet-action__accept-even-money`);
//   acceptBetBtn.classList.add(`btn-side-bet-action`);
//   declineBetBtn.classList.add(`btn-side-bet-action__decline-even-money`);
//   declineBetBtn.classList.add(`btn-side-bet-action`);

//   btnContainer.appendChild(acceptBetBtn);
//   btnContainer.appendChild(declineBetBtn);

//   modalContainer.appendChild(headingElem);
//   modalContainer.appendChild(btnContainer);
//   modalContainer.appendChild(outcomeElem);

//   listeners.addEvenMoneyModalListeners();

//   popbox.open(`generic-modal`);
// }

// export function activateInsuranceModal() {
//   const modalContainer = document.querySelector(`.generic-modal__main`);
//   modalContainer.innerHTML = ` `;
//   const modalTitle = document.querySelector(`.generic-modal__title`);
//   modalTitle.textContent = `Decide Side Bet`;
//   const nextBtn = document.querySelector(`.btn-generic-modal__next`);
//   const closeBtn = document.querySelector(`.btn-generic-modal__close`);

//   nextBtn.dataset.sidebet = `insurance`;

//   nextBtn.style.display = "none";
//   closeBtn.style.display = "none";

//   const headingElem = document.createElement(`h1`);
//   const headingText = document.createTextNode(`Insurance?`);
//   headingElem.appendChild(headingText);

//   const btnContainer = document.createElement(`div`);
//   const acceptBetBtn = document.createElement(`button`);
//   const declineBetBtn = document.createElement(`button`);

//   const acceptBetContent = document.createTextNode(`Accept Bet`);
//   const declineBetContent = document.createTextNode(`Decline Bet`);
//   acceptBetBtn.appendChild(acceptBetContent);
//   declineBetBtn.appendChild(declineBetContent);

//   const outcomeElem = document.createElement(`h1`);
//   const outcomeContent = document.createTextNode(` `);
//   outcomeElem.appendChild(outcomeContent);
//   outcomeElem.classList.add(`generic-modal__outcome-text`);

//   headingElem.classList.add(`generic-modal__side-bet-heading`);
//   btnContainer.classList.add(`generic-modal__side-bet-title`);
//   acceptBetBtn.classList.add(`btn-side-bet-action__accept-insurance`);
//   acceptBetBtn.classList.add(`btn-side-bet-action`);
//   declineBetBtn.classList.add(`btn-side-bet-action__decline-insurance`);
//   declineBetBtn.classList.add(`btn-side-bet-action`);

//   btnContainer.appendChild(acceptBetBtn);
//   btnContainer.appendChild(declineBetBtn);

//   modalContainer.appendChild(headingElem);
//   modalContainer.appendChild(btnContainer);
//   modalContainer.appendChild(outcomeElem);

//   listeners.addInsuranceModalListeners();

//   popbox.open(`generic-modal`);
// }

// export function renderEvenMoneyOutcome(outcome, gameState) {
//   const outcomeField = document.querySelector(`.generic-modal__outcome-text`);
//   const nextBtn = document.querySelector(`.btn-generic-modal__next`);
//   const headingElem = document.querySelector(
//     `.generic-modal__side-bet-heading`
//   );
//   let dealerHand = gameState.dealer.hand;

//   nextBtn.style.display = `inline-block`;

//   if (outcome == `win`) {
//     headingElem.textContent = `You win Even Money!`;
//     outcomeField.textContent = `Dealer Blackjack.  Round Ends...`;
//     renderPlayerHandOutcome(dealerHand, `dealer`);
//   } else {
//     headingElem.textContent = `You lose Even Money`;
//     outcomeField.textContent = `No Dealer Blackjack.  Round Ends...`;
//   }
// }

// export function renderInsuranceOutcome(outcome, gameState) {
//   const outcomeField = document.querySelector(`.generic-modal__outcome-text`);
//   const nextBtn = document.querySelector(`.btn-generic-modal__next`);
//   const headingElem = document.querySelector(
//     `.generic-modal__side-bet-heading`
//   );
//   let dealerHand = gameState.dealer.hand;

//   nextBtn.style.display = `inline-block`;

//   if (outcome == `win`) {
//     headingElem.textContent = `You win Insurance Bet`;
//     outcomeField.textContent = `Dealer Blackjack, Round Ends...`;
//     renderPlayerHandOutcome(dealerHand, `dealer`);
//     listeners.addInsuranceNextBtnListener(outcome);
//   } else {
//     headingElem.textContent = `You lose Insurance Bet`;
//     outcomeField.textContent = `No Dealer Blackjack.  Round continues...`;
//     listeners.addInsuranceNextBtnListener(outcome);
//   }
// }

// export function removeSideBetDecideBtns() {
//   const btnContainer = document.querySelector(`.generic-modal__side-bet-title`);

//   btnContainer.style.display = `none`;
// }

export const baseRoundOutcomeModal = {
  mainContainer: document.querySelector(`.generic-modal__main`),
  titleField: document.querySelector(`.generic-modal__title`),
  nextBtn: document.querySelector(`.btn-generic-modal__next`),
  closeBtn: document.querySelector(`.btn-generic-modal__close`),

  //replaces renderSingleHandOutcome
  renderSingleHandOutcome(gameState) {
    let player = gameState.player;
    let outcomePackage = player.hand.outcomePackage;
    let roundOutcome = outcomePackage.roundOutcome;

    this.prepareModal();

    let roundOutcomeHeading = createRoundOutcomeElement(roundOutcome);

    let outcomeHeading = createOutcomeHeadingElement();

    let winningsHeading = createWinningsElement();

    this.mainContainer.appendChild(roundOutcomeHeading);
    this.mainContainer.appendChild(outcomeHeading);
    this.mainContainer.appendChild(winningsHeading);

    listeners.addBaseRoundOutcomeModalListener();

    popbox.open(`generic-modal`);

    function createRoundOutcomeElement(roundOutcome) {
      let noticeText = baseRoundOutcomeModal.createNoticeText(roundOutcome);

      const roundOutcomeHeading = document.createElement(`h1`);
      const roundOutcomeHeadingContent = document.createTextNode(noticeText);
      roundOutcomeHeading.appendChild(roundOutcomeHeadingContent);

      return roundOutcomeHeading;
    }

    function createOutcomeHeadingElement() {
      const outcomeHeading = document.createElement(`h2`);
      const outcomeHeadingContent = document.createTextNode(
        outcomePackage.outcomeText
      );
      outcomeHeading.appendChild(outcomeHeadingContent);

      return outcomeHeading;
    }

    function createWinningsElement() {
      const winningsHeading = document.createElement(`h2`);
      const winningsHeadingContent = document.createTextNode(
        `Winnings: ${outcomePackage.winnings}`
      );
      winningsHeading.appendChild(winningsHeadingContent);

      return winningsHeading;
    }
  },

  //replaces renderSplitHandOutcome
  renderSplitHandOutcome(gameState) {
    let splitHands = gameState.player.splitHands;

    this.prepareModal();

    let handElems = splitHands.map((obj) => renderSplitOutcomeText(obj));

    handElems.forEach(function (elem) {
      this.mainContainer.appendChild(elem);
    }, this);

    listeners.addBaseRoundOutcomeModalListener();

    popbox.open(`generic-modal`);

    function renderSplitOutcomeText(hand) {
      let handNum = hand.handNum;
      let roundOutcome = hand.roundOutcome;
      let outcomeText = hand.outcomePackage.outcomeText;
      let winnings = hand.outcomePackage.winnings;

      let noticeText = baseRoundOutcomeModal.createNoticeText(roundOutcome);

      const outcomeHeading = document.createElement(`h2`);
      const outcomeHeadingContent = document.createTextNode(
        `Hand ${handNum}: ${noticeText}  ${outcomeText}  Winnings: $${winnings}`
      );
      outcomeHeading.appendChild(outcomeHeadingContent);

      return outcomeHeading;
    }
  },

  clearModal() {
    this.mainContainer.innerHTML = ` `;
  },

  prepareModal() {
    this.titleField.textContent = `Round Outcome`;
    this.nextBtn.style.display = `inline-block`;
    this.closeBtn.style.display = `none`;

    this.clearModal();
  },

  createNoticeText(roundOutcome) {
    let noticeText;

    if (roundOutcome == `win`) noticeText = `WIN!`;
    if (roundOutcome == `lose`) noticeText = `Lose`;
    if (roundOutcome == `push`) noticeText = `Push`;
    if (roundOutcome == `natural`) noticeText = `Blackjack!!!`;
    if (roundOutcome == `surrender`) noticeText = `Surrender`;

    return noticeText;
  },
};

// export function renderSingleHandOutcome(gameState) {
//   let player = gameState.player;
//   let outcomePackage = player.hand.outcomePackage;
//   let roundOutcome = outcomePackage.roundOutcome;
//   let noticeText;

//   const displayField = document.querySelector(`.generic-modal__main`);
//   const displayTitle = document.querySelector(`.generic-modal__title`);
//   const nextBtn = document.querySelector(`.btn-generic-modal__next`);
//   const closeBtn = document.querySelector(`.btn-generic-modal__close`);

//   nextBtn.style.display = `inline-block`;
//   closeBtn.style.display = `none`;

//   if (roundOutcome == `win`) noticeText = `WIN!`;
//   if (roundOutcome == `lose`) noticeText = `Lose`;
//   if (roundOutcome == `push`) noticeText = `Push`;
//   if (roundOutcome == `natural`) noticeText = `Blackjack!!!`;
//   if (roundOutcome == `surrender`) noticeText = `Surrender`;

//   displayTitle.textContent = `Round Outcome`;

//   displayField.innerHTML = ` `;

//   const roundOutcomeHeading = document.createElement(`h1`);
//   const roundOutcomeHeadingContent = document.createTextNode(noticeText);
//   roundOutcomeHeading.appendChild(roundOutcomeHeadingContent);

//   const outcomeHeading = document.createElement(`h2`);
//   const outcomeHeadingContent = document.createTextNode(
//     outcomePackage.outcomeText
//   );
//   outcomeHeading.appendChild(outcomeHeadingContent);

//   const winningsHeading = document.createElement(`h2`);
//   const winningsHeadingContent = document.createTextNode(
//     `Winnings: ${outcomePackage.winnings}`
//   );
//   winningsHeading.appendChild(winningsHeadingContent);

//   displayField.appendChild(roundOutcomeHeading);
//   displayField.appendChild(outcomeHeading);
//   displayField.appendChild(winningsHeading);

//   listeners.addBaseRoundOutcomeModalListener();

//   popbox.open(`generic-modal`);
// }

// export function renderSplitHandOutcome(gameState) {
//   let player = gameState.player;
//   let splitHands = player.splitHands;

//   const displayField = document.querySelector(`.generic-modal__main`);
//   const displayTitle = document.querySelector(`.generic-modal__title`);
//   const nextBtn = document.querySelector(`.btn-generic-modal__next`);
//   const closeBtn = document.querySelector(`.btn-generic-modal__close`);

//   nextBtn.style.display = `inline-block`;
//   closeBtn.style.display = `none`;

//   displayTitle.textContent = `Round Outcome`;

//   displayField.innerHTML = ` `;

//   let handElems = splitHands.map((obj) => renderSplitOutcomeText(obj));

//   handElems.forEach(function (elem, index, array) {
//     displayField.appendChild(elem);
//   });

//   listeners.addBaseRoundOutcomeModalListener();

//   popbox.open(`generic-modal`);

//   function renderSplitOutcomeText(hand) {
//     let handNum = hand.handNum;
//     let roundOutcome = hand.roundOutcome;
//     let outcomeText = hand.outcomePackage.outcomeText;
//     let winnings = hand.outcomePackage.winnings;
//     let noticeText;

//     if (roundOutcome == `win`) noticeText = `WIN!`;
//     if (roundOutcome == `lose`) noticeText = `Lose.`;
//     if (roundOutcome == `push`) noticeText = `Push.`;
//     if (roundOutcome == `natural`) noticeText = `Blackjack!!!`;
//     if (roundOutcome == `surrender`) noticeText = `Surrender.`;

//     const outcomeHeading = document.createElement(`h2`);
//     const outcomeHeadingContent = document.createTextNode(
//       `Hand ${handNum}: ${noticeText}  ${outcomeText}  Winnings: $${winnings}`
//     );
//     outcomeHeading.appendChild(outcomeHeadingContent);

//     return outcomeHeading;
//   }
// }

// export function displayEndingSideBetOutcome(gameState) {
//   const summaryField = document.querySelector(`.summary-modal__main`);
//   const summaryTitle = document.querySelector(`.summary-modal__title`);
//   const closeBtn = document.querySelector(`.btn-summary-modal__close`);
//   const nextBtn = document.querySelector(`.btn-summary-modal__next`);

//   closeBtn.style.display = "none";
//   nextBtn.style.display = `inline-block`;
//   //   let buttonCountArr = [];

//   summaryTitle.textContent = `Side Bet Outcome`;

//   summaryField.innerHTML = ` `;

//   let outcomeArr = gameState.betObj.endingOutcomePackages;
//   let totalWinnings = gameState.betObj.getEndingSideBetWinnings();

//   outcomeArr.forEach(function (obj) {
//     let [outcomeElem, buttonCount] = createSummaryFieldElements(obj);

//     summaryField.appendChild(outcomeElem);
//   });

//   let winningsField = document.createElement(`h1`);
//   let winningsFieldContent = document.createTextNode(
//     `Total Winnings: ${totalWinnings}`
//   );
//   winningsField.appendChild(winningsFieldContent);
//   summaryField.appendChild(winningsField);

//   listeners.addSummaryModalEndingDisplayHandListener(gameState);
//   popbox.open(`summary-modal`);
// }

export function displayTotalWinningsModal(gameState) {
  const winningsField = document.querySelector(
    `.winnings-modal__winnings-value`
  );

  winningsField.textContent = gameState.totalWinnings;

  popbox.open(`winnings-modal`);
}

export const winSummaryModal = {
  mainContainer: document.querySelector(`.summary-modal__main`),
  titleField: document.querySelector(`.summary-modal__title`),
  closeBtn: document.querySelector(`.btn-summary-modal__close`),
  nextBtn: document.querySelector(`.btn-summary-modal__next`),

  //replaces displayWinSummaryModal
  displayModal(gameState) {
    this.prepareModal();

    let baseGameDiv = this.createBaseGameSummaryElements(gameState);

    this.mainContainer.appendChild(baseGameDiv);

    let initialOutcomePackages = gameState.betObj.initialOutcomePackages;
    let endingOutcomePackages = gameState.betObj.endingOutcomePackages;

    if (initialOutcomePackages)
      initialOutcomePackages.forEach(generateSummaryElements, this);

    if (endingOutcomePackages)
      endingOutcomePackages.forEach(generateSummaryElements, this);

    popbox.open(`summary-modal`);

    function generateSummaryElements(outcomeObj) {
      let sideBetDiv = winSummaryModal.createSideBetSummaryElements(outcomeObj);

      winSummaryModal.mainContainer.appendChild(sideBetDiv);
    }
  },

  //replaces createBaseGameSummaryElements
  createBaseGameSummaryElements(gameState) {
    let player = gameState.player;
    let blackjackPayout = gameState.options.blackjackPayout;
    let outcomeElem;

    const newDiv = document.createElement(`div`);

    let roundLabel = createRoundLabelElement();

    let outcomeElems = createOutcomeElems(player);

    newDiv.appendChild(roundLabel);
    roundLabel.insertAdjacentHTML(`afterend`, `<br>`);

    outcomeElems.forEach(function (elem) {
      newDiv.appendChild(elem);
    });

    return newDiv;

    function createRoundLabelElement() {
      const roundLabel = document.createElement(`span`);
      let roundLabelContent = document.createTextNode(`Base Round`);
      roundLabel.appendChild(roundLabelContent);

      return roundLabel;
    }

    function createOutcomeElems(player, blackjackPayout) {
      let activeHand = player.currentSplitHand;
      let outcomeElems = [];

      if (activeHand == 0) {
        let hand = player.hand;
        outcomeElems.push(
          winSummaryModal.createPlayerSummaryFieldElements(
            hand,
            blackjackPayout
          )
        );
      } else {
        player.splitHands.forEach(function (hand) {
          outcomeElems.push(
            this.createPlayerSummaryFieldElements(hand, blackjackPayout)
          );
        }, winSummaryModal);
      }

      return outcomeElems;
    }
  },

  //replaces createPlayerSummaryFieldElements
  createPlayerSummaryFieldElements(hand, blackjackPayout) {
    let { name, roundOutcome, winnings } = hand.outcomePackage;

    const playerDiv = document.createElement(`div`);

    let nameSpan = this.createNameElement(name);

    let outcomeDiv = this.createOutcomeElement(roundOutcome);

    let payoutSpan = createPayoutElement(roundOutcome, blackjackPayout);

    let winningsSpan = this.createWinningsElement(winnings);

    playerDiv.appendChild(nameSpan);
    playerDiv.appendChild(outcomeDiv);
    playerDiv.appendChild(payoutSpan);
    playerDiv.appendChild(winningsSpan);

    return playerDiv;

    function createPayoutElement(roundOutcome, blackjackPayout) {
      let payout = determinePayoutText(roundOutcome, blackjackPayout);

      const payoutSpan = document.createElement(`span`);
      let payoutSpanContent = document.createTextNode(`Payout: ${payout}`);
      payoutSpan.appendChild(payoutSpanContent);

      return payoutSpan;

      function determinePayoutText(roundOutcome, blackjackPayout) {
        let payout;
        if (roundOutcome == `win`) payout = `2:1`;
        else if (roundOutcome == `natural`) payout = blackjackPayout;
        else if (roundOutcome == `push`) payout = `Bet Returned`;
        else if (roundOutcome == `surrender`) payout = `1/2 Bet Returned`;
        else payout = `0:0`;

        return payout;
      }
    }
  },

  //replaces createSideBetSummaryElements
  createSideBetSummaryElements(outcomeObj) {
    let { name, outcome, payout, winCondition, winnings } = outcomeObj;

    const newDiv = document.createElement(`div`);

    let nameSpan = this.createNameElement(name);

    let outcomeDiv = this.createOutcomeElement(outcome);

    let payoutSpan = createPayoutElement(payout);

    let winConditionSpan = createWinConditionElement(winCondition);

    let winningsSpan = this.createWinningsElement(winnings);

    newDiv.appendChild(nameSpan);
    newDiv.appendChild(outcomeDiv);
    newDiv.appendChild(payoutSpan);
    payoutSpan.insertAdjacentHTML(`afterend`, `<br>`);
    newDiv.appendChild(winConditionSpan);
    newDiv.appendChild(winningsSpan);

    return newDiv;

    function createPayoutElement(payout) {
      const payoutSpan = document.createElement(`span`);
      const payoutSpanContent = document.createTextNode(`Payout: ${payout}`);
      payoutSpan.appendChild(payoutSpanContent);

      return payoutSpan;
    }

    function createWinConditionElement(winCondition) {
      const winConditionSpan = document.createElement(`span`);
      const winConditionSpanContent = document.createTextNode(
        `${winCondition}`
      );
      winConditionSpan.appendChild(winConditionSpanContent);

      return winConditionSpan;
    }
  },

  createNameElement(name) {
    const nameSpan = document.createElement(`span`);
    let nameSpanContent = document.createTextNode(`${name} `);
    nameSpan.appendChild(nameSpanContent);

    return nameSpan;
  },

  createOutcomeElement(roundOutcome) {
    const outcomeDiv = document.createElement(`div`);
    outcomeDiv.classList.add(`summary-modal__outcome--${roundOutcome}`);
    let outcomeDivContent = document.createTextNode(`${roundOutcome} `);
    outcomeDiv.style.display = `inline-block`;
    outcomeDiv.appendChild(outcomeDivContent);

    return outcomeDiv;
  },

  createWinningsElement(winnings) {
    const winningsSpan = document.createElement(`span`);
    let winningsSpanContent = document.createTextNode(`+ $${winnings}`);
    winningsSpan.appendChild(winningsSpanContent);

    return winningsSpan;
  },

  clearModal() {
    this.mainContainer.innerHTML = ` `;
  },

  prepareModal() {
    this.closeBtn.style.display = "inline-block";
    this.nextBtn.style.display = `none`;

    this.titleField.textContent = `Win Summary`;

    this.clearModal();
  },
};

// export function displayWinSummaryModal(gameState) {
//   const summaryField = document.querySelector(`.summary-modal__main`);
//   const summaryTitle = document.querySelector(`.summary-modal__title`);
//   const closeBtn = document.querySelector(`.btn-summary-modal__close`);
//   const nextBtn = document.querySelector(`.btn-summary-modal__next`);

//   let initialOutcomePackages = gameState.betObj.initialOutcomePackages;
//   let endingOutcomePackages = gameState.betObj.endingOutcomePackages;

//   closeBtn.style.display = "inline-block";
//   nextBtn.style.display = `none`;

//   summaryTitle.textContent = `Win Summary`;

//   summaryField.innerHTML = ` `;

//   let baseGameDiv = createBaseGameSummaryElements(gameState);

//   summaryField.appendChild(baseGameDiv);

//   if (initialOutcomePackages)
//     initialOutcomePackages.forEach(generateSummaryElements);

//   if (endingOutcomePackages)
//     endingOutcomePackages.forEach(generateSummaryElements);

//   function generateSummaryElements(outcomeObj) {
//     let sideBetDiv = createSideBetSummaryElements(outcomeObj);

//     summaryField.appendChild(sideBetDiv);
//   }

//   popbox.open(`summary-modal`);
// }

// function createSideBetSummaryElements(outcomeObj) {
//   let { name, outcome, payout, winCondition, winnings } = outcomeObj;

//   const newDiv = document.createElement(`div`);

//   const nameSpan = document.createElement(`span`);
//   const nameSpanContent = document.createTextNode(`${name}`);
//   nameSpan.appendChild(nameSpanContent);

//   const outcomeDiv = document.createElement(`div`);
//   outcomeDiv.classList.add(`summary-modal__outcome--${outcome}`);
//   outcomeDiv.style.display = `inline-block`;
//   let outcomeDivContent = document.createTextNode(`${outcome} `);
//   outcomeDiv.appendChild(outcomeDivContent);

//   const payoutSpan = document.createElement(`span`);
//   const payoutSpanContent = document.createTextNode(`Payout: ${payout}`);
//   payoutSpan.appendChild(payoutSpanContent);

//   const winConditionSpan = document.createElement(`span`);
//   const winConditionSpanContent = document.createTextNode(`${winCondition}`);
//   winConditionSpan.appendChild(winConditionSpanContent);

//   const winningsSpan = document.createElement(`span`);
//   const winningsSpanContent = document.createTextNode(`+ $${winnings}`);
//   winningsSpan.appendChild(winningsSpanContent);

//   newDiv.appendChild(nameSpan);
//   newDiv.appendChild(outcomeDiv);
//   newDiv.appendChild(payoutSpan);
//   payoutSpan.insertAdjacentHTML(`afterend`, `<br>`);
//   newDiv.appendChild(winConditionSpan);
//   newDiv.appendChild(winningsSpan);

//   return newDiv;
// }

// function createBaseGameSummaryElements(gameState) {
//   let player = gameState.player;
//   let activeHand = player.currentSplitHand;
//   let outcomeObj;
//   let blackjackPayout = gameState.options.blackjackPayout;

//   const newDiv = document.createElement(`div`);

//   const roundLabel = document.createElement(`span`);
//   let roundLabelContent = document.createTextNode(`Base Round`);
//   roundLabel.appendChild(roundLabelContent);

//   newDiv.appendChild(roundLabel);
//   roundLabel.insertAdjacentHTML(`afterend`, `<br>`);

//   if (activeHand == 0) {
//     let hand = player.hand;
//     let outcomeElem = createPlayerSummaryFieldElements(hand, blackjackPayout);

//     newDiv.appendChild(outcomeElem);
//   } else {
//     player.splitHands.forEach(function (hand) {
//       let outcomeElem = createPlayerSummaryFieldElements(hand, blackjackPayout);

//       newDiv.appendChild(outcomeElem);
//     });
//   }

//   return newDiv;
// }

// function createPlayerSummaryFieldElements(hand, blackjackPayout) {
//   let { name, roundOutcome, winnings } = hand.outcomePackage;

//   let payout;
//   if (roundOutcome == `win`) payout = `2:1`;
//   else if (roundOutcome == `natural`) payout = blackjackPayout;
//   else if (roundOutcome == `push`) payout = `Bet Returned`;
//   else if (roundOutcome == `surrender`) payout = `1/2 Bet Returned`;
//   else payout = `0:0`;

//   const playerDiv = document.createElement(`div`);

//   const nameSpan = document.createElement(`span`);
//   let nameSpanContent = document.createTextNode(`${name} `);
//   nameSpan.appendChild(nameSpanContent);

//   const outcomeDiv = document.createElement(`div`);
//   outcomeDiv.classList.add(`summary-modal__outcome--${roundOutcome}`);
//   let outcomeDivContent = document.createTextNode(`${roundOutcome} `);
//   outcomeDiv.style.display = `inline-block`;
//   outcomeDiv.appendChild(outcomeDivContent);

//   const payoutSpan = document.createElement(`span`);
//   let payoutSpanContent = document.createTextNode(`Payout: ${payout}`);
//   payoutSpan.appendChild(payoutSpanContent);

//   const winningsSpan = document.createElement(`span`);
//   let winningsSpanContent = document.createTextNode(`+ $${winnings}`);
//   winningsSpan.appendChild(winningsSpanContent);

//   playerDiv.appendChild(nameSpan);
//   playerDiv.appendChild(outcomeDiv);
//   playerDiv.appendChild(payoutSpan);
//   playerDiv.appendChild(winningsSpan);

//   return playerDiv;
// }

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

  sideBetModal.clearModal();

  gameInfoFields.toggleDoubleDownMarker(false);

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
  const endGameBtn = document.querySelector(`.btn-system__end-game`);

  if (boolean) {
    newGameBtn.style.display = `inline-block`;
    endGameBtn.style.display = `none`;
  } else {
    newGameBtn.style.display = `none`;
    endGameBtn.style.display = `inline-block`;
  }
}

export function toggleDisplayOptionsBtn(boolean) {
  const optionsBtn = document.querySelector(`.btn-system__settings`);

  boolean
    ? (optionsBtn.style.display = `inline`)
    : (optionsBtn.style.display = `none`);
}

export const triviaModal = {
  titleField: document.querySelector(`.trivia-modal__title`),
  questionField: document.querySelector(`.trivia__question`),
  triviaDifficultyBtns: document.querySelectorAll(`.btn__trivia-difficulty`),

  credits: {
    //replaces creditsField
    field: document.querySelector(`.trivia__credits`),
    //replaces creditModifiers
    modifiers: document.querySelectorAll(`.trivia__credits-modifier`),
    minus1Modifier: document.querySelector(
      `.trivia__credits-modifier--minus-1`
    ),
    plus1Modifier: document.querySelector(`.trivia__credits-modifier--plus-1`),
    plus5Modifier: document.querySelector(`.trivia__credits-modifier--plus-5`),
  },

  label: {
    //replaces labelContainer
    container: document.querySelector(`.trivia-modal__label-container`),
    categoryField: document.querySelector(`.trivia__category`),
    difficultyField: document.querySelector(`.trivia__difficulty`),
  },

  answerTable: {
    //replaces answerTableField
    field: document.querySelector(`.trivia-modal__answer-table`),
    //replaces answerFields
    answerValueFields: document.querySelectorAll(`.trivia-modal__answer`),
    //replaces answerAField - answerDField
    fieldA: document.querySelector(`.trivia-modal__answer-a`),
    fieldB: document.querySelector(`.trivia-modal__answer-b`),
    fieldC: document.querySelector(`.trivia-modal__answer-c`),
    fieldD: document.querySelector(`.trivia-modal__answer-d`),
  },

  answerBtns: {
    //replaces answerBtns
    allBtns: document.querySelectorAll(`.btn__answer`),
    multChoiceBtns: document.querySelectorAll(`.btn__answer-multiple`),
    //replaces answerABtn - answerDBtn, trueBtn, falseBtn
    btnA: document.querySelector(`.btn__answer-a`),
    btnB: document.querySelector(`.btn__answer-b`),
    btnC: document.querySelector(`.btn__answer-c`),
    btnD: document.querySelector(`.btn__answer-d`),
    boolChoiceBtns: document.querySelectorAll(`.btn__answer-boolean`),
    btnTrue: document.querySelector(`.btn__answer-true`),
    btnFalse: document.querySelector(`.btn__answer-false`),
  },

  correctAnswer: {
    //replaces correctAnswerField and Text
    field: document.querySelector(`.trivia-modal__answer-correct-container`),
    text: document.querySelector(`.trivia-modal__answer-correct`),
  },

  //replaces renderTriviaQuestion
  renderQuestion(questionObj) {
    this.toggleDisplayDifficultyBtns(false);

    displayQuestionInfo(questionObj);

    renderBtns(questionObj);

    console.log(questionObj.correctAnswer);

    function displayQuestionInfo(questionObj) {
      triviaModal.label.container.style.display = `flex`;

      triviaModal.label.categoryField.textContent = questionObj.category;
      triviaModal.label.difficultyField.textContent = questionObj.difficulty;

      triviaModal.questionField.innerHTML = questionObj.question;
    }

    function renderBtns(questionObj) {
      if (questionObj.type == `multiple`) {
        triviaModal.renderMultipleChoiceAnswers(questionObj);
      } else {
        triviaModal.renderBooleanChoiceAnswers(questionObj);
      }
    }
  },

  //replaces renderMultipleChoiceAnswers
  renderMultipleChoiceAnswers(questionObj) {
    setAnswersToBtnElements(questionObj);

    setAnswersToModalFields(questionObj);

    setCorrectAnswerToBtn(questionObj);

    //reveals answerTable
    this.answerTable.field.style.display = `flex`;

    function setAnswersToBtnElements(questionObj) {
      triviaModal.answerBtns.btnA.setAttribute(
        `data-ans`,
        questionObj.answerChoices[0]
      );
      triviaModal.answerBtns.btnB.setAttribute(
        `data-ans`,
        questionObj.answerChoices[1]
      );
      triviaModal.answerBtns.btnC.setAttribute(
        `data-ans`,
        questionObj.answerChoices[2]
      );
      triviaModal.answerBtns.btnD.setAttribute(
        `data-ans`,
        questionObj.answerChoices[3]
      );
    }

    function setAnswersToModalFields(questionObj) {
      triviaModal.answerTable.fieldA.innerHTML = questionObj.answerChoices[0];
      triviaModal.answerTable.fieldB.innerHTML = questionObj.answerChoices[1];
      triviaModal.answerTable.fieldC.innerHTML = questionObj.answerChoices[2];
      triviaModal.answerTable.fieldD.innerHTML = questionObj.answerChoices[3];
    }

    function setCorrectAnswerToBtn(questionObj) {
      triviaModal.answerBtns.multChoiceBtns.forEach(function (btn) {
        let answer = btn.getAttribute("data-ans");
        if (answer == questionObj.correctAnswer) {
          btn.classList.add("correctAnswer");
        }

        btn.style.display = `inline-block`;
      });
    }
  },

  renderBooleanChoiceAnswers(questionObj) {
    if (questionObj.correctAnswer == `True`) {
      setCorrectAnswerToBtn(this.answerBtns.btnTrue, `True`);
    } else {
      setCorrectAnswerToBtn(this.answerBtns.btnFalse, `True`);
    }

    displayBooleanChoiceBtns();

    function setCorrectAnswerToBtn(elem, str) {
      elem.classList.add("correctAnswer");
      elem.setAttribute(`data-ans`, str);
    }

    function displayBooleanChoiceBtns() {
      triviaModal.answerBtns.boolChoiceBtns.forEach(function (btn) {
        btn.style.display = `inline-block`;
      });
    }
  },

  //replaces toggleDisplayTriviaDifficultyBtns
  toggleDisplayDifficultyBtns(toggle) {
    let displayValue;

    toggle ? (displayValue = `inline-block`) : (displayValue = `none`);

    this.triviaDifficultyBtns.forEach(function (btn) {
      btn.style.display = displayValue;
    });
  },

  //replaces displayTriviaCorrectAnswer
  displayCorrectAnswer(questionObj) {
    this.correctAnswer.field.style.display = `inline-block`;
    this.correctAnswer.text.innerHTML = questionObj.correctAnswer;
  },

  //replaces renderTriviaCorrectAnswer
  renderPlayerCorrectResult() {
    document.querySelector(".correctAnswer").style.backgroundColor = `green`;
    this.titleField.textContent = `Correct Answer!`;
    this.titleField.style.color = `green`;
  },

  //replaces renderTriviaIncorrectAnswer
  renderPlayerIncorrectResult(event) {
    document.querySelector(".correctAnswer").style.backgroundColor = `green`;
    event.target.id = `incorrectAnswer`;

    this.titleField.textContent = `Wrong Answer...`;
    this.titleField.style.color = `red`;
  },

  //replaces resetTriviaModal
  resetModal(answerCorrectly) {
    this.clearModalFields();
    this.clearAnswerBtnData(answerCorrectly);
    this.resetCreditsModifier();
    this.toggleDisplayDifficultyBtns(true);
    this.resetAnswerBtns();
    popbox.close(`trivia-modal`);
  },

  //replaces clearTriviaUI
  clearModalFields() {
    this.titleField.textContent = `Hit Trivia Question`;
    this.titleField.style.color = `white`;

    this.label.categoryField.textContent = ``;
    this.label.difficultyField.textContent = ``;
    this.label.container.style.display = `none`;

    this.correctAnswer.text.innerHTML = ` `;
    this.correctAnswer.field.style.display = `none`;

    this.questionField.textContent = `Select Trivia Difficulty`;

    this.answerTable.field.style.display = `none`;
    this.answerTable.answerValueFields.forEach(function (elem) {
      elem.textContent = ` `;
    });
  },

  //replaces clearAnswerBtnData
  clearAnswerBtnData(answerCorrectly) {
    this.answerBtns.multChoiceBtns.forEach(function (elem) {
      elem.removeAttribute(`data-ans`);
    });

    document.querySelector(".correctAnswer").style.backgroundColor = `grey`;
    document.querySelector(`.correctAnswer`).classList.remove(`correctAnswer`);

    if (!answerCorrectly) {
      document.querySelector(`#incorrectAnswer`).removeAttribute(`id`);
    }
  },

  //replaces renderTriviaCredits
  renderCredits(credits, modifier = null) {
    this.credits.field.textContent = credits;

    if (modifier == `minus1`)
      this.credits.minus1Modifier.style.display = `inline`;
    if (modifier == `plus1`)
      this.credits.plus1Modifier.style.display = `inline`;
    if (modifier == `plus5`)
      this.credits.plus5Modifier.style.display = `inline`;
  },

  //replaces resetTriviaCreditsModifier
  resetCreditsModifier() {
    this.credits.modifiers.forEach(function (elem) {
      elem.style.display = `none`;
    });
  },

  //replaces resetTriviaBtns
  resetAnswerBtns() {
    this.toggleDisableAnswerBtns(false);

    this.answerBtns.allBtns.forEach(function (btn) {
      btn.style.display = `none`;
    });
  },

  //replaces toggleDisableTriviaAnswerBtns
  toggleDisableAnswerBtns(toggle) {
    let disableValue;

    toggle ? (disableValue = true) : (disableValue = false);

    this.answerBtns.allBtns.forEach(function (btn) {
      btn.disabled = disableValue;
    });
  },
};

// export function renderTriviaQuestion(questionObj) {
//   const labelContainer = document.querySelector(
//     `.trivia-modal__label-container`
//   );
//   const categoryField = document.querySelector(`.trivia__category`);
//   const difficultyField = document.querySelector(`.trivia__difficulty`);
//   const questionField = document.querySelector(`.trivia__question`);

//   const answerTableItems = document.querySelectorAll(
//     `.trivia-modal__answer-table-item`
//   );

//   toggleDisplayTriviaDifficultyBtns(false);

//   labelContainer.style.display = `flex`;

//   categoryField.textContent = questionObj.category;
//   difficultyField.textContent = questionObj.difficulty;
//   questionField.innerHTML = questionObj.question;

//   console.log(questionObj.correctAnswer);

//   if (questionObj.type == `multiple`) {
//     renderMultipleChoiceAnswers(questionObj);
//   } else {
//     renderBooleanChoiceAnswers(questionObj);
//   }

//   function renderMultipleChoiceAnswers(questionObj) {
//     const answerTableField = document.querySelector(
//       `.trivia-modal__answer-table`
//     );

//     const multChoiceAnswerBtns = document.querySelectorAll(
//       `.btn__answer-multiple`
//     );

//     const answerABtn = document.querySelector(`.btn__answer-a`);
//     const answerBBtn = document.querySelector(`.btn__answer-b`);
//     const answerCBtn = document.querySelector(`.btn__answer-c`);
//     const answerDBtn = document.querySelector(`.btn__answer-d`);

//     const answerAField = document.querySelector(`.trivia-modal__answer-a`);
//     const answerBField = document.querySelector(`.trivia-modal__answer-b`);
//     const answerCField = document.querySelector(`.trivia-modal__answer-c`);
//     const answerDField = document.querySelector(`.trivia-modal__answer-d`);

//     answerABtn.setAttribute(`data-ans`, questionObj.answerChoices[0]);
//     answerBBtn.setAttribute(`data-ans`, questionObj.answerChoices[1]);
//     answerCBtn.setAttribute(`data-ans`, questionObj.answerChoices[2]);
//     answerDBtn.setAttribute(`data-ans`, questionObj.answerChoices[3]);

//     answerAField.innerHTML = questionObj.answerChoices[0];
//     answerBField.innerHTML = questionObj.answerChoices[1];
//     answerCField.innerHTML = questionObj.answerChoices[2];
//     answerDField.innerHTML = questionObj.answerChoices[3];

//     multChoiceAnswerBtns.forEach(function (btn) {
//       let answer = btn.getAttribute("data-ans");
//       if (answer == questionObj.correctAnswer) {
//         btn.classList.add("correctAnswer");
//       }

//       btn.style.display = `inline-block`;
//     });

//     answerTableField.style.display = `flex`;
//   }

//   function renderBooleanChoiceAnswers(questionObj) {
//     const trueBtn = document.querySelector(`.btn__answer-true`);
//     const falseBtn = document.querySelector(`.btn__answer-false`);
//     const boolChoiceAnswerBtns =
//       document.querySelectorAll(`.btn__answer-boolean`);

//     if (questionObj.correctAnswer == `True`) {
//       trueBtn.classList.add("correctAnswer");
//       trueBtn.setAttribute(`data-ans`, `True`);
//     } else {
//       falseBtn.classList.add("correctAnswer");
//       falseBtn.setAttribute(`data-ans`, "False");
//     }

//     boolChoiceAnswerBtns.forEach(function (btn) {
//       btn.style.display = `inline-block`;
//     });
//   }
// }

// function toggleDisplayTriviaDifficultyBtns(toggle) {
//   const triviaDifficultyBtns = document.querySelectorAll(
//     `.btn__trivia-difficulty`
//   );

//   if (toggle) {
//     triviaDifficultyBtns.forEach(function (btn) {
//       btn.style.display = `inline-block`;
//     });
//   } else {
//     triviaDifficultyBtns.forEach(function (btn) {
//       btn.style.display = "none";
//     });
//   }
// }

// export function displayTriviaCorrectAnswer(questionObj) {
//   const correctAnswerField = document.querySelector(
//     `.trivia-modal__answer-correct-container`
//   );
//   const correctAnswerText = document.querySelector(
//     `.trivia-modal__answer-correct`
//   );

//   correctAnswerField.style.display = `inline-block`;
//   correctAnswerText.innerHTML = questionObj.correctAnswer;
// }

// export function renderTriviaCorrectAnswer() {
//   const titleField = document.querySelector(`.trivia-modal__title`);

//   document.querySelector(".correctAnswer").style.backgroundColor = `green`;
//   titleField.textContent = `Correct Answer!`;
//   titleField.style.color = `green`;
// }

// export function renderTriviaIncorrectAnswer(event) {
//   const titleField = document.querySelector(`.trivia-modal__title`);

//   document.querySelector(".correctAnswer").style.backgroundColor = `green`;
//   event.target.id = `incorrectAnswer`;

//   titleField.textContent = `Wrong Answer...`;
//   titleField.style.color = `red`;
// }

// export function resetTriviaModal(answerCorrectly) {
//   clearTriviaUI();
//   clearAnswerBtnData(answerCorrectly);
//   resetTriviaCreditsModifier();
//   toggleDisplayTriviaDifficultyBtns(true);
//   resetTriviaBtns();
//   popbox.close(`trivia-modal`);
// }

// function clearTriviaUI() {
//   const categoryField = document.querySelector(`.trivia__category`);
//   const difficultyField = document.querySelector(`.trivia__difficulty`);
//   const labelContainer = document.querySelector(
//     `.trivia-modal__label-container`
//   );
//   const questionField = document.querySelector(`.trivia__question`);
//   const answerFields = document.querySelectorAll(`.trivia-modal__answer`);
//   const correctAnswerField = document.querySelector(
//     `.trivia-modal__answer-correct-container`
//   );
//   const correctAnswerText = document.querySelector(
//     `.trivia-modal__answer-correct`
//   );
//   const answerTableField = document.querySelector(
//     `.trivia-modal__answer-table`
//   );
//   const titleField = document.querySelector(`.trivia-modal__title`);

//   categoryField.textContent = ``;
//   difficultyField.textContent = ``;
//   correctAnswerText.innerHTML = ` `;
//   labelContainer.style.display = `none`;
//   correctAnswerField.style.display = `none`;
//   answerTableField.style.display = `none`;
//   titleField.textContent = `Hit Trivia Question`;
//   titleField.style.color = `white`;
//   questionField.textContent = `Select Trivia Difficulty`;

//   answerFields.forEach(function (elem) {
//     elem.textContent = ` `;
//   });
// }

// function clearAnswerBtnData(answerCorrectly) {
//   const multChoiceAnswerBtns = document.querySelectorAll(
//     `.btn__answer-multiple`
//   );

//   multChoiceAnswerBtns.forEach(function (elem) {
//     elem.removeAttribute(`data-ans`);
//   });

//   document.querySelector(".correctAnswer").style.backgroundColor = `grey`;
//   document.querySelector(`.correctAnswer`).classList.remove(`correctAnswer`);

//   if (!answerCorrectly) {
//     document.querySelector(`#incorrectAnswer`).removeAttribute(`id`);
//   }
// }

// export function renderTriviaCredits(credits, modifier = null) {
//   const creditsField = document.querySelector(`.trivia__credits`);
//   const minus1Modifier = document.querySelector(
//     `.trivia__credits-modifier--minus-1`
//   );
//   const plus1Modifier = document.querySelector(
//     `.trivia__credits-modifier--plus-1`
//   );
//   const plus5Modifier = document.querySelector(
//     `.trivia__credits-modifier--plus-5`
//   );

//   creditsField.textContent = credits;

//   if (modifier == `minus1`) minus1Modifier.style.display = `inline`;
//   if (modifier == `plus1`) plus1Modifier.style.display = `inline`;
//   if (modifier == `plus5`) plus5Modifier.style.display = `inline`;
// }

// function resetTriviaCreditsModifier() {
//   const creditsModifiers = document.querySelectorAll(
//     `.trivia__credits-modifier`
//   );

//   creditsModifiers.forEach(function (elem) {
//     elem.style.display = `none`;
//   });
// }

// function resetTriviaBtns() {
//   const answerBtns = document.querySelectorAll(`.btn__answer`);
//   toggleDisableTriviaAnswerBtns(false);

//   answerBtns.forEach(function (btn) {
//     btn.style.display = `none`;
//   });
// }

// export function toggleDisableTriviaAnswerBtns(toggle) {
//   const answerBtns = document.querySelectorAll(`.btn__answer`);
//   if (toggle) {
//     answerBtns.forEach(function (btn) {
//       btn.disabled = true;
//     });
//   } else {
//     answerBtns.forEach(function (btn) {
//       btn.disabled = false;
//     });
//   }
// }

export function activateEarlySurrenderModal(gameState) {
  const titleField = document.querySelector(`.winning-hand-modal__title`);
  const sideBetContainer = document.querySelector(
    `.winning-hand-modal__side-bet-name-container`
  );
  const dealerCardsContainer = document.querySelector(
    `.winning-hand-modal__dealer-cards-container`
  );
  const playerCardsContainer = document.querySelector(
    `.winning-hand-modal__player-cards-container`
  );
  const dealerField = document.querySelector(
    `.winning-hand-modal__dealer-cards`
  );
  const playerField = document.querySelector(
    `.winning-hand-modal__player-cards`
  );
  const winningsInfoContainer = document.querySelector(
    `.winning-hand-modal__winnings-info-container`
  );
  const closeBtn = document.querySelector(`.btn-winning-hand-modal__close`);
  const nextBtn = document.querySelector(`.btn-winning-hand-modal__next`);
  const acceptBtn = document.querySelector(
    `.btn-winning-hand-modal__accept-early-surrender`
  );
  const declineBtn = document.querySelector(
    `.btn-winning-hand-modal__decline-early-surrender`
  );

  let playerHand = gameState.player.hand;
  let dealerHand = gameState.dealer.hand;

  titleField.textContent = `Surrender Hand?`;

  sideBetContainer.style.display = `none`;
  dealerCardsContainer.style.display = `block`;
  playerCardsContainer.style.display = `block`;
  winningsInfoContainer.style.display = `none`;
  closeBtn.style.display = `none`;
  nextBtn.style.display = `none`;
  acceptBtn.style.display = `inline`;
  declineBtn.style.display = `inline`;

  dealerField.innerHTML = dealerHand.simpleImages.join();
  playerField.innerHTML = playerHand.simpleImages.join();

  popbox.open(`winning-hand-modal`);
}

// export function resetWinningHandModal() {
//   const titleField = document.querySelector(`.winning-hand-modal__title`);
//   const sideBetContainer = document.querySelector(
//     `.winning-hand-modal__side-bet-name-container`
//   );
//   const dealerCardsContainer = document.querySelector(
//     `.winning-hand-modal__dealer-cards-container`
//   );
//   const playerCardsContainer = document.querySelector(
//     `.winning-hand-modal__player-cards-container`
//   );
//   const dealerField = document.querySelector(
//     `.winning-hand-modal__dealer-cards`
//   );
//   const playerField = document.querySelector(
//     `.winning-hand-modal__player-cards`
//   );
//   const winningsInfoContainer = document.querySelector(
//     `.winning-hand-modal__winnings-info-container`
//   );
//   const closeBtn = document.querySelector(`.btn-winning-hand-modal__close`);
//   const nextBtn = document.querySelector(`.btn-winning-hand-modal__next`);
//   const acceptBtn = document.querySelector(
//     `.btn-winning-hand-modal__accept-early-surrender`
//   );
//   const declineBtn = document.querySelector(
//     `.btn-winning-hand-modal__decline-early-surrender`
//   );

//   titleField.textContent = `Winning Hand`;

//   sideBetContainer.style.display = `block`;
//   dealerCardsContainer.style.display = `block`;
//   playerCardsContainer.style.display = `block`;
//   winningsInfoContainer.style.display = `block`;
//   closeBtn.style.display = `inline`;
//   nextBtn.style.display = `none`;
//   acceptBtn.style.display = `none`;
//   declineBtn.style.display = `none`;

//   dealerField.innerHTML = ` `;
//   playerField.innerHTML = ` `;
// }
