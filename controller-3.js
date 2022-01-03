import * as bjModel from "./blackjack-model-3.js";
import * as triviaModel from "./trivia-model-3.js";
import * as view from "./view-3.js";
import * as listeners from "./listeners.js";

let optionsPlaceholder;

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

  gameState.initialAddPlayers(players);

  view.addHandlerListeners(btnsArr, gameState);

  gameState.toggleGameActive(true);

  //make submit bet modal visible
  view.openBasicBetModal(gameState);
}

export function updateBasicBetChipBtnCallback(event) {
  view.updateBasicBetChipAmount(event);
}

export function clearBasicBetChipAmountCallback(event) {
  view.clearBasicBetChipAmount(event);
}

export function submitOptions(event = null, gameState = null) {
  let options = view.collectOptions();

  if (!gameState) optionsPlaceholder = options;
  else gameState.updateOptions(options);
}
