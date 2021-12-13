import * as controller from "./controller-2.js";

class CardHolder {
  constructor() {
    this.hand = { cards: [], images: [], total: 0 };
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
}

export class Player extends CardHolder {
  // bank = 0;
  betAmount = 0;
  type = `player`;
  // hand: { cards: [], images: [], total: 0 },

  constructor(bank) {
    super();
    this.bank = bank;
    this.hand.type = `player`;
  }

  set updateBank(bank) {
    this.bank = bank;
  }

  set updateBetAmount(betAmount) {
    this.betAmount = betAmount;
  }

  set addCardToHand(card) {
    // this.hand.cards.push(card);
    super.addCardToHand = card;

    this.hand.images.push(`<img src="${card.image}" class="card">`);
    // this.hand.total = this.calculateHandTotal(this.hand.cards);
  }

  // get getHand() {
  //   return this.hand;
  // },

  // calculateHandTotal(cards) {
  //   let handValueArr = cards.map((card) => card.value);
  //   // let numberArr = handValue.map(getCardValue);

  //   return getHandValue(handValueArr);

  //   function getHandValue(arr) {
  //     let total = arr.map(getCardValue).reduce((acc, cur) => acc + cur);

  //     if (total > 21 && arr.includes("ACE")) {
  //       let index = arr.indexOf("ACE");
  //       arr[index] = "ACELOW";
  //       total = getHandValue(arr);
  //     }

  //     return total;

  //     function getCardValue(value) {
  //       let num;

  //       switch (value) {
  //         case "JACK":
  //           num = 10;
  //           break;
  //         case "QUEEN":
  //           num = 10;
  //           break;
  //         case "KING":
  //           num = 10;
  //           break;
  //         case "ACE":
  //           num = 11;
  //           break;
  //         case "ACELOW":
  //           num = 1;
  //           break;
  //         default:
  //           num = Number(value);
  //       }

  //       return num;
  //     }
  //   }
  // },

  checkValidSplit() {
    // if (this.mode.split) return;

    let card1 = this.hand.cards[0].value;
    let card2 = this.hand.cards[1].value;

    if (card1 == card2) return true;
    return false;
  }
}

export class Dealer extends CardHolder {
  type = `dealer`;

  constructor() {
    super();
    this.hand.type = `dealer`;
    this.hand.visibleCards = [];
    this.hand.visibleTotal = 0;
    this.hand.unrevealedCard;
  }

  set addCardToHand(card) {
    // this.hand.cards.push(card);
    super.addCardToHand = card;

    if (this.hand.cards.length == 1) {
      this.hand.unrevealedCard = `<img src="${card.image}" class="card">`;
      this.hand.images.push(
        `<img src='img/playing-card-back.svg' class='card'>`
      );
    } else {
      this.hand.images.push(`<img src="${card.image}" class="card">`);
      this.hand.visibleCards.push(card);
      this.hand.visibleTotal = this.calculateHandTotal(this.hand.visibleCards);
    }

    // this.hand.total = this.calculateHandTotal(this.hand.cards);
  }
}

export let gameInfo = {
  deckID: `zkz7lu7uf81p`,
  gameActive: false,

  splitToken(boolean, gameState) {
    this.splitAvailable = boolean;
    controller.updateSplitToken(boolean, gameState);
  },

  set updateDeckID(deckID) {
    this.deckID = deckID;
  },

  updateGameActive(toggle) {
    toggle ? (this.gameActive = true) : (this.gameActive = false);
  },
};

export function initPlayers(bank) {
  let currentPlayer = new Player(bank);
  let currentDealer = new Dealer();
  return [currentPlayer, currentDealer];
}

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

export function checkValidBet(submittedBet, bank) {
  if (submittedBet > bank) return false;
  return true;
}

export function updateGameActive(toggle) {
  gameInfo.updateGameActive(toggle);
}

// export function applySubmittedBet(betAmount, gameState) {
//   return player.bank - betAmount;
// }

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
  let currentPlayer = gameState.player;
  let currentDealer = gameState.dealer;

  shuffleCards(gameInfo.deckID);
  dealPlayerCards(gameInfo.deckID, currentPlayer, gameState);
  dealDealerCards(gameInfo.deckID, currentDealer, gameState);
}

export function shuffleCards(deckID) {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {})
    .catch((err) => shuffleCards(deckID));
}

function dealPlayerCards(deckID, currentPlayer, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      console.log(cardsObj);
      currentPlayer.addCardToHand = cardsObj.card1;
      currentPlayer.addCardToHand = cardsObj.card2;
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
      controller.updateStatePlayers(currentPlayer, gameState);
      gameInfo.splitToken(currentPlayer.checkValidSplit(), gameState);
    });
}

function dealDealerCards(deckID, currentDealer, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      currentDealer.addCardToHand = cardsObj.card1;
      currentDealer.addCardToHand = cardsObj.card2;

      //To test Dealer Bust (keep original 2 cards)
      // dealerHand.push(playerSplitTestCard1);
      // dealerHand.push(playerSplitTestCard2);

      //To test Insurance functionality (substitute card2)
      // dealerHand.push(dealerInsTestCard);

      //To test 5 Card Charlie (comment out all other dealerHands)
      // createFiveCardCharlieTestHand(`dealer`);

      // return dealerHand;
    })
    // .then(function (dealerHand) {
    //   updateDealerCards(dealerHand);
    // })
    .catch((err) => dealDealerCards(deckID))
    .finally(function () {
      controller.updateStatePlayers(currentDealer, gameState);
      controller.enableBeginRoundBtns(gameState);
      // checkValidInsurance(dealerHand);
      // cardObj = renderCardInfo(specialToken);
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
