//Selectors

const newGameBtn = document.querySelector(".btn__newGame");
const endGameBtn = document.querySelector(".btn__endGame");
const submitBetBtn = document.querySelector(".btn__submitBetValue");
const submitInsuranceBetBtn = document.querySelector(
  ".btn__submitInsuranceBetValue"
);
const dealCardsBtn = document.querySelector(".btn__dealCards");
const hitBtn = document.querySelector(".btn__hit");
const standBtn = document.querySelector(".btn__stand");
const doubleDownBtn = document.querySelector(".btn__doubleDown");
const splitBtn = document.querySelector(".btn__split");
const acceptInsuranceBtn = document.querySelector(".btn__acceptInsurance");
const declineInsuranceBtn = document.querySelector(".btn__declineInsurance");

const noticeUI = document.querySelector(".notice");
const scoreUI = document.querySelector(".score");
const bankUI = document.querySelector(".bank");
const betAmountUI = document.querySelector(".betAmount");
const splitBetAmountUI = document.querySelector(".splitBetAmount");
const insuranceBetAmountUI = document.querySelector(".insuranceBetAmount");
const betValueField = document.querySelector("#betValue");
const insuranceBetValueField = document.querySelector("#insuranceBetValue");
const dealerHandUI = document.querySelector(".dealerHand");
const dealerHandTotalUI = document.querySelector(".dealerHandTotal");
const playerHandUI = document.querySelector(".playerHand");
const playerHandTotalUI = document.querySelector(".playerHandTotal");
const playerSplitHandUI = document.querySelector(".playerSplitHand");
const playerSplitHandTotalUI = document.querySelector(".playerSplitHandTotal");

//Variables

let bank, betAmount, playerHandTotal, dealerHandTotal;
let deckID, insuranceBetPlaced, insuranceStopGameGuard, insuranceAlreadyChecked;
let playerTimer, dealerTimer, playerCurrentAction;
let splitMode, splitBetAmount, playerSplitHandTotal, currentPlayerHand;
let playerHand = [];
let playerSplitHand = [];
let dealerHand = [];

//Buttons

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
  betAmount = Number(betValueField.value);
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
    playerCurrentAction = "hit";
    if (!insuranceAlreadyChecked) checkInsurance();
    if (insuranceStopGameGuard) return;
    if (splitMode) {
      if (currentPlayerHand == 1) {
        playerHit(deckID, playerHand);
        return;
      } else {
        playerHit(deckID, playerSplitHand);
        return;
      }
    }
    playerHit(deckID, playerHand);
  });
  standBtn.addEventListener("click", function () {
    playerCurrentAction = "stand";
    if (!insuranceAlreadyChecked) checkInsurance();
    if (insuranceStopGameGuard) return;
    if (splitMode && currentPlayerHand == 1) {
      currentPlayerHand = 2;
      noticeUI.textContent = `Please play 2nd split hand`;
      return;
    }
    noticeUI.textContent = `Dealer's turn...`;
    dealerTimer = setTimeout(dealerTurn, 3000);
  });
  doubleDownBtn.addEventListener("click", function () {
    playerCurrentAction = "doubleDown";
    if (!insuranceAlreadyChecked) checkInsurance();
    if (insuranceStopGameGuard) return;
    bank = bank - betAmount;
    betAmount = betAmount * 2;
    bankUI.textContent = bank;
    betAmountUI.textContent = betAmount;
    noticeUI.textContent = `Player doubles down...`;
    playerHit(deckID);
    dealerTimer = setTimeout(dealerTurn, 3000);
  });
  splitBtn.addEventListener("click", function () {
    playerCurrentAction = "split";
    if (!insuranceAlreadyChecked) checkInsurance();
    if (insuranceStopGameGuard) return;
    noticeUI.textContent = `Player splits hand...`;
    splitPlayerHand();
    // dealerTimer = setTimeout(dealerTurn, 3000);
  });
  //   doubleDownBtn.addEventListener("click", playerDoubleDown);
}

function splitPlayerHand() {
  splitMode = true;
  let poppedCard = playerHand.pop();

  playerSplitHand.push(poppedCard);

  drawCards(deckID, 2)
    .then(function (cardsObj) {
      playerHand.push(cardsObj.card1);
      playerSplitHand.push(cardsObj.card2);
      console.log(`split`);
      console.log(playerHand);
      console.log(playerSplitHand);
      return playerHand;
      // updateUI();
    })
    .then(function (playerHand) {
      updatePlayerUI(playerHand, playerSplitHand);
    });

  splitBetAmount = betAmount;
  bank = bank - splitBetAmount;
  bankUI.textContent = bank;
  splitBetAmountUI.textContent = splitBetAmount;

  currentPlayerHand = 1;
}

function dealPlayerCards(deckID) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      playerHand.push(cardsObj.card1);
      playerHand.push(cardsObj.card2);
      console.log(`dealPlayerCards`);
      console.log(playerHand);
      return playerHand;
      // updateUI();
    })
    .then(function (playerHand) {
      updatePlayerUI(playerHand);
    });
}

function dealDealerCards(deckID) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      dealerHand.push(cardsObj.card1);
      dealerHand.push(cardsObj.card2);
      console.log(`dealDealerCards`);
      console.log(dealerHand);
      return dealerHand;
    })
    .then(function (dealerHand) {
      updateDealerUI(dealerHand);
    });
}

function playerHit(deckID, arr) {
  drawSingleCard(deckID)
    .then(function (cardsObj) {
      arr.push(cardsObj);
      console.log(`dealPlayerCards`);
      console.log(arr);
      return arr;
    })
    .then(function (arr) {
      if (splitMode) {
        if (currentPlayerHand == 1) updatePlayerUI(arr, playerSplitHand);
        if (currentPlayerHand == 2) updatePlayerUI(playerHand, arr);
        return;
      }
      updatePlayerUI(arr);
    });
}

function dealerHit(deckID) {
  drawSingleCard(deckID)
    .then(function (cardsObj) {
      dealerHand.push(cardsObj);
      console.log(`dealDealerCards`);
      console.log(dealerHand);
      return dealerHand;
    })
    .then(function (dealerHand) {
      updateDealerUI(dealerHand);
    });
}

function dealerTurn() {
  if (dealerHandTotal <= 16) {
    noticeUI.textContent = `Dealer Hits...`;
    dealerHit(deckID);
    dealerTimer = setTimeout(dealerTurn, 3000);
    return;
  } else {
    noticeUI.textContent = `Dealer's Turn Ends...`;
    dealerTimer = setTimeout(endRound, 3000);
    return;
  }
}

function endRound() {
  if (splitMode) {
    let playerSplitHand1 = chooseWinner(playerHandTotal, betAmount);
    let playerSplitHand2 = chooseWinner(playerSplitHandTotal, splitBetAmount);

    gameOutcomeUI(playerSplitHand1, playerSplitHand2);
    return;
  }

  let playerSplitHand1 = chooseWinner(playerHandTotal, betAmount);
  gameOutcomeUI(playerSplitHand1);
}

function chooseWinner(playerHandTotal, betAmount) {
  let outcomeNoticeText;

  //   switch (true) {
  //     case playerHandTotal > 21:
  //       noticeUI.textContent = `Player loses. Bust...`;
  //       break;
  //     case dealerHandTotal > 21:
  //       noticeUI.textContent = `Player Wins!  Dealer busts...`;
  //       bank = bank + betAmount * 2;
  //       break;
  //     case dealerHandTotal == 21 && playerHandTotal == 21 && !insuranceBetPlaced:
  //       noticeUI.textContent = `Push.  Both players have blackjack`;
  //       bank = bank + betAmount;
  //       break;
  //     case dealerHandTotal == 21 && playerHandTotal == 21 && insuranceBetPlaced:
  //       noticeUI.textContent = `Push.  Both players have blackjack. Player wins insurance bet.`;
  //       bank = bank + betAmount;
  //       break;
  //     case playerHandTotal == 21:
  //       noticeUI.textContent = `Player Wins.  Blackjack!`;
  //       bank = bank + betAmount * 2 + Math.round(betAmount / 2);
  //       break;
  //     case dealerHandTotal == 21 && !insuranceBetPlaced:
  //       noticeUI.textContent = `Player Loses.  Dealer Blackjack.`;
  //       break;
  //     case dealerHandTotal == 21 && insuranceBetPlaced:
  //       noticeUI.textContent = `Dealer Blackjack.  Player wins insurance bet only.`;
  //       break;
  //     case dealerHandTotal > playerHandTotal:
  //       noticeUI.textContent = `Dealer Wins.`;
  //       break;
  //     case dealerHandTotal == playerHandTotal:
  //       noticeUI.textContent = `Push.`;
  //       bank = bank + betAmount;
  //       break;
  //     default:
  //       noticeUI.textContent = `Player Wins!`;
  //       bank = bank + betAmount * 2;
  //       break;
  //   }

  switch (true) {
    case playerHandTotal > 21:
      outcomeNoticeText = `Player loses. Bust...`;
      break;
    case dealerHandTotal > 21:
      outcomeNoticeText = `Player Wins!  Dealer busts...`;
      bank = bank + betAmount * 2;
      break;
    case dealerHandTotal == 21 && playerHandTotal == 21 && !insuranceBetPlaced:
      outcomeNoticeText = `Push.  Both players have blackjack`;
      bank = bank + betAmount;
      break;
    case dealerHandTotal == 21 && playerHandTotal == 21 && insuranceBetPlaced:
      outcomeNoticeText = `Push.  Both players have blackjack. Player wins insurance bet.`;
      bank = bank + betAmount;
      break;
    case playerHandTotal == 21:
      outcomeNoticeText = `Player Wins.  Blackjack!`;
      bank = bank + betAmount * 2 + Math.round(betAmount / 2);
      break;
    case dealerHandTotal == 21 && !insuranceBetPlaced:
      outcomeNoticeText = `Player Loses.  Dealer Blackjack.`;
      break;
    case dealerHandTotal == 21 && insuranceBetPlaced:
      outcomeNoticeText = `Dealer Blackjack.  Player wins insurance bet only.`;
      break;
    case dealerHandTotal > playerHandTotal:
      outcomeNoticeText = `Dealer Wins.`;
      break;
    case dealerHandTotal == playerHandTotal:
      outcomeNoticeText = `Push.`;
      bank = bank + betAmount;
      break;
    default:
      outcomeNoticeText = `Player Wins!`;
      bank = bank + betAmount * 2;
      break;
  }

  let player = { gameOutcome: outcomeNoticeText, betAmount: betAmount };

  return player;
}

function gameOutcomeUI(hand1, hand2 = null) {
  bankUI.textContent = bank;

  if (splitMode) {
    noticeUI.innerHTML = `Hand 1: ${hand1.gameOutcome}<br>Hand 2: ${hand2.gameOutcome}`;
    betAmountUI.textContent = hand1.betAmount;
    splitBetAmountUI.textContent = hand2.betAmount;
  } else {
    noticeUI.textContent = hand1.gameOutcome;
    betAmountUI.textContent = hand1.betAmount;
  }
}

//       if (dealerHandTotal == 21 && playerHandTotal == 21) {
//           noticeUI.textContent = `Push.  Both players have blackjack.`;
//       } else if (dealerHandTotal == 21) {
//           noticeUI.textContent = `Player Loses.  Dealer Blackjack.`;
//       } else if (dealerHandTotal > 21) {
//           noticeUI.textContent = `Player Wins!  Dealer Busts.`;
//       } else if (dealerHandTotal > playerHandTotal)
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
        value: cardData[0].value,
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

function updatePlayerUI(arr, arr2 = null) {
  console.log(`Update UI:`);
  console.log(arr);

  let card1UI = [];
  let cards1Value = [];

  let card2UI = [];
  let cards2Value = [];

  for (let card of arr) {
    card1UI.push(card.code);
    cards1Value.push(card.value);
  }

  if (splitMode) {
    for (let card of arr2) {
      card2UI.push(card.code);
      cards2Value.push(card.value);
    }

    playerSplitHandTotal = getPlayerValue(cards2Value);

    playerSplitHandTotalUI.textContent = playerSplitHandTotal;
    playerSplitHandUI.textContent = card2UI.join();
  }

  //   if (splitMode && currentPlayerHand == 2) {
  //     playerSplitHandTotal = getPlayerValue(cardsValue);

  //     playerSplitHandTotalUI.textContent = playerSplitHandTotal;
  //     playerSplitHandUI = cardUI.join();
  //   } else {
  playerHandTotal = getPlayerValue(cards1Value);

  playerHandTotalUI.textContent = playerHandTotal;
  playerHandUI.textContent = card1UI.join();

  if (playerHand.length == 2 || playerSplitHand.length == 2) {
    checkNaturalBlackjack();
  }

  checkBust();
}

function checkNaturalBlackjack() {
  //   if (
  //     (playerHandTotal == 21 && playerHand.length == 2) ||
  //     playerHandTotal > 21
  //   ) {
  //     chooseWinner();
  //   }

  if (splitMode) {
    if (currentPlayerHand == 1 && playerHandTotal == 21) {
      currentPlayerHand = 2;
    } else if (currentPlayerHand == 2 && playerSplitHandTotal == 21) {
      dealerTurn();
    }
  } else {
    if (playerHandTotal == 21) endRound();
  }
}

function checkBust() {
  if (splitMode) {
    if (currentPlayerHand == 1 && playerHandTotal > 21) {
      currentPlayerHand = 2;
    } else if (currentPlayerHand == 2 && playerSplitHandTotal > 21) {
      dealerTurn();
    }
  } else {
    if (playerHandTotal > 21) endRound();
  }
}

//   if (playerHandTotal = 21 && playerHand.length = 2) {
//       playerBlackJackRoutine();
//       noticeUI.textContent = `Player Blackjack!  You Win!!!`;
//     //   playerWinRoutine();
//   }

//   if (playerHandTotal > 21) {
//       noticeUI.textContent = `Player Bust.  You Lose!`;
//       playerBustRoutine();
//   }

function updateDealerUI(dealerHand) {
  console.log(`Update Dealer UI:`);
  console.log(dealerHand);

  let cardUI = [];
  let cardsValue = [];

  for (let card of dealerHand) {
    cardUI.push(card.code);
    cardsValue.push(card.value);
  }

  dealerHandTotal = getPlayerValue(cardsValue);

  dealerHandTotalUI.textContent = dealerHandTotal;
  dealerHandUI.textContent = cardUI.join();
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
// let dealerHand = drawCards(deckID, 2);

// playerCards.then(function (playerCards) {});

// let pCard1Value = Number(playerCards.card1.value);
// let pCard2Value = Number(playerCards.card2.value);

// test1.textContent = pCard1Value;
// test2.textContent = pCard2Value;

// function playerBlackJackRoutine () {
//     if (dealerHandTotal = 21) {
//         noticeUI.textContent = `Push.  Both have the same score`;
//     } else {
//         noticeUI.textContent = `Player BlackJack!  You Win!!!`
//     }
// }

// function playerBustRoutine ()

function checkInsurance() {
  insuranceAlreadyChecked = true;

  if (!(dealerHand[1].value == "ACE")) return;

  console.log(dealerHand[1].value);

  noticeUI.textContent = `Insurance?`;

  insuranceStopGameGuard = true;
  acceptInsuranceBtn.addEventListener("click", function () {
    noticeUI.textContent = `Choose an insurance bet that is half your bet amount`;
    submitInsuranceBetBtn.addEventListener("click", insuranceLogic);
  });

  declineInsuranceBtn.addEventListener("click", function () {
    insuranceStopGameGuard = false;
    switch (playerCurrentAction) {
      case "hit":
        noticeUI.textContent = `Insurance Declined.  Player Hits...`;
        playerTimer = setTimeout(function () {
          playerHit(deckID);
        }, 3000);
        break;
      case "doubleDown":
        noticeUI.textContent = `Insurance Declined.  Player doubles down...`;
        bank = bank - betAmount;
        betAmount = betAmount * 2;
        bankUI.textContent = bank;
        betAmountUI.textContent = betAmount;
        playerTimer = setTimeout(function () {
          playerHit(deckID);
        }, 3000);
        break;
      case "split":
        noticeUI.textContent = `Insurance Declined.  Player splits hand...`;
        playerTimer = setTimeout(splitPlayerHand, 3000);
        break;
      default:
        noticeUI.textContent = `Insurance Declined. Player stands...`;
        playerTimer = setTimeout(dealerTurn, 3000);
        break;
    }
  });
}

function insuranceLogic() {
  let insuranceBet = Number(insuranceBetValueField.value);

  if (insuranceBet > Math.round(betAmount / 2)) {
    insuranceBet = 0;
    noticeUI.textContent = `Invalid Insurance Bet.  Please try again.`;
    return;
  }

  //   dealerHandTotal = 21;

  if (dealerHand[1].value == "ACE" && dealerHandTotal == 21) {
    insuranceBetPlaced = true;
    insuranceStopGameGuard = false;
    bank = bank + insuranceBet * 2;
    endRound();
    return;
  }

  bank = bank - insuranceBet;
  bankUI.textContent = bank;
  noticeUI.textContent = `Lost Insurance Bet.  Player's Turn.`;
  insuranceStopGameGuard = false;
}
