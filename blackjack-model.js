import {
  executeDealerTurn,
  updateController,
  updateControllerCardInfo,
  updateControllerNextDealerTurn,
  updateControllerSplitCardInfo,
} from "./controller.js";

// Variables

let deckID = `h9j8glyl41fb`;
let bank;
let gameActive;
let betAmount, insuranceBetAmount, splitBetAmount;
let playerHandTotal, playerSplitHandTotal;
let dealerHandTotal, visibleDealerHandTotal;
let playerHand = [];
let playerSplitHand = [];
let dealerHand = [];
let playerCardImgs = [];
let playerSplitCardImgs = [];
let dealerCardImgs = [];
let currentSplitHand;
let doubleDownMode;
let splitMode;
let cancelPlayerHit;
let insuranceAlreadyChecked, hand2PassNeeded, insuranceLost;
let cardObj;
let specialToken = {
  split: false,
  insurance: false,
  naturalBlackJack: false,
};
let splitHandPass = { hand1Bust: false, hand2Charlie: false };
// let bustSplitHandPass = false;

export function resetBank() {
  bank = 1000;
  return bank;
}

export function updateModelBank(updatedBank) {
  bank = updatedBank;
}

export function makeGameInactive() {
  gameActive = false;
}

export function initDeck() {
  if (deckID) return;

  const getNewDeckID = function () {
    return fetch(`https://deckofcardsapi.com/api/deck/new`)
      .then(
        function (response) {
          return response.json();
        },
        (err) => alert(err)
      )
      .then(function (data) {
        deckID = data.deck_id;
        console.log(deckID);
        return deckID;
      })
      .catch(function (err) {
        alert(err);
      });
  };

  getNewDeckID();
}

export function shuffleCards() {
  // if (!deckID) {
  //   getNewDeckID()
  //     .then(function (data) {
  //       deckID = data;
  //     })
  //     .catch((err) => alert(`Did not get new deck ID`));
  // }

  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {})
    .catch((err) => shuffleCards(deckID));
}

export function checkValidInsuranceBet(submittedBet) {
  insuranceBetAmount = submittedBet;
  if (insuranceBetAmount > betAmount / 2 || insuranceBetAmount > bank) {
    insuranceBetAmount = 0;
    return false;
  } else return true;
}

//needs to be continued
export function insuranceLogic(insuranceBet) {
  if (dealerHand[1].value == "ACE" && dealerHandTotal == 21) {
    bank = bank + insuranceBet * 2;
    insuranceLost = true;
    return [bank, insuranceLost];
  }

  bank = bank - insuranceBet;

  insuranceLost = false;
  return [bank, insuranceLost];
}

export function checkValidBet(submittedBet) {
  if (submittedBet > bank) return false;
  return true;
}

export function updateBetAmount(submittedBet) {
  betAmount = submittedBet;
  bank = bank - betAmount;
  return [bank, betAmount];
}

export function revealDealerCards() {
  gameActive = false;
  updateDealerCards(dealerHand);
  return renderCardInfo();
}

export function dealInitialCards() {
  gameActive = true;
  shuffleCards(deckID);
  dealPlayerCards(deckID);
  dealDealerCards(deckID);
  // if (checkNaturalBlackjack()) token.push({ naturalToken: naturalToken });
  // if (splitToken) token.push({ splitToken: splitToken });
  // if (insuranceToken) token.push({ insuranceToken: insuranceToken });

  // cardObj = renderCardInfo(specialToken);
}

export function collectDealedCards() {
  return cardObj;
}

function checkNaturalBlackjack() {
  if (playerHandTotal == 21) specialToken.naturalBlackJack = true;
  // return true;
}

function renderCardInfo(token = null) {
  let cardInfo = {
    playerCardImgs: playerCardImgs,
    playerHandTotal: playerHandTotal,
    playerSplitCardImgs: playerSplitCardImgs,
    playerSplitHandTotal: playerSplitHandTotal,
    dealerCardImgs: dealerCardImgs,
    dealerHandTotal: dealerHandTotal,
    visibleDealerHandTotal: visibleDealerHandTotal,
  };

  if (token) cardInfo.token = token;

  return cardInfo;
}

function dealPlayerCards(deckID) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      playerHand.push(cardsObj.card1);
      playerHand.push(cardsObj.card2);

      //Test Split Cards (replace original 2 cards) and Test Bust (add to original 2)
      // playerHand.push(playerSplitTestCard1);
      // playerHand.push(playerSplitTestCard2);

      //Test Player 5 Card Charlie (comment out original 2 cards)
      // createFiveCardCharlieTestHand(`player`);

      console.log(`dealPlayerCards`);
      console.log(playerHand);
      return playerHand;
    })
    .then(function (playerHand) {
      updatePlayerCards(playerHand);
    })
    .catch((err) => dealPlayerCards(deckID))
    .finally(function () {
      checkValidSplit(playerHand);
      cardObj = renderCardInfo(specialToken);
    });
}

function dealDealerCards(deckID) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      dealerHand.push(cardsObj.card1);
      dealerHand.push(cardsObj.card2);

      //To test Dealer Bust (keep original 2 cards)
      // dealerHand.push(playerSplitTestCard1);
      // dealerHand.push(playerSplitTestCard2);

      //To test Insurance functionality (substitute card2)
      // dealerHand.push(dealerInsTestCard);

      //To test 5 Card Charlie (comment out all other dealerHands)
      // createFiveCardCharlieTestHand(`dealer`);

      return dealerHand;
    })
    .then(function (dealerHand) {
      updateDealerCards(dealerHand);
    })
    .catch((err) => dealDealerCards(deckID))
    .finally(function () {
      // checkValidInsurance(dealerHand);
      cardObj = renderCardInfo(specialToken);
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

function updatePlayerCards(arr, arr2 = null) {
  playerCardImgs.length = 0;

  let playerCardValue = [];

  let playerSplitCardValue = [];

  for (let card of arr) {
    let imgTag = `<img src='${card.image}' class='card'>`;

    playerCardImgs.push(imgTag);
    playerCardValue.push(card.value);
  }

  playerHandTotal = getPlayerValue(playerCardValue);

  if (splitMode) {
    playerSplitCardImgs.length = 0;

    for (let card of arr2) {
      let imgTag = `<img src='${card.image}' class='card'>`;

      playerSplitCardImgs.push(imgTag);
      playerSplitCardValue.push(card.value);
    }

    playerSplitHandTotal = getPlayerValue(playerSplitCardValue);

    // playerSplitHandTotalUI.textContent = playerSplitHandTotal;
    // playerSplitHandUI.innerHTML = card2UI.join();
  }

  // playerHandTotalUI.textContent = playerHandTotal;
  // playerHandUI.innerHTML = card1UI.join();

  if (playerHand.length == 2 && !splitMode) checkNaturalBlackjack();
  // }

  return playerHand;
}

function updateDealerCards(dealerHand) {
  dealerCardImgs.length = 0;
  let dealerCardValue = [];
  let visibleDealerCardValue = [];
  // visibleDealerHandTotal;

  dealerHand.forEach((card, index) => {
    let imgTag;
    if (index == 0) {
      if (gameActive) {
        imgTag = `<img src='img/playing-card-back.svg' class='card'>`;
      } else {
        imgTag = `<img src='${card.image}' class='card'>`;
        visibleDealerCardValue.push(card.value);
      }
    } else {
      imgTag = `<img src='${card.image}' class='card'>`;
      visibleDealerCardValue.push(card.value);
    }

    dealerCardImgs.push(imgTag);
    dealerCardValue.push(card.value);
  });

  visibleDealerHandTotal = getPlayerValue(visibleDealerCardValue);
  dealerHandTotal = getPlayerValue(dealerCardValue);

  // dealerHandTotalUI.textContent = visibleDealerHandTotal;
  // dealerHandUI.innerHTML = cardUI.join();

  checkFiveCardCharlie();
  checkValidInsurance(dealerHand);
}

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

function getPlayerValue(arr) {
  let numberArr = arr.map(getCardValue);

  let total = numberArr.reduce((acc, cur) => acc + cur);

  if (total > 21 && arr.includes("ACE")) {
    let index = arr.indexOf("ACE");
    arr[index] = "ACELOW";
    total = getPlayerValue(arr);
  }

  return total;
}

export function checkValidSplit(playerHand) {
  if (splitMode) return;
  let card1 = playerHand[0].value;
  let card2 = playerHand[1].value;

  if (card1 == card2) specialToken.split = true;
}

function checkValidInsurance(dealerHand) {
  if (insuranceAlreadyChecked) return;
  insuranceAlreadyChecked = true;

  if (dealerHand[1].value == "ACE" && bank >= 1 && betAmount >= 2)
    specialToken.insurance = true;
}

export function applyDoubleDown() {
  doubleDownMode = true;
  bank = bank - betAmount;
  betAmount = betAmount * 2;
  return [bank, betAmount];
}

export function changeCurrentSplitHand() {
  return (currentSplitHand = 2);
}

export function executePlayerHit() {
  if (splitMode) {
    hand2PassNeeded = false;
    if (currentSplitHand == 1) {
      playerHit(deckID, playerHand);
      return;
    } else {
      playerHit(deckID, playerSplitHand);
      return;
    }
  }
  playerHit(deckID, playerHand);
  if (cancelPlayerHit) return;
}

export function executeDealerHit() {
  dealerHit(deckID);
}

function dealerHit(deckID) {
  drawSingleCard(deckID)
    .then(function (cardsObj) {
      dealerHand.push(cardsObj);
      return dealerHand;
    })
    .then(function (dealerHand) {
      updateDealerCards(dealerHand);
    })
    .catch((err) => {
      drawSingleCard(deckID);
    })
    .finally(function () {
      // checkValidInsurance();
      cardObj = renderCardInfo();
      updateControllerCardInfo(cardObj);
      updateControllerNextDealerTurn();
    });
}

export function splitPlayerHand() {
  splitMode = true;
  let poppedCard = playerHand.pop();
  playerSplitHand.push(poppedCard);

  drawCards(deckID, 2)
    .then(function (cardsObj) {
      playerHand.push(cardsObj.card1);
      playerSplitHand.push(cardsObj.card2);

      //To test Split Hand 2 Five Card Charlie (comment out playerSPlitHand)
      // createFiveCardCharlieTestHand(`split`);

      return playerHand;
    })
    .then(function (playerHand) {
      updatePlayerCards(playerHand, playerSplitHand);
    })
    .catch((err) => {
      splitPlayerHand();
    })
    .finally(() => {
      cardObj = renderCardInfo();
      splitBetAmount = betAmount;
      bank = bank - splitBetAmount;
      currentSplitHand = 1;
      let gameInfo = {
        bank: bank,
        splitBetAmount: splitBetAmount,
        currentSplitHand: currentSplitHand,
        gameCards: cardObj,
      };
      updateControllerSplitCardInfo(gameInfo);
      // updateControllerCardInfo(cardObj);
      // checkDoubleDown();
      // checkBust();
      // checkFiveCardCharlie();
    });
  // let cardInfo = renderCardInfo();

  // return [bank, splitBetAmount, cardInfo];
}

function playerHit(deckID, arr) {
  drawSingleCard(deckID)
    .then(function (cardsObj) {
      arr.push(cardsObj);
      return arr;
    })
    .then(function (arr) {
      if (splitMode) {
        if (currentSplitHand == 1) updatePlayerCards(arr, playerSplitHand);
        if (currentSplitHand == 2 && !hand2PassNeeded)
          updatePlayerCards(playerHand, arr);
        return;
      }
      updatePlayerCards(arr);
    })
    .catch((err) => drawSingleCard(deckID))
    .finally(() => {
      cardObj = renderCardInfo();
      updateControllerCardInfo(cardObj);
      checkDoubleDown();
      checkFiveCardCharlie();
      checkBust();
    });

  // function executeUpdatePlayerCards(arr) {
  //   if (splitMode) {
  //     if (currentPlayerHand == 1) updatePlayerCards(arr, playerSplitHand);
  //     if (currentPlayerHand == 2 && !hand2PassNeeded)
  //       updatePlayerCards(playerHand, arr);
  //     return;
  //   }
  //   updatePlayerCards(arr);
  // }

  function checkDoubleDown() {
    if (doubleDownMode && playerHandTotal < 21) executeDealerTurn();
  }

  function checkBust() {
    if (!gameActive) return;

    let bustToken = ``;
    if (playerHandTotal > 21 || playerSplitHandTotal > 21)
      cancelPlayerHit = true;
    if (splitMode) {
      switch (true) {
        case currentSplitHand == 1 && playerHandTotal > 21:
          hand2PassNeeded = true;
          currentSplitHand = 2;
          bustToken = `split hand 1 bust`;
          updateController(bustToken);
          break;
        case currentSplitHand == 2 &&
          playerHandTotal > 21 &&
          playerSplitHandTotal > 21:
          bustToken = `bust`;
          updateController(bustToken);
          break;
        case currentSplitHand == 2 && playerSplitHandTotal > 21:
          bustToken = `split hand 2 bust`;
          updateController(bustToken);
          break;
        case splitHandPass.hand1Bust:
          splitHandPass.hand1Bust = false;
          bustToken = `hand 2 continue`;
          updateController(bustToken);
          break;
        case splitHandPass.hand2Charlie:
          splitHandPass.hand2Charlie = false;
          bustToken = `break `;
          updateController(bustToken);
          break;
        default:
          bustToken = `continue`;
          updateController(bustToken);
      }
    } else if (playerHandTotal > 21) {
      bustToken = `bust`;
      updateController(bustToken);
    } else if (playerHandTotal <= 21 || playerSplitHandTotal <= 21) {
      bustToken = `continue`;
      updateController(bustToken);
    }
  }
}

function checkFiveCardCharlie() {
  if (!gameActive) return;
  if (dealerHandTotal > 21) return;
  if (!splitMode && playerHandTotal > 21) return;
  if (splitHandPass.charliePass) return;

  let charlieToken = ``;

  if (splitMode) {
    if (
      currentSplitHand == 1 &&
      playerHand.length == 5 &&
      playerHandTotal <= 21
    ) {
      splitHandPass.hand1Bust = true;
      // playerHandTotal = 100;
      charlieToken = `split hand 1 charlie`;
      updateController(charlieToken, playerHandTotal);
      currentSplitHand = 2;
      return;
    } else if (
      currentSplitHand == 2 &&
      playerSplitHand.length == 5 &&
      playerSplitHandTotal <= 21
    ) {
      // playerSplitHandTotal = 100;
      charlieToken = `split hand 2 charlie`;
      splitHandPass.hand2Charlie = true;
      splitHandPass.charliePass = true;
      updateController(charlieToken, playerSplitHandTotal);
      return;
    }
  }

  if (!splitMode && playerHand.length == 5) {
    // playerHandTotal = 100;
    charlieToken = `player charlie`;
    updateController(charlieToken, playerHandTotal);
    return;
  }

  if (dealerHand.length == 5) {
    // dealerHandTotal = 100;
    charlieToken = `dealer charlie`;
    updateController(charlieToken, dealerHandTotal);
  }
}

export function calculatePlayerWinnings(betAmount, outcome) {
  switch (outcome) {
    case `win`:
      bank = bank + betAmount * 2;
      return bank;
    case `push`:
      bank = bank + betAmount;
      return bank;
    case `blackjack`:
      bank = bank + betAmount * 2 + Math.round(betAmount / 2);
      return bank;
      defaut: return bank;
  }
}

export function clearRoundModelData() {
  betAmount = 0;
  playerHandTotal = 0;
  dealerHandTotal = 0;
  insuranceAlreadyChecked = false;
  doubleDownMode = false;
  splitMode = false;
  splitBetAmount = 0;
  playerSplitHandTotal = 0;
  currentSplitHand = 1;
  hand2PassNeeded = false;
  specialToken.split = false;
  specialToken.insurance = false;
  specialToken.naturalBlackJack = false;
  splitHandPass.hand1Bust = false;
  splitHandPass.hand2Charlie = false;
  splitHandPass.charliePass = false;

  playerHand.splice(0);
  playerSplitHand.splice(0);
  dealerHand.splice(0);
  playerCardImgs.splice(0);
  playerSplitCardImgs.splice(0);
  dealerCardImgs.splice(0);
}

////////// Test cards //////////
// Dealer card for testing Insurance mode logic
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

// Player cards for testing Split mode logic
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

function createFiveCardCharlieTestHand(player) {
  if (player === `dealer`) {
    dealerHand.push({
      code: "AH",
      image: `https://deckofcardsapi.com/static/img/AH.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AH.svg",
        png: "https://deckofcardsapi.com/static/img/AH.png",
      },
      suit: "HEARTS",
      value: "ACE",
    });
    dealerHand.push({
      code: "AS",
      image: `https://deckofcardsapi.com/static/img/AS.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AS.svg",
        png: "https://deckofcardsapi.com/static/img/AS.png",
      },
      suit: "SPADES",
      value: "ACE",
    });
    dealerHand.push({
      code: "2D",
      image: `https://deckofcardsapi.com/static/img/2D.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/2D.svg",
        png: "https://deckofcardsapi.com/static/img/2D.png",
      },
      suit: "DIAMONDS",
      value: "2",
    });
    dealerHand.push({
      code: "AC",
      image: `https://deckofcardsapi.com/static/img/AC.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AC.svg",
        png: "https://deckofcardsapi.com/static/img/AC.png",
      },
      suit: "CLUBS",
      value: "ACE",
    });
  } else if (player == `split`) {
    playerSplitHand.push({
      code: "AH",
      image: `https://deckofcardsapi.com/static/img/AH.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AH.svg",
        png: "https://deckofcardsapi.com/static/img/AH.png",
      },
      suit: "HEARTS",
      value: "ACE",
    });
    playerSplitHand.push({
      code: "AS",
      image: `https://deckofcardsapi.com/static/img/AS.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AS.svg",
        png: "https://deckofcardsapi.com/static/img/AS.png",
      },
      suit: "SPADES",
      value: "ACE",
    });
    playerSplitHand.push({
      code: "AC",
      image: `https://deckofcardsapi.com/static/img/AC.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AC.svg",
        png: "https://deckofcardsapi.com/static/img/AC.png",
      },
      suit: "CLUBS",
      value: "ACE",
    });
  } else {
    playerHand.push({
      code: "AH",
      image: `https://deckofcardsapi.com/static/img/AH.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AH.svg",
        png: "https://deckofcardsapi.com/static/img/AH.png",
      },
      suit: "HEARTS",
      value: "ACE",
    });
    playerHand.push({
      code: "AS",
      image: `https://deckofcardsapi.com/static/img/AS.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AS.svg",
        png: "https://deckofcardsapi.com/static/img/AS.png",
      },
      suit: "SPADES",
      value: "ACE",
    });
    playerHand.push({
      code: "2D",
      image: `https://deckofcardsapi.com/static/img/2D.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/2D.svg",
        png: "https://deckofcardsapi.com/static/img/2D.png",
      },
      suit: "DIAMONDS",
      value: "2",
    });
    playerHand.push({
      code: "AC",
      image: `https://deckofcardsapi.com/static/img/AC.png`,
      images: {
        svg: "https://deckofcardsapi.com/static/img/AC.svg",
        png: "https://deckofcardsapi.com/static/img/AC.png",
      },
      suit: "CLUBS",
      value: "ACE",
    });
  }
}
