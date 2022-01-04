import * as bjModel from "./blackjack-model-3.js";
import * as triviaModel from "./trivia-model-3.js";
import * as view from "./view-3.js";
import * as listeners from "./listeners.js";

let optionsPlaceholder;

class State {
  betObj;
  player;
  dealer;

  constructor(bank) {
    this.bank = bank;
  }

  initialAddPlayers(arr) {
    let [player, dealer] = arr;
    this.player = player;
    this.dealer = dealer;
  }

  addBetObj(betObj) {
    this.betObj = betObj;
  }
}

function init() {
  listeners.addNewGameBtnListener();
  listeners.addBasicBetChipBtnListeners();
  listeners.addOptionsBtnListener();
  submitOptions();
}

export function startNewGame(e) {
  let bank = 1000;
  let options = optionsPlaceholder;
  //   triviaModel.generateTriviaQuestions();
  // view.renderBtnVisibility({ array: btnsArr, newGame: false, endGame: true });
  startNewRound(bank, options);
}

export function startNewRound(bank) {
  let gameState = new State(bank);

  let players = bjModel.initPlayers(bank);

  let betObj = betModel.initBaseBet(bank);

  gameState.addBetObj(betObj);

  gameState.initialAddPlayers(players);

  view.addHandlerListeners(btnsArr, gameState);

  gameState.toggleGameActive(true);

  //make submit bet modal visible
  view.openBaseBetModal(gameState);
}

export function updateBaseBetChips(event, gameState) {
  let addend = parseInt(event.target.dataset.value, 10);

  gameState.betObj.updateTempBaseBet(addend);
  view.updateBaseBetModalTotal(gameState);
}

export function clearBaseBetChips(event, gameState) {
  gameState.betObj.clearTempBaseBet();
  view.updateBaseBetModalTotal(gameState);
}

export function updateSideBetContainer(event, gameState) {
  view.addActiveElementToBetContainer(event);
}

export function updateSideBetChips(event, gameState) {
  //Need error for when betAmount > bank
  let betObj = gameState.betObj;
  let sideBet = view.collectSideBet();

  if (!betObj.checkSideBetExists(sideBet)) {
    let sideBetObj = betModel.generateSideBetObj(sideBet);

    gameState.betObj.addSideBetObj(sideBetObj);
  }

  let addend = parseInt(event.target.dataset.value, 10);

  gameState.betObj.updateSideBetAmount(sideBet, addend);
  view.updateSideBetModalTotals(sideBet, gameState);
}

export function submitOptions(event = null, gameState = null) {
  let options = view.collectOptions();

  if (!gameState) optionsPlaceholder = options;
  else gameState.updateOptions(options);
}

export function clearSideBetChips(event, gameState) {
  let sideBet = view.collectSideBet();
  let betObj = gameState.betObj;

  betObj.clearTempSideBetAmount(sideBet);
  view.updateSideBetModalTotals(sideBet, gameState);
}
