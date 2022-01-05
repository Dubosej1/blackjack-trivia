import * as bjModel from "./blackjack-model-3.js";
import * as triviaModel from "./trivia-model.js";
import * as view from "./view-3.js";
import * as listeners from "./listeners.js";
import * as betModel from "./bet-model.js";
import * as state from "./state.js";

let optionsPlaceholder;

export function startNewGame(e) {
  let bank = 1000;
  let options = optionsPlaceholder;
  //   triviaModel.generateTriviaQuestions();
  // view.renderBtnVisibility({ array: btnsArr, newGame: false, endGame: true });
  startNewRound(bank, options);
}

export function startNewRound(bank, options) {
  let gameState = state.initNewState(bank, options);

  let players = bjModel.initPlayers(bank);

  let betObj = betModel.initBaseBet(bank);

  gameState.addBetObj(betObj);

  gameState.initialAddPlayers(players);

  listeners.removeBeginGameOptionsBtnListener();
  listeners.addNewRoundEventListeners(gameState);

  //   view.addHandlerListeners(btnsArr, gameState);

  gameState.toggleGameActive(true);

  //make submit bet modal visible
  view.openBaseBetModal(gameState);
  bjModel.initDeck(gameState);
}

export function updateStatePlayers(player, gameState) {
  // if ((hand.type = `player`)) gameState.updatePlayerHand = hand;
  // if ((hand.type = `dealer`)) gameState.updateDealerHand = hand;

  if (player.type == "player") gameState.updatePlayer = player;
  if (player.type == `dealer`) gameState.updateDealer = player;
  if (player.type == `split player`) {
    if (player.currentSplitHand == 1) gameState.updateSplitHand1 = player;
    else gameState.updateSplitHand2 = player;
  }
}

export function updateBaseBetChips(event, gameState) {
  if (!gameState.cardsDealt) bjModel.dealInitialCards(gameState);

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

export function submitOptions(event, gameState = null) {
  let options = view.collectOptions();

  if (!gameState) optionsPlaceholder = options;
  else gameState.updateOptions(options);
  console.log(options);
  console.log(optionsPlaceholder);
}

export function clearSideBetChips(event, gameState) {
  let sideBet = view.collectSideBet();
  let betObj = gameState.betObj;

  betObj.clearTempSideBetAmount(sideBet);
  view.updateSideBetModalTotals(sideBet, gameState);
}

export function placeSideBets(event, gameState) {
  let sideBetTotal = gameState.betObj.getTempSideBetTotalValue();
  let bank = gameState.betObj.getTempBank();

  view.updateBaseBetModalTotal(gameState);

  //add "view side bets btn and side bet field"

  gameState.betObj.toggleSideBetPlacedModalActive(true);
  view.toggleSideBetPlacedBtn(true, gameState);
  view.activateSideBetsPlacedModal(gameState);
}

export function clearAllSideBets(event, gameState) {
  let modalActive = gameState.betObj.sideBetPlacedModalActive;

  gameState.betObj.clearSideBets();
  view.resetSideBetModal(gameState);

  if (modalActive) {
    view.updateBaseBetModalTotal(gameState);
    view.toggleSideBetPlacedBtn(false);
    view.deactivateSideBetsPlacedModal();
    gameState.betObj.toggleSideBetPlacedModalActive(false);
  }
}

export function startDealCardsRoutine(event, gameState) {
  gameState.updatePlayer = gameState.player;
  gameState.updateDealer = gameState.dealer;
}

function init() {
  listeners.addNewGameBtnListener();
  listeners.addBeginGameOptionsBtnListener();
  listeners.addOptionsMenuInputListeners();
  submitOptions();
}

init();
