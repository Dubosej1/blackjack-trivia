//Selectors

//To Do next: dealerStand.

const newGameBtn = document.querySelector(".btn__newGame");
const endGameBtn = document.querySelector(".btn__endGame");
const submitBetBtn = document.querySelector(".btn__submitBetValue");
const dealCardsBtn = document.querySelector(".btn__dealCards");
const hitBtn = document.querySelector(".btn__hit");
const standBtn = document.querySelector(".btn__stand");
const doubleDownBtn = document.querySelector(".btn__doubleDown");
const splitBtn = document.querySelector(".btn__split");
const insuranceBtn = document.querySelector(".btn__insurance");

const noticeUI = document.querySelector(".notice");
const scoreUI = document.querySelector(".score");
const bankUI = document.querySelector(".bank");
const betAmountUI = document.querySelector(".betAmount");
const betValueField = document.querySelector("#betValue");
const dealerCardsUI = document.querySelector(".dealerCards");
const dealerTotalUI = document.querySelector(".dealerTotal");
const playerCardsUI = document.querySelector(".playerCards");
const playerTotalUI = document.querySelector(".playerTotal");

let bank, betAmount, playerCardTotal, dealerCardTotal;
let deckID;
let dealerTimer;
let playerCards = [];
let dealerCards = [];

newGameBtn.addEventListener("click", startNewGame);

deckID = `70u37rzjibvz`;

function startNewGame() {
  bank = 1000;
  bankUI.textContent = bank;

  startNewRound();
}

function startNewRound() {
  noticeUI.textContent = "Place an amount to bet";
  submitBetBtn.addEventListener("click", submitBet);
}

function submitBet() {
  betAmount = betValueField.value;
  bank = bank - betAmount;
  bankUI.textContent = bank;
  betAmountUI.textContent = betAmount;

  //   console.log(betAmount);
  dealCardsBtn.addEventListener("click", initialDeal);
}

function initialDeal() {
  shuffleCards(deckID);

  dealDealerCards(deckID);
  dealPlayerCards(deckID);

  hitBtn.addEventListener("click", function () {
    playerHit(deckID);
  });
  standBtn.addEventListener("click", function () {
    noticeUI.textContent = `Dealer's turn...`;
    dealerTimer = setTimeout(dealerTurn, 3000);
  });
  //   doubleDownBtn.addEventListener("click", playerDoubleDown);
}

function dealPlayerCards(deckID) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      playerCards.push(cardsObj.card1);
      playerCards.push(cardsObj.card2);
      console.log(`dealPlayerCards`);
      console.log(playerCards);
      return playerCards;
      // updateUI();
    })
    .then(function (playerCards) {
      updatePlayerUI(playerCards);
    });
}

function dealDealerCards(deckID) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      dealerCards.push(cardsObj.card1);
      dealerCards.push(cardsObj.card2);
      console.log(`dealDealerCards`);
      console.log(dealerCards);
      return dealerCards;
    })
    .then(function (playerCards) {
      updateDealerUI(playerCards);
    });
}

function playerHit(deckID) {
  drawSingleCard(deckID)
    .then(function (cardsObj) {
      playerCards.push(cardsObj);
      console.log(`dealPlayerCards`);
      console.log(playerCards);
      return playerCards;
    })
    .then(function (playerCards) {
      updatePlayerUI(playerCards);
    });
}

function dealerHit(deckID) {
  drawSingleCard(deckID)
    .then(function (cardsObj) {
      dealerCards.push(cardsObj);
      console.log(`dealDealerCards`);
      console.log(dealerCards);
      return dealerCards;
    })
    .then(function (dealerCards) {
      updateDealerUI(dealerCards);
    });
}

function dealerTurn() {
  if (dealerCardTotal <= 16) {
    noticeUI.textContent = `Dealer Hits...`;
    dealerHit(deckID);
    dealerTimer = setTimeout(dealerTurn, 3000);
    return;
  } else {
    noticeUI.textContent = `Dealer's Turn Ends...`;
    dealerTimer = setTimeout(chooseWinner, 3000);
    return;
  }
}

function chooseWinner() {
  switch (true) {
    case playerCardTotal > 21:
      noticeUI.textContent = `Player loses. Bust...`;
      break;
    case dealerCardTotal > 21:
      noticeUI.textContent = `Player Wins!  Dealer busts...`;
      break;
    case dealerCardTotal == 21 && playerCardTotal == 21:
      noticeUI.textContent = `Push.  Both players have blackjack`;
      break;
    case playerCardTotal == 21:
      noticeUI.textContent = `Player Wins.  Blackjack!`;
      break;
    case dealerCardTotal == 21:
      noticeUI.textContent = `Player Loses.  Dealer Blackjack.`;
      break;
    case dealerCardTotal > playerCardTotal:
      noticeUI.textContent = `Dealer Wins.`;
      break;
    case dealerCardTotal == playerCardTotal:
      noticeUI.textContent = `Push.`;
      break;
    default:
      noticeUI.textContent = `Player Wins!`;
      break;
  }
}

//       if (dealerCardTotal == 21 && playerCardTotal == 21) {
//           noticeUI.textContent = `Push.  Both players have blackjack.`;
//       } else if (dealerCardTotal == 21) {
//           noticeUI.textContent = `Player Loses.  Dealer Blackjack.`;
//       } else if (dealerCardTotal > 21) {
//           noticeUI.textContent = `Player Wins!  Dealer Busts.`;
//       } else if (dealerCardTotal > playerCardTotal)
//   }

const drawSingleCard = function (deckID) {
  return fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then(function (response) {
      //   console.log(response);
      return response.json();
    })
    .then(function (data) {
      let cardData = data.cards;
      let card = {
        value: getCardValue(cardData[0].value),
        code: cardData[0].code,
        image: cardData[0].image,
        remaining: data.remaining,
      };

      //   console.log(`drawCard:`);
      //   console.log(data);
      //   console.log(cardData);
      //   console.log(card);
      //   console.log(card.value);

      return card;
    });
};

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

function updatePlayerUI(playerCards) {
  console.log(`Update UI:`);
  console.log(playerCards);

  let cardUI = [];
  let cardsValue = [];
  let cardNumValue = [];

  for (let card of playerCards) {
    cardUI.push(card.code);
    cardsValue.push(card.value);
  }

  playerCardTotal = getPlayerValue(cardsValue);

  playerTotalUI.textContent = playerCardTotal;
  playerCardsUI.textContent = cardUI.join();

  if (
    (playerCardTotal == 21 && playerCards.length == 2) ||
    playerCardTotal > 21
  ) {
    chooseWinner();
  }

  //   if (playerCardTotal = 21 && playerCards.length = 2) {
  //       playerBlackJackRoutine();
  //       noticeUI.textContent = `Player Blackjack!  You Win!!!`;
  //     //   playerWinRoutine();
  //   }

  //   if (playerCardTotal > 21) {
  //       noticeUI.textContent = `Player Bust.  You Lose!`;
  //       playerBustRoutine();
  //   }
}

function updateDealerUI(dealerCards) {
  console.log(`Update Dealer UI:`);
  console.log(dealerCards);

  let cardUI = [];
  let cardsValue = [];
  let cardNumValue = [];

  for (let card of dealerCards) {
    cardUI.push(card.code);
    cardsValue.push(card.value);
  }

  dealerCardTotal = getPlayerValue(cardsValue);

  dealerTotalUI.textContent = dealerCardTotal;
  dealerCardsUI.textContent = cardUI.join();
}

function shuffleCards(deckID) {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`)
    .then(function (response) {
      console.log(`ShuffleCards:`);
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function getPlayerValue(arr) {
  let numberArr = arr.map(getCardValue);
  console.log(`getPlayerValue`);
  console.log(numberArr);

  let total = numberArr.reduce((acc, cur) => acc + cur);

  if (total > 21 && arr.includes("ACE")) {
    let index = arr.indexOf("ACE");
    arr[index] = "ACELOW";
    getPlayerValue(arr);
    return;
  }

  console.log(total);

  return total;
}

// function playerLoseRoutine() {

// }

// const getNewDeck = function () {
//   let cardDeck;

//   fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       cardDeck = data;
//       cardDeck = {
//         success: cardDeck.success,
//         deckID: cardDeck.deck_id,
//         remaining: cardDeck.remaining,
//         shuffled: cardDeck.shuffled,
//       };

//       //   console.log(data);
//       console.log(cardDeck);
//       //   console.log(cardDeck.success);
//       //   console.log(cardDeck.deckID);
//     });

//   return cardDeck;
// };

// let cardDeck = getNewDeck();

// const deckID = cardDeck.deckID;

// const deckID = `70u37rzjibvz`;

const drawCards = function (deckID, count) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`
  )
    .then(function (response) {
      //   console.log(response);
      return response.json();
    })
    .then(function (data) {
      let [card1, card2] = data.cards;
      let playerCards = {
        card1: card1,
        card2: card2,
        remaining: data.remaining,
      };
      console.log(`Old drawCards function:`);
      console.log(data.cards);
      console.log(data.remaining);
      console.log(playerCards);
      console.log(card1);

      return playerCards;
    });
};

// let playerCards = drawCards(deckID, 2);
// let dealerCards = drawCards(deckID, 2);

// playerCards.then(function (playerCards) {});

// let pCard1Value = Number(playerCards.card1.value);
// let pCard2Value = Number(playerCards.card2.value);

// test1.textContent = pCard1Value;
// test2.textContent = pCard2Value;

// function playerBlackJackRoutine () {
//     if (dealerCardTotal = 21) {
//         noticeUI.textContent = `Push.  Both have the same score`;
//     } else {
//         noticeUI.textContent = `Player BlackJack!  You Win!!!`
//     }
// }

// function playerBustRoutine ()
