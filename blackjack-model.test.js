import { jest } from "@jest/globals";
import State from "./controller.js";
import { player, gameInfo } from "./blackjack-model.js";

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

describe(`Testing add a card to a player's hand and calculating hand's total`, () => {
  test(`Adding a card`, () => {
    let testPlayer = player;

    let card = {
      code: "AC",
      image: "https://deckofcardsapi.com/static/img/AC.png",
      suit: `CLUBS`,
      value: `ACE`,
    };

    let image = `<img src="https://deckofcardsapi.com/static/img/AC.png" class="card">`;

    let cardsArr = [];
    let imagesArr = [];
    cardsArr.push(card);
    imagesArr.push(image);

    testPlayer.addCardToHand = card;

    expect(testPlayer.hand.cards).toContain(card);
    expect(testPlayer.hand.images).toEqual(expect.arrayContaining(imagesArr));
    expect(testPlayer.hand.total).toBe(11);
  });

  test(`Adding 5 cards`, () => {
    let testPlayer = player;

    let card1 = {
      code: "AC",
      image: "https://deckofcardsapi.com/static/img/AC.png",
      suit: `CLUBS`,
      value: `ACE`,
    };

    let card2 = {
      code: "2C",
      image: "https://deckofcardsapi.com/static/img/2C.png",
      suit: `CLUBS`,
      value: `2`,
    };

    let card3 = {
      code: "2S",
      image: "https://deckofcardsapi.com/static/img/2S.png",
      suit: `SPADES`,
      value: `2`,
    };

    let card4 = {
      code: "2H",
      image: "https://deckofcardsapi.com/static/img/2H.png",
      suit: `HEARTS`,
      value: `2`,
    };

    let card5 = {
      code: "AD",
      image: "https://deckofcardsapi.com/static/img/AD.png",
      suit: `DIAMONDS`,
      value: `ACE`,
    };

    let image1 = `<img src="https://deckofcardsapi.com/static/img/AC.png" class="card">`;
    let image2 = `<img src="https://deckofcardsapi.com/static/img/2C.png" class="card">`;
    let image3 = `<img src="https://deckofcardsapi.com/static/img/2S.png" class="card">`;
    let image4 = `<img src="https://deckofcardsapi.com/static/img/2H.png" class="card">`;
    let image5 = `<img src="https://deckofcardsapi.com/static/img/AD.png" class="card">`;

    let cardsArr = [];
    let imagesArr = [];

    cardsArr.push(card1);
    cardsArr.push(card2);
    cardsArr.push(card3);
    cardsArr.push(card4);
    cardsArr.push(card5);
    imagesArr.push(image1);
    imagesArr.push(image2);
    imagesArr.push(image3);
    imagesArr.push(image4);
    imagesArr.push(image5);
    testPlayer.addCardToHand = card1;
    testPlayer.addCardToHand = card2;
    testPlayer.addCardToHand = card3;
    testPlayer.addCardToHand = card4;
    testPlayer.addCardToHand = card5;

    expect(testPlayer.hand.cards).toEqual(expect.arrayContaining(cardsArr));
    expect(testPlayer.hand.images).toEqual(expect.arrayContaining(imagesArr));
    expect(testPlayer.hand.total).toBe(18);
  });
});
