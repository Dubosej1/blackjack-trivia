import {
  startNewGame,
  //   applyEndGameBtn,
  submitBetValue,
  //   applyInitialCards,
  //   hitAction,
  //   standAction,
  //   doubleDownAction,
  //   splitAction,
  //   insuranceAction,
  //   applyEasyQuestionDifficulty,
  //   applyMediumQuestionDifficulty,
  //   applyHardQuestionDifficulty,
  //   collectTriviaAnswer,
} from "./controller-2.js";
/////////////////////////////////////////////
////////// Selectors
////////////////////////////////////////////

//////////Game Buttons//////////

//Main Game Btns
const newGameBtn = document.querySelector(".btn__newGame");
const endGameBtn = document.querySelector(".btn__endGame");
const submitBetBtn = document.querySelector(".btn__submitBetValue");
const submitInsuranceBetBtn = document.querySelector(
  ".btn__submitInsuranceBetValue"
);

//Blackjack Section Btns
const dealCardsBtn = document.querySelector(".btn__deal-cards");
const hitBtn = document.querySelector(".btn__hit");
const standBtn = document.querySelector(".btn__stand");
const doubleDownBtn = document.querySelector(".btn__doubleDown");
const splitBtn = document.querySelector(".btn__split");
const insuranceBtn = document.querySelector(".btn__insurance");

//Trivia Section Btns
const easyDifficultyBtn = document.querySelector(".btn__easy");
const mediumDifficultyBtn = document.querySelector(".btn__medium");
const hardDifficultyBtn = document.querySelector(".btn__hard");
const answerABtn = document.querySelector(".btn__answer-a");
const answerBBtn = document.querySelector(".btn__answer-b");
const answerCBtn = document.querySelector(".btn__answer-c");
const answerDBtn = document.querySelector(".btn__answer-d");
const answerTrueBtn = document.querySelector(".btn__answer-true");
const answerFalseBtn = document.querySelector(".btn__answer-false");
const answerBtns = document.querySelectorAll(".btn__answer");
const multipleChoiceAnswerBtns = document.querySelectorAll(
  ".btn__answer-multiple"
);
const booleanChoiceAnswerBtns = document.querySelectorAll(
  ".btn__answer-boolean"
);
const triviaDifficultyBtns = document.querySelectorAll(
  ".btn__trivia-difficulty"
);

const allBtns = document.querySelectorAll(`.btn`);

//////////Blackjack Section UI Fields//////////
// const noticeUI = document.querySelector(".notice");
const scoreUI = document.querySelector(".score");
const bankUI = document.querySelector(".bank");
const betAmountUI = document.querySelector(".betAmount");
const splitBetAmountUI = document.querySelector(".splitBetAmount");
const insuranceBetAmountUI = document.querySelector(".insuranceBetAmount");
const betValueField = document.querySelector("#betValue");
const insuranceBetFieldUI = document.querySelector(
  ".player-actions__insurance"
);
const insuranceBetValueField = document.querySelector("#insuranceBetValue");
const dealerHandUI = document.querySelector(".dealerHand");
const dealerHandTotalUI = document.querySelector(".dealerHandTotal");
const playerHandUI = document.querySelector(".playerHand");
const playerHandLabel = document.querySelector(`.player-info__count`);
const playerHandTotalUI = document.querySelector(".playerHandTotal");
const playerSplitHandUI = document.querySelector(".playerSplitHand");
const playerSplitHandTotalUI = document.querySelector(".playerSplitHandTotal");

////////// Trivia Section UI Fields //////////
const triviaModal = document.querySelector(".trivia__modal");
const triviaModalHeading = document.querySelector(".trivia__modal-heading");
const triviaLabelContainer = document.querySelector(
  ".trivia__modal-label--container"
);
const categoryTriviaUI = document.querySelector(".trivia__category");
const difficultyTriviaUI = document.querySelector(".trivia__difficulty");
const questionTriviaUI = document.querySelector(".trivia__question");
const choiceATriviaUI = document.querySelector(".trivia__answer-a");
const choiceBTriviaUI = document.querySelector(".trivia__answer-b");
const choiceCTriviaUI = document.querySelector(".trivia__answer-c");
const choiceDTriviaUI = document.querySelector(".trivia__answer-d");
const correctAnswerTriviaUI = document.querySelector(".trivia__answer-correct");
const triviaCorrectAnswerField = document.querySelector(
  ".trivia__modal-answer-correct--container"
);
const multipleChoiceAnswerField = document.querySelector(
  ".trivia__modal-answer-table"
);

// export function addHandlerListeners(handlerMap) {
//   allBtns.forEach(function (btn) {
//     console.log(btn);
//     let btnName = convertVarNameToStr({ btn });

//     if (handlerMap.has(btnName))
//       btn.addEventListener(`click`, handlerMap.get(btnName));
//   });
// }
const btnMap = (function () {
  const allBtns = document.querySelectorAll(`.btn`);
  let map = new Map();

  allBtns.forEach(function (btn) {
    let key = convertVarNameToStr({ btn });
    map.set(key, btn);
  });
  return map;
})();

export function addHandlerListeners(handlerMap, gameState = null) {
  const allBtns = document.querySelectorAll(`.btn`);
  // handlerMap.forEach(function (item) {
  //   let [class, callback] = item;

  //   if (btn.item(class))

  // }

  allBtns.forEach(function (btn) {
    // console.log(btn);
    let classCallback;

    handlerMap.forEach(function (obj) {
      if (btn.classList.contains(obj.class)) classCallback = obj.callback;
    });
    if (!classCallback) return;

    btn.addEventListener(`click`, function (event) {
      classCallback(event, gameState);
    });
  });

  //   allBtns.forEach(function (btn) {
  //     console.log(btn);
  //     let btnName = convertVarNameToStr({ btn });

  //     if (btn.classList.contains()
  //       btn.addEventListener(`click`, handlerMap.get(btnName));
  //   });
}

function convertVarNameToStr(varObj) {
  return Object.keys(varObj)[0];
}

// export function renderState (render, gameState = null, changeObj = null) {
//   if (render == false) return;
//   if (changeObj.noticeText == true) view.renderNoticeText(gameState.noticeText);
//   if (changeObj.bank == true) renderBank(gameState.bank);
//   if (changeObj.betAmount == true) renderBetAmount(gamaeState.betAmount);
//   if ()

// }

export function renderBtnVisibility(btnObj) {
  // Object.entries(btnObj).forEach(function ([key, value]) {
  //   if (btnMap.has(key))
  //     value === true
  //       ? (btnMap(key).style.display = "inline-block")
  //       : (btnMap(key).style.display = `none`);
  // });

  //arr = btns arr with callbacks, rest = btn toggle states, obj =
  let { array: btnArr, ...rest } = btnObj;

  Object.entries(rest).forEach(function ([key, value]) {
    const foundElement = btnArr.find(function (obj) {
      return obj.name === key;
    });
    // let elementClass = document.querySelector(`.${foundElement.class}`);
    value
      ? (document.querySelector(`.${foundElement.class}`).style.display =
          "inline-block")
      : (document.querySelector(
          `.${foundElement.class}`
        ).style.display = `none`);
  });
}

export function renderNoticeText(str) {
  document.querySelector(".notice").innerHTML = str;
}

export function renderBank(bank) {
  document.querySelector(".bank").textContent = bank;
}

export function renderBetAmount(
  betAmount,
  splitBetAmount = null,
  insuranceBetAmount = null
) {
  document.querySelector(".betAmount").textContent = betAmount;
  if (splitBetAmount)
    document.querySelector(".splitBetAmount").textContent = splitBetAmount;
  if (insuranceBetAmount)
    document.querySelector(".insuranceBetAmount").textContent =
      insuranceBetAmount;
}

export function collectBetSubmitted() {
  return Math.round(Number(document.querySelector("#betValue").value));
}

export function renderBetValueField(value) {
  document.querySelector("#betValue").value = value;
}

export function renderPlayerHand(hand) {
  document.querySelector(".playerHand").innerHTML = hand.images.join();
  document.querySelector(".playerHandTotal").textContent = hand.total;
}

export function renderDealerHand(hand) {
  document.querySelector(".dealerHand").innerHTML = hand.images.join();
  document.querySelector(".dealerHandTotal").textContent = hand.visibleTotal;
}

export function renderPlayerSplitHand(hand) {
  document.querySelector(".playerSplitHand").innerHTML = hand.images.join();
  document.querySelector(".playerSplitHandTotal").textContent = hand.total;
}
