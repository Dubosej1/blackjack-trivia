export let globalState;

class State {
  betObj;
  player;
  dealer;
  gameActive;

  constructor(bank, options) {
    this.bank = bank;
    this.options = options;
  }

  initialAddPlayers(arr) {
    let [player, dealer] = arr;
    this.player = player;
    this.dealer = dealer;
  }

  addBetObj(betObj) {
    this.betObj = betObj;
  }

  toggleGameActive(toggle) {
    toggle ? (this.gameActive = true) : (this.gameActive = false);
    // bjModel.updateGameActive(toggle);
  }
}

export function initNewState(bank, options) {
  let gameState = new State(bank, options);
  globalState = gameState;
  return gameState;
}
