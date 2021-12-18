import { jest } from "@jest/globals";
import State, { startNewRound, btnsArr } from "./controller.js";
import { renderNoticeText, renderBetAmount } from "./view.js";
import { player, gameInfo, updateGameActive } from "./blackjack-model.js";

// jest.mock("./controller-2.js");

document.body.innerHTML = `
<h1 class="notice">hello</h1>
<span class="bank"></span>
<span class="betAmount"></span>
<span class="splitBetAmount"></span>
<span class="insuranceBetAmount"></span>
<span class="#betValue"></span>
<button class="btn__newGame" style="display:inline-block"></button>
<button class="btn__endGame" style="display:inline-block"></button>
<button class="btn__submitBetValue" style="display:inline-block"></button>
<button class="btn__deal-cards" style="display:inline-block"></button>
<button class="btn__hit" style="display:inline-block"></button>
<button class="btn__doubleDown" style="display:inline-block"></button>
<button class="btn__stand" style="display:inline-block"></button>
<button class="btn__split" style="display:none"></button>
<button class="btn__insurance" style="display:inline-block"></button>
<span class="playerHand"></span>
<span class="playerHandTotal"></span>`;

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
let testGameState;
let bank = 1000;

describe(`Testing State methods that set state properties`, () => {
  let testPlayer, testGameInfo;

  beforeEach(() => {
    testGameState = new State(bank);
    // testPlayer = deepCopy(player);
    // testGameInfo = deepCopy(gameInfo);
  });

  test(`it should make state.gameActive true `, () => {
    testGameState.gameActive = false;
    testGameState.toggleGameActive(true);

    expect(testGameState.gameActive).toBe(true);
  });

  test(`state.updateBank() should make state.bank a num and render that number to HTML `, () => {
    const bank = 1000;

    const bankUI = document.querySelector(".bank");

    testGameState.updateBank = bank;

    expect(testGameState.bank).toBe(1000);
    expect(Number(bankUI.textContent)).toEqual(bank);
  });

  test(`state.updateBetAmount() should make state.betAmount a num and render that number to HTML `, () => {
    const betAmount = 100;

    const betAmountUI = document.querySelector(".betAmount");

    testGameState.updateBetAmount = betAmount;

    expect(testGameState.betAmount).toBe(100);
    expect(Number(betAmountUI.textContent)).toEqual(betAmount);
  });

  test(`state.currentBank should make state.bank a number and render that number to HTML `, () => {
    const updatedBank = 1200;
    testGameState.currentBank = updatedBank;

    expect(testGameState.bank).toBe(1200);
    expect(typeof testGameState.bank).toBe(`number`);
  });

  test(`state.updateNoticeText should make state.noticeText a str and render that string to HTML `, () => {
    const message = `Player's Turn...`;

    const noticeTextUI = document.querySelector(".notice");

    testGameState.updateNoticeText = message;

    expect(testGameState.noticeText).toBe(message);
    expect(noticeTextUI.textContent).toEqual(message);
  });
});

describe(`testing that state can change the page visibility of buttons`, () => {
  beforeEach(() => {
    testGameState = new State(bank);
    // testPlayer = deepCopy(player);
    // testGameInfo = deepCopy(gameInfo);
  });

  test(`nav buttons can toggle visibility`, () => {
    let changeObj;
    const newGameBtn = document.querySelector(".btn__newGame");
    const endGameBtn = document.querySelector(".btn__endGame");

    changeObj = { newGame: false, endGame: true };

    testGameState.updateVisibleNavBtns = changeObj;

    expect(testGameState.navBtnVisible).toMatchObject(changeObj);
    expect(newGameBtn.style.display).toBe(`none`);
    expect(endGameBtn.style.display).toBe(`inline-block`);

    changeObj = { newGame: true, endGame: false };

    testGameState.updateVisibleNavBtns = changeObj;

    expect(testGameState.navBtnVisible).toMatchObject(changeObj);
    expect(newGameBtn.style.display).toBe(`inline-block`);
    expect(endGameBtn.style.display).toBe(`none`);
  });

  test(`game buttons can toggle visibility`, () => {
    let changeObj;

    const hitBtn = document.querySelector(".btn__hit");
    const standBtn = document.querySelector(".btn__stand");
    const splitBtn = document.querySelector(".btn__split");
    const insuranceBtn = document.querySelector(".btn__insurance");

    changeObj = { hit: true, stand: true };

    testGameState.updateVisibleGameBtns = changeObj;

    expect(testGameState.gameBtnVisible).toMatchObject(changeObj);
    expect(testGameState.gameBtnVisible).toMatchObject({ hit: true });
    expect(testGameState.gameBtnVisible).toMatchObject({ insurance: false });
    expect(testGameState.gameBtnVisible).not.toMatchObject({ stand: false });
    expect(hitBtn.style.display).toBe(`inline-block`);
    expect(standBtn.style.display).toBe(`inline-block`);
    expect(splitBtn.style.display).toBe(`none`);

    changeObj = { split: true, insurance: true, stand: false };

    testGameState.updateVisibleGameBtns = changeObj;

    expect(testGameState.gameBtnVisible).toMatchObject(changeObj);
    expect(testGameState.gameBtnVisible).toMatchObject({ insurance: true });
    expect(testGameState.gameBtnVisible).not.toMatchObject({ split: false });
    expect(testGameState.gameBtnVisible).toMatchObject({ hit: true });
    expect(testGameState.gameBtnVisible).toMatchObject({ stand: false });
    expect(splitBtn.style.display).toBe(`inline-block`);
    expect(standBtn.style.display).toBe(`none`);
    expect(insuranceBtn.style.display).toBe(`inline-block`);
    expect(hitBtn.style.display).toBe(`inline-block`);
  });

  test(`state.updateSplitAvailable() changes split btn visibility`, () => {
    const splitBtn = document.querySelector(".btn__split");

    testGameState.updateVisibleGameBtns = { split: false };

    testGameState.updateSplitAvailable = false;

    expect(testGameState.splitAvailable).toBe(false);
    expect(testGameState.gameBtnVisible).toMatchObject({ split: false });
    expect(splitBtn.style.display).toBe(`none`);

    testGameState.updateSplitAvailable = true;

    expect(testGameState.splitAvailable).toBe(true);
    expect(testGameState.gameBtnVisible).toMatchObject({ split: true });
    expect(splitBtn.style.display).toBe(`inline-block`);
  });
});

describe(`Testing that state can update card hands and display them on HTML`, () => {
  const hand = {
    cards: [
      {
        code: "QH",
        image: `"https://deckofcardsapi.com/static/img/QH.png"`,
        suit: `HEARTS`,
        value: `QUEEN`,
      },
      {
        code: `6H`,
        image: `https://deckofcardsapi.com/static/img/6H.png`,
        suit: `HEARTS`,
        value: `6`,
      },
    ],
    images: [
      `<img src="https://deckofcardsapi.com/static/img/QH.png" class="card">`,
      `<img src="https://deckofcardsapi.com/static/img/6H.png" class="card">`,
    ],
    total: 16,
  };

  const correctHandOutput = `<img src="https://deckofcardsapi.com/static/img/QH.png" class="card">,<img src="https://deckofcardsapi.com/static/img/6H.png" class="card">`;

  test(`Hand gets added to State and added to HTML`, () => {
    const playerHandUI = document.querySelector(".playerHand");
    const playerHandTotalUI = document.querySelector(".playerHandTotal");

    testGameState.updatePlayerHand = hand;

    expect(testGameState.playerHand.cards).toMatchObject(hand.cards);
    expect(testGameState.playerHand.images).toEqual(
      expect.arrayContaining(hand.images)
    );
    expect(testGameState.playerHand.total).toBe(hand.total);
    expect(playerHandUI.innerHTML).toBe(correctHandOutput);
    expect(Number(playerHandTotalUI.textContent)).toBe(hand.total);
  });
});
