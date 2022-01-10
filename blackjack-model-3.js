import * as testCard from "./test-cards.js";

class Cardholder {
  constructor() {
    this.hand = {
      cards: [],
      images: [],
      simpleImages: [],
      endTags: [],
      total: 0,
    };
  }

  set addCardToHand(card) {
    this.hand.cards.push(card);
    this.hand.total = this.calculateHandTotal(this.hand.cards);
    // this.hand.images.push(`<img src="${card.image}" class="card">`);
    // this.hand.total = this.calculateHandTotal(this.hand.cards);
  }

  get getHand() {
    return this.hand;
  }

  calculateHandTotal(cards) {
    let handValueArr = cards.map((card) => card.value);
    // let numberArr = handValue.map(getCardValue);

    return getHandValue(handValueArr);

    function getHandValue(arr) {
      let total = arr.map(getCardValue).reduce((acc, cur) => acc + cur);

      if (total > 21 && arr.includes("ACE")) {
        let index = arr.indexOf("ACE");
        arr[index] = "ACELOW";
        total = getHandValue(arr);
      }

      return total;

      function getCardValue(value) {
        let num;

        switch (value) {
          case "JACK":
            num = 10;
            break;
          case "QUEEN":
            num = 10;
            break;
          case "KING":
            num = 10;
            break;
          case "ACE":
            num = 11;
            break;
          case "ACELOW":
            num = 1;
            break;
          default:
            num = Number(value);
        }

        return num;
      }
    }
  }

  addEndingCardTags(imageArr) {
    let cardCount = this.hand.cards.length;
    let endTags = `<li><ul>`;
    let repeatedTags = endTags.repeat(cardCount);
    this.hand.images.push(repeatedTags);
  }
}

class Player extends Cardholder {
  betAmount = 0;
  type = `player`;
  splitHand1 = { cards: [], images: [], total: 0 };
  splitHand2 = { cards: [], images: [], total: 0 };
  currentSplitHand = 0;

  constructor(bank) {
    super();
    this.bank = bank;
  }

  set addCardToHand(card) {
    super.addCardToHand = card;
    this.hand.images.push(
      `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}"/>`
    );
    this.hand.endTags.push(`</li></ul>`);
    this.hand.simpleImages.push(`<img src="${card.image}" class="card">`);
    console.log(this.hand);
  }

  checkHandForNatural(hand) {
    if (hand.cards.length !== 2) return false;
    if (hand.total != 21) return false;

    this.hand.outcome = `natural`;
    return true;
  }

  //   checkValidSideBet() {
  //     return this.bank - this.betAmount >= 0 ? true : false;
  //   }

  checkValidSplit(options) {
    let card1 = this.hand.cards[0].value;
    let card2 = this.hand.cards[1].value;

    if (options.splitAnyTens) {
      card1 = convertTenValueCard(card1);
      card2 = convertTenValueCard(card2);
    }

    if (!options.splitAces) {
      if (card1 == "ACE" || card2 == "ACE") return false;
    }

    if (card1 == card2) return true;
    return false;

    function convertTenValueCard(value) {
      let faceCards = ["JACK", "QUEEN", "KING"];
      let result = faceCards.some((face) => face == value);

      if (result) value = "10";
      return value;
    }
  }
}

class Dealer extends Cardholder {
  type = `dealer`;

  constructor() {
    super();
    this.hand.type = `dealer`;
    this.hand.visibleCards = [];
    this.hand.visibleTotal = 0;
    this.hand.unrevealedCard;
    this.hand.simpleUnrevealedCard;
  }

  set addCardToHand(card) {
    super.addCardToHand = card;

    if (this.hand.cards.length == 1) {
      this.hand.unrevealedCard = `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="${card.image}"/>`;
      this.hand.simpleUnrevealedCard = `<img src="${card.image}" class="card">`;
      this.hand.images.push(
        `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="img/playing-card-back.svg"/>`
      );
      this.hand.simpleImages.push(
        `<img src='img/playing-card-back.svg' class='card'>`
      );
    } else {
      this.hand.images.push(
        `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="${card.image}"/>`
      );
      this.hand.simpleImages.push(`<img src="${card.image}" class="card">`);
      this.hand.visibleCards.push(card);
      this.hand.visibleTotal = this.calculateHandTotal(this.hand.visibleCards);
    }
    this.hand.endTags.push(`</li></ul>`);
  }

  checkHandForNatural(hand) {
    if (hand.cards.length !== 2) return;
    if (hand.total != 21) return;

    this.hand.outcome = `natural`;
  }
}

// `zkz7lu7uf81p`

let gameInfo = {
  deckID: `vhe84zc8um6g`,

  set updateDeckID(id) {
    this.deckID = id;
  },
};

export function initPlayers(bank) {
  let currentPlayer = new Player(bank);
  let currentDealer = new Dealer();
  return [currentPlayer, currentDealer];
}

export function initDeck(gameState) {
  if (gameInfo.deckID) {
    if (gameState.remainingCards <= 2 || !gameState.remainingCards)
      shuffleCards(gameState.options.deckCount);
    return;
  }

  (function () {
    const getNewDeckID = function () {
      return fetch(`https://deckofcardsapi.com/api/deck/new`)
        .then(
          function (response) {
            return response.json();
          },
          (err) => alert(err)
        )
        .then(function (data) {
          gameInfo.updateDeckID = data.deck_id;
          console.log(gameInfo.deckID);
          //   return gameInfo.deckID;
        })
        .finally(function () {
          let deckCount = gameState.options.deckCount;
          shuffleCards(deckCount);
        })
        .catch(function (err) {
          alert(err);
        });
    };

    getNewDeckID();
    // gameInfo.updateDeckID = newDeckID;
  })(gameInfo.deckID);
}

export function shuffleCards(deckCount) {
  fetch(
    `https://deckofcardsapi.com/api/deck/${gameInfo.deckID}/shuffle/?deck_count=${deckCount}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch((err) => console.log(`shuffle cards error`));
}

export function dealInitialCards(gameState) {
  let currentPlayer = gameState.player;
  let currentDealer = gameState.dealer;
  gameState.updateCardsDealt(true);

  dealPlayerCards(gameInfo.deckID, currentPlayer, gameState);
  dealDealerCards(gameInfo.deckID, currentDealer, gameState);
}

function dealPlayerCards(deckID, currentPlayer, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      console.log(cardsObj);
      currentPlayer.addCardToHand = cardsObj.card1;
      currentPlayer.addCardToHand = cardsObj.card2;
      gameState.updateRemainingCards = cardsObj.remaining;

      //Test Perfect 11s (regularHand)
      // currentPlayer.addCardToHand = testCard.heart7;
      // currentPlayer.addCardToHand = testCard.heart4;

      //Test Extra Bet Blackjack
      // currentPlayer.addCardToHand = testCard.diamondKing;
      // currentPlayer.addCardToHand = testCard.heart4;

      //Test House Money
      // currentPlayer.addCardToHand = testCard.diamondKing;
      // currentPlayer.addCardToHand = testCard.diamondAce;

      //Test Player Blackjack/Even Money (replace original 2)
      // currentPlayer.addCardToHand = dealerInsTestCard;
      // currentPlayer.addCardToHand = playerBlackjackCard;

      //Test Split Cards (replace original 2 cards) and Test Bust (add to original 2)
      //   currentPlayer.addCardToHand = playerSplitTestCard1;
      //   currentPlayer.addCardToHand = playerSplitTestCard2;

      //Test Player 5 Card Charlie (comment out original 2 cards)
      // createFiveCardCharlieTestHand(`player`);

      //   console.log(`dealPlayerCards`);
      //   console.log(playerHand);
      //   return playerHand;
    })
    .catch((err) => dealPlayerCards(deckID))
    .finally(function () {
      currentPlayer.checkHandForNatural(currentPlayer.hand);
      //   controller.updateStatePlayers(currentPlayer, gameState);
      //   controller.updateSplitToken(currentPlayer.checkValidSplit(), gameState);
      //   controller.updateDoubleDownToken(currentPlayer.checkValidSideBet(), gameState);
      console.log(currentPlayer.hand);
    });
}

function dealDealerCards(deckID, currentDealer, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      currentDealer.addCardToHand = cardsObj.card1;
      // currentDealer.addCardToHand = cardsObj.card2;
      gameState.updateRemainingCards = cardsObj.remaining;

      //To test Dealer Bust (keep original 2 cards)
      // dealerHand.push(playerSplitTestCard1);
      // dealerHand.push(playerSplitTestCard2);

      // To test Insurance functionality (substitute card2)
      currentDealer.addCardToHand = testCard.heartAce;

      //To test 5 Card Charlie (comment out all other dealerHands)
      // createFiveCardCharlieTestHand(`dealer`);

      // return dealerHand;
    })
    // .then(function (dealerHand) {
    //   updateDealerCards(dealerHand);
    // })
    .catch((err) => dealDealerCards(deckID))
    .finally(function () {
      currentDealer.checkHandForNatural(currentDealer.hand);
      // controller.updateStatePlayers(currentDealer, gameState);
      // gameState.checkValidEvenMoney();
      // gameState.checkValidInsurance();
      // controller.enableBeginRoundBtns(gameState);

      // checkValidInsurance(dealerHand);
      // cardObj = renderCardInfo(specialToken);
      console.log(currentDealer.hand);
    });
}

function drawCards(deckID, count) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`
  )
    .then(
      function (response) {
        return response.json();
      },
      (err) => alert(err)
    )
    .then(function (data) {
      let [card1, card2] = data.cards;
      let playerCards = {
        card1: card1,
        card2: card2,
        remaining: data.remaining,
      };

      return playerCards;
    })
    .catch(function (err) {
      drawCards(deckID, 2);
    });
}
