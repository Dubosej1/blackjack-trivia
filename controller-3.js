import * as bjModel from "./blackjack-model-3.js";
import * as triviaModel from "./trivia-model.js";
import * as view from "./view-3.js";
import * as listeners from "./listeners.js";
import * as betModel from "./bet-model.js";
import * as state from "./state.js";
import { triviaObj } from "./trivia-model.js";

export let optionsPlaceholder;
export let bankPlaceholder;
export let specialNumPlaceholder;

//////////Game Flow functions//////////

export function startNewGame(e) {
  view.gameInfoFields.toggleDisplayNewGameBtn(false);

  triviaObj.generateTriviaQuestions();
  triviaObj.resetTriviaCredits();

  view.gameInfoFields.renderNoticeText(`New Game Started...`);

  let bank = 1000;
  let options = optionsPlaceholder;
  let specialNum = betModel.generateSpecialNums();

  startNewRound(bank, options, specialNum);
}

export function startNewRound(bank, options, specialNum) {
  let gameState = initializeGameObjs(bank, options, specialNum);

  changeSystemButtonVisibility();

  addBeginningRoundListeners();

  gameState.toggleEnableActionBtns = {
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    surrender: false,
  };

  // gameState.toggleGameActive(true);

  view.baseBetModal.openModal(gameState);
  bjModel.initDeck(gameState);

  return;

  function initializeGameObjs(bank, options, specialNum) {
    let gameState = state.initNewState(bank, options, specialNum);

    let players = bjModel.initPlayers(bank);

    let betObj = betModel.initBaseBet(bank);

    gameState.addBetObj(betObj);

    gameState.initialAddPlayers(players);

    return gameState;
  }

  function changeSystemButtonVisibility() {
    view.gameInfoFields.toggleDisplayStartNextRoundBtn(false);
    view.gameInfoFields.toggleDisplayOptionsBtn(false);
  }

  function addBeginningRoundListeners() {
    listeners.removeBeginGameOptionsBtnListener();
    listeners.addNewRoundEventListeners();
  }
}

export function startDealCardsRoutine(event, gameState) {
  gameState.updateNoticeText = `Cards Dealt...`;

  updateGameStateBetInfo(gameState);

  updateGameStateCardHolderObjs(gameState);

  prepareBeginGameRoutine(gameState);

  return;

  function updateGameStateBetInfo(gameState) {
    gameState.betObj.lockInBets();

    let newBank = gameState.betObj.getBank();
    gameState.updateBank(newBank);

    let newBaseBet = gameState.betObj.getBaseBet();
    view.gameInfoFields.updateBaseBet(newBaseBet);
  }

  function updateGameStateCardHolderObjs(gameState) {
    gameState.updatePlayer = gameState.player;
    gameState.updateDealer = gameState.dealer;
  }

  function prepareBeginGameRoutine(gameState) {
    if (gameState.betObj.checkForBeginningSideBetBtn())
      view.toggleCheckSideBetBtn(true);
    else beginGameRoutinePart2(gameState);
  }
}

export function determineBeginGameRoutineOrder(gameState) {
  let beginGameRoutineOrder = {
    perfect11sDiceRoll: false,
    sideBetSequence: false,
    extraBet: false,
    houseMoney: false,
    baseRound: true,
    natural: false,
    dealerPeek: false,
    earlySurrender: false,
  };

  let diceRollNeeded = false;
  let betObj = gameState.betObj;
  let playerHand = gameState.player.hand;
  let dealerHand = gameState.dealer.hand;

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
    extraBetBJObj.checkValidBet(playerHand)
      ? (beginGameRoutineOrder.extraBet = true)
      : (beginGameRoutineOrder.extraBet = false);
  }

  gameState.beginGameRoutineOrder = beginGameRoutineOrder;

  let houseMoneyExists = betObj.checkSideBetExists(`houseMoney`);

  if (houseMoneyExists) {
    let houseMoneyObj = betObj.getSideBet(`houseMoney`);

    houseMoneyObj.initSideBet(gameState);
  }

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
      view.perfect11sDiceModal.displayModal(diceRolls);
      order.perfect11sDiceRoll = false;
      break;
    case order.houseMoney:
      view.houseMoneyModal.displayModal(gameState);
      order.houseMoney = false;
      break;
    case order.sideBetSequence:
      gameState.betObj.initInitialSideBetSequence(gameState);
      let winnings = gameState.betObj.getInitialSideBetWinnings();
      gameState.updateWinningsToBank(winnings);
      view.sideBetOutcomeModal.displayModal(gameState, `beginning`);
      order.sideBetSequence = false;
      break;
    case order.extraBet:
      view.displayExtraBetModal(gameState);
      order.extraBet = false;
      break;
    default:
      beginGameRoutinePart2(gameState);
  }
}

export function beginGameRoutinePart2(gameState) {
  let order = gameState.beginGameRoutineOrder;
  let playerHand = gameState.player.hand;
  let dealerHand = gameState.dealer.hand;
  let gameTimer, modalType;

  if (!gameState.beginningRoundChecksDone) {
    gameState.checkSplitAvailable(playerHand);
    gameState.checkDoubleDownAvailable(playerHand);
    gameState.checkValidEvenMoney();
    gameState.checkValidInsurance();
    checkForRemainingOrderRoutines(gameState);
    gameState.beginningRoundChecksDone = true;
  }

  switch (true) {
    case gameState.evenMoneyAvailable:
      modalType = `evenMoney`;
      activateSideBetModal(modalType);
      gameState.evenMoneyAvailable = false;
      break;
    case gameState.insuranceAvailable:
      modalType = `insurance`;
      activateSideBetModal(modalType);
      gameState.insuranceAvailable = false;
      break;
    case order.natural:
      let playerText;

      if (playerHand.outcome == `natural`) playerText = `Player`;
      else playerText = "Dealer";

      gameState.updateNoticeText = `${playerText} Natural`;

      gameTimer = setTimeout(determineEndGameRoutineOrder, 3000, gameState);
      order.natural = false;
      break;
    case order.earlySurrender:
      view.activateEarlySurrenderModal(gameState);

      order.earlySurrender = false;
      break;
    case order.dealerPeek:
      gameState.updateNoticeText = `Dealer Peeks for Natural`;

      gameTimer = setTimeout(dealerPeekAction, 2000, gameState);
      order.dealerPeek = false;
      break;
    default:
      let obj = {
        hit: true,
        stand: true,
        split: gameState.splitAvailable,
        doubleDown: gameState.doubleDownAvailable,
        surrender: true,
      };

      if (gameState.options.surrenderType == `early`) obj.surrender = false;

      gameState.toggleEnableActionBtns = obj;
      gameState.updateNoticeText = `Player's Turn`;
  }

  function activateSideBetModal(modalType) {
    let activateModal = view.evenMoneyInsuranceModal.activateModal.bind(
      view.evenMoneyInsuranceModal
    );

    gameTimer = setTimeout(activateModal, 3000, modalType);
  }

  function dealerPeekAction(gameState) {
    let dealerHand = gameState.dealer.hand;

    if (dealerHand.outcome == `natural`)
      gameState.beginGameRoutineOrder.natural = true;

    beginGameRoutinePart2(gameState);
  }

  function checkForRemainingOrderRoutines(gameState) {
    let playerHand = gameState.player.hand;
    let dealer = gameState.dealer;
    let options = gameState.options;

    if (playerHand.outcome == `natural`)
      gameState.beginGameRoutineOrder.natural = true;

    if (dealer.peekNeeded) gameState.beginGameRoutineOrder.dealerPeek = true;

    if (options.surrenderType == `early`)
      gameState.beginGameRoutineOrder.earlySurrender = true;
  }
}

export function determineEndGameRoutineOrder(gameState) {
  let endGameRoutineOrder = {
    mysteryModal: false,
    sideBetSequence: false,
    totalWinnings: true,
    roundOutcome: true,
  };

  gameState.updateNoticeText = `Round Ended`;

  gameState.revealDealerFaceDown();

  gameState.determineBaseRoundOutcome();

  gameState.betObj.checkForEndingSideBetSequence(gameState)
    ? (endGameRoutineOrder.sideBetSequence = true)
    : (endGameRoutineOrder.sideBetSequence = false);

  gameState.endGameRoutineOrder = endGameRoutineOrder;

  let gameTimer = setTimeout(endGameRoutine, 3500, gameState);
}

export function endGameRoutine(gameState) {
  let order = gameState.endGameRoutineOrder;
  let betObj = gameState.betObj;
  let sideBet = betObj.sideBet;
  let activeHand = gameState.player.currentSplitHand;

  switch (true) {
    case order.roundOutcome:
      //Base Round Outcome Modal
      if (activeHand == 0)
        view.baseRoundOutcomeModal.renderSingleHandOutcome(gameState);
      else view.baseRoundOutcomeModal.renderSplitHandOutcome(gameState);

      gameState.updateWinningsToBank(gameState.playerWinnings);

      order.roundOutcome = false;
      break;
    case 2:
      //Mystery Jackpot Modal
      break;
    case order.sideBetSequence:
      //Side Bet Outcome Modal
      gameState.betObj.initEndingSideBetSequence(gameState);
      let winnings = gameState.betObj.getEndingSideBetWinnings();
      gameState.updateWinningsToBank(winnings);
      view.sideBetOutcomeModal.displayModal(gameState, `ending`);
      order.sideBetSequence = false;
      break;
    case order.totalWinnings:
      gameState.calculateTotalWinnings();
      view.totalWinningsModal.displayModal(gameState);
      order.totalWinnings = false;
      break;
    default:
      view.gameInfoFields.toggleDisplayOptionsBtn(true);
      let result = checkGameOver(gameState);

      if (result) {
        clearRoundData(gameState);
        view.gameInfoFields.toggleDisplayNewGameBtn(true);
      } else view.gameInfoFields.toggleDisplayStartNextRoundBtn(true);
  }
}

function checkGameOver(gameState) {
  let result;

  if (gameState.bank == 0) {
    view.gameInfoFields.renderNoticeText(`Game Over...no money`);
    result = true;
  } else if (triviaObj.credits == 0) {
    view.gameInfoFields.renderNoticeText(`Game Over...no trivia credits`);
    result = true;
  } else result = false;

  return result;
}

export function clearRoundData(gameState) {
  let gameTimer;

  view.resetUI();
  view.baseBetModal.resetModal(gameState);
  state.addStateToLog(gameState);
  listeners.addBeginGameOptionsBtnListener();
  bankPlaceholder = gameState.bank;
  specialNumPlaceholder = gameState.specialNum;
  optionsPlaceholder = gameState.options;
  view.gameInfoFields.renderNoticeText(` `);

  if (gameState.gameAborted) {
    view.gameInfoFields.renderNoticeText(`Game Ended.`);
    let bank = 0;
    view.gameInfoFields.updateBank(bank);
    view.gameInfoFields.toggleDisplayNewGameBtn(true);
    gameState.toggleEnableActionBtns = {
      hit: false,
      stand: false,
      doubleDown: false,
      split: false,
      surrender: false,
    };
  }
}

export function updateStatePlayers(player, gameState) {
  if (player.type == `dealer`) gameState.updateDealer = player;
  else gameState.updatePlayer = player;
}

export function endGameAction(gameState) {
  gameState.abortGame();
  clearRoundData(gameState);
}

export function submitOptions(event, gameState = null) {
  let options = view.optionsModal.collectOptions();

  if (!gameState) optionsPlaceholder = options;
  else gameState.updateOptions(options);
}

//////////Split Game Flow Functions//////////

/////////Betting Controls//////////

//"Base Bet" Modal Functions

export function updateBaseBetChips(event, gameState) {
  if (!gameState.cardsDealt) bjModel.dealInitialCards(gameState);

  let addend = parseInt(event.target.dataset.value, 10);

  gameState.betObj.addToTempBaseBet(addend);
  view.baseBetModal.updateModalTotal(gameState);
}

export function clearBaseBetChips(event, gameState) {
  gameState.betObj.clearTempBaseBet();
  view.baseBetModal.updateModalTotal(gameState);
}

export function updateSideBetContainer(event, gameState) {
  view.sideBetModal.addActiveElementToBetContainer(event);
}

//"Choose Side Bet" Modal functions

export function updateSideBetChips(event, gameState) {
  //Need error for when betAmount > bank
  let betObj = gameState.betObj;
  let sideBet = view.sideBetModal.collectSideBet();

  if (!betObj.checkSideBetExists(sideBet)) {
    let sideBetObj = betModel.generateSideBetObj(sideBet);

    gameState.betObj.addSideBetObj(sideBetObj);
  }

  let addend = parseInt(event.target.dataset.value, 10);

  gameState.betObj.updateSideBetAmount(sideBet, addend);
  view.sideBetModal.updateModalTotals(sideBet, gameState);
}

export function clearSideBetChips(event, gameState) {
  let sideBet = view.sideBetModal.collectSideBet();
  let betObj = gameState.betObj;

  betObj.clearTempSideBetAmount(sideBet);
  view.sideBetModal.updateModalTotals(sideBet, gameState);
  betObj.removeSideBetObj(sideBet);
}

export function placeSideBets(event, gameState) {
  view.baseBetModal.updateModalTotal(gameState);

  gameState.betObj.toggleSideBetPlacedModalActive(true);
  view.baseBetModal.toggleSideBetPlacedBtn(true, gameState);
  view.sideBetPlacedModal.toggleActivateModal(true, gameState);
}

export function activateSideBet(event, gameState) {
  let betObj = gameState.betObj;
  let sideBet = view.sideBetModal.collectSideBet();

  if (!betObj.checkSideBetExists(sideBet)) {
    let sideBetObj = betModel.generateSideBetObj(sideBet);

    gameState.betObj.addSideBetObj(sideBetObj);
  }

  view.sideBetModal.activateSideBetSelectedText(sideBet);
}

export function clearAllSideBets(event, gameState) {
  let modalActive = gameState.betObj.sideBetPlacedModalActive;

  gameState.betObj.clearSideBetObjs();
  view.sideBetModal.resetModal(gameState);

  if (modalActive) {
    view.baseBetModal.updateModalTotal(gameState);
    view.baseBetModal.toggleSideBetPlacedBtn(false);
    view.sideBetPlacedModal.toggleActivateModal(false);
    gameState.betObj.toggleSideBetPlacedModalActive(false);
  }
}

export function initDisplayInitialSideBetOutcome(event, gameState) {
  view.toggleCheckSideBetBtn(false);

  determineBeginGameRoutineOrder(gameState);
}

// "Extra Bet" Modal Functions

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

  let sideBetObj;

  if (sideBet == `extraBetBlackjack`) {
    sideBetObj = gameState.betObj.getSideBet(`extraBetBlackjack`);
    let bank = sideBetObj.lockInExtraBet();
    gameState.betObj.bank = bank;
    gameState.updateBank(bank);
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

//House Money Modal Function

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
      bet = houseMoneyObj.bet;
      betObj.parlayToBaseBet(bet);
      houseMoneyObj.changeWinnings(`bet`);
      break;
    case `parlay-winnings`:
      winnings = houseMoneyObj.winnings;
      betObj.parlayToBaseBet(winnings);
      houseMoneyObj.changeWinnings(`winnings`);
      break;
    case `parlay-all`:
      total = houseMoneyObj.winnings + houseMoneyObj.bet;
      betObj.parlayToBaseBet(total);
      houseMoneyObj.changeWinnings(`all`);
      break;
    default:
      console.log(`Error: House Money Modal Parlay Btns`);
  }

  beginGameRoutine(gameState);
}

//Even Money and Insurance Side Bet Functions

export function initEvenMoneyBet(event, gameState) {
  gameState.deductHalfBetFromBank();

  let outcome = betModel.generateEvenMoneyObj(gameState);
  view.evenMoneyInsuranceModal.removeSideBetDecideBtns();

  let modalType = `evenMoney`;
  view.evenMoneyInsuranceModal.renderOutcome(modalType, outcome, gameState);
}

export function initInsuranceBet(event, gameState) {
  gameState.deductHalfBetFromBank();

  let outcome = betModel.generateInsuranceObj(gameState);
  view.evenMoneyInsuranceModal.removeSideBetDecideBtns();

  let modalType = `insurance`;
  view.evenMoneyInsuranceModal.renderOutcome(modalType, outcome, gameState);
}

//////////Game Action Btn Functions
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

  if (gameState.options.triviaMode) popbox.open(`trivia-modal`);
  else gameState.player.executeHit(gameState);
}

export function standAction(e, gameState) {
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

  view.gameField.renderPlayerHands(player);

  let gameTimer = setTimeout(nextPlayerAction, 1500, nextAction, gameState);
}

export function doubleDownAction(e, gameState) {
  gameState.toggleEnableActionBtns = {
    hit: false,
    stand: false,
    doubleDown: false,
    surrender: false,
    split: false,
  };

  triviaObj.toggleDoubleDownToken(true);

  if (gameState.options.triviaMode) popbox.open(`trivia-modal`);
  else executeDoubleDown(gameState);
}

function executeDoubleDown(gameState) {
  let player = gameState.player;
  let activeHand = player.currentSplitHand;

  let hand;

  if (activeHand == 0) hand = player.hand;
  else hand = player.getSplitHand(activeHand);

  hand.doubleDownActive = true;
  gameState.updateDoubleDownBet();

  gameState.updateNoticeText = `Player Doubles Down`;

  let hitClbk = player.executeHit.bind(player);

  let gameTimer = setTimeout(hitClbk, 1500, gameState);
}

export function surrenderAction(event, gameState) {
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
  let earlySurrender;

  gameState.options.surrenderType == `early`
    ? (earlySurrender = true)
    : (earlySurrender = false);

  if (activeHand > 0) {
    let handCount = player.splitHands.length;

    hand = player.getSplitHand(activeHand);
    handHolder = `Hand ${activeHand}`;

    if (activeHand == handCount) nextAction = `endRound`;
    else nextAction = `changeHand`;
  } else {
    hand = player.hand;
    handHolder = `Player`;
    nextAction = `endRound`;
  }

  gameState.updateNoticeText = `${handHolder} surrendered`;

  if (dealer.hand.outcome == `natural` && !earlySurrender)
    hand.outcome = `surrenderFail`;
  else {
    hand.outcome = `surrender`;
    view.gameField.renderHandOutcome(hand, `player`);
  }

  gameTimer = setTimeout(nextPlayerAction, 2500, nextAction, gameState);
}

//////////Next Cardholder Action Functions//////////

//Player Actions
export function nextPlayerAction(nextAction, gameState) {
  let player = gameState.player;

  switch (nextAction) {
    case `changeHand`:
      let activeHand = player.currentSplitHand;

      let hand = player.getSplitHand(activeHand);
      if (hand.doubleDownActive)
        view.gameInfoFields.toggleDoubleDownMarker(false);

      player.currentSplitHand = ++activeHand;

      gameState.updateNoticeText = `Hand ${activeHand}'s Turn`;

      view.gameField.renderPlayerHands(player, true);

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
      determineEndGameRoutineOrder(gameState);
      break;
    default:
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

//Split Hand Actions
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

  let btnObj = { stand: true, surrender: true };

  gameState.splitAvailable ? (btnObj.split = true) : (btnObj.split = false);
  gameState.doubleDownAvailable
    ? (btnObj.doubleDown = true)
    : (btnObj.doubleDown = false);
  currHand.resplitHit ? (btnObj.hit = true) : (btnObj.hit = false);

  gameState.toggleEnableActionBtns = btnObj;
}

//Dealer Actions
export function executeDealerTurn(gameState) {
  let dealer = gameState.dealer;

  dealer.determineContinueStatus(dealer.hand, gameState);
}

export function nextDealerAction(nextAction, gameState) {
  let gameTimer;
  let dealer = gameState.dealer;

  view.gameField.renderHandOutcome(dealer.hand, `dealer`);

  let hitClbk = dealer.executeHit.bind(dealer);

  if (nextAction == `continue`)
    gameTimer = setTimeout(hitClbk, 1500, gameState);
  else {
    gameState.updateNoticeText = `Round Ends...`;

    gameTimer = setTimeout(determineEndGameRoutineOrder, 1500, gameState);
  }
}

//////////Trivia Mode Functions//////////
export function processTriviaDifficulty(event, gameState) {
  let difficulty = event.target.dataset.difficulty;

  triviaObj.selectTriviaDifficulty(difficulty);
  view.triviaModal.renderQuestion(triviaObj.activeQuestion);
}

export function processTriviaAnswer(event, gameState) {
  view.triviaModal.toggleDisableAnswerBtns();

  let selectedAnswer = event.target.dataset.ans;

  let answerCorrectly = triviaObj.determineCorrectAnswer(selectedAnswer);
  let [credits, modifier] = triviaObj.updateTriviaCredits(answerCorrectly);
  view.triviaModal.displayCorrectAnswer(triviaObj.activeQuestion);
  view.triviaModal.renderCredits(credits, modifier);
  updateTriviaResult(answerCorrectly, event, gameState);

  function updateTriviaResult(answerCorrectly, event, gameState) {
    let gameTimer;

    if (answerCorrectly) {
      //Player Hits
      view.triviaModal.renderPlayerCorrectResult();
    } else {
      //Player Stands
      view.triviaModal.renderPlayerIncorrectResult(event);
    }
    let resetTriviaModal = view.triviaModal.resetModal.bind(view.triviaModal);

    gameTimer = setTimeout(resetTriviaModal, 5000, answerCorrectly);

    nextTriviaAction(answerCorrectly, gameState);

    function nextTriviaAction(answerCorrectly, gameState) {
      let gameTimer;
      let player = gameState.player;
      let hitClbk = player.executeHit.bind(player);

      if (answerCorrectly) {
        if (triviaObj.doubleDownToken) {
          gameTimer = setTimeout(executeDoubleDown, 5500, gameState);
          triviaObj.toggleDoubleDownToken(false);
        } else gameTimer = setTimeout(hitClbk, 5500, gameState);
      } else gameTimer = setTimeout(standAction, 5500, null, gameState);
    }
  }
}

// Initializing Entire Program

function init() {
  listeners.addNewGameListeners();

  let credits = triviaObj.getTriviaCredits();
  view.triviaModal.renderCredits(credits);
  submitOptions();
}

init();
