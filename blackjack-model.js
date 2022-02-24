import * as testCard from "./test-cards.js";
import * as controller from "./controller.js";

class Cardholder {
  hand;

  constructor() {}

  addNewHand(hand) {
    this.hand = hand;
  }

  get getHand() {
    return this.hand;
  }
}

class Hand {
  total;
  cards = [];
  images = [];
  simpleImages = [];
  endTags = [];
  addImagesToHand;

  constructor(type, handNum) {
    this.type = type;
    this.handNum = handNum;
  }

  set addCardToHand(card) {
    this.cards.push(card);
    this.total = this.calculateHandTotal(this.cards);
    this.addImagesToHand(card);
  }

  popCardFromHand() {
    let poppedCard = this.cards.pop();

    this.simpleImages.pop();
    this.images.pop();
    if (this.type != `dealer`) this.codes.pop();
    this.endTags.pop();
    this.calculateHandTotal(this.cards);
    return poppedCard;
  }

  calculateHandTotal(cards) {
    let handValueArr = cards.map((card) => card.value);
    let getCardValue = this.getCardValue;

    return getHandValue(handValueArr);

    function getHandValue(arr) {
      let total = arr.map(getCardValue).reduce((acc, cur) => acc + cur);

      if (total > 21 && arr.includes("ACE")) {
        let index = arr.indexOf("ACE");
        arr[index] = "ACELOW";
        total = getHandValue(arr);
      }

      return total;
    }
  }

  getCardValue(value) {
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

  addEndingCardTags(imageArr) {
    let cardCount = this.cards.length;
    let endTags = `<li><ul>`;
    let repeatedTags = endTags.repeat(cardCount);
    this.images.push(repeatedTags);
  }

  cardHit(cardHolder, gameState) {
    let hand = this;

    drawSingleCard(gameInfo.deckID)
      .then(function (cardsObj) {
        hand.addCardToHand = cardsObj;
      })
      .catch((err) => alert(`error executeHit`))
      .finally(function () {
        hand.performHandChecks(gameState);
        controller.updateStatePlayers(cardHolder, gameState);
        cardHolder.determineContinueStatus(hand, gameState);
      });
  }

  performHandChecks(gameState) {
    let options = gameState.options;

    this.checkHandForBust();
    this.checkHandForCharlie(options);
  }

  checkHandForBust() {
    if (this.total <= 21) return;
    else this.outcome = `bust`;
  }

  checkHandForCharlie(options) {
    let cardCount = this.cards.length;

    let charlieLimit;

    if (options.fiveCardCharlie) charlieLimit = 5;
    else charlieLimit = 7;

    if (this.total > 21) return;
    if (cardCount < charlieLimit) return;

    this.outcome = `charlie`;
    this.charlieType = cardCount;
  }

  checkStandForCharlie() {
    let cardCount = this.cards.length;

    if (cardCount < 5) return false;

    this.outcome = `charlie`;
    this.charlieType = cardCount;
    return true;
  }

  checkForAces() {
    return this.cards.some((obj) => obj.value == "ACE");
  }

  calculateWinnings(options, bet) {
    let bjPayout = options.blackjackPayout;
    let winnings;

    switch (this.roundOutcome) {
      case `win`:
        winnings = bet * 2 + bet;
        break;
      case `push`:
        winnings = bet;
        break;
      case `surrender`:
        winnings = Math.round(bet / 2);
        break;
      case `natural`:
        let num = bjPayout.split(`:`).map((num) => parseInt(num, 10));
        let multiplier = num[0];
        let divider = num[1];

        winnings = Math.round((bet * multiplier) / divider) + bet;
        break;
      default:
        winnings = 0;
    }

    this.winnings = winnings;
  }

  generateOutcomePackage() {
    let outcomePackage = {};

    outcomePackage.handOutcome = this.outcome;
    outcomePackage.roundOutcome = this.roundOutcome;
    outcomePackage.winnings = this.winnings;
    outcomePackage.outcomeText = this.roundOutcomeText;

    let name;

    if (this.handNum == 1) name = `Hand 1`;
    else if (this.handNum == 2) name = `Hand 2`;
    else if (this.handNum == 3) name = `Hand 3`;
    else if (this.handNum == 4) name = `Hand 4`;
    else name = `Player`;

    outcomePackage.name = name;

    this.outcomePackage = outcomePackage;
  }

  getFinalOutcome() {
    if (this.outcome == `stand`) {
      if (this.handNum <= 4) this.outcome = `playerStand`;
      else this.outcome = `dealerStand`;
    }

    return this.outcome;
  }
}

class Player extends Cardholder {
  betAmount = 0;
  type = `player`;
  splitHands = [];
  currentSplitHand = 0;

  constructor(bank) {
    super();
    this.bank = bank;
  }

  checkHandForNatural(hand) {
    if (hand.cards.length !== 2) return false;
    if (hand.total != 21) return false;

    this.hand.outcome = `natural`;
    return true;
  }

  set updateType(type) {
    this.type = type;
  }

  set updateCurrentSplitHand(handNum) {
    this.currentSplitHand = handNum;
  }

  getSplitHand(handNum) {
    return this.splitHands.find((obj) => obj.handNum == handNum);
  }

  splitHand(newCards) {
    let [newCard1, newCard2] = newCards;
    let currHand, splitHand, splitCard;
    let currentSplitHand = this.currentSplitHand;
    let handCount = this.splitHands.length;

    switch (currentSplitHand) {
      case 1:
        currHand = this.getSplitHand(1);
        splitCard = currHand.popCardFromHand();
        if (handCount == 4) splitHand = this.getSplitHand(4);
        if (handCount == 3) splitHand = this.getSplitHand(3);
        if (handCount == 2) splitHand = this.getSplitHand(2);
        break;
      case 2:
        currHand = this.getSplitHand(2);
        splitCard = currHand.popCardFromHand();
        if (handCount == 2) splitHand = this.getSplitHand(3);
        else splitHand = this.getSplitHand(4);
        break;
      case 3:
        currHand = this.getSplitHand(3);
        splitCard = currHand.popCardFromHand();
        splitHand = this.getSplitHand(4);
        break;
      default:
        console.log(`Error: Split Cards`);
    }
    currHand.addCardToHand = newCard1;
    splitHand.addCardToHand = splitCard;
    splitHand.addCardToHand = newCard2;
  }

  addInitialSplitHands(newHand) {
    let splitHand = this.hand;

    splitHand.splitValid = false;
    splitHand.splitChecked = false;
    splitHand.handNum = 1;

    this.splitHands.push(splitHand);
    this.splitHands.push(newHand);
    this.hand = null;
  }

  addNewSplitHand(newHand) {
    this.splitHands.push(newHand);
  }

  addCardToSplitHand(handNum, newCard) {
    let hand = this.splitHands.find((obj) => obj.handNum == handNum);

    hand.addCardToHand(newCard);
  }

  checkValidResplitActions(hand, options) {
    if (hand.splitChecked) return;
    hand.splitChecked = true;

    this.checkValidResplitDraw(hand, options);

    if (!options.resplitting) {
      hand.splitValid = false;
      return;
    }

    if (this.acesSplit && !options.resplitAfterSplitAces) {
      hand.splitValid = false;
      return;
    }

    this.checkValidSplit(hand, options);
  }

  checkValidResplitDraw(hand, options) {
    options.doubleAfterSplit
      ? (hand.resplitDoubleValid = true)
      : (hand.resplitDoubleValid = false);

    hand.resplitHit = true;

    if (!this.acesSplit) return;

    options.doubleAfterSplitAces
      ? (hand.resplitDoubleValid = true)
      : (hand.resplitDoubleValid = false);

    if (options.draw1SplitAce) {
      hand.resplitDoubleValid = false;
      hand.resplitHit = false;
    }
  }

  checkValidSplit(hand, options) {
    let card1 = hand.cards[0].value;
    let card2 = hand.cards[1].value;
    let result;

    if (options.splitAnyTens) {
      card1 = convertTenValueCard(card1);
      card2 = convertTenValueCard(card2);
    }

    if (!options.splitAces) {
      if (card1 == "ACE" || card2 == "ACE") {
        hand.splitValid = false;
        hand.splitChecked = true;
        return;
      }
    }

    if (card1 == card2) result = true;
    else result = false;

    result ? (hand.splitValid = true) : (hand.splitValid = false);

    function convertTenValueCard(value) {
      let faceCards = ["JACK", "QUEEN", "KING"];
      let result = faceCards.some((face) => face == value);

      if (result) value = "10";
      return value;
    }
  }

  executeHit(gameState) {
    let options = gameState.options;
    let activeHand = this.currentSplitHand;
    let hand;

    if (activeHand == 0) hand = gameState.player.hand;
    else hand = this.getSplitHand(activeHand);

    hand.cardHit(this, gameState);
  }

  determineContinueStatus(hand, gameState) {
    let options = gameState.options;
    let outcome = hand.outcome;
    let activeHand = this.currentSplitHand;
    let handCount = 1;
    let nextAction;

    if (activeHand > 0) handCount = this.splitHands.length;

    switch (outcome) {
      case `bust`:
        if (activeHand == 0) nextAction = `endRound`;
        else if (activeHand == handCount) nextAction = `dealer`;
        else nextAction = `changeHand`;
        break;
      case `charlie`:
        let charlieLimit;

        if (options.fiveCardCharlie) charlieLimit = 5;
        else charlieLimit = 7;

        if (hand.charlieCount < charlieLimit) nextAction = `continue`;
        else if (activeHand == 0) nextAction = `endRound`;
        else if (activeHand == handCount) nextAction = `dealer`;
        else nextAction = `changeHand`;
        break;
      default:
        if (!hand.doubleDownActive) nextAction = `continue`;
        else {
          if (activeHand == 0 || activeHand == handCount) nextAction = `dealer`;
          else nextAction = `changeHand`;

          hand.outcome = `stand`;
        }
    }

    let gameTimer = setTimeout(
      controller.nextPlayerAction,
      1500,
      nextAction,
      gameState
    );
  }
}

class Dealer extends Cardholder {
  type = `dealer`;

  constructor() {
    super();
  }

  checkHandForNatural(hand) {
    if (hand.cards.length !== 2) return;
    if (hand.total != 21) return;

    this.hand.outcome = `natural`;
  }

  checkHandForPeek() {
    let faceUpCard = this.hand.cards[1];
    let cardValue = this.hand.getCardValue(faceUpCard.value);

    cardValue >= 10 ? (this.peekNeeded = true) : (this.peekNeeded = false);
  }

  executeHit(gameState) {
    this.hand.cardHit(this, gameState);
  }

  determineContinueStatus(hand, gameState) {
    let options = gameState.options;
    let outcome = hand.outcome;
    let dealerLimit = options.dealerStandsOn;
    let aces, nextAction;

    if (outcome == `bust` || outcome == `charlie`) nextAction = `endRound`;
    else {
      switch (dealerLimit) {
        case `soft16`:
          if (this.hand.total >= 16) nextAction = `endRound`;
          else nextAction = `continue`;
          break;
        case `hard16`:
          if (this.hand.total > 16) nextAction = `endRound`;
          else if (this.hand.total < 16) nextAction = `continue`;
          else {
            aces = this.hand.checkForAces();
            if (aces) nextAction = `continue`;
            else nextAction = `endRound`;
          }
          break;
        case `soft17`:
          if (this.hand.total >= 17) nextAction = `endRound`;
          else nextAction = `continue`;
          break;
        case `hard17`:
          if (this.hand.total > 17) nextAction = `endRound`;
          else if (this.hand.total < 17) nextAction = `continue`;
          else {
            aces = this.hand.checkForAces();
            if (aces) nextAction = `continue`;
            else nextAction = `endRound`;
          }
          break;
        default:
          console.log(`ERROR: Determine Dealer Continue`);
      }

      if (nextAction == `endRound`) hand.outcome = `stand`;
      else hand.outcome = `dealerHit`;
    }

    let gameTimer = setTimeout(
      controller.nextDealerAction,
      1500,
      nextAction,
      gameState
    );
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
          // console.log(gameInfo.deckID);
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
  })(gameInfo.deckID);
}

export function shuffleCards(deckCount) {
  fetch(
    `https://deckofcardsapi.com/api/deck/${gameInfo.deckID}/shuffle/?deck_count=${deckCount}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {})
    .catch((err) => console.log(`shuffle cards error`));
}

export function dealInitialCards(gameState) {
  let currentPlayer = gameState.player;
  let currentDealer = gameState.dealer;
  gameState.updateCardsDealt(true);

  initNewHands(currentPlayer, currentDealer);

  dealPlayerCards(gameInfo.deckID, currentPlayer, gameState);
  dealDealerCards(gameInfo.deckID, currentDealer, gameState);
}

function initNewHands(player, dealer) {
  let playerHand = new Hand(`player`, 0);
  let dealerHand = new Hand(`dealer`, 10);

  addPlayerHandMethods(playerHand);

  dealerHand.addImagesToHand = addDealerImagesToHand;
  dealerHand.calcVisibleTotal = calcDealerVisibleHandTotal;
  dealerHand.revealFaceDownCard = revealDealerFaceDownCard;
  dealerHand.visibleCards = [];
  dealerHand.visibleTotal = 0;

  player.addNewHand(playerHand);
  dealer.addNewHand(dealerHand);
}

function addPlayerHandMethods(playerHand) {
  playerHand.addImagesToHand = addPlayerImagesToHand;
  playerHand.codes = [];
}

function dealPlayerCards(deckID, currentPlayer, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      // console.log(cardsObj);
      currentPlayer.hand.addCardToHand = cardsObj.card1;
      currentPlayer.hand.addCardToHand = cardsObj.card2;
      gameState.updateRemainingCards = cardsObj.remaining;

      //Test Perfect Pair
      // currentPlayer.hand.addCardToHand = testCard.spade7;
      // currentPlayer.hand.addCardToHand = testCard.spade7;
      // currentPlayer.hand.addCardToHand = testCard.club7;
      // currentPlayer.hand.addCardToHand = testCard.heart7;

      //Test Split Ace Functionality
      // currentPlayer.hand.addCardToHand = testCard.heartAce;
      // currentPlayer.hand.addCardToHand = testCard.diamondAce;

      //Test Natural Functionality
      // currentPlayer.hand.addCardToHand = testCard.spadeKing;
      // currentPlayer.hand.addCardToHand = testCard.diamondAce;

      //Test Split Functionality (regularHand)
      // currentPlayer.hand.addCardToHand = testCard.heart7;
      // currentPlayer.hand.addCardToHand = testCard.spade7;

      //Test 21+3 3 Kind (normal)
      // currentPlayer.hand.addCardToHand = testCard.spade7;
      // currentPlayer.hand.addCardToHand = testCard.spade7;
      // currentPlayer.hand.addCardToHand = testCard.spadeJack;
      // currentPlayer.hand.addCardToHand = testCard.spadeJack;

      //Test Perfect 11s (regularHand)
      // currentPlayer.hand.addCardToHand = testCard.heart7;
      // currentPlayer.hand.addCardToHand = testCard.heart4;

      //Test Extra Bet Blackjack
      // currentPlayer.hand.addCardToHand = testCard.diamondKing;
      // currentPlayer.hand.addCardToHand = testCard.heart4;

      //Test House Money
      // currentPlayer.hand.addCardToHand = testCard.diamondKing;
      // currentPlayer.hand.addCardToHand = testCard.diamondAce;

      //Test Player Blackjack/Even Money (replace original 2)
      // currentPlayer.addCardToHand = dealerInsTestCard;
      // currentPlayer.addCardToHand = playerBlackjackCard;

      //Test Split Cards (replace original 2 cards) and Test Bust (add to original 2)
      //   currentPlayer.addCardToHand = playerSplitTestCard1;
      //   currentPlayer.addCardToHand = playerSplitTestCard2;

      //Test Player 5 Card Charlie (comment out original 2 cards)
      // createFiveCardCharlieTestHand(`player`);

      //Test Jackpot Ace Functionality
      // currentPlayer.hand.addCardToHand = testCard.spadeAce;

      //Test Perfect 11s Jackpot Functionality (pair with Jackpot Ace)
      // currentPlayer.hand.addCardToHand = testCard.spadeKing;

      //Test Lucky Ladies Functionality
      // currentPlayer.hand.addCardToHand = testCard.diamondKing;
      // currentPlayer.hand.addCardToHand = testCard.diamondKing;

      //Test Lucky Ladies Queen Pair
      // currentPlayer.hand.addCardToHand = testCard.spadeQueen;
      // currentPlayer.hand.addCardToHand = testCard.spadeQueen;
      // currentPlayer.hand.addCardToHand = testCard.heart9;
      // currentPlayer.hand.addCardToHand = testCard.spadeJack;
      // currentPlayer.hand.addCardToHand = testCard.spadeJack;

      //Test Lucky Ladies Queen Hearts Pair
      // currentPlayer.hand.addCardToHand = testCard.heartQueen;
      // currentPlayer.hand.addCardToHand = testCard.heartQueen;
    })
    .catch((err) => dealPlayerCards(deckID))
    .finally(function () {
      currentPlayer.checkHandForNatural(currentPlayer.hand);
    });
}

function dealDealerCards(deckID, currentDealer, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      currentDealer.hand.addCardToHand = cardsObj.card1;
      currentDealer.hand.addCardToHand = cardsObj.card2;
      gameState.updateRemainingCards = cardsObj.remaining;

      //To test Dealer Bust (keep original 2 cards)
      // dealerHand.push(playerSplitTestCard1);
      // dealerHand.push(playerSplitTestCard2);

      //Test Perfect Pair
      // currentDealer.hand.addCardToHand = testCard.spade7;
      // currentDealer.hand.addCardToHand = testCard.spade7;

      // To test Insurance functionality (substitute card2)
      // currentDealer.hand.addCardToHand = testCard.heartAce;

      //To test 5 Card Charlie (comment out all other dealerHands)
      // createFiveCardCharlieTestHand(`dealer`);

      //To Test "Dealer Stands On" routines
      // currentDealer.hand.addCardToHand = testCard.heartAce;
      // currentDealer.hand.addCardToHand = testCard.spade6;
      // currentDealer.hand.addCardToHand = testCard.spade5;

      //Test Natural Functionality
      // currentDealer.hand.addCardToHand = testCard.spadeKing;
      // currentDealer.hand.addCardToHand = testCard.heartAce;

      //Test Lucky Ladies
      // currentDealer.hand.addCardToHand = testCard.heartQueen;
      // currentDealer.hand.addCardToHand = testCard.heartAce;
      // currentDealer.hand.addCardToHand = testCard.diamondKing;
      // currentDealer.hand.addCardToHand = testCard.diamondAce;

      //Test 21+3 King 3 Kind
      // currentDealer.hand.addCardToHand = testCard.diamondKing;
      // currentDealer.hand.addCardToHand = testCard.spade7;
      // currentDealer.hand.addCardToHand = testCard.spadeJack;
    })
    .catch((err) => dealDealerCards(deckID))
    .finally(function () {
      currentDealer.checkHandForNatural(currentDealer.hand);
      currentDealer.checkHandForPeek();
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

export function splitPlayerHand(gameState) {
  let player = gameState.player;
  let num = player.currentSplitHand;

  gameState.updateSplitBet();

  if (num == 0) {
    player.updateType = `split player`;
    checkForSplitAces(player.hand, player);
    player.updateCurrentSplitHand = 1;
  } else {
    let currHand = player.getSplitHand(num);
    if (currHand.splitChecked) currHand.splitChecked = false;

    checkForSplitAces(currHand, player);
  }

  generateNewSplitHand(num, player);

  let newCards = [];

  drawCards(gameInfo.deckID, 2)
    .then(function (cardsObj) {
      newCards.push(cardsObj.card1);
      newCards.push(cardsObj.card2);
      gameState.updateRemainingCards = cardsObj.remaining;

      //Testing Resplitting more hands
      // newCards.push(testCard.heartAce);
      // newCards.push(cardsObj.card2);
      return newCards;
    })
    .then(function (newCards) {
      player.splitHand(newCards);
    })
    .catch((err) => {
      console.log(`Error: Split Hand Function`);
    })
    .finally(() => {
      controller.updateStatePlayers(player, gameState);
      controller.continueRoundAfterSplit(gameState);
    });

  function generateNewSplitHand(currentSplitHand, player) {
    let splitHand;
    let handCount = player.splitHands.length;

    switch (currentSplitHand) {
      case 0:
        splitHand = new Hand(`split hand 2`, 2);
        break;
      case 1:
        if (handCount == 2) splitHand = new Hand(`split hand 3`, 3);
        else splitHand = new Hand(`split hand 4`, 4);
        break;
      case 2:
        if (handCount == 2) splitHand = new Hand(`split hand 3`, 3);
        else splitHand = new Hand(`split hand 4`, 4);
        break;
      case 3:
        splitHand = new Hand(`split hand 4`, 4);
        break;
      default:
        console.log(`Error: No split hands`);
    }

    addPlayerHandMethods(splitHand);

    if (currentSplitHand == 0) player.addInitialSplitHands(splitHand);
    else player.addNewSplitHand(splitHand);
  }

  function checkForSplitAces(hand, player) {
    let [card1, card2] = hand.cards;

    card1.value == "ACE" && card2.value == "ACE"
      ? (player.acesSplit = true)
      : (player.acesSplit = false);
  }
}

function addDealerImagesToHand(card) {
  if (this.cards.length == 1) {
    this.unrevealedCard = `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="${card.image}">`;
    this.simpleUnrevealedCard = `<img src="${card.image}" class="card">`;
    this.images.push(
      `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="img/playing-card-back.svg">`
    );
    this.simpleImages.push(
      `<img src='img/playing-card-back.svg' class='card'>`
    );
  } else {
    this.images.push(
      `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="${card.image}">`
    );
    this.simpleImages.push(`<img src="${card.image}" class="card">`);
    this.visibleCards.push(card);
    this.visibleTotal = this.calculateHandTotal(this.visibleCards);
  }
  this.endTags.push(`</li></ul>`);
}

function calcDealerVisibleHandTotal() {
  this.visibleTotal = this.calculateHandTotal(this.visibleCards);
}

function addPlayerImagesToHand(card) {
  this.images.push(
    `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}">`
  );
  this.endTags.push(`</li></ul>`);
  this.simpleImages.push(`<img src="${card.image}" class="card">`);
  this.codes.push(card.code);
}

function revealDealerFaceDownCard() {
  this.visibleTotal = this.total;

  this.images.shift();
  this.images.unshift(this.unrevealedCard);
}
