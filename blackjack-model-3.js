class Cardholder {
  constructor() {
    this.hand = { cards: [], images: [], total: 0 };
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
}

class Dealer extends Cardholder {
  type = `dealer`;

  constructor() {
    super();
    this.hand.type = `dealer`;
    this.hand.visibleCards = [];
    this.hand.visibleTotal = 0;
    this.hand.unrevealedCard;
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
  if (gameInfo.deckID) return;

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
          shuffleCards(gameInfo.deckID, deckCount);
        })
        .catch(function (err) {
          alert(err);
        });
    };

    getNewDeckID();
    // gameInfo.updateDeckID = newDeckID;
  })(gameInfo.deckID);
}

export function shuffleCards(deckID, deckCount) {
  fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/?deck_count=${deckCount}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch((err) => shuffleCards(deckID));
}
