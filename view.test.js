import { jest } from "@jest/globals";
import {
  renderNoticeText,
  renderBtnVisibility,
  renderBank,
  renderBetAmount,
} from "./view.js";
import State, { btnsArr } from "./controller.js";

document.body.innerHTML = `
<h1 class="notice">hello</h1>
<span class="bank"></span>
<span class="betAmount"></span>
<span class="splitBetAmount"></span>
<span class="insuranceBetAmount"></span>
<span class="#betValue"></span>
<button class="btn__newGame" style="display:none"></button>
<button class="btn__endGame" style="display:none"></button>
<button class="btn__submitBetValue" style="display:none"></button>
<button class="btn__deal-cards" style="display:none"></button>
<button class="btn__hit" style="display:none"></button>
<button class="btn__doubleDown" style="display:none"></button>
<button class="btn__stand" style="display:none"></button>
<button class="btn__split" style="display:none"></button>
<button class="btn__insurance" style="display:none"></button>
<span class="playerHand"></span>
<span class="playerHandTotal"></span>`;

describe(`Testing that certain buttons are rendered to web page`, () => {
  const newGameBtn = document.querySelector(".btn__newGame");
  const endGameBtn = document.querySelector(".btn__endGame");
  const submitBetBtn = document.querySelector(".btn__submitBetValue");
  const hitBtn = document.querySelector(".btn__hit");
  const standBtn = document.querySelector(".btn__stand");
  const doubleDownBtn = document.querySelector(".btn__doubleDown");
  const splitBtn = document.querySelector(".btn__split");
  const insuranceBtn = document.querySelector(".btn__insurance");

  const createBtnObj = function (obj) {
    let btnObj = { array: btnsArr, ...obj };
    return btnObj;
  };

  test(`Testing if nav buttons will render`, () => {
    let btnObj;

    btnObj = createBtnObj({ newGame: true, endGame: false });

    renderBtnVisibility(btnObj);

    expect(newGameBtn.style.display).toBe(`inline-block`);
    expect(endGameBtn.style.display).toBe(`none`);

    btnObj = createBtnObj({ newGame: false, endGame: true });

    renderBtnVisibility(btnObj);

    expect(newGameBtn.style.display).toBe(`none`);
    expect(endGameBtn.style.display).toBe(`inline-block`);
  });

  test(`Testing if game buttons will render`, () => {
    let btnObj;

    btnObj = createBtnObj({ hit: true, stand: false });

    renderBtnVisibility(btnObj);

    expect(hitBtn.style.display).toBe(`inline-block`);
    expect(standBtn.style.display).toBe(`none`);

    btnObj = createBtnObj({ insurance: true, split: false });

    renderBtnVisibility(btnObj);

    expect(insuranceBtn.style.display).toBe(`inline-block`);
    expect(splitBtn.style.display).toBe(`none`);

    btnObj = createBtnObj({ submitBet: true, hit: false, doubleDown: false });

    renderBtnVisibility(btnObj);

    expect(submitBetBtn.style.display).toBe(`inline-block`);
    expect(hitBtn.style.display).toBe(`none`);
    expect(doubleDownBtn.style.display).toBe(`none`);
    expect(hitBtn.style.display).not.toBe(`inline-block`);
  });
});

describe(`Testing displaying various text on the page`, () => {
  test(`text should be rendered to the game's message display `, () => {
    const noticeUI = document.querySelector(".notice");

    let message = `Please work Mr. Test`;
    renderNoticeText(message);

    expect(noticeUI.innerHTML).toEqual(message);

    message = `Hand 1: Player Wins! <br> Hand 2: Dealer Wins...Player loses....`;

    renderNoticeText(message);

    expect(noticeUI.innerHTML).toBe(message);
  });

  test(`bank should be displayed on screen `, () => {
    const bankUI = document.querySelector(".bank");

    let bank = 100;
    renderBank(bank);

    expect(Number(bankUI.textContent)).toEqual(bank);
  });

  test(`Regular, Split and Insurance bets should be displayed on screen `, () => {
    const betAmountUI = document.querySelector(".betAmount");
    const splitBetAmountUI = document.querySelector(".splitBetAmount");
    const insuranceBetAmountUI = document.querySelector(".insuranceBetAmount");
    const _ = undefined;

    let betAmount = 100;
    renderBetAmount(betAmount);

    expect(Number(betAmountUI.textContent)).toEqual(100);

    let splitBetAmount = 50;
    renderBetAmount(betAmount, splitBetAmount);

    expect(Number(betAmountUI.textContent)).toEqual(100);
    expect(Number(splitBetAmountUI.textContent)).toEqual(50);

    let insuranceBetAmount = 500;
    renderBetAmount(betAmount, splitBetAmount, insuranceBetAmount);

    expect(Number(betAmountUI.textContent)).toEqual(100);
    expect(Number(splitBetAmountUI.textContent)).toEqual(50);
    expect(Number(insuranceBetAmountUI.textContent)).toEqual(500);

    splitBetAmount = 200;
    insuranceBetAmount = 250;
    renderBetAmount(betAmount, _, insuranceBetAmount);

    expect(Number(betAmountUI.textContent)).toEqual(100);
    expect(Number(splitBetAmountUI.textContent)).toEqual(50);
    expect(Number(insuranceBetAmountUI.textContent)).toEqual(250);

    insuranceBetAmount = 750;
    renderBetAmount(betAmount, splitBetAmount);

    expect(Number(splitBetAmountUI.textContent)).toEqual(200);
    expect(Number(insuranceBetAmountUI.textContent)).not.toEqual(750);
  });
});
