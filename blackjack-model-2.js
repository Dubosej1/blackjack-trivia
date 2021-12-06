let player = {
  bank: 0,
  betAmount: 0,

  set updateBank(bank) {
    this.bank = bank;
  },

  set updateBetAmount(betAmount) {
    this.betAmount = betAmount;
  },
};

let dealer = {};

let gameInfo = {
  deckID: `h9j8glyl41fb`,
  gameActive: false,

  set updateDeckID(deckID) {
    this.deckID = deckID;
  },
};

//////////update exports/////////////
export function collectBankBetAmount() {
  return [player.bank, player.betAmount];
}

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

export function dealInitialCards() {
  // gameActive = true;
  shuffleCards(deckID);
  dealPlayerCards(deckID);
  dealDealerCards(deckID);
}

export function updateGameActive(toggle) {
  toggle ? (gameInfo.gameActive = true) : (gameInfo.gameActive = false);
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
