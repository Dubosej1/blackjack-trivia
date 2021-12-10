import { jest } from "@jest/globals";
import State from "./controller-2.js";
import { player, gameInfo } from "./blackjack-model-2.js";

describe(`Testing calculating a card's value`, () => {
  test(`Testing 2 regular cards`, () => {
    let hand = [
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
    ];

    expect(player.calculateHandTotal(hand)).toBe(16);
  });

  test(`Testing 5 regular cards`, () => {
    let hand = [
      {
        code: "2H",
        image: `"https://deckofcardsapi.com/static/img/2H.png"`,
        suit: `HEARTS`,
        value: `2`,
      },
      {
        code: `2D`,
        image: `https://deckofcardsapi.com/static/img/2D.png`,
        suit: `DIAMONDS`,
        value: `2`,
      },
      {
        code: "2C",
        image: `"https://deckofcardsapi.com/static/img/2C.png"`,
        suit: `CLUBS`,
        value: `2`,
      },
      {
        code: `2S`,
        image: `https://deckofcardsapi.com/static/img/2S.png`,
        suit: `SPADES`,
        value: `2`,
      },
      {
        code: `KH`,
        image: `https://deckofcardsapi.com/static/img/KH.png`,
        suit: `HEARTS`,
        value: `KING`,
      },
    ];

    expect(player.calculateHandTotal(hand)).toBe(18);
  });

  test(`Testing 2 Aces.  Should be 1 regular ace and 1 acelow`, () => {
    let hand = [
      {
        code: "5H",
        image: `"https://deckofcardsapi.com/static/img/5H.png"`,
        suit: `HEARTS`,
        value: `5`,
      },
      {
        code: `AD`,
        image: `https://deckofcardsapi.com/static/img/AD.png`,
        suit: `DIAMONDS`,
        value: `ACE`,
      },
      {
        code: "AC",
        image: `"https://deckofcardsapi.com/static/img/AC.png"`,
        suit: `CLUBS`,
        value: `ACE`,
      },
    ];

    expect(player.calculateHandTotal(hand)).toBe(17);
  });

  test(`Testing whether calculateHandTotal() recognizes 2 ACELOWs`, () => {
    let hand = [
      {
        code: "JH",
        image: `"https://deckofcardsapi.com/static/img/JH.png"`,
        suit: `HEARTS`,
        value: `JACK`,
      },
      {
        code: `AD`,
        image: `https://deckofcardsapi.com/static/img/AD.png`,
        suit: `DIAMONDS`,
        value: `ACE`,
      },
      {
        code: "AC",
        image: `"https://deckofcardsapi.com/static/img/AC.png"`,
        suit: `CLUBS`,
        value: `ACE`,
      },
    ];

    expect(player.calculateHandTotal(hand)).toBe(12);
  });
});
