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
  let specialNum = betModel.generateSpecialNums();
  //   triviaModel.generateTriviaQuestions();
  // view.renderBtnVisibility({ array: btnsArr, newGame: false, endGame: true });
  startNewRound(bank, options, specialNum);
}

export function startNewRound(bank, options, specialNum) {
  let gameState = state.initNewState(bank, options, specialNum);

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
  gameState.betObj.lockInBets();
  gameState.updatePlayer = gameState.player;
  gameState.updateDealer = gameState.dealer;
  let playerHand = gameState.player.hand;
  let dealerHand = gameState.dealer.hand;

  gameState.checkSplitAvailable();
  gameState.checkDoubleDownAvailable();
  gameState.checkValidEvenMoney();
  gameState.checkValidInsurance();

  //   let sideBetPackage = {
  //     baseBet: gameState.betObj.baseBet,
  //     playerHand: playerHand,
  //     dealerHand: dealerHand,
  //   };

  //   gameState.sideBetPackage = sideBetPackage;

  if (gameState.betObj.checkForInitialSideBetSequence())
    view.toggleCheckSideBetBtn(true);
  //begin regular routine

  //   let [hasPerfect11sBet, perfect11sObj] =
  //     gameState.betObj.checkHasPerfect11sBet();

  //   if (diceRollGuard && hasPerfect11sBet) {
  //     let diceRolls = betModel.rollPerfect11Dice();
  //     view.displayPerfect11DiceRoll(diceRolls);
  //     gameState.betObj.collectPerfect11DiceRolls(diceRolls);
  //     return;
  //   }

  //   continueDealCardsRoutine(sideBetPackage, gameState);
}

export function determineBeginGameRoutineOrder(gameState) {
  let beginGameRoutineOrder = {
    perfect11sDiceRoll: false,
    sideBetSequence: false,
    extraBet: false,
    houseMoney: false,
    baseRound: true,
  };
  let diceRollNeeded = false;
  let betObj = gameState.betObj;
  let playerHand = gameState.player.hand;

  let perfect11sExists = betObj.checkSideBetExists(`perfect11s`);

  if (perfect11sExists) {
    let perfect11sObj = betObj.getSideBet(`perfect11s`);
    perfect11sObj.checkDiceRollNeeded(playerHand)
      ? (diceRollNeeded = true)
      : (diceRollNeeded = false);
  }
  perfect11sExists && diceRollNeeded
    ? (beginGameRoutineOrder.perfect11sDiceRoll = true)
    : (beginGameRoutineOrder.perfect11sDiceRoll = false);

  betObj.checkForInitialSideBetSequence()
    ? (beginGameRoutineOrder.sideBetSequence = true)
    : (beginGameRoutineOrder.sideBetSequence = false);

  let extraBetBJExists = betObj.checkSideBetExists(`extraBetBlackjack`);
  if (extraBetBJExists) {
    let extraBetBJObj = betObj.getSideBet(`extraBetBlackjack`);
    extraBetBJObj.initSideBet(playerHand)
      ? (beginGameRoutineOrder.extraBet = true)
      : (beginGameRoutineOrder.extraBet = false);
  }

  gameState.beginGameRoutineOrder = beginGameRoutineOrder;

  beginGameRoutine(gameState);
}

export function beginGameRoutine(gameState) {
  let order = gameState.beginGameRoutineOrder;
  let betObj = gameState.betObj;
  let sideBet = betObj.sideBet;

  switch (true) {
    case order.perfect11sDiceRoll:
      let perfect11sObj = betObj.getSideBet(`perfect11s`);
      let diceRolls = perfect11sObj.rollInfinityDice();
      view.displayPerfect11DiceRoll(diceRolls);
      order.perfect11sDiceRoll = false;
      //   gameState.betObj.collectPerfect11DiceRolls(diceRolls);
      break;
    case order.sideBetSequence:
      gameState.betObj.initInitialSideBetSequence(gameState);
      order.sideBetSequence = false;
      break;
    case order.extraBet:
      view.displayExtraBetModal(gameState);
      order.extraBet = false;
      break;
    case order.houseMoneyModal:
      view.displayHouseMoneyModal(gameState);
      order.houseMoneyModal = false;
      break;
    default:
    // start round as normal
  }
}

// export function continueDealCardsRoutine(sideBetPackage, gameState) {
//   if (gameState.betObj.initInitialSideBetSequence(sideBetPackage, gameState))
//     view.toggleCheckSideBetBtn(true);
//   //else start round as normal
// }

export function initDisplayInitialSideBetOutcome(event, gameState) {
  determineBeginGameRoutineOrder(gameState);
  //   view.displayInitialSideBetOutcome(gameState);
}

function init() {
  listeners.addNewGameBtnListener();
  listeners.addBeginGameOptionsBtnListener();
  listeners.addOptionsMenuInputListeners();
  submitOptions();
}

init();
