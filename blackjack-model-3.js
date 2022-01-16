import * as testCard from "./test-cards.js";
import * as controller from "./controller-3.js";

class Cardholder {
  hand;

  constructor() {}

  addNewHand(hand) {
    this.hand = hand;
  }

  // set addCardToHand(card) {
  //   this.hand.cards.push(card);
  //   this.hand.total = this.calculateHandTotal(this.hand.cards);
  // }

  get getHand() {
    return this.hand;
  }

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
  // }

  // addEndingCardTags(imageArr) {
  //   let cardCount = this.hand.cards.length;
  //   let endTags = `<li><ul>`;
  //   let repeatedTags = endTags.repeat(cardCount);
  //   this.hand.images.push(repeatedTags);
  // }
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
    // this.hand.images.push(`<img src="${card.image}" class="card">`);
    // this.hand.total = this.calculateHandTotal(this.hand.cards);
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
    let cardCount = this.cards.length;
    let endTags = `<li><ul>`;
    let repeatedTags = endTags.repeat(cardCount);
    this.images.push(repeatedTags);
  }

  cardHit(cardHolder, gameState) {
    // let player = gameState.player;
    let hand = this;

    drawSingleCard(gameInfo.deckID)
      .then(function (cardsObj) {
        hand.addCardToHand = cardsObj;
      })
      .catch((err) => alert(`error executeHit`))
      .finally(function () {
        hand.performHandChecks(gameState);
        controller.updateStatePlayers(cardHolder, gameState);
        // controller.checkPlayerNextAvailableAction(gameState);
        cardHolder.determineContinueStatus(hand, gameState);
      });
    // player.performHandChecks();

    // controller.updateStatePlayers(player, gameState);
    // controller.checkPlayerNextAvailableAction(player, gameState);
  }

  // playerHit(gameState) {
  //   let player = gameState.player;
  //   let hand = this;

  //   drawSingleCard(gameInfo.deckID)
  //     .then(function (cardsObj) {
  //       hand.addCardToHand = cardsObj;
  //     })
  //     .catch((err) => alert(`error executePlayerHit`))
  //     .finally(function () {
  //       hand.performHandChecks(gameState);
  //       controller.updateStatePlayers(player, gameState);
  //       player.determineContinueStatus(hand, gameState);
  //     });
  // }

  // dealerHit(gameState) {
  //   let dealer = gameState.dealer;
  //   let hand = this;

  //   drawSingleCard(gameInfo.deckID)
  //     .then(function (cardsObj) {
  //       hand.addCardToHand = cardsObj;
  //     })
  //     .catch((err) => alert(`error executeDealerHit`))
  //     .finally(function () {
  //       hand.performHandChecks(gameState);
  //       controller.updateStatePlayers(dealer, gameState);
  //       dealer.determineContinueStatus(hand, gameState);
  //     });
  // }

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

    //Need option to not add base bet to winnings (based on side bet option)

    this.winnings = winnings;
  }

  generateOutcomePackage() {
    let outcomePackage = {};

    outcomePackage.handOutcome = this.outcome;
    outcomePackage.roundOutcome = this.roundOutcome;
    outcomePackage.winnings = this.winnings;
    outcomePackage.outcomeText = this.roundOutcomeText;

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
  // splitHand1 = {
  //   cards: [],
  //   images: [],
  //   simpleImages: [],
  //   endTags: [],
  //   code: [],
  //   total: 0,
  // };
  // splitHand2 = {
  //   cards: [],
  //   images: [],
  //   simpleImages: [],
  //   endTags: [],
  //   code: [],
  //   total: 0,
  // };
  // splitHand3 = {
  //   cards: [],
  //   images: [],
  //   simpleImages: [],
  //   endTags: [],
  //   code: [],
  //   total: 0,
  // };
  // splitHand4 = {
  //   cards: [],
  //   images: [],
  //   simpleImages: [],
  //   endTags: [],
  //   code: [],
  //   total: 0,
  // };
  // totalSplitHands = 1;
  currentSplitHand = 0;

  constructor(bank) {
    super();
    this.bank = bank;
  }

  // addImagesToHand(card) {
  //   this.hand.images.push(
  //     `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}"/>`
  //   );
  //   this.hand.endTags.push(`</li></ul>`);
  //   this.hand.simpleImages.push(`<img src="${card.image}" class="card">`);
  //   console.log(this.hand);
  // }

  // set addCardToHand(card) {
  //   super.addCardToHand = card;
  //   // this.hand.images.push(
  //   //   `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}"/>`
  //   // );
  //   // this.hand.endTags.push(`</li></ul>`);
  //   // this.hand.simpleImages.push(`<img src="${card.image}" class="card">`);
  //   // console.log(this.hand);
  // }

  // get getHand() {
  //   return this.hand;
  // }

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

  // updateTotalSplitHands() {
  //   this.totalSplitHands++;
  // }

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

  // splitHand(newCards) {
  //   let newCard1, newCard2;

  //   if (newCards.length == 2) {
  //     newCard1 = newCards.pop();
  //     newCard2 = newCards.pop();
  //   } else newCard1 = newCards.pop();

  //   if (this.currentSplitHand == 0) {
  //     let [splitCard1, splitCard2] = this.removeSplitCardsFromBaseHand();
  //     this.addCardToSplitHand(1, splitCard1);
  //     this.addCardToSplitHand(1, newCard1);
  //     this.addCartdToSplitHand(2, splitCard2);
  //     this.addCardToSplitHand(2, newCard2);
  //   }

  //   if (this.currentSplitHand == 1) {
  //     let splitCard = this.removeSplitCardsFromSplitHand(1);
  //     this.addCardToSplitHand(3, splitCard);
  //     this.addCardToSplitHand(3, newCard1);
  //   }

  //   if (this.currentSplitHand == 2 && this.totalSplitHands == 2) {
  //     let splitCard = this.removeSplitCardsFromSplitHand(2);
  //     this.addCardToSplitHand(3, splitCard);
  //     this.addCardToSplitHand(3, newCard1);
  //   }

  //   if (this.currentSplitHand == 2 && this.totalSplitHands == 3) {
  //     let splitCard = this.removeSplitCardsFromSplitHand(2);
  //     this.addCardToSplitHand(4, splitCard);
  //     this.addCardToSplitHand(4, newCard1);
  //   }

  //   if (this.currentSplitHand == 3) {
  //     let splitCard = this.removeSplitCardsFromSplitHand(3);
  //     this.addCardToSplitHand(4, splitCard);
  //     this.addCardToSplitHand(4, newCard1);
  //   }

  //   // this.checkForSplitAces(splitCard1, splitCard2);
  // }

  // removeSplitCardsFromBaseHand() {
  //   this.hand.images.length = 0;
  //   this.hand.total = 0;
  //   let card1 = this.hand.cards.pop();
  //   let card2 = this.hand.cards.pop();
  //   return [card1, card2];
  // }

  // removeSplitCardsFromSplitHand(splitHand) {
  //   let card;

  //   if (splitHand == 1) card = this.splitHand1.cards.pop();
  //   if (splitHand == 2) card = this.splitHand2.cards.pop();
  //   if (splitHand == 3) card = this.splitHand3.cards.pop();

  //   return card;
  // }

  // addCardToSplitHand(splitHand, card) {
  //   if (splitHand == 1) {
  //     this.splitHand1.cards.push(card);
  //     this.splitHand1.images.push(
  //       `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}"/>`
  //     );
  //     this.splitHand1.simpleImages.push(
  //       `<img src="${card.image}" class="card">`
  //     );
  //     this.splitHand1.endTags.push(`</li></ul>`);
  //     this.splitHand1.codes.push(card.code);
  //     this.splitHand1.total = this.calculateHandTotal(this.splitHand1.cards);
  //   }

  //   if (splitHand == 2) {
  //     this.splitHand2.cards.push(card);
  //     this.splitHand2.images.push(
  //       `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}"/>`
  //     );
  //     this.splitHand2.simpleImages.push(
  //       `<img src="${card.image}" class="card">`
  //     );
  //     this.splitHand2.endTags.push(`</li></ul>`);
  //     this.splitHand2.codes.push(card.code);
  //     this.splitHand2.total = this.calculateHandTotal(this.splitHand2.cards);
  //   }

  //   if (splitHand == 3) {
  //     this.splitHand3.cards.push(card);
  //     this.splitHand3.images.push(
  //       `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}"/>`
  //     );
  //     this.splitHand3.simpleImages.push(
  //       `<img src="${card.image}" class="card">`
  //     );
  //     this.splitHand3.endTags.push(`</li></ul>`);
  //     this.splitHand3.codes.push(card.code);
  //     this.splitHand3.total = this.calculateHandTotal(this.splitHand3.cards);
  //   }

  //   if (splitHand == 4) {
  //     this.splitHand4.cards.push(card);
  //     this.splitHand4.images.push(
  //       `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}"/>`
  //     );
  //     this.splitHand4.simpleImages.push(
  //       `<img src="${card.image}" class="card">`
  //     );
  //     this.splitHand4.endTags.push(`</li></ul>`);
  //     this.splitHand4.codes.push(card.code);
  //     this.splitHand4.total = this.calculateHandTotal(this.splitHand4.cards);
  //   }
  // }

  //   checkValidSideBet() {
  //     return this.bank - this.betAmount >= 0 ? true : false;
  //   }

  // checkValidSplit(options) {
  //   let card1 = this.hand.cards[0].value;
  //   let card2 = this.hand.cards[1].value;

  //   if (options.splitAnyTens) {
  //     card1 = convertTenValueCard(card1);
  //     card2 = convertTenValueCard(card2);
  //   }

  //   if (!options.splitAces) {
  //     if (card1 == "ACE" || card2 == "ACE") return false;
  //   }

  //   if (card1 == card2) return true;
  //   return false;

  //   function convertTenValueCard(value) {
  //     let faceCards = ["JACK", "QUEEN", "KING"];
  //     let result = faceCards.some((face) => face == value);

  //     if (result) value = "10";
  //     return value;
  //   }
  // }

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

    // controller.renderPlayerOutcome(nextAction, gameState);
  }
}

class Dealer extends Cardholder {
  type = `dealer`;

  constructor() {
    super();
  }

  // constructor() {
  //   super();
  //   this.hand.type = `dealer`;
  //   this.hand.visibleCards = [];
  //   this.hand.visibleTotal = 0;
  //   this.hand.unrevealedCard;
  //   this.hand.simpleUnrevealedCard;
  // }

  // set addCardToHand(card) {
  //   super.addCardToHand = card;

  //   if (this.hand.cards.length == 1) {
  //     this.hand.unrevealedCard = `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="${card.image}"/>`;
  //     this.hand.simpleUnrevealedCard = `<img src="${card.image}" class="card">`;
  //     this.hand.images.push(
  //       `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="img/playing-card-back.svg"/>`
  //     );
  //     this.hand.simpleImages.push(
  //       `<img src='img/playing-card-back.svg' class='card'>`
  //     );
  //   } else {
  //     this.hand.images.push(
  //       `<ul><li class="dealerCardPos dealer-cards__li"><img class="card dealerCard dealer-cards__card" src="${card.image}"/>`
  //     );
  //     this.hand.simpleImages.push(`<img src="${card.image}" class="card">`);
  //     this.hand.visibleCards.push(card);
  //     this.hand.visibleTotal = this.calculateHandTotal(this.hand.visibleCards);
  //   }
  //   this.hand.endTags.push(`</li></ul>`);
  // }

  checkHandForNatural(hand) {
    if (hand.cards.length !== 2) return;
    if (hand.total != 21) return;

    this.hand.outcome = `natural`;
  }

  executeHit(gameState) {
    // let options = gameState.options;

    this.hand.cardHit(this, gameState);
  }

  determineContinueStatus(hand, gameState) {
    let options = gameState.options;
    let outcome = hand.outcome;
    let dealerLimit = options.dealerStandsOn;
    let aces, nextAction;
    // let activeHand = this.currentSplitHand;
    // let handCount = 1;
    // let nextAction;

    // if (activeHand > 0) handCount = this.splitHands.length;

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
    }

    if (nextAction == `endRound`) hand.outcome = `stand`;
    else hand.outcome = `dealerHit`;

    let gameTimer = setTimeout(
      controller.nextDealerAction,
      1500,
      nextAction,
      gameState
    );

    // controller.renderPlayerOutcome(nextAction, gameState);
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
  // playerHand.splitInitialHand = splitPlayerInitialHand;
  // playerHand.splitNewHand = splitPlayerNewHand;
  // playerHand.addCardToSplitHand = addCardToPlayerSplitHand;
  playerHand.codes = [];
}

function dealPlayerCards(deckID, currentPlayer, gameState) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      console.log(cardsObj);
      // currentPlayer.hand.addCardToHand = cardsObj.card1;
      // currentPlayer.hand.addCardToHand = cardsObj.card2;
      gameState.updateRemainingCards = cardsObj.remaining;

      //Test Split Ace Functionality
      // currentPlayer.hand.addCardToHand = testCard.heartAce;
      // currentPlayer.hand.addCardToHand = testCard.diamondAce;

      //Test Natural Functionality
      currentPlayer.hand.addCardToHand = testCard.spadeKing;
      currentPlayer.hand.addCardToHand = testCard.diamondAce;

      //Test Split Functionality (regularHand)
      // currentPlayer.hand.addCardToHand = testCard.heart7;
      // currentPlayer.hand.addCardToHand = testCard.spade7;

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
      // currentDealer.hand.addCardToHand = cardsObj.card1;
      // currentDealer.hand.addCardToHand = cardsObj.card2;
      gameState.updateRemainingCards = cardsObj.remaining;

      //To test Dealer Bust (keep original 2 cards)
      // dealerHand.push(playerSplitTestCard1);
      // dealerHand.push(playerSplitTestCard2);

      // To test Insurance functionality (substitute card2)
      // currentDealer.hand.addCardToHand = testCard.heartAce;

      //To test 5 Card Charlie (comment out all other dealerHands)
      // createFiveCardCharlieTestHand(`dealer`);

      //To Test "Dealer Stands On" routines
      // currentDealer.hand.addCardToHand = testCard.heartAce;
      // currentDealer.hand.addCardToHand = testCard.spade6;

      //Test Natural Functionality
      currentDealer.hand.addCardToHand = testCard.heartAce;
      currentDealer.hand.addCardToHand = testCard.spadeKing;

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
  // let betObj = gameState.betObj;
  let num = player.currentSplitHand;

  gameState.updateSplitBet();

  if (num == 0) {
    player.updateType = `split player`;
    // let hand = player.hand;
    checkForSplitAces(player.hand, player);
    player.updateCurrentSplitHand = 1;
  } else {
    let currHand = player.getSplitHand(num);
    if (currHand.splitChecked) currHand.splitChecked = false;

    checkForSplitAces(currHand, player);
  }

  generateNewSplitHand(num, player);

  // currentPlayer.updateSplitBet();

  // currentPlayer.updateType = `split player`;

  // currentPlayer.updateCurrentSplitHand = 1;

  let newCards = [];

  // let poppedCard = playerHand.pop();
  // playerSplitHand.push(poppedCard);

  drawCards(gameInfo.deckID, 2)
    .then(function (cardsObj) {
      // newCards.push(cardsObj.card1);
      // newCards.push(cardsObj.card2);
      gameState.updateRemainingCards = cardsObj.remaining;
      // currentPlayer.splitHand(newCards);
      // player.addCardToSplitHand(1, cardsObj.card1);
      // player.addCardToSplitHand(2, cardsObj.card2);

      //To test Split Hand 2 Five Card Charlie (comment out playerSPlitHand)
      // createFiveCardCharlieTestHand(`split`);

      //Testing Resplitting more hands
      newCards.push(testCard.heartAce);
      newCards.push(cardsObj.card2);

      return newCards;
    })
    .then(function (newCards) {
      player.splitHand(newCards);
    })
    .catch((err) => {
      // splitPlayerHand();
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

    // splitHand.addImagesToHand = addPlayerImagesToHand;

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
  console.log(this);
}

function revealDealerFaceDownCard() {
  this.visibleTotal = this.total;

  this.images.shift();
  this.images.unshift(this.unrevealedCard);
  // this.endTags.push(`</li></ul>`);
}

// function addSplitImagesToHand(card) {
//   this.images.push(
//     `<ul><li class="playerCardPos player-cards__li"><img class="card playerCard player-cards__card" src="${card.image}"/>`
//   );
//   this.simpleImages.push(`<img src="${card.image}" class="card">`);
//   this.endTags.push(`</li></ul>`);
//   this.codes.push(card.code);
// }
