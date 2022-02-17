import * as listeners from "./listeners.js";

export let gameActionBtns = {
  hit: document.querySelector(`.btn-action__hit`),
  stand: document.querySelector(`.btn-action__stand`),
  doubleDown: document.querySelector(`.btn-action__doubleDown`),
  split: document.querySelector(`.btn-action__split`),
  surrender: document.querySelector(`.btn-action__surrender`),
  toggleEventListeners: toggleEventListeners,

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

  // toggleEventListeners(funcObj, toggle) {
  //   let keysArr = Object.entries(funcObj);

  //   keysArr.forEach(function (arr) {
  //     let [key, clbk] = arr;

  //     if (toggle == `add`) this[key].addEventListener(`click`, clbk);
  //     else this[key].removeEventListener(`click`, clbk);
  //   }, this);
  // },
};

function toggleEventListeners(funcObj, toggle) {
  let keysArr = Object.entries(funcObj);

  keysArr.forEach(function (arr) {
    let [key, clbk] = arr;

    if (this[key] instanceof NodeList)
      addMultipleEventListeners(this[key], clbk, toggle);
    else addSingleEventListener(this[key], clbk, toggle);
  }, this);

  function addMultipleEventListeners(elems, clbk, toggle) {
    if (toggle == `add`) {
      elems.forEach(function (elem) {
        elem.addEventListener(`click`, clbk);
      });
    } else {
      elems.forEach(function (elem) {
        elem.removeEventListener(`click`, clbk);
      });
    }
  }

  function addSingleEventListener(elem, clbk, toggle) {
    if (toggle == `add`) elem.addEventListener(`click`, clbk);
    else elem.removeEventListener(`click`, clbk);
  }
}

export let gameInfoFields = {
  bankField: document.querySelector(`.bank__value`),
  baseBetField: document.querySelector(`.bet__value`),
  doubleDownMarker: document.querySelector(`.round-info__double-down-marker`),
  noticeField: document.querySelector(`.game-message__text`),
  newGameBtn: document.querySelector(`.btn-system__new-game`),
  endGameBtn: document.querySelector(`.btn-system__end-game`),
  startNextRoundBtn: document.querySelector(`.btn-system__start-next-round`),
  optionsBtn: document.querySelector(`.btn-system__settings`),
  checkSideBetBtn: document.querySelector(
    `.btn-system__check-side-bet-outcome`
  ),
  toggleEventListeners: toggleEventListeners,
  toggleDisplayElementOn: toggleDisplayElementOn,

  updateBank(bank) {
    this.bankField.textContent = bank;
  },

  updateBaseBet(bet) {
    this.baseBetField.textContent = bet;
  },

  toggleDoubleDownMarker(toggle) {
    if (toggle) this.toggleDisplayElementOn(this.doubleDownMarker, true);
    else this.toggleDisplayElementOn(this.doubleDownMarker, false);
  },

  //replaces renderNoticeText
  renderNoticeText(str) {
    this.noticeField.textContent = str;
  },

  //replaces toggleDisplayStartNextRoundBtn
  toggleDisplayStartNextRoundBtn(toggle) {
    toggle
      ? this.toggleDisplayElementOn(this.startNextRoundBtn, true)
      : this.toggleDisplayElementOn(this.startNextRoundBtn, false);
  },

  //replaces toggleDisplayNewGameBtn
  toggleDisplayNewGameBtn(toggle) {
    if (toggle) {
      this.toggleDisplayElementOn(this.newGameBtn, true);
      this.toggleDisplayElementOn(this.endGameBtn, false);
    } else {
      this.toggleDisplayElementOn(this.newGameBtn, false);
      this.toggleDisplayElementOn(this.endGameBtn, true);
    }
  },

  //replaces toggleDisplayOptionsBtn
  toggleDisplayOptionsBtn(toggle) {
    toggle
      ? this.toggleDisplayElementOn(this.optionsBtn, true)
      : this.toggleDisplayElementOn(this.optionsBtn, false);
  },

  //replaces toggleCheckSideBetBtn
  toggleCheckSideBetBtn(toggle) {
    const checkSideBetBtn = document.querySelector(
      `.btn-system__check-side-bet-outcome`
    );

    toggle
      ? this.toggleDisplayElementOn(this.checkSideBetBtn, true)
      : this.toggleDisplayElementOn(this.checkSideBetBtn, false);
  },

  clearRoundUI() {
    this.toggleDoubleDownMarker(false);

    this.baseBetField.textContent = 0;
  },
};

export let baseBetModal = {
  bankValue: document.querySelector(`.basic-bet-modal__bank-value`),
  baseBetValue: document.querySelector(`.basic-bet-modal__bet-value`),
  sideBetPlacedBtn: document.querySelector(
    `.btn-basic-bet-modal__side-bet-placed`
  ),
  chipBtns: document.querySelectorAll(`.btn-basic-bet-modal__chip`),
  clearBetBtn: document.querySelector(`.btn-basic-bet-modal__clear-bet`),
  dealCardsBtn: document.querySelector(`.btn-basic-bet-modal__deal-cards`),
  sideBetMenuBtn: document.querySelector(
    `.btn-basic-bet-modal__place-side-bets`
  ),
  enableChipBtn: enableChipBtn,
  disableChipBtn: disableChipBtn,
  toggleDisableBtn: toggleDisableBtn,
  toggleEventListeners: toggleEventListeners,
  //clearbtn
  //dealcardsbtn
  //sidebetmenubtn

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
    this.checkToDisableDealCardsBtn(betTotal);
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
    this.checkToDisableDealCardsBtn(0);
  },

  checkToDisableDealCardsBtn(baseBet) {
    baseBet == 0
      ? (this.dealCardsBtn.disabled = true)
      : (this.dealCardsBtn.disabled = false);
  },

  //replaces toggleSideBetPlacedBtn
  toggleSideBetPlacedBtn(toggle, gameState = null) {
    let disable;

    toggle ? (disable = false) : (disable = true);

    if (toggle) {
      const sideBetTotal = gameState.betObj.getTempSideBetTotalValue();
      this.toggleDisableBtn(this.sideBetPlacedBtn, disable);
      // this.sideBetPlacedBtn.style.display = `inline-block`;
      this.sideBetPlacedBtn.innerHTML = `Side Bets Placed <br> $${sideBetTotal}`;
    } else {
      this.toggleDisableBtn(this.sideBetPlacedBtn, disable);
      // this.sideBetPlacedBtn.style.display = `none`;
      this.sideBetPlacedBtn.innerHTML = `No Side Bets <br> Placed`;
    }

    // function toggleDisableBtn(toggle) {
    //   toggle
    //     ? (baseBetModal.sideBetPlacedBtn.disabled = true)
    //     : (baseBetModal.sideBetPlacedBtn.disabled = false);
    // }
  },
};

function toggleDisableBtn(elem, toggle) {
  toggle ? (elem.disabled = true) : (elem.disabled = false);
}

export let sideBetModal = {
  modalContainer: document.querySelector(`.side-bet-modal__container`),
  bankValue: document.querySelector(`.side-bet-modal__bank-value`),
  totalValue: document.querySelector(`.side-bet-modal__total-value`),
  activeBetElem: document.querySelector(`.side-bet-modal__active-bet`),
  activeValueElem: document.querySelector(`.side-bet-modal__active-value`),
  sideBetContainers: document.querySelectorAll(`.side-bet-modal__side-bet-div`),
  chipBtns: document.querySelectorAll(`.btn-side-bet-modal__chip`),
  activateBetBtn: document.querySelector(`.btn-side-bet-modal__activate-bet`),
  sideBetValueFields: document.querySelectorAll(
    `.side-bet-modal__side-bet-value`
  ),
  clearBetBtn: document.querySelector(`.btn-side-bet-modal__clear-bet`),
  clearAllBetsBtn: document.querySelector(`.btn-side-bet-modal__clear-all`),
  placeSideBetsBtn: document.querySelector(`.btn-side-bet-modal__place-bets`),
  activateSideBetBtn: document.querySelector(
    `.btn-side-bet-modal__activate-bet`
  ),
  exitBtn: document.querySelector(`.btn-side-bet-modal__exit`),
  enableChipBtn: enableChipBtn,
  disableChipBtn: disableChipBtn,
  toggleDisableBtn: toggleDisableBtn,
  toggleDisplayElementOn: toggleDisplayElementOn,
  toggleEventListeners: toggleEventListeners,
  checkNeedModalScrollbar: checkNeedModalScrollbar,
  toggleAddScrollbarToModal: toggleAddScrollbarToModal,

  //replaces updateSideBetModalInfo
  updateModalInfo(gameState) {
    this.bankValue.textContent = gameState.betObj.tempValue.bank;
    this.checkNeedModalScrollbar();
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
    this.checkChipBtnsValid(bank);
    this.checkToEnableActionBtns(gameState);
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
    this.checkToEnableActionBtns(gameState);
  },

  collectSideBet() {
    const elem = document.querySelector(`.side-bet-modal__active-bet`);

    const sideBet = elem.dataset.sidebet;
    return sideBet;
  },

  activateSideBetSelectedText(sideBet, gameState) {
    switch (sideBet) {
      case "extraBetBlackjack":
        document.querySelector(
          `.extra-bet-blackjack__value`
        ).textContent = `Activated`;
        break;
      default:
        console.log(`ERROR: activateSideBetSelectedText`);
    }

    this.checkToEnableActionBtns(gameState);
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
          modalObj.toggleDisplayElementOn(elem, false);
          // elem.style.display = `none`;
        });
        modalObj.toggleDisplayElementOn(modalObj.activateBetBtn, true);
        // modalObj.activateBetBtn.style.display = `inline-block`;
      } else {
        modalObj.chipBtns.forEach(function (elem) {
          modalObj.toggleDisplayElementOn(elem, true);
          // elem.style.display = `inline-block`;
        });
        modalObj.toggleDisplayElementOn(modalObj.activateBetBtn, false);
        // modalObj.activateBetBtn.style.display = `none`;
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

  checkToEnableActionBtns(gameState) {
    let sideBetTotalValue = gameState.betObj.getTempSideBetTotalValue();
    let extraBetBJExists =
      gameState.betObj.checkSideBetExists(`extraBetBlackjack`);

    let toggle = sideBetTotalValue > 0 || extraBetBJExists;

    toggle ? enableActionBtns(true) : enableActionBtns(false);

    function enableActionBtns(boolean) {
      sideBetModal.toggleDisableBtn(sideBetModal.clearBetBtn, !boolean);
      sideBetModal.toggleDisableBtn(sideBetModal.clearAllBetsBtn, !boolean);
      sideBetModal.toggleDisableBtn(sideBetModal.placeSideBetsBtn, !boolean);
    }
  },
};

function checkNeedModalScrollbar() {
  let modalHeight = this.modalContainer.offsetHeight;

  let viewportHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );

  modalHeight > viewportHeight
    ? this.toggleAddScrollbarToModal(true)
    : this.toggleAddScrollbarToModal(false);
}

function toggleAddScrollbarToModal(toggle) {
  if (toggle) {
    if (
      this.modalContainer.classList.contains(`three-section-modal--scrollbar`)
    )
      return;
    this.modalContainer.classList.add(`three-section-modal--scrollbar`);
  } else this.modalContainer.classList.remove(`three-section-modal--scrollbar`);

  // let threeSectionModals = document.querySelectorAll(`.three-section-modal`);

  // threeSectionModals.forEach(function (elem) {
  //   if (toggle) {
  //     if (elem.classList.contains(`three-section-modal--scrollbar`)) return;
  //     elem.classList.add(`three-section-modal--scrollbar`);
  //   } else elem.classList.remove(`three-section-modal--scrollbar`);
  // });
}

export let sideBetPlacedModal = {
  titleField: document.querySelector(`.generic-modal__title`),
  mainContainer: document.querySelector(`.generic-modal__main`),
  nextBtn: document.querySelector(`.btn-generic-modal__next`),
  closeBtn: document.querySelector(`.btn-generic-modal__close`),
  toggleDisplayElementOn: toggleDisplayElementOn,
  // toggleDisplayBtn: toggleDisplayBtn,

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

    // this.toggleDisplayBtn(this.nextBtn, dataObj.nextBtn);
    // this.toggleDisplayBtn(this.closeBtn, dataObj.closeBtn);

    this.toggleDisplayElementOn(this.nextBtn, dataObj.nextBtn);
    this.toggleDisplayElementOn(this.closeBtn, dataObj.closeBtn);
  },
};

function toggleDisplayBtn(elem, toggle) {
  toggle
    ? (elem.style.display = `inline-block`)
    : (elem.style.display = `none`);
}

// function checkExtraBetChipBtnsValid(value, sideBet, baseBet) {
//   const chip1 = document.querySelector(`.btn-extra-bet-modal__1`);
//   const chip5 = document.querySelector(`.btn-extra-bet-modal__5`);
//   const chip10 = document.querySelector(`.btn-extra-bet-modal__10`);
//   const chip25 = document.querySelector(`.btn-extra-bet-modal__25`);
//   const chip100 = document.querySelector(`.btn-extra-bet-modal__100`);
//   const chip500 = document.querySelector(`.btn-extra-bet-modal__500`);
//   let maxValue = baseBet * 5;

//   value >= 1 ? enableChipBtn(chip1) : disableChipBtn(chip1);
//   value > 5 ? enableChipBtn(chip5) : disableChipBtn(chip5);
//   value > 10 ? enableChipBtn(chip10) : disableChipBtn(chip10);
//   value > 25 ? enableChipBtn(chip25) : disableChipBtn(chip25);
//   value > 100 ? enableChipBtn(chip100) : disableChipBtn(chip100);
//   value > 500 ? enableChipBtn(chip500) : disableChipBtn(chip500);
//   sideBet >= maxValue
//     ? toggleDisableExtraBetChips(true)
//     : toggleDisableExtraBetChips(false);

//   function toggleDisableExtraBetChips(toggle) {
//     const chipBtns = document.querySelectorAll(`.btn-extra-bet-modal__chip`);

//     if (toggle) {
//       chipBtns.forEach(function (elem) {
//         elem.disabled = true;
//       });
//     } else {
//       chipBtns.forEach(function (elem) {
//         elem.disabled = false;
//       });
//     }
//   }
// }

function enableChipBtn(element) {
  element.disabled = false;
  if (element.classList.contains(`disabled`))
    element.classList.remove("disabled");
}

function disableChipBtn(element) {
  element.disabled = true;
  element.classList.add(`disabled`);
}

export const optionsModal = {
  modalContainer: document.querySelector(`.options-modal__container`),
  formElem: document.querySelector(`.options-modal__form`),
  applyOptionsBtn: document.querySelector(`.btn-options-modal__submit-options`),
  checkNeedModalScrollbar: checkNeedModalScrollbar,
  toggleAddScrollbarToModal: toggleAddScrollbarToModal,

  get inputElems() {
    return this.formElem.querySelectorAll(`input`);
  },

  collectOptions() {
    let formData = new FormData(this.formElem);
    this.formData = formData;

    this.generateNewOptionsObj();

    return this.options;
  },

  generateNewOptionsObj() {
    this.options = {};

    this.generateOptionsProps();
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
    optionsModal.inputElems.forEach(function (elem) {
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
};

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

  clearRoundUI() {
    this.cardsContainer.innerHTML = ` `;
    this.total.textContent = 0;
    this.messageText.textContent = ` `;
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

  clearRoundUI() {
    this.cardsContainer.innerHTML = ` `;
    this.total.textContent = 0;
    this.messageText.textContent = ` `;
  },
};

export let splitStageField = {
  stageContainer: document.querySelector(`.grid__split-stages-container`),
  cardFields: document.querySelectorAll(`.split-stage__cards`),
  totalFields: document.querySelectorAll(`.split-stage__total`),
  resultFields: document.querySelectorAll(`.split-stage__result`),
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

  clearRoundUI() {
    this.cardFields.forEach(function (elem) {
      elem.innerHTML = ` `;
    });

    this.totalFields.forEach(function (elem) {
      elem.textContent = 0;
    });

    this.resultFields.forEach(function (elem) {
      elem.textContent = ` `;
    });

    this.stageContainer.style.display = `none`;
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
    if (field == `dealer`) {
      this.dealer.removeOutcomeModifierClass(this.dealer.messageContainer);
      this.dealer.renderOutcome(outcome, outcomeText);
    }
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
      if (outcome == `surrender`) outcomeText = `Surrender`;

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

  clearRoundUI() {
    this.dealer.clearRoundUI();

    this.player.clearRoundUI();

    this.splitStages.clearRoundUI();

    this.resetAllMessageFieldUI();
  },

  resetAllMessageFieldUI() {
    // let outcomeArr = [
    //   `bust`,
    //   `charlie`,
    //   `natural`,
    //   `stand`,
    //   `surrender`,
    //   `dealerHit`,
    // ];

    this.player.removeOutcomeModifierClass(this.player.messageContainer);
    this.dealer.removeOutcomeModifierClass(this.dealer.messageContainer);
    this.splitStages.removeOutcomeModifierClass(this.splitStages.stage1.result);
    this.splitStages.removeOutcomeModifierClass(this.splitStages.stage2.result);
    this.splitStages.removeOutcomeModifierClass(this.splitStages.stage3.result);

    // outcomeArr.forEach(function (str) {
    //   this.dealer.messageContainer.classList.remove(
    //     `dealer-message__container--${str}`
    //   );
    //   this.player.messageContainer.classList.remove(
    //     `player-message__container--${str}`
    //   );
    //   this.splitStages.stage1.result.classList.remove(
    //     `split-stage-1__result--${str}`
    //   );
    //   this.splitStages.stage2.result.classList.remove(
    //     `split-stage-2__result--${str}`
    //   );
    //   this.splitStages.stage3.result.classList.remove(
    //     `split-stage-3__result--${str}`
    //   );
    // }, this);
  },
};

function removeOutcomeModifierClass(elem) {
  let classesArr = [
    `natural`,
    `bust`,
    `charlie`,
    `stand`,
    `dealerHit`,
    `surrender`,
  ];

  classesArr.forEach(function (str) {
    elem.classList.remove(`--${str}`);
  });
}

// export function toggleCheckSideBetBtn(toggle) {
//   const checkSideBetBtn = document.querySelector(
//     `.btn-system__check-side-bet-outcome`
//   );

//   toggle
//     ? (checkSideBetBtn.style.display = `inline-block`)
//     : (checkSideBetBtn.style.display = `none`);
// }

export let sideBetOutcomeModal = {
  modalContainer: document.querySelector(`.summary-modal__container`),
  mainContainer: document.querySelector(`.summary-modal__main`),
  titleField: document.querySelector(`.summary-modal__title`),
  closeBtn: document.querySelector(`.btn-summary-modal__close`),
  nextBtn: document.querySelector(`.btn-summary-modal__next`),
  toggleDisplayElementOn: toggleDisplayElementOn,
  checkNeedModalScrollbar: checkNeedModalScrollbar,
  toggleAddScrollbarToModal: toggleAddScrollbarToModal,

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
      sideBetOutcomeModal.toggleDisplayElementOn(
        sideBetOutcomeModal.closeBtn,
        false
      );
      sideBetOutcomeModal.toggleDisplayElementOn(
        sideBetOutcomeModal.nextBtn,
        true
      );
      // sideBetOutcomeModal.closeBtn.style.display = "none";
      // sideBetOutcomeModal.nextBtn.style.display = `inline-block`;

      sideBetOutcomeModal.titleField.textContent = `Side Bet Outcome`;

      sideBetOutcomeModal.checkNeedModalScrollbar();

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

      let labelSpan = document.createElement(`span`);
      let valueSpan = document.createElement(`span`);

      let labelContent = document.createTextNode(`Total Winnings: `);
      let valueContent = document.createTextNode(totalWinnings);

      labelSpan.appendChild(labelContent);
      valueSpan.appendChild(valueContent);

      winningsField.appendChild(labelSpan);
      winningsField.appendChild(valueSpan);

      labelSpan.classList.add(`summary-modal__total-winnings-label`);

      // let winningsFieldContent = document.createTextNode(
      //   `Total Winnings: ${totalWinnings}`
      // );
      // winningsField.appendChild(winningsFieldContent);

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
    newDiv.classList.add(`summary-modal__side-bet-div`);

    const nameSpan = createNameElement(name);

    const outcomeDiv = createOutcomeElement(outcome);

    const winConditionSpan = createWinConditionElement(winCondition);

    newDiv.appendChild(nameSpan);
    newDiv.appendChild(outcomeDiv);

    if (outcome == `lose`) {
      newDiv.appendChild(winConditionSpan);
      winConditionSpan.insertAdjacentHTML(`beforebegin`, `<br>`);
      return newDiv;
    }

    let { winnings, sideBetKey } = outcomeObj;

    const checkHandBtn = createCheckHandBtnElement(sideBetKey);

    const winningsSpan = createWinningsElement(winnings);

    newDiv.appendChild(winningsSpan);
    winningsSpan.insertAdjacentHTML(`afterend`, `<br>`);
    newDiv.appendChild(winConditionSpan);
    newDiv.appendChild(checkHandBtn);

    // newDiv.appendChild(checkHandBtn);
    // newDiv.appendChild(winConditionSpan);
    // winConditionSpan.insertAdjacentHTML(`beforebegin`, `<br>`);
    // newDiv.appendChild(winningsSpan);

    return newDiv;

    function createNameElement(name) {
      const nameSpan = document.createElement(`span`);
      let nameSpanContent = document.createTextNode(`${name}: `);
      nameSpan.appendChild(nameSpanContent);

      nameSpan.classList.add(`summary-modal__name-label`);

      return nameSpan;
    }

    function createOutcomeElement(outcome) {
      const outcomeDiv = document.createElement(`div`);
      outcomeDiv.classList.add(`summary-modal__outcome`);
      outcomeDiv.classList.add(`summary-modal__outcome--${outcome}`);
      let outcomeDivContent = document.createTextNode(`${outcome} `);
      outcomeDiv.appendChild(outcomeDivContent);

      return outcomeDiv;
    }

    function createWinConditionElement(winCondition) {
      const winConditionSpan = document.createElement(`span`);
      const winConditionSpanContent = document.createTextNode(
        `Hand Outcome: "${winCondition}"  `
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

      const labelSpan = document.createElement(`span`);
      const valueSpan = document.createElement(`span`);

      const labelContent = document.createTextNode(`Winnings: `);
      const valueContent = document.createTextNode(winnings);

      labelSpan.appendChild(labelContent);
      valueSpan.appendChild(valueContent);

      winningsSpan.appendChild(labelSpan);
      winningsSpan.appendChild(valueSpan);

      labelSpan.classList.add(`summary-modal__winnings-label`);

      winningsSpan.classList.add(`summary-modal__winnings-value`);
      // let winningsSpanContent = document.createTextNode(`${winnings}`);
      // winningsSpan.appendChild(winningsSpanContent);
      return winningsSpan;
    }
  },

  clearModal() {
    this.mainContainer.innerHTML = ` `;
  },
};

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
  toggleDisplayElementOn: toggleDisplayElementOn,

  //replaces both initialSideBetOutcomeWinHand and endingsideBetOutcomeWinHand
  displayModal(event, gameState, phase) {
    let key = event.target.dataset.sideBet;

    let outcomeObj = generateOutcomeObj(key, phase, gameState);

    this.titleField.textContent = `Winning Hand Info`;
    this.sideBetNameField.textContent = outcomeObj.name;
    this.payoutField.textContent = outcomeObj.payout;
    this.winConditionField.textContent = `"${outcomeObj.winCondition}"`;

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
        toggle
          ? winningHandModal.toggleDisplayElementOn(elem, true)
          : winningHandModal.toggleDisplayElementOn(elem, false);
        // toggle ? (elem.style.display = `block`) : (elem.style.display = `none`);
      }

      function displayCards(elem, hand, phase) {
        if (phase == `ending`) hand.simpleImages[0] = hand.simpleUnrevealedCard;
        elem.innerHTML = hand.simpleImages.join();
      }
    }
  },

  resetModal() {
    this.titleField.textContent = `Winning Hand`;

    this.toggleDisplayElementOn(this.sideBetContainer, true);
    this.toggleDisplayElementOn(this.dealerContainer, true);
    this.toggleDisplayElementOn(this.playerContainer, true);
    this.toggleDisplayElementOn(this.winningsContainer, true);
    this.toggleDisplayElementOn(this.closeBtn, true);
    this.toggleDisplayElementOn(this.nextBtn, false);
    this.toggleDisplayElementOn(this.acceptEarlySurrenderBtn, false);
    this.toggleDisplayElementOn(this.declineEarlySurrenderBtn, false);

    earlySurrenderModal.toggleAddClassToModalContainer(false);

    // this.sideBetContainer.style.display = `block`;
    // this.dealerContainer.style.display = `block`;
    // this.playerContainer.style.display = `block`;
    // this.winningsContainer.style.display = `block`;
    // this.closeBtn.style.display = `inline`;
    // this.nextBtn.style.display = `none`;
    // this.acceptEarlySurrenderBtn.style.display = `none`;
    // this.declineEarlySurrenderBtn.style.display = `none`;

    this.dealerCardsField.innerHTML = ` `;
    this.playerCardsField.innerHTML = ` `;
  },
};

export const perfect11sDiceModal = {
  title: document.querySelector(`.generic-modal__title`),
  //replaces displayField
  mainContainer: document.querySelector(`.generic-modal__main`),
  closeBtn: document.querySelector(`.btn-generic-modal__close`),
  nextBtn: document.querySelector(`.btn-generic-modal__next`),
  toggleDisplayElementOn: toggleDisplayElementOn,

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

    this.diceTimer1 = setInterval(this.loopDiceRoll, 75, 1);
    this.diceTimer2 = setInterval(this.loopDiceRoll, 75, 2);
    this.diceTimer3 = setInterval(this.loopDiceRoll, 75, 3);

    function prepareModal() {
      perfect11sDiceModal.toggleDisplayElementOn(
        perfect11sDiceModal.closeBtn,
        false
      );
      perfect11sDiceModal.toggleDisplayElementOn(
        perfect11sDiceModal.nextBtn,
        false
      );
      // perfect11sDiceModal.closeBtn.style.display = `none`;
      // perfect11sDiceModal.nextBtn.style.display = `none`;

      perfect11sDiceModal.title.textContent = `Perfect 11s Dice Roll`;

      perfect11sDiceModal.toggleAddClassToModalContainer(true);
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
      diceContainer.classList.add(`infinity-dice__container`);

      let infinityDice1 = createIndvDiceElement();

      let infinityDice2 = createIndvDiceElement();

      let infinityDice3 = createIndvDiceElement();

      // let infinityDice1 = document.createElement(`h3`);
      // let infinityDice2 = document.createElement(`h3`);
      // let infinityDice3 = document.createElement(`h3`);

      diceContainer.appendChild(infinityDice1);
      diceContainer.appendChild(infinityDice2);
      diceContainer.appendChild(infinityDice3);

      // let diceFields = diceContainer.querySelectorAll(`h3`);
      let diceFields = diceContainer.querySelectorAll(`div`);

      addDataToDiceElements(diceFields, diceRolls);

      return diceContainer;

      function createIndvDiceElement() {
        let infinityDice = document.createElement(`div`);
        let diceSpan = document.createElement(`span`);
        infinityDice.appendChild(diceSpan);

        return infinityDice;
      }

      function addDataToDiceElements(diceFields, diceRolls) {
        Array.from(diceFields).forEach(function (elem, index) {
          elem.classList.add(`infinity-dice-${index + 1}`);
          elem.classList.add(`infinity-dice`);
          elem
            .querySelector(`span`)
            .classList.add(`infinity-dice-${index + 1}__value`);
          elem.dataset.diceRoll = diceRolls[index];
          elem.dataset.loopCounter = 1;
        });
      }
    }

    function createStopBtnElement() {
      let stopBtn = document.createElement(`button`);
      stopBtn.classList.add(`btn-generic-modal__stop-dice`);
      stopBtn.classList.add(`btn-generic-modal__action`);
      stopBtn.dataset.diceCounter = 1;
      let stopBtnContent = document.createTextNode(`Stop Dice!`);
      stopBtn.appendChild(stopBtnContent);

      return stopBtn;
    }

    function createDirectionsFooterElement() {
      let directionsFooter = document.createElement(`div`);
      let stopDirectionsHeading = document.createElement(`h2`);
      let infinityHeading = document.createElement(`h2`);

      let stopDirectionsSpan = document.createTextNode(
        `Press STOP button to stop dice roll.`
      );
      let infinityHeadingSpan = document.createTextNode(
        `Roll 2 or more infinities to win the BONUS`
      );

      stopDirectionsHeading.appendChild(stopDirectionsSpan);
      infinityHeading.appendChild(infinityHeadingSpan);

      directionsFooter.appendChild(stopDirectionsHeading);
      directionsFooter.appendChild(infinityHeading);
      directionsFooter.classList.add(`infinity-dice__directions-footer`);

      // directionsFooter.innerHTML = `Press STOP button to stop dice roll.<br>Roll 2 or more infinities to win the BONUS`;

      return directionsFooter;
    }
  },

  loopDiceRoll(diceNum) {
    let dice = document.querySelector(`.infinity-dice-${diceNum}`);
    let diceSpan = document.querySelector(`.infinity-dice-${diceNum}__value`);

    let loopCount = dice.dataset.loopCounter;

    let dataObj = {};

    if (loopCount == 6) {
      dataObj.text = `\u221E`;
      dataObj.class = `infinity`;
    } else {
      let text;

      dataObj.text = `BLANK`;
      dataObj.class = `blank`;
      if (loopCount == 1) text = `one`;
      if (loopCount == 3) text = `three`;
      if (loopCount == 5) text = `five`;
      if (loopCount % 2 == 0) text = `even`;

      dataObj.modifier = text;
    }

    applyDiceTextProperties(diceSpan, dataObj);

    loopCount == 6
      ? (dice.dataset.loopCounter = 1)
      : (dice.dataset.loopCounter = ++loopCount);

    return;

    function applyDiceTextProperties(diceSpan, dataObj) {
      diceSpan.textContent = dataObj.text;
      perfect11sDiceModal.removeDiceClass(diceSpan);

      if (dataObj.class == `blank`)
        diceSpan.classList.add(
          `infinity-dice__${dataObj.class}-display--${dataObj.modifier}`
        );
      else diceSpan.classList.add(`infinity-dice__${dataObj.class}-display`);
    }
  },

  removeDiceClass(diceSpan) {
    let classArr = [`infinity`, `blank`];

    classArr.forEach(function (str) {
      if (str == `blank`) {
        diceSpan.classList.remove(`infinity-dice__${str}-display--even`);
        diceSpan.classList.remove(`infinity-dice__${str}-display--one`);
        diceSpan.classList.remove(`infinity-dice__${str}-display--three`);
        diceSpan.classList.remove(`infinity-dice__${str}-display--five`);
      } else diceSpan.classList.remove(`infinity-dice__${str}-display`);
    });
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
        clearInterval(this.diceTimer1);
        applyDiceRoll(dice1, diceCounter);
        increaseDiceCounter(diceCounter, stopBtn);
        break;
      case 2:
        clearInterval(this.diceTimer2);
        applyDiceRoll(dice2, diceCounter);
        increaseDiceCounter(diceCounter, stopBtn);
        break;
      case 3:
        clearInterval(this.diceTimer3);
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
      let span = elem.querySelector(`span`);
      perfect11sDiceModal.removeDiceClass(span);

      if (diceRoll == `INFINITY`) {
        span.textContent = `\u221E`;
        span.classList.add(`infinity-dice__infinity-display`);
      } else {
        span.textContent = diceRoll;
        span.classList.add(`infinity-dice__blank-display--default`);
      }
      // elem.innerHTML = `DICE ${diceCounter}: ${diceRoll}`;
    }

    function increaseDiceCounter(diceCounter, stopBtn) {
      diceCounter++;
      stopBtn.dataset.diceCounter = diceCounter;
    }

    function changeBtnsStatus(stopBtn, nextBtn) {
      stopBtn.disabled = true;
      perfect11sDiceModal.toggleDisplayElementOn(nextBtn, true);
      // nextBtn.style.display = `inline-block`;
    }
  },

  toggleAddClassToModalContainer(toggle) {
    toggle
      ? this.mainContainer.classList.add(
          `generic-modal__main--perfect-11s-dice-modal`
        )
      : this.mainContainer.classList.remove(
          `generic-modal__main--perfect-11s-dice-modal`
        );
  },

  clearModal() {
    this.mainContainer.innerHTML = ` `;
  },
};

export const extraBetModal = {
  titleField: document.querySelector(`.extra-bet-modal__title`),
  bankValue: document.querySelector(`.extra-bet-modal__bank-value`),
  baseBetValue: document.querySelector(`.extra-bet-modal__base-bet-value`),
  betValue: document.querySelector(`.extra-bet-modal__bet-value`),
  initialSideBetField: document.querySelector(
    `.extra-bet-modal__initial-side-bet-container`
  ),
  initialSideBetValue: document.querySelector(
    `.extra-bet-modal__initial-side-bet-value`
  ),
  feeField: document.querySelector(`.extra-bet-modal__fee-container`),
  feeValue: document.querySelector(`.extra-bet-modal__fee-value`),
  mainContainer: document.querySelector(`.extra-bet-modal__main`),
  placeExtraBetBtn: document.querySelector(
    `.btn-extra-bet-modal__place-extra-bet`
  ),
  raiseTheRoofBtn: document.querySelector(
    `.btn-extra-bet-modal__raise-the-roof`
  ),
  chipBtns: document.querySelectorAll(`.btn-extra-bet-modal__chip`),
  clearBetBtn: document.querySelector(`.btn-extra-bet-modal__clear-bet`),
  placeBetBtn: document.querySelector(`.btn-extra-bet-modal__place-extra-bet`),
  declineBetBtn: document.querySelector(`.btn-extra-bet-modal__decline-bet`),
  toggleDisplayElementOn: toggleDisplayElementOn,
  enableChipBtn: enableChipBtn,
  disableChipBtn: disableChipBtn,
  toggleDisableBtn: toggleDisableBtn,
  toggleEventListeners: toggleEventListeners,

  //replaces displayExtraBetModal
  displayModal(gameState) {
    changeBtnDisplay(this);

    this.toggleDisplayElementOn(this.initialSideBetField, false);
    this.toggleDisplayElementOn(this.feeField, true);

    let bank = gameState.bank;
    let baseBet = gameState.betObj.baseBet;

    this.titleField.textContent = `Extra Bet Blackjack`;
    this.bankValue.textContent = bank;
    this.baseBetValue.textContent = baseBet;
    this.mainContainer.dataset.sidebet = `extraBetBlackjack`;

    this.checkChipBtnsValid(bank, 0, baseBet);
    this.checkToEnableActionBtns(gameState);

    popbox.open(`extra-bet-modal`);

    function changeBtnDisplay(modal) {
      modal.toggleDisplayElementOn(modal.placeExtraBetBtn, true);
      modal.toggleDisplayElementOn(modal.raiseTheRoofBtn, false);
    }
  },

  //replaces updateExtraBetModalTotal
  updateModalTotal(sideBetObj, gameState) {
    let betTotal = sideBetObj.getTempBet();
    let bank = sideBetObj.getTempBank();
    let fee = sideBetObj.fee;
    let baseBet = gameState.betObj.baseBet;

    this.bankValue.textContent = bank;
    this.betValue.textContent = betTotal;
    this.feeValue.textContent = fee;

    this.checkChipBtnsValid(bank, betTotal, baseBet);
    this.checkToEnableActionBtns(gameState);
  },

  //replaces checkExtraBetChipBtnsValid
  checkChipBtnsValid(value, sideBet, baseBet) {
    this.chipBtns.forEach(function (btn) {
      value >= btn.dataset.value
        ? enableChipBtn(btn, this)
        : disableChipBtn(btn, this);
    }, this);

    let maxValue = baseBet * 5;

    sideBet >= maxValue ? toggleDisableChips(true) : toggleDisableChips(false);

    function enableChipBtn(btn, modal) {
      modal.enableChipBtn(btn);
      btn.dataset.disabledbyvalue = false;
    }

    function disableChipBtn(btn, modal) {
      modal.disableChipBtn(btn);
      btn.dataset.disabledbyvalue = true;
    }

    function toggleDisableChips(toggle) {
      if (toggle) {
        extraBetModal.chipBtns.forEach(function (elem) {
          extraBetModal.disableChipBtn(elem);
        });
      } else {
        extraBetModal.chipBtns.forEach(function (elem) {
          if (elem.dataset.disabledbyvalue) return;
          extraBetModal.enableChipBtn(elem);
        });
      }
    }
  },

  //replaces deactivateExtraBetModal
  deactivateModal() {
    this.bankValue.textContent = 0;
    this.baseBetValue.textContent = 0;
    this.betValue.textContent = 0;
    this.feeValue.textContent = 0;

    this.chipBtns.forEach(function (btn) {
      btn.removeAttribute(`data-disabledbyvalue`);
    });

    this.mainContainer.dataset.sidebet = ` `;

    // listeners.removeExtraBetBlackjackModalListeners();
  },

  checkToEnableActionBtns(gameState) {
    let sideBetObj = gameState.betObj.getSideBet(`extraBetBlackjack`);
    let betValue = sideBetObj.getTempBet();

    betValue > 0 ? enableActionBtns(true) : enableActionBtns(false);

    function enableActionBtns(boolean) {
      extraBetModal.toggleDisableBtn(extraBetModal.clearBetBtn, !boolean);
      extraBetModal.toggleDisableBtn(extraBetModal.placeBetBtn, !boolean);
    }
  },
};

// export function displayExtraBetModal(gameState) {
//   const titleField = document.querySelector(`.extra-bet-modal__title-text`);
//   const bankField = document.querySelector(`.extra-bet-modal__bank-value`);
//   const baseBetField = document.querySelector(`.extra-bet-modal__bet-value`);
//   const mainContainer = document.querySelector(`.extra-bet-modal__main`);
//   const placeExtraBetBtn = document.querySelector(
//     `.btn-extra-bet-modal__place-extra-bet`
//   );
//   const raiseTheRoofBtn = document.querySelector(
//     `.btn-extra-bet-modal__raise-the-roof`
//   );

//   placeExtraBetBtn.style.display = `inline-block`;
//   raiseTheRoofBtn.style.display = `none`;

//   titleField.textContent = `Extra Bet Blackjack`;
//   bankField.textContent = gameState.bank;
//   baseBetField.textContent = gameState.betObj.baseBet;
//   mainContainer.dataset.sidebet = `extraBetBlackjack`;

//   popbox.open(`extra-bet-modal`);
// }

// export function updateExtraBetModalTotal(sideBetObj, gameState) {
//   const bankField = document.querySelector(".extra-bet-modal__bank-value");
//   const betField = document.querySelector(".extra-bet-modal__bet-value");
//   const feeField = document.querySelector(`.extra-bet-modal__fee-value`);

//   let betTotal = sideBetObj.getTempBet();
//   let bank = sideBetObj.getTempBank();
//   let fee = sideBetObj.fee;
//   let baseBet = gameState.betObj.baseBet;

//   bankField.textContent = bank;
//   betField.textContent = betTotal;
//   feeField.textContent = fee;

//   checkExtraBetChipBtnsValid(bank, betTotal, baseBet);
// }

// export function deactivateExtraBetModal() {
//   const bankField = document.querySelector(".extra-bet-modal__bank-value");
//   const betField = document.querySelector(".extra-bet-modal__bet-value");
//   const feeField = document.querySelector(`.extra-bet-modal__fee-value`);
//   const mainContainer = document.querySelector(`.extra-bet-modal__main`);

//   bankField.textContent = 0;
//   betField.textContent = 0;
//   feeField.textContent = 0;

//   mainContainer.dataset.sidebet = ` `;

//   listeners.removeExtraBetBlackjackModalListeners();
// }

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
  actionBtns: document.querySelectorAll(`.btn-house-money-modal__action`),
  toggleEventListeners: toggleEventListeners,

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
      houseMoneyModal.winConditionField.textContent = `"${houseMoneyObj.outcomePackage.winCondition}"`;
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

export const evenMoneyInsuranceModal = {
  modalContainer: document.querySelector(`.generic-modal__main`),
  title: document.querySelector(`.generic-modal__title`),
  nextBtn: document.querySelector(`.btn-generic-modal__next`),
  closeBtn: document.querySelector(`.btn-generic-modal__close`),
  toggleDisplayElementOn: toggleDisplayElementOn,

  //replaces activateEvenMoneyModal and activateInsuranceModal
  activateModal(modalType) {
    //modalType either evenMoney or insurance
    this.title.textContent = `Decide Side Bet`;

    this.toggleAddClassToModalContainer(true);

    this.clearModal();

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

      evenMoneyInsuranceModal.toggleDisplayElementOn(
        evenMoneyInsuranceModal.nextBtn,
        false
      );
      evenMoneyInsuranceModal.toggleDisplayElementOn(
        evenMoneyInsuranceModal.closeBtn,
        false
      );

      // evenMoneyInsuranceModal.nextBtn.style.display = "none";
      // evenMoneyInsuranceModal.closeBtn.style.display = "none";
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

      acceptBetBtn.classList.add(`btn-generic-modal__action`);
      acceptBetBtn.classList.add(`btn-generic-modal__accept-bet`);
      declineBetBtn.classList.add(`btn-generic-modal__action`);

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

    this.toggleDisplayElementOn(this.nextBtn, true);

    // this.nextBtn.style.display = `inline-block`;

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
        roundStatusText = `Continues`;

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

  toggleAddClassToModalContainer(toggle) {
    toggle
      ? this.modalContainer.classList.add(
          `generic-modal__main--even-money-insurance-modal`
        )
      : this.modalContainer.classList.remove(
          `generic-modal__main--even-money-insurance-modal`
        );
  },

  clearModal() {
    this.modalContainer.innerHTML = ` `;
  },
};

export const baseRoundOutcomeModal = {
  mainContainer: document.querySelector(`.generic-modal__main`),
  titleField: document.querySelector(`.generic-modal__title`),
  nextBtn: document.querySelector(`.btn-generic-modal__next`),
  closeBtn: document.querySelector(`.btn-generic-modal__close`),
  toggleDisplayElementOn: toggleDisplayElementOn,

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

      roundOutcomeHeading.classList.add(
        `base-round-outcome-modal__single-hand-outcome-heading--${roundOutcome}`
      );

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

      const winningsLabelSpan = document.createElement(`span`);
      const winningsValueSpan = document.createElement(`span`);

      const winningsLabelContent = document.createTextNode(`Winnings: `);
      const winningsValueContent = document.createTextNode(
        outcomePackage.winnings
      );

      winningsLabelSpan.appendChild(winningsLabelContent);
      winningsValueSpan.appendChild(winningsValueContent);

      winningsHeading.appendChild(winningsLabelSpan);
      winningsHeading.appendChild(winningsValueSpan);
      // const winningsHeadingContent = document.createTextNode(
      //   `Winnings: ${outcomePackage.winnings}`
      // );
      // winningsHeading.appendChild(winningsHeadingContent);

      winningsLabelSpan.classList.add(
        `base-round-outcome-modal__single-hand-winnings-label`
      );

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

      const outcomeDiv = document.createElement(`div`);
      outcomeDiv.classList.add(
        `base-round-outcome-modal__split-hand-outcome-div`
      );

      let handNumSpan = createHandNumElement(handNum);

      let roundOutcomeSpan = createRoundOutcomeElement(
        noticeText,
        roundOutcome
      );

      let outcomeTextSpan = createOutcomeTextElement(outcomeText);

      let winningsSpan = createWinningsElement(winnings);

      outcomeDiv.appendChild(handNumSpan);
      outcomeDiv.appendChild(roundOutcomeSpan);
      outcomeDiv.appendChild(outcomeTextSpan);
      outcomeDiv.appendChild(winningsSpan);

      return outcomeDiv;

      function createHandNumElement(handNum) {
        const handNumSpan = document.createElement(`span`);
        const handNumSpanContent = document.createTextNode(`Hand ${handNum}: `);
        handNumSpan.appendChild(handNumSpanContent);
        handNumSpan.classList.add(
          `base-round-outcome-modal__split-hand-handnum-label`
        );

        return handNumSpan;
      }

      function createRoundOutcomeElement(noticeText, roundOutcome) {
        const roundOutcomeSpan = document.createElement(`span`);
        const roundOutcomeSpanContent = document.createTextNode(
          `${noticeText}  `
        );
        roundOutcomeSpan.appendChild(roundOutcomeSpanContent);
        roundOutcomeSpan.classList.add(
          `base-round-outcome-modal__split-hand-outcome--${roundOutcome}`
        );

        return roundOutcomeSpan;
      }

      function createOutcomeTextElement(outcomeText) {
        const outcomeTextSpan = document.createElement(`span`);
        const outcomeTextSpanContent = document.createTextNode(
          `${outcomeText}`
        );
        outcomeTextSpan.appendChild(outcomeTextSpanContent);

        return outcomeTextSpan;
      }

      function createWinningsElement(winnings) {
        const winningsSpan = document.createElement(`span`);
        const winningsLabelSpan = document.createElement(`span`);
        const winningsValueSpan = document.createElement(`span`);

        const winningsLabelContent = document.createTextNode(`Winnings: `);

        const winningsValueContent = document.createTextNode(winnings);

        winningsLabelSpan.appendChild(winningsLabelContent);
        winningsValueSpan.appendChild(winningsValueContent);

        winningsSpan.appendChild(winningsLabelSpan);
        winningsSpan.appendChild(winningsValueSpan);

        winningsLabelSpan.classList.add(
          `base-round-outcome-modal__split-hand-winnings-label`
        );

        return winningsSpan;
      }

      // const outcomeHeading = document.createElement(`h2`);
      // const outcomeHeadingContent = document.createTextNode(
      //   `Hand ${handNum}: ${noticeText}  ${outcomeText}  Winnings: $${winnings}`
      // );
      // outcomeHeading.appendChild(outcomeHeadingContent);

      // return outcomeHeading;
    }
  },

  clearModal() {
    this.mainContainer.innerHTML = ` `;
  },

  prepareModal() {
    this.titleField.textContent = `Round Outcome`;
    this.toggleDisplayElementOn(this.nextBtn, true);
    this.toggleDisplayElementOn(this.closeBtn, false);

    this.toggleAddClassToModalContainer(true);
    // this.mainContainer.classList.add(`generic-modal__main--base-outcome-modal`);

    this.clearModal();
  },

  toggleAddClassToModalContainer(toggle) {
    toggle
      ? this.mainContainer.classList.add(
          `generic-modal__main--base-outcome-modal`
        )
      : this.mainContainer.classList.remove(
          `generic-modal__main--base-round-outcome-modal`
        );
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

export const totalWinningsModal = {
  winningsField: document.querySelector(`.winnings-modal__winnings-value`),
  winSummaryBtn: document.querySelector(`.btn-winnings-modal__win-summary`),
  closeBtn: document.querySelector(`.btn-winnings-modal__close`),
  toggleEventListeners: toggleEventListeners,

  //replaces displayTotalWinningsModal
  displayModal(gameState) {
    this.winningsField.textContent = gameState.totalWinnings;

    popbox.open(`winnings-modal`);
  },
};

// export function displayTotalWinningsModal(gameState) {
//   const winningsField = document.querySelector(
//     `.winnings-modal__winnings-value`
//   );

//   winningsField.textContent = gameState.totalWinnings;

//   popbox.open(`winnings-modal`);
// }

export const winSummaryModal = {
  modalContainer: document.querySelector(`.summary-modal__container`),
  mainContainer: document.querySelector(`.summary-modal__main`),
  titleField: document.querySelector(`.summary-modal__title`),
  closeBtn: document.querySelector(`.btn-summary-modal__close`),
  nextBtn: document.querySelector(`.btn-summary-modal__next`),
  toggleDisplayElementOn: toggleDisplayElementOn,
  checkNeedModalScrollbar: checkNeedModalScrollbar,
  toggleAddScrollbarToModal: toggleAddScrollbarToModal,

  //replaces displayWinSummaryModal
  displayModal(gameState) {
    this.prepareModal();

    let baseGameDiv = this.createBaseGameSummaryElements(gameState);

    this.mainContainer.appendChild(baseGameDiv);

    let initialOutcomePackages = gameState.betObj.initialOutcomePackages;
    let endingOutcomePackages = gameState.betObj.endingOutcomePackages;

    if (initialOutcomePackages || endingOutcomePackages) {
      let sideBetLabelSpan = this.createSideBetLabelElement();
      this.mainContainer.appendChild(sideBetLabelSpan);
      sideBetLabelSpan.insertAdjacentHTML(`beforebegin`, `<br>`);
    }

    if (initialOutcomePackages)
      initialOutcomePackages.forEach(generateSummaryElements, this);

    if (endingOutcomePackages)
      endingOutcomePackages.forEach(generateSummaryElements, this);

    this.checkNeedModalScrollbar();

    popbox.open(`summary-modal`);

    function generateSummaryElements(outcomeObj) {
      let sideBetDiv = winSummaryModal.createSideBetSummaryElements(outcomeObj);

      winSummaryModal.mainContainer.appendChild(sideBetDiv);
    }
  },

  //replaces createBaseGameSummaryElements
  createBaseGameSummaryElements(gameState) {
    let player = gameState.player;

    const newDiv = document.createElement(`div`);

    let roundLabel = createRoundLabelElement();

    let outcomeElems = createOutcomeElems(player);

    newDiv.appendChild(roundLabel);
    // roundLabel.insertAdjacentHTML(`beforebegin`, `<br>`);

    outcomeElems.forEach(function (elem) {
      newDiv.appendChild(elem);
    });

    return newDiv;

    function createRoundLabelElement() {
      const roundLabel = document.createElement(`h2`);
      let roundLabelContent = document.createTextNode(`Base Round`);
      roundLabel.appendChild(roundLabelContent);

      roundLabel.classList.add(`summary-modal__win-summary-round-label`);

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
    playerDiv.classList.add(`summary-modal__base-round-hand-div`);

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

      return winSummaryModal.createPayoutNodes(payout);

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
    newDiv.classList.add(`summary-modal__side-bet-div`);

    let nameSpan = this.createNameElement(name);

    let outcomeDiv = this.createOutcomeElement(outcome);

    // let payoutSpan = createPayoutElement(payout);

    let payoutSpan = this.createPayoutNodes(payout);

    let winConditionSpan = createWinConditionElement(winCondition);

    let winningsSpan = this.createWinningsElement(winnings);

    newDiv.appendChild(nameSpan);
    newDiv.appendChild(outcomeDiv);
    newDiv.appendChild(winningsSpan);
    winningsSpan.insertAdjacentHTML(`afterend`, `<br>`);
    newDiv.appendChild(winConditionSpan);
    newDiv.appendChild(payoutSpan);

    // newDiv.appendChild(nameSpan);
    // newDiv.appendChild(outcomeDiv);
    // newDiv.appendChild(payoutSpan);
    // payoutSpan.insertAdjacentHTML(`afterend`, `<br>`);
    // newDiv.appendChild(winConditionSpan);
    // newDiv.appendChild(winningsSpan);

    return newDiv;

    // function createPayoutElement(payout) {
    //   const payoutSpan = document.createElement(`span`);
    //   const payoutSpanContent = document.createTextNode(`Payout: ${payout}`);
    //   payoutSpan.appendChild(payoutSpanContent);

    //   return payoutSpan;
    // }

    function createWinConditionElement(winCondition) {
      const winConditionSpan = document.createElement(`span`);
      const winConditionSpanContent = document.createTextNode(
        `Hand Outcome: "${winCondition}"`
      );
      winConditionSpan.appendChild(winConditionSpanContent);

      return winConditionSpan;
    }
  },

  createSideBetLabelElement() {
    const sideBetLabelSpan = document.createElement(`h2`);
    let sideBetLabelContent = document.createTextNode(`Side Bets`);
    sideBetLabelSpan.appendChild(sideBetLabelContent);

    sideBetLabelSpan.classList.add(`summary-modal__win-summary-side-bet-label`);

    return sideBetLabelSpan;
  },

  createNameElement(name) {
    const nameSpan = document.createElement(`span`);
    let nameSpanContent = document.createTextNode(`${name} `);
    nameSpan.appendChild(nameSpanContent);

    nameSpan.classList.add(`summary-modal__name-label`);

    return nameSpan;
  },

  createOutcomeElement(roundOutcome) {
    const outcomeDiv = document.createElement(`div`);
    outcomeDiv.classList.add(`summary-modal__outcome`);
    outcomeDiv.classList.add(`--${roundOutcome}`);
    let outcomeDivContent = document.createTextNode(`${roundOutcome} `);
    // outcomeDiv.style.display = `inline-block`;
    outcomeDiv.appendChild(outcomeDivContent);

    return outcomeDiv;
  },

  createPayoutNodes(payout) {
    const payoutSpan = document.createElement(`span`);

    const labelSpan = document.createElement(`span`);
    const valueSpan = document.createElement(`span`);

    const labelContent = document.createTextNode(`Payout: `);
    const valueContent = document.createTextNode(payout);

    labelSpan.appendChild(labelContent);
    valueSpan.appendChild(valueContent);

    payoutSpan.appendChild(labelSpan);
    payoutSpan.appendChild(valueSpan);

    labelSpan.classList.add(`summary-modal__payout-label`);

    payoutSpan.classList.add(`summary-modal__payout-value`);

    // let payoutSpanContent = document.createTextNode(`Payout: ${payout}`);
    // payoutSpan.appendChild(payoutSpanContent);

    return payoutSpan;
  },

  createWinningsElement(winnings) {
    // const winningsSpan = document.createElement(`span`);

    // let winningsSpanContent = document.createTextNode(`+ $${winnings}`);
    // winningsSpan.appendChild(winningsSpanContent);

    // return winningsSpan;

    const winningsSpan = document.createElement(`span`);

    const labelSpan = document.createElement(`span`);
    const valueSpan = document.createElement(`span`);

    const labelContent = document.createTextNode(`Winnings: `);
    const valueContent = document.createTextNode(winnings);

    labelSpan.appendChild(labelContent);
    valueSpan.appendChild(valueContent);

    winningsSpan.appendChild(labelSpan);
    winningsSpan.appendChild(valueSpan);

    labelSpan.classList.add(`summary-modal__winnings-label`);

    winningsSpan.classList.add(`summary-modal__winnings-value`);

    return winningsSpan;
  },

  clearModal() {
    this.mainContainer.innerHTML = ` `;
  },

  prepareModal() {
    this.toggleDisplayElementOn(this.closeBtn, true);
    this.toggleDisplayElementOn(this.nextBtn, false);

    // this.closeBtn.style.display = "inline-block";
    // this.nextBtn.style.display = `none`;

    this.titleField.textContent = `Win Summary`;

    this.clearModal();
  },
};

export function resetUI() {
  sideBetModal.clearModal();

  gameInfoFields.clearRoundUI();

  gameField.clearRoundUI();
}

export const triviaModal = {
  titleField: document.querySelector(`.trivia-modal__title`),
  questionField: document.querySelector(`.trivia__question`),
  triviaDifficultyBtns: document.querySelectorAll(`.btn__trivia-difficulty`),
  difficultyBtnContainer: document.querySelector(
    `.trivia-modal__difficulty-btn-container`
  ),

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
    multChoiceBtnContainer: document.querySelector(
      `.trivia-modal__multiple-choice-btn-container`
    ),
    multChoiceBtns: document.querySelectorAll(`.btn__answer-multiple`),
    //replaces answerABtn - answerDBtn, trueBtn, falseBtn
    btnA: document.querySelector(`.btn__answer-a`),
    btnB: document.querySelector(`.btn__answer-b`),
    btnC: document.querySelector(`.btn__answer-c`),
    btnD: document.querySelector(`.btn__answer-d`),
    boolChoiceBtnContainer: document.querySelector(
      `.trivia-modal__boolean-choice-btn-container`
    ),
    boolChoiceBtns: document.querySelectorAll(`.btn__answer-boolean`),
    btnTrue: document.querySelector(`.btn__answer-true`),
    btnFalse: document.querySelector(`.btn__answer-false`),
  },

  correctAnswer: {
    //replaces correctAnswerField and Text
    field: document.querySelector(`.trivia-modal__answer-correct-container`),
    text: document.querySelector(`.trivia-modal__answer-correct`),
  },
  toggleDisplayElementOn: toggleDisplayElementOn,

  //replaces renderTriviaQuestion
  renderQuestion(questionObj) {
    this.toggleDisplayElementOn(this.difficultyBtnContainer, false);
    // this.toggleDisplayDifficultyBtns(false);

    displayQuestionInfo(questionObj);

    renderBtns(questionObj);

    console.log(questionObj.correctAnswer);

    function displayQuestionInfo(questionObj) {
      triviaModal.toggleDisplayElementOn(triviaModal.label.container, true);
      // triviaModal.label.container.style.display = `flex`;

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
    this.toggleDisplayElementOn(this.answerTable.field, true);
    // this.answerTable.field.classList.remove(`display-none`);

    //reveals multiple choice btn container
    this.toggleDisplayElementOn(this.answerBtns.multChoiceBtnContainer, true);

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
      triviaModal.answerTable.fieldA.textContent = questionObj.answerChoices[0];
      triviaModal.answerTable.fieldB.textContent = questionObj.answerChoices[1];
      triviaModal.answerTable.fieldC.textContent = questionObj.answerChoices[2];
      triviaModal.answerTable.fieldD.textContent = questionObj.answerChoices[3];
    }

    function setCorrectAnswerToBtn(questionObj) {
      triviaModal.answerBtns.multChoiceBtns.forEach(function (btn) {
        let answer = btn.getAttribute("data-ans");
        if (answer == questionObj.correctAnswer) {
          btn.classList.add("correctAnswer");
        }

        // triviaModal.toggleDisplayElementOn(btn, true);
        // btn.style.display = `inline-block`;
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
      triviaModal.toggleDisplayElementOn(
        triviaModal.answerBtns.boolChoiceBtnContainer,
        true
      );
      // triviaModal.answerBtns.boolChoiceBtns.forEach(function (btn) {
      //   btn.style.display = `inline-block`;
      // });
    }
  },

  //replaces toggleDisplayTriviaDifficultyBtns
  toggleDisplayDifficultyBtns(toggle) {
    this.toggleDisplayElementOn(this.difficultyBtnContainer, toggle);
    // let displayValue;

    // toggle ? (displayValue = `inline-block`) : (displayValue = `none`);

    // this.triviaDifficultyBtns.forEach(function (btn) {
    //   btn.style.display = displayValue;
    // });
  },

  //replaces displayTriviaCorrectAnswer
  displayCorrectAnswer(questionObj) {
    this.toggleDisplayElementOn(this.correctAnswer.field, true);
    // this.correctAnswer.field.style.display = `block`;
    this.correctAnswer.text.innerHTML = questionObj.correctAnswer;
  },

  //replaces renderTriviaCorrectAnswer
  renderPlayerCorrectResult() {
    this.toggleApplyCorrectAnswerColor(true);
    // document.querySelector(".correctAnswer").style.backgroundColor = `green`;
    this.titleField.textContent = `Correct Answer!`;
    this.changeModalTitleState(`correctAnswer`);
    // this.titleField.style.color = `green`;
  },

  //replaces renderTriviaIncorrectAnswer
  renderPlayerIncorrectResult(event) {
    this.toggleApplyCorrectAnswerColor(true);
    // document.querySelector(".correctAnswer").style.backgroundColor = `green`;

    this.toggleApplyIncorrectAnswerColor(true, event.target);
    // event.target.id = `incorrectAnswer`;

    this.titleField.textContent = `Wrong Answer...`;
    this.changeModalTitleState(`incorrectAnswer`);
    // this.titleField.style.color = `red`;
  },

  toggleApplyCorrectAnswerColor(toggle) {
    toggle
      ? document
          .querySelector(`.correctAnswer`)
          .classList.add(`correctAnswer--display`)
      : document
          .querySelector(`.correctAnswer`)
          .classList.remove(`correctAnswer--display`);
  },

  toggleApplyIncorrectAnswerColor(toggle, elem = null) {
    toggle
      ? (elem.id = `incorrectAnswer`)
      : document.querySelector(`#incorrectAnswer`).removeAttribute(`id`);
  },

  changeModalTitleState(state) {
    let stateArr = [`correctAnswer`, `incorrectAnswer`];

    if (state == `default`) {
      stateArr.forEach(function (state) {
        this.titleField.classList.remove(`trivia-modal__title--${state}`);
      }, this);
    } else this.titleField.classList.add(`trivia-modal__title--${state}`);
  },

  //replaces resetTriviaModal
  resetModal(answerCorrectly) {
    this.clearModalFields();
    this.clearAnswerBtnData(answerCorrectly);
    this.resetCreditsModifier();
    this.toggleDisplayElementOn(this.difficultyBtnContainer, true);
    // this.toggleDisplayDifficultyBtns(true);
    this.resetAnswerBtns();
    popbox.close(`trivia-modal`);
  },

  //replaces clearTriviaUI
  clearModalFields() {
    this.titleField.textContent = `Hit Trivia Question`;
    this.titleField.style.color = `white`;

    this.label.categoryField.textContent = ``;
    this.label.difficultyField.textContent = ``;
    this.toggleDisplayElementOn(this.label.container, false);
    // this.label.container.style.display = `none`;

    this.correctAnswer.text.innerHTML = ` `;
    this.toggleDisplayElementOn(this.correctAnswer.field, false);
    // this.correctAnswer.field.style.display = `none`;

    this.questionField.textContent = `Select Trivia Difficulty`;
    this.changeModalTitleState(`default`);

    this.toggleDisplayElementOn(this.answerTable.field, false);
    // this.answerTable.field.classList.add(`display-none`);
    this.answerTable.answerValueFields.forEach(function (elem) {
      elem.textContent = ` `;
    });
  },

  //replaces clearAnswerBtnData
  clearAnswerBtnData(answerCorrectly) {
    this.answerBtns.multChoiceBtns.forEach(function (elem) {
      elem.removeAttribute(`data-ans`);
    });

    this.toggleApplyCorrectAnswerColor(false);
    // document.querySelector(".correctAnswer--style").style.backgroundColor = `grey`;
    document.querySelector(`.correctAnswer`).classList.remove(`correctAnswer`);

    if (!answerCorrectly) {
      this.toggleApplyIncorrectAnswerColor(false);
      // document.querySelector(`#incorrectAnswer`).removeAttribute(`id`);
    }
  },

  //replaces renderTriviaCredits
  renderCredits(credits, modifier = null) {
    this.credits.field.textContent = credits;

    if (modifier == `minus1`)
      this.toggleDisplayElementOn(this.credits.minus1Modifier, true);
    if (modifier == `plus1`)
      this.toggleDisplayElementOn(this.credits.plus1Modifier, true);
    if (modifier == `plus5`)
      this.toggleDisplayElementOn(this.credits.plus5Modifier, true);
  },

  //replaces resetTriviaCreditsModifier
  resetCreditsModifier() {
    this.credits.modifiers.forEach(function (elem) {
      this.toggleDisplayElementOn(elem, false);
    }, this);
  },

  //replaces resetTriviaBtns
  resetAnswerBtns() {
    this.toggleDisableAnswerBtns(false);

    this.toggleDisplayElementOn(this.answerBtns.multChoiceBtnContainer, false);
    this.toggleDisplayElementOn(this.answerBtns.boolChoiceBtnContainer, false);

    // this.answerBtns.allBtns.forEach(function (btn) {
    //   btn.style.display = `none`;
    // });
  },

  //replaces toggleDisableTriviaAnswerBtns
  toggleDisableAnswerBtns(toggle) {
    let disableValue;

    toggle ? (disableValue = true) : (disableValue = false);

    this.answerBtns.allBtns.forEach(function (btn) {
      btn.disabled = disableValue;
    });
  },

  toggleEventListeners(funcObj, toggle) {
    if (toggle == `add`) {
      this.triviaDifficultyBtns.forEach(function (elem) {
        elem.addEventListener(`click`, funcObj.triviaDifficultyBtns);
      });

      this.answerBtns.allBtns.forEach(function (elem) {
        elem.addEventListener(`click`, funcObj.answerBtns);
      });
    } else {
      this.triviaDifficultyBtns.forEach(function (elem) {
        elem.removeEventListener(`click`, funcObj.triviaDifficultyBtns);
      });

      this.answerBtns.allBtns.forEach(function (elem) {
        elem.removeEventListener(`click`, funcObj.answerBtns);
      });
    }
  },
};

function toggleDisplayElementOn(elem, toggle) {
  toggle
    ? elem.classList.remove(`display-none`)
    : elem.classList.add(`display-none`);
}

export const earlySurrenderModal = {
  titleField: document.querySelector(`.winning-hand-modal__title`),
  sideBetContainer: document.querySelector(
    `.winning-hand-modal__side-bet-name-container`
  ),
  cardInfoContainer: document.querySelector(
    `.winning-hand-modal__card-info-container`
  ),
  dealerCardsContainer: document.querySelector(
    `.winning-hand-modal__dealer-cards-container`
  ),
  dealerField: document.querySelector(`.winning-hand-modal__dealer-cards`),
  playerCardsContainer: document.querySelector(
    `.winning-hand-modal__player-cards-container`
  ),
  playerField: document.querySelector(`.winning-hand-modal__player-cards`),
  winningsInfoContainer: document.querySelector(
    `.winning-hand-modal__winnings-info-container`
  ),
  closeBtn: document.querySelector(`.btn-winning-hand-modal__close`),
  nextBtn: document.querySelector(`.btn-winning-hand-modal__next`),
  acceptBtn: document.querySelector(
    `.btn-winning-hand-modal__accept-early-surrender`
  ),
  declineBtn: document.querySelector(
    `.btn-winning-hand-modal__decline-early-surrender`
  ),
  // mainContainer: document.querySelector(`.winning-hand-modal__main`),
  footer: document.querySelector(`.winning-hand-modal__footer`),
  toggleDisplayElementOn: toggleDisplayElementOn,
  toggleEventListeners: toggleEventListeners,

  //replaces activateEarlySurrenderModal
  activateModal(gameState) {
    let playerHand = gameState.player.hand;
    let dealerHand = gameState.dealer.hand;

    this.titleField.textContent = `Surrender Hand?`;

    this.toggleAddClassToModalContainer(true);

    displayModalUI(this);

    renderModalCardDisplay(playerHand, dealerHand, this);

    popbox.open(`winning-hand-modal`);

    function displayModalUI(modal) {
      modal.toggleDisplayElementOn(modal.sideBetContainer, false);
      modal.toggleDisplayElementOn(modal.winningsInfoContainer, false);
      modal.toggleDisplayElementOn(modal.closeBtn, false);
      modal.toggleDisplayElementOn(modal.nextBtn, false);
      modal.toggleDisplayElementOn(modal.acceptBtn, true);
      modal.toggleDisplayElementOn(modal.declineBtn, true);
    }

    function renderModalCardDisplay(playerHand, dealerHand, modal) {
      modal.toggleDisplayElementOn(modal.dealerCardsContainer, true);
      modal.toggleDisplayElementOn(modal.playerCardsContainer, true);

      modal.dealerField.innerHTML = dealerHand.simpleImages.join();
      modal.playerField.innerHTML = playerHand.simpleImages.join();
    }
  },

  toggleAddClassToModalContainer(toggle) {
    if (toggle) {
      this.cardInfoContainer.classList.add(
        `winning-hand-modal__card-info-container--early-surrender-modal`
      );
      this.footer.classList.add(
        `winning-hand-modal__footer--early-surrender-modal`
      );
    } else {
      this.cardInfoContainer.classList.remove(
        `winning-hand-modal__card-info-container--early-surrender-modal`
      );
      this.footer.classList.remove(
        `winning-hand-modal__footer--early-surrender-modal`
      );
    }
  },
};

// export function activateEarlySurrenderModal(gameState) {
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

//   let playerHand = gameState.player.hand;
//   let dealerHand = gameState.dealer.hand;

//   titleField.textContent = `Surrender Hand?`;

//   sideBetContainer.style.display = `none`;
//   dealerCardsContainer.style.display = `block`;
//   playerCardsContainer.style.display = `block`;
//   winningsInfoContainer.style.display = `none`;
//   closeBtn.style.display = `none`;
//   nextBtn.style.display = `none`;
//   acceptBtn.style.display = `inline`;
//   declineBtn.style.display = `inline`;

//   dealerField.innerHTML = dealerHand.simpleImages.join();
//   playerField.innerHTML = playerHand.simpleImages.join();

//   popbox.open(`winning-hand-modal`);
// }
