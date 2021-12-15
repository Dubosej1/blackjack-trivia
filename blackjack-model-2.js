import State, * as controller from "./controller-2.js";

const playerSplitTestCard1 = {
  code: "7S",
  image: `https://deckofcardsapi.com/static/img/7S.png`,
  images: {
    svg: "https://deckofcardsapi.com/static/img/7S.svg",
    png: "https://deckofcardsapi.com/static/img/7S.png",
  },
  suit: "SPADES",
  value: "7",
};

const playerSplitTestCard2 = {
  code: "7H",
  image: `https://deckofcardsapi.com/static/img/7H.png`,
  images: {
    svg: "https://deckofcardsapi.com/static/img/7H.svg",
    png: "https://deckofcardsapi.com/static/img/7H.png",
  },
  suit: "HEARTS",
  value: "7",
};

const dealerInsTestCard = {
  code: "AH",
  image: `https://deckofcardsapi.com/static/img/AH.png`,
  images: {
    svg: "https://deckofcardsapi.com/static/img/7H.svg",
    png: "https://deckofcardsapi.com/static/img/7H.png",
  },
  suit: "HEARTS",
  value: "ACE",
};

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
  betAmount = 0;
  type = `player`;
  splitHand1 = { cards: [], images: [], total: 0 };
  splitHand2 = { cards: [], images: [], total: 0 };
  currentSplitHand = 0;

  constructor(bank) {
    super();
    this.bank = bank;
  }

  set updateBank(bank) {
    this.bank = bank;
  }

  set updateBetAmount(betAmount) {
    this.betAmount = betAmount;
  }

  set updateInsuranceBetAmount(betAmount) {
    this.insuranceBetAmount = betAmount;
  }

  updateSplitBet() {
    let betAmount = this.betAmount;

    this.splitBetAmount = betAmount;
    this.betAmount = betAmount - betAmount;
  }

  set addCardToHand(card) {
    super.addCardToHand = card;
    this.hand.images.push(`<img src="${card.image}" class="card">`);
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

  checkValidSideBet() {
    return this.bank - this.betAmount >= 0 ? true : false;
  }

  checkValidSplit() {
    let validBet = this.checkValidSideBet();

    let card1 = this.hand.cards[0].value;
    let card2 = this.hand.cards[1].value;

    if (card1 == card2 && validBet) return true;
    return false;
  }

  splitHand(newCards) {
    let [card1, card2] = newCards;

    let [splitCard1, splitCard2] = this.removeSplitCardsFromHand();

    this.addCardToSplitHand1 = splitCard1;
    this.addCardToSplitHand1 = card1;
    this.addCardToSplitHand2 = splitCard2;
    this.addCardToSplitHand2 = card2;
  }

  removeSplitCardsFromHand() {
    this.hand.images.length = 0;
    this.hand.total = 0;
    let card1 = this.hand.cards.pop();
    let card2 = this.hand.cards.pop();
    return [card1, card2];
  }

  set addCardToSplitHand1(card) {
    this.splitHand1.cards.push(card);
    this.splitHand1.images.push(`<img src="${card.image}" class="card">`);
    this.splitHand1.total = this.calculateHandTotal(this.splitHand1.cards);
  }

  set addCardToSplitHand2(card) {
    this.splitHand2.cards.push(card);
    this.splitHand2.images.push(`<img src="${card.image}" class="card">`);
    this.splitHand2.total = this.calculateHandTotal(this.splitHand2.cards);
  }

  set updateType(type) {
    if (type == `player`) this.type = `player`;
    if (type == `split player`) this.type = `split player`;
  }

  set updateCurrentSplitHand(num) {
    if (num == 0) this.currentSplitHand = 0;
    if (num == 1) this.currentSplitHand = 1;
    if (num == 2) this.currentSplitHand = 2;
  }

  checkHandForBust(hand) {
    if (hand.total <= 21) return;

    if (this.currentSplitHand == 0) this.hand.outcome = `bust`;
    if (this.currentSplitHand == 1) this.splitHand1.outcome = `bust`;
    if (this.currentSplitHand == 2) this.splitHand2.outcome = `bust`;
  }

  checkHandForCharlie(hand) {
    if (hand.total > 21) return;
    if (hand.cards.length !== 5) return;

    if (this.currentSplitHand == 0) this.hand.outcome = `charlie`;
    if (this.currentSplitHand == 1) this.splitHand1.outcome = `charlie`;
    if (this.currentSplitHand == 2) this.splitHand2.outcome = `charlie`;
  }

  performHandChecks() {
    let hand;

    if (this.currentSplitHand == 0) hand = this.hand;
    if (this.currentSplitHand == 1) hand = this.splitHand1;
    if (this.currentSplitHand == 2) hand = this.splitHand2;

    this.checkHandForBust(hand);
    this.checkHandForCharlie(hand);
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
  }

  checkHandForBust(hand) {
    if (hand.total <= 21) return;
    this.hand.outcome = `bust`;
  }

  checkHandForCharlie(hand) {
    if (hand.total > 21) return;
    if (hand.cards.length !== 5) return;

    this.hand.outcome = `charlie`;
  }

  performHandChecks() {
    let hand = this.hand;

    this.checkHandForBust(hand);
    this.checkHandForCharlie(hand);
  }
}

export let gameInfo = {
  deckID: `zkz7lu7uf81p`,
  gameActive: false,

  splitToken(boolean, gameState) {
    this.splitAvailable = boolean;
    controller.updateSplitToken(boolean, gameState);
  },

  doubleDownToken(boolean, gameState) {
    this.doubleDownAvailable = boolean;
    controller.updateDoubleDownToken(boolean, gameState);
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
      // currentPlayer.addCardToHand = cardsObj.card1;
      // currentPlayer.addCardToHand = cardsObj.card2;

      //Test Split Cards (replace original 2 cards) and Test Bust (add to original 2)
      currentPlayer.addCardToHand = playerSplitTestCard1;
      currentPlayer.addCardToHand = playerSplitTestCard2;

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
      gameInfo.doubleDownToken(currentPlayer.checkValidSideBet(), gameState);
    });
}

function dealDealerCards(deckID, currentDealer, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      currentDealer.addCardToHand = cardsObj.card1;
      // currentDealer.addCardToHand = cardsObj.card2;

      //To test Dealer Bust (keep original 2 cards)
      // dealerHand.push(playerSplitTestCard1);
      // dealerHand.push(playerSplitTestCard2);

      // To test Insurance functionality (substitute card2)
      currentDealer.addCardToHand = dealerInsTestCard;

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
      gameState.checkValidInsurance();
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

export function insuranceLogic(insuranceBet, gameState) {
  let dealerHand = gameState.dealer.hand;
  let player = gameState.player;

  player.updateBank = player.bank - insuranceBet;

  if (dealerHand.cards[1].value == "ACE" && dealerHand.total == 21) {
    player.updateBank = player.bank + insuranceBet * 2;
    player.hand.insuranceOutcome = `win`;
  }

  player.hand.insuranceOutcome = `lose`;
  controller.updateStatePlayers(player, gameState);
}

export function checkValidInsuranceBet(submittedBet, gameState) {
  let betAmount = gameState.player.betAmount;
  let bank = gameState.player.bank;

  if (submittedBet > betAmount / 2 || submittedBet > bank) return false;
  else return true;
}

export function splitPlayerHand(gameState) {
  // splitMode = true;
  gameState.updateGameMode = `split`;

  let currentPlayer = gameState.player;

  currentPlayer.updateSplitBet();

  currentPlayer.updateType = `split player`;

  currentPlayer.updateCurrentSplitHand = 1;

  let newCards = [];

  // let poppedCard = playerHand.pop();
  // playerSplitHand.push(poppedCard);

  drawCards(gameInfo.deckID, 2)
    .then(function (cardsObj) {
      newCards.push(cardsObj.card1);
      newCards.push(cardsObj.card2);
      // currentPlayer.splitHand(newCards);

      //To test Split Hand 2 Five Card Charlie (comment out playerSPlitHand)
      // createFiveCardCharlieTestHand(`split`);

      return newCards;
    })
    .then(function (newCards) {
      currentPlayer.splitHand(newCards);
    })
    .catch((err) => {
      splitPlayerHand();
    })
    .finally(() => {
      controller.updateStateInitialSplit(currentPlayer, gameState);
      // cardObj = renderCardInfo();
      // splitBetAmount = betAmount;
      // bank = bank - splitBetAmount;
      // currentSplitHand = 1;
      // let gameInfo = {
      //   bank: bank,
      //   splitBetAmount: splitBetAmount,
      //   currentSplitHand: currentSplitHand,
      //   gameCards: cardObj,
      // };
      // updateControllerSplitCardInfo(gameInfo);
      // updateControllerCardInfo(cardObj);
      // checkDoubleDown();
      // checkBust();
      // checkFiveCardCharlie();
    });
  // let cardInfo = renderCardInfo();

  // return [bank, splitBetAmount, cardInfo];
}

export function applyDoubleDown(gameState) {
  let player = gameState.player;
  let updatedBet = player.betAmount * 2;
  player.updateBank = player.bank - player.betAmount;
  player.updateBetAmount = updatedBet;
  controller.updateStatePlayers(player, gameState);
  controller.updateStateUI(gameState);
}

export function executePlayerHit(gameState) {
  let player = gameState.player;

  drawSingleCard(gameInfo.deckID)
    .then(function (cardsObj) {
      if (player.currentSplitHand == 0) player.addCardToHand = cardsObj;
      if (player.currentSplitHand == 1) player.addCardToSplitHand1 = cardsObj;
      if (player.currentSplitHand == 2) player.addCardToSplitHand2 = cardsObj;
    })
    .catch((err) => alert(`error executePlayerHit`))
    .finally(function () {
      player.performHandChecks();
      controller.updateStatePlayers(player, gameState);
      controller.checkPlayerNextAvailableAction(gameState);
    });
  // player.performHandChecks();

  // controller.updateStatePlayers(player, gameState);
  // controller.checkPlayerNextAvailableAction(player, gameState);
}

// function playerHit(deckID, hand) {
//   drawSingleCard(deckID)
//     .then(function (cardsObj) {
//       hand.push(cardsObj);
//       return arr;
//     })
//     .then(function (arr) {
//       if (splitMode) {
//         if (currentSplitHand == 1) updatePlayerCards(arr, playerSplitHand);
//         if (currentSplitHand == 2 && !hand2PassNeeded)
//           updatePlayerCards(playerHand, arr);
//         return;
//       }
//       updatePlayerCards(arr);
//     })
//     .catch((err) => drawSingleCard(deckID))
//     .finally(() => {
//       cardObj = renderCardInfo();
//       updateControllerCardInfo(cardObj);
//       checkDoubleDown();
//       checkFiveCardCharlie();
//       checkBust();
//     });
// }

export function executeDealerHit(gameState) {
  let dealer = gameState.dealer;

  drawSingleCard(gameInfo.deckID)
    .then(function (cardsObj) {
      dealer.addCardToHand = cardsObj;
    })
    .catch((err) => alert(`error executeDealerHit`))
    .finally(function () {
      dealer.performHandChecks();
      controller.updateStatePlayers(dealer, gameState);
      controller.checkDealerNextAvailableAction(gameState);
    });
}

function drawSingleCard(deckID) {
  return fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let cardData = data.cards;
      let card = {
        value: cardData[0].value,
        code: cardData[0].code,
        image: cardData[0].image,
        remaining: data.remaining,
      };

      return card;
    })
    .catch((err) => {
      cardData = null;
      card = null;
      drawSingleCard(deckID);
    });
}
