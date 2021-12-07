import * as controller from "/controller-2.js";

let player = {
  bank: 0,
  betAmount: 0,
  hand: { cards: [], images: [], total: 0 },

  set updateBank(bank) {
    this.bank = bank;
  },

  set updateBetAmount(betAmount) {
    this.betAmount = betAmount;
  },

  set addCardToHand(card) {
    this.hand.cards.push(card);
    this.hand.images.push(`<img src='${card.image}' class='card'>`);
    this.hand.total = this.calculateHandTotal(this.hand.cards);
  },

  get getHand() {
    return this.hand;
  },

  calculateHandTotal(cards) {
    let numberArr = cards.map((card) => card.value).map(getCardValue);

    let total = numberArr.reduce((acc, cur) => acc + cur);

    if (total > 21 && arr.includes("ACE")) {
      let index = arr.indexOf("ACE");
      arr[index] = "ACELOW";
      total = getPlayerValue(arr);
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
  },

  checkValidSplit() {
    // if (this.mode.split) return;

    let card1 = this.hand.cards[0].value;
    let card2 = this.hand.cards[1].value;

    if (card1 == card2) return true;
    return false;
  },
};

let dealer = {};

let gameInfo = {
  deckID: `h9j8glyl41fb`,
  gameActive: false,

  splitToken(boolean, gameState) {
    this.splitIsValid = boolean;
    controller.updateSplitToken(boolean, gameState);
  },

  set updateDeckID(deckID) {
    this.deckID = deckID;
  },

  updateGameActive(toggle) {
    toggle ? (this.gameActive = true) : (this.gameActive = false);
  },
};

//////////update exports/////////////
// export function collectBankBetAmount() {
//   return [player.bank, player.betAmount];
// }

export function updateBank(bank) {
  player.updateBank = bank;
}

export function updateBetAmount(betAmount) {
  player.updateBetAmount = betAmount;
}

export function checkValidBet(submittedBet) {
  if (submittedBet > player.bank) return false;
  return true;
}

export function updateGameActive(toggle) {
  gameInfo.updateGameActive(toggle);
}

export function applySubmittedBet(betAmount) {
  return player.bank - betAmount;
}

export function initDeck() {
  if (gameInfo.deckID) return;

  (function (deckID) {
    const getNewDeckID = function () {
      return fetch(`https://deckofcardsapi.com/api/deck/new`)
        .then(
          function (response) {
            return response.json();
          },
          (err) => alert(err)
        )
        .then(function (data) {
          gameInfo.deckID = data.deck_id;
          console.log(deckID);
          return deckID;
        })
        .catch(function (err) {
          alert(err);
        });
    };

    let newDeckID = getNewDeckID();
    gameInfo.updateDeckID = newDeckID;
  })(gameInfo.deckID);
}

export function dealInitialCards(gameState) {
  shuffleCards(gameInfo.deckID);
  dealPlayerCards(gameInfo.deckID, gameState);
  //   dealDealerCards(gameInfo.deckID);
}

export function shuffleCards(deckID) {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {})
    .catch((err) => shuffleCards(deckID));
}

function dealPlayerCards(deckID, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      player.addCardToHand = cardsObj.card1;
      player.addCardToHand = cardsObj.card2;
      //   playerHand.push(cardsObj.card1);
      //   playerHand.push(cardsObj.card2);

      //Test Split Cards (replace original 2 cards) and Test Bust (add to original 2)
      // playerHand.push(playerSplitTestCard1);
      // playerHand.push(playerSplitTestCard2);

      //Test Player 5 Card Charlie (comment out original 2 cards)
      // createFiveCardCharlieTestHand(`player`);

      //   console.log(`dealPlayerCards`);
      //   console.log(playerHand);
      //   return playerHand;
    })
    .catch((err) => dealPlayerCards(deckID))
    .finally(function () {
      controller.updateStateCardHand(player.getHand, gameState);
      gameInfo.splitToken(player.checkValidSplit(), gameState);
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
