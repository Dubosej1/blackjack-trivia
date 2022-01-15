import * as bjModel from "./blackjack-model-3.js";
import * as triviaModel from "./trivia-model.js";
import * as view from "./view-3.js";
import * as listeners from "./listeners.js";
import * as betModel from "./bet-model.js";
import * as state from "./state.js";

let optionsPlaceholder;

//////////Game Flow functions//////////

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

export function startDealCardsRoutine(event, gameState) {
  gameState.betObj.lockInBets();
  let newBank = gameState.betObj.getBank();
  gameState.updateBank(newBank);

  gameState.updatePlayer = gameState.player;
  gameState.updateDealer = gameState.dealer;
  let playerHand = gameState.player.hand;
  let dealerHand = gameState.dealer.hand;

  //   let sideBetPackage = {
  //     baseBet: gameState.betObj.baseBet,
  //     playerHand: playerHand,
  //     dealerHand: dealerHand,
  //   };

  //   gameState.sideBetPackage = sideBetPackage;

  if (gameState.betObj.checkForBeginningSideBetBtn())
    view.toggleCheckSideBetBtn(true);
  else beginGameRoutinePart2(gameState);
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
      view.displayPerfect11sDiceRoll(diceRolls);
      order.perfect11sDiceRoll = false;
      //   gameState.betObj.collectPerfect11DiceRolls(diceRolls);
      break;
    case order.sideBetSequence:
      gameState.betObj.initInitialSideBetSequence(gameState);
      let winnings = gameState.betObj.getInitialSideBetWinnings();
      gameState.updateWinningsToBank(winnings);
      view.displayInitialSideBetOutcome(gameState);
      order.sideBetSequence = false;
      break;
    case order.extraBet:
      view.displayExtraBetModal(gameState);
      order.extraBet = false;
      break;
    case order.houseMoney:
      view.displayHouseMoneyModal(gameState);
      order.houseMoney = false;
      break;
    default:
      //if end round early?
      //else beginGameRoutinePart2()
      beginGameRoutinePart2(gameState);
  }
}

export function beginGameRoutinePart2(gameState) {
  if (!gameState.beginningRoundChecksDone) {
    let hand = gameState.player.hand;

    gameState.checkSplitAvailable(hand);
    gameState.checkDoubleDownAvailable(hand);
    gameState.checkValidEvenMoney();
    gameState.checkValidInsurance();
    gameState.beginningRoundChecksDone = true;
  }

  switch (true) {
    case gameState.evenMoneyAvailable:
      view.activateEvenMoneyModal();
      gameState.evenMoneyAvailable = false;
      break;
    case gameState.insuranceAvailable:
      view.activateInsuranceModal();
      gameState.insuranceAvailable = false;
      break;
    //case playerhand == natural or dealerhand == natural
    default:
      let obj = {
        hit: true,
        stand: true,
        split: gameState.splitAvailable,
        doubleDown: gameState.doubleDownAvailable,
        surrender: true,
      };
      gameState.toggleEnableActionBtns = obj;
      gameState.updateNoticeText = `Player's Turn`;
  }
}

export function determineEndGameRoutineOrder(gameState) {
  let endGameRoutineOrder = {
    mysteryModal: false,
    sideBetSequence: false,
    totalWinnings: false,
    roundOutcome: true,
  };

  gameState.determineBaseRoundOutcome();

  betObj.checkForEndingSideBetSequence()
    ? (endGameRoutineOrder.sideBetSequence = true)
    : (endGameRoutineOrder.sideBetSequence = false);

  gameState.endGameRoutineOrder = endGameRoutineOrder;

  endGameRoutine(gameState);
}

export function endGameRoutine(gameState) {
  let order = gameState.endGameRoutineOrder;
  let betObj = gameState.betObj;
  let sideBet = betObj.sideBet;
  let activeHand = gameState.player.currentSplitHand;

  switch (true) {
    case order.roundOutcome:
      //Base Round Outcome Modal
      if (activeHand == 0) view.renderSingleHandRoundOutcome(gameState);
      else view.renderSplitHandRoundOutcome(gameState);

      order.roundOutcome = false;
      break;
    case 2:
      //Mystery Jackpot Modal
      break;
    case order.sideBetRoutine:
      //Side Bet Outcome Modal
      gameState.betObj.initEndingSideBetSequence(gameState);
      let winnings = gameState.betObj.getEndingSideBetWinnings();
      gameState.updateWinningsToBank(winnings);
      view.displayEndingSideBetOutcome(gameState);
      order.sideBetSequence = false;
      break;
    case 4:
      //Total Winnings Modal + Complete Win Summary Modal via Btn
      break;
    default:
    //if end round early?
    //else beginGameRoutinePart2()
  }
}

export function updateStatePlayers(player, gameState) {
  // if ((hand.type = `player`)) gameState.updatePlayerHand = hand;
  // if ((hand.type = `dealer`)) gameState.updateDealerHand = hand;

  // if (player.type == "player") gameState.updatePlayer = player;
  if (player.type == `dealer`) gameState.updateDealer = player;
  else gameState.updatePlayer = player;
  // if (player.type == `split player`) {
  //   if (player.currentSplitHand == 1) gameState.updateSplitHand1 = player;
  //   else gameState.updateSplitHand2 = player;
  // }
}

export function continueRoundAfterSplit(gameState) {
  let betObj = gameState.betObj;
  let player = gameState.player;
  let splitHands = player.splitHands;
  let splitPlayerCount = gameState.player.splitHands.length;
  let options = gameState.options;

  switch (true) {
    case betObj.checkSideBetExists(`21Magic`):
      //activate 21 Magic Extra Bet Modal for new split hand
      break;
    default:
      if (splitPlayerCount == 4)
        player.checkValidResplitActions(splitHands[3], options);
      if (splitPlayerCount == 3)
        player.checkValidResplitActions(splitHands[2], options);
      player.checkValidResplitActions(splitHands[1], options);
      player.checkValidResplitActions(splitHands[0], options);

      beginSplitHandActions(gameState);
  }
}

export function beginSplitHandActions(gameState) {
  let currentSplitHand = gameState.player.currentSplitHand;
  let currHand = gameState.player.getSplitHand(currentSplitHand);

  gameState.checkSplitAvailable(currHand);
  gameState.checkDoubleDownAvailable(currHand);

  let btnObj = { stand: true };

  gameState.splitAvailable ? (btnObj.split = true) : (btnObj.split = false);
  gameState.doubleDownAvailable
    ? (btnObj.doubleDown = true)
    : (btnObj.doubleDown = false);
  currHand.resplitHit ? (btnObj.hit = true) : (btnObj.hit = false);

  gameState.toggleEnableActionBtns = btnObj;
}

export function submitOptions(event, gameState = null) {
  let options = view.collectOptions();

  if (!gameState) optionsPlaceholder = options;
  else gameState.updateOptions(options);
  console.log(options);
  console.log(optionsPlaceholder);
}

/////////Betting Controls//////////

//"Base Bet" Modal Functions

export function updateBaseBetChips(event, gameState) {
  if (!gameState.cardsDealt) bjModel.dealInitialCards(gameState);

  let addend = parseInt(event.target.dataset.value, 10);

  gameState.betObj.addToTempBaseBet(addend);
  view.updateBaseBetModalTotal(gameState);
}

export function clearBaseBetChips(event, gameState) {
  gameState.betObj.clearTempBaseBet();
  view.updateBaseBetModalTotal(gameState);
}

export function updateSideBetContainer(event, gameState) {
  view.addActiveElementToBetContainer(event);
}

//"Choose Side Bet" Modal functions

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

export function activateSideBet(event, gameState) {
  let betObj = gameState.betObj;
  let sideBet = view.collectSideBet();

  if (!betObj.checkSideBetExists(sideBet)) {
    let sideBetObj = betModel.generateSideBetObj(sideBet);

    gameState.betObj.addSideBetObj(sideBetObj);
  }
}

export function clearAllSideBets(event, gameState) {
  let modalActive = gameState.betObj.sideBetPlacedModalActive;

  gameState.betObj.clearSideBetObjs();
  view.resetSideBetModal(gameState);

  if (modalActive) {
    view.updateBaseBetModalTotal(gameState);
    view.toggleSideBetPlacedBtn(false);
    view.deactivateSideBetsPlacedModal();
    gameState.betObj.toggleSideBetPlacedModalActive(false);
  }
}

export function initDisplayInitialSideBetOutcome(event, gameState) {
  determineBeginGameRoutineOrder(gameState);
  //   view.displayInitialSideBetOutcome(gameState);
}

// "Extra Bet" and "House Money" Modal functions

export function updateExtraBetChips(event, gameState) {
  const sideBet = document.querySelector(`.extra-bet-modal__main`).dataset
    .sidebet;

  let addend = parseInt(event.target.dataset.value, 10);
  let sideBetObj;

  if (sideBet == `extraBetBlackjack`) {
    sideBetObj = gameState.betObj.getSideBet(`extraBetBlackjack`);
    sideBetObj.updateTempExtraBetTotal(addend);
    sideBetObj.calcExtraBetFee();
  }

  if (sideBet == `raiseTheRoof`) {
    sideBetObj = gameState.betObj.getSideBet(`raiseTheRoof`);
    sideBetObj.updateTempExtraBetTotal(addend);
  }

  view.updateExtraBetModalTotal(sideBetObj, gameState);
}

export function clearExtraBetChips(event, gameState) {
  const sideBet = document.querySelector(`.extra-bet-modal__main`).dataset
    .sidebet;

  // let betObj = gameState.betObj;
  let sideBetObj;

  if (sideBet == `extraBetBlackjack`) {
    sideBetObj = gameState.betObj.getSideBet(`extraBetBlackjack`);
    sideBetObj.clearTempExtraBetBlackjackTotal();
  }

  if (sideBet == `raiseTheRoof`) {
    sideBetObj = gameState.betObj.getSideBet(`raiseTheRoof`);
    sideBetObj.clearExtraBet();
  }

  view.updateExtraBetModalTotal(sideBetObj, gameState);
}

export function placeExtraBet(event, gameState) {
  const sideBet = document.querySelector(`.extra-bet-modal__main`).dataset
    .sidebet;

  // let betObj = gameState.betObj;
  let sideBetObj;

  if (sideBet == `extraBetBlackjack`) {
    sideBetObj = gameState.betObj.getSideBet(`extraBetBlackjack`);
    let bank = sideBetObj.lockInExtraBet();
    gameState.betObj.bank = bank;
  }
  if (sideBet == `raiseTheRoof`) {
    sideBetObj = gameState.betObj.getSideBet(`raiseTheRoof`);
    // sideBetObj.lockInRaiseTheRoofBet();
  }

  view.deactivateExtraBetModal();
  beginGameRoutine(gameState);
}

export function declineExtraBet(event, gameState) {
  clearExtraBetChips(event, gameState);
  placeExtraBet(event, gameState);
}

export function decideHouseMoney(event, gameState) {
  let choice = event.target.dataset.choice;
  let houseMoneyObj = gameState.betObj.getSideBet(`houseMoney`);
  let betObj = gameState.betObj;
  let winnings, bet, total;

  switch (choice) {
    case `collect`:
      winnings = houseMoneyObj.winnings;
      betObj.addWinningsToBank(winnings);
      gameState.updateWinningsToBank(winnings);
      break;
    case `parlay-bet`:
      bet = houseMoneyObj.total;
      betObj.parlayToBaseBet(bet);
      break;
    case `parlay-winnings`:
      winnings = houseMoneyObj.winnings;
      betObj.parlayToBaseBet(winnings);
      break;
    case `parlay-all`:
      total = houseMoneyObj.winnings + houseMoneyObj.total;
      betObj.parlayToBaseBet(total);
      break;
    default:
      console.log(`Error: House Money Modal Parlay Btns`);
  }

  beginGameRoutine(gameState);
}

export function initEvenMoneyBet(event, gameState) {
  let outcome = betModel.generateEvenMoneyObj(gameState);
  view.renderEvenMoneyOutcome(outcome);
}

export function initInsuranceBet(event, gameState) {
  let outcome = betModel.generateInsuranceObj(gameState);
  view.renderInsuranceOutcome(outcome);
}

export function splitAction(event, gameState) {
  gameState.toggleEnableActionBtns = { split: false };

  bjModel.splitPlayerHand(gameState);
}

export function hitAction(event, gameState) {
  gameState.toggleEnableActionBtns = {
    split: false,
    doubleDown: false,
    surrender: false,
  };

  gameState.player.executeHit(gameState);
}

export function standAction(e, gameState) {
  // if (checkForNaturals(gameState)) return;
  // changeBtnsAvailable(gameState);

  gameState.toggleEnableActionBtns = {
    split: false,
    doubleDown: false,
    hit: false,
    stand: false,
    surrender: false,
  };

  let player = gameState.player;
  let activeHand = player.currentSplitHand;
  let hand, handCount, outcomeCharlie, nextAction;

  if (activeHand == 0) {
    hand = player.hand;
    nextAction = `dealer`;
  } else {
    handCount = player.splitHands.length;
    hand = player.getSplitHand(activeHand);

    if (activeHand == handCount) nextAction = `dealer`;
    else nextAction = `changeHand`;
  }

  outcomeCharlie = hand.checkStandForCharlie();

  if (!outcomeCharlie) hand.outcome = `stand`;

  view.renderPlayerHands(player);

  let gameTimer = setTimeout(nextPlayerAction, 1500, nextAction, gameState);
}

export function doubleDownAction(e, gameState) {
  let player = gameState.player;
  let activeHand = player.currentSplitHand;

  gameState.toggleEnableActionBtns = {
    doubleDown: false,
    surrender: false,
    split: false,
  };

  gameState.updateDoubleDownBet();

  let hand;

  if (activeHand == 0) hand = player.hand;
  else hand = player.getSplitHand(activeHand);

  hand.doubleDownActive = true;

  gameState.updateNoticeText = `Player Doubles Down`;

  let hitClbk = player.executeHit.bind(player);

  // Wait 3 Sec

  let gameTimer = setTimeout(hitClbk, 1500, gameState);
}

export function surrenderAction(event, gameState) {
  //disable game buttons
  gameState.toggleEnableActionBtns = {
    split: false,
    hit: false,
    stand: false,
    doubleDown: false,
    surrender: false,
  };

  let hand;
  let player = gameState.player;
  let dealer = gameState.dealer;
  let activeHand = player.currentSplitHand;
  let handHolder, gameTimer, nextAction;

  if (activeHand > 0) {
    let handCount = player.splitHands.length;

    hand = player.getSplitHand(activeHand);
    handHolder = `Hand ${activeHand}`;

    if (activeHand == 4) nextAction = `endRound`;
    else nextAction = `changeHand`;
  } else {
    hand = player.hand;
    handHolder = `Player`;
    nextAction = `endRound`;
  }

  //Notice Text: Player Surrendered
  //Render Hand Outcome: Surrender
  gameState.updateNoticeText = `${handHolder} surrendered`;

  //Check if dealer has a natural
  //IF yes: Player loses, render player outcome as Lose/dealer as natural, end round
  //IF no: Player outcome as surrender,

  //End Round

  if (dealer.hand.outcome == `natural`) player.outcome = `surrenderFail`;
  else player.outcome = `surrender`;

  gameTimer = setTimeout(nextPlayerAction, 1500, nextAction, gameState);
}

// export function renderPlayerOutcome(nextAction, gameState) {
//   let player = gameState.player;
//   let activeHand = player.currentSplitHand;
//   let hand;

//   if (activeHand == 0) hand = player.hand;
//   else hand = player.getSplitHand(activeHand);

//   view.renderPlayerHands(player);
//   // view.renderPlayerHandOutcome(hand, `player`);

//   let gameTimer = setTimeout(nextPlayerAction, 3000, nextAction, gameState);
// }

export function nextPlayerAction(nextAction, gameState) {
  let player = gameState.player;

  switch (nextAction) {
    case `changeHand`:
      let activeHand = player.currentSplitHand;

      let hand = player.getSplitHand(activeHand);
      if (hand.doubleDownActive) view.toggleDoubleDownMarker(false);

      player.currentSplitHand = ++activeHand;

      gameState.updateNoticeText = `Hand ${activeHand}'s Turn`;

      view.renderPlayerHands(player, true);

      beginSplitHandActions(gameState);
      break;
    case `dealer`:
      gameState.updateNoticeText = `Dealer's Turn`;

      gameState.toggleEnableActionBtns = {
        hit: false,
        stand: false,
        doubleDown: false,
        split: false,
        surrender: false,
      };

      executeDealerTurn(gameState);
      break;
    case `endRound`:
      gameState.updateNoticeText = `Round Ends...`;
      //Begin End Round Sequence (Mystery Jackpot, Side Bets, Round Outcome)
      determineEndGameRoutineOrder(gameState);
      break;
    default:
      // view.renderPlayerHands(player);

      let btnObj = {
        hit: true,
        stand: true,
        doubleDown: false,
        split: false,
        surrender: false,
      };

      gameState.toggleEnableActionBtns = btnObj;
  }
}

export function executeDealerTurn(gameState) {
  let dealer = gameState.dealer;

  dealer.determineContinueStatus(dealer.hand, gameState);

  // dealer.executeHit(gameState);
}

export function nextDealerAction(nextAction, gameState) {
  let gameTimer;
  let dealer = gameState.dealer;

  view.renderPlayerHandOutcome(dealer.hand, `dealer`);

  let hitClbk = dealer.executeHit.bind(dealer);

  if (nextAction == `continue`)
    gameTimer = setTimeout(hitClbk, 1500, gameState);
  else {
    dealer.hand.revealFaceDownCard();
    view.renderDealerField(dealer.hand);

    gameState.updateNoticeText = `Round Ends...`;

    gameTimer = setTimeout(determineEndGameRoutineOrder, 1500, gameState);
  }
}

// Initializing Entire Program

function init() {
  listeners.addNewGameBtnListener();
  listeners.addBeginGameOptionsBtnListener();
  listeners.addOptionsMenuInputListeners();
  submitOptions();
}

init();
