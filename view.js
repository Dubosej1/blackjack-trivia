import {
  startNewGame,
  applyEndGameBtn,
  submitBetValue,
  applyInitialCards,
  hitAction,
  standAction,
  doubleDownAction,
  splitAction,
  insuranceAction,
  applyEasyQuestionDifficulty,
  applyMediumQuestionDifficulty,
  applyHardQuestionDifficulty,
  collectTriviaAnswer,
} from "/controller.js";
/////////////////////////////////////////////
////////// Selectors
////////////////////////////////////////////

//////////Game Buttons//////////

const allBtns = document.querySelectorAll(`.btn`);
const btnMap = (function () {
  let map = new Map();

  allBtns.forEach(function (btn) {
    let key = convertVarNameToStr({ btn });
    map.set(key, btn);
  });
  return map;
})();

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

//////////Blackjack Section UI Fields//////////
const noticeUI = document.querySelector(".notice");
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

export function addHandlerListeners(handlerMap) {
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

    btn.addEventListener(`click`, classCallback);
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
    const elementClass = document.querySelector(`.${foundElement.class}`);
    value
      ? (elementClass.style.display = "inline-block")
      : (elementClass.style.display = `none`);
  });
}

export function renderNoticeText(str) {
  noticeUI.innerHTML = str;
}

export function renderUIFields(state, noticeToken = false) {
  noticeUI.innerHTML = state.noticeText;
  if (noticeToken) return;
  bankUI.textContent = state.bank;
  betAmountUI.textContent = state.betAmount;
  splitBetAmountUI.textContent = state.splitBetAmount;
  insuranceBetAmountUI.textContent = state.insuranceBetAmount;
}

export function collectBetSubmitted() {
  return Math.round(Number(betValueField.value));
}

export function renderBetValueField(value) {
  betValueField.value = value;
}

export function renderInsuranceBetField(betAmount, btnObj) {
  renderBtnVisibility(btnObj);
  insuranceBetFieldUI.style.display = `block`;
  insuranceBetAmountUI.textContent = betAmount;
  renderBetValueField(null);
}

export function hideInsuranceBetField(betAmount) {
  insuranceBetFieldUI.style.display = `none`;
  insuranceBetAmountUI.textContent = betAmount;
}

export function renderGameCards(state) {
  playerHandUI.innerHTML = state.playerCardImgs.join();
  playerSplitHandUI.innerHTML = state.playerSplitCardImgs.join();
  dealerHandUI.innerHTML = state.dealerCardImgs.join();

  playerHandTotalUI.textContent = state.playerHandTotal;
  playerSplitHandTotalUI.textContent = state.playerSplitHandTotal;
  dealerHandTotalUI.textContent = state.visibleDealerHandTotal;
}

export function clearGameCards(state) {
  playerHandUI.innerHTML = ``;
  playerSplitHandUI.innerHTML = ``;
  dealerHandUI.innerHTML = ``;

  playerHandTotalUI.textContent = state.playerHandTotal;
  playerSplitHandTotalUI.textContent = state.playerSplitHandTotal;
  dealerHandTotalUI.textContent = state.visibleDealerHandTotal;
}

export function toggleSplitHandLabel(toggle) {
  toggle
    ? (playerHandLabel.textContent = `Hand 1 `)
    : (playerHandLabel.textContent = `Player `);
}

export function displayGameOutcome(state, hand1, hand2 = null) {
  if (hand2) {
    state.noticeText = `Hand 1: ${hand1.gameOutcome}<br>Hand 2: ${hand2.gameOutcome}`;
    state.betAmount = hand1.betAmount;
    state.splitBetAmount = hand2.betAmount;
  } else {
    state.noticeText = hand1.gameOutcome;
    state.betAmount = hand1.betAmount;
  }
  renderUIFields(state);
}

export function toggleTriviaModal(toggle) {
  toggle
    ? (triviaModal.style.display = `block`)
    : (triviaModal.style.display = `none`);
}

function toggleTriviaDifficultyBtns(toggle) {
  if (toggle) {
    triviaDifficultyBtns.forEach(function (btn) {
      btn.style.display = `inline-block`;
    });
  } else {
    triviaDifficultyBtns.forEach(function (btn) {
      btn.style.display = "none";
    });
  }
}

export function disableTriviaAnswerBtns() {
  answerBtns.forEach(function (btn) {
    btn.disabled = true;
  });
}

export function displayTriviaCorrectAnswer(state) {
  triviaCorrectAnswerField.style.display = `inline-block`;
  correctAnswerTriviaUI.innerHTML = state.triviaData.correctAnswer;
}

export function renderTriviaQuestionUI(questionObj) {
  console.log(questionObj);
  toggleTriviaDifficultyBtns(false);

  triviaLabelContainer.style.display = `flex`;

  categoryTriviaUI.textContent = questionObj.category;
  difficultyTriviaUI.textContent = questionObj.difficulty;
  questionTriviaUI.innerHTML = questionObj.question;

  if (questionObj.type == `multiple`) {
    renderMultipleChoiceAnswers(questionObj.answers);
  } else {
    renderBooleanChoiceAnswers(questionObj.correctAnswer);
  }

  function renderMultipleChoiceAnswers(answers) {
    answerABtn.setAttribute(
      `data-ans`,
      questionObj.multipleChoiceAnswersArr[0]
    );
    answerBBtn.setAttribute(
      `data-ans`,
      questionObj.multipleChoiceAnswersArr[1]
    );
    answerCBtn.setAttribute(
      `data-ans`,
      questionObj.multipleChoiceAnswersArr[2]
    );
    answerDBtn.setAttribute(
      `data-ans`,
      questionObj.multipleChoiceAnswersArr[3]
    );

    choiceATriviaUI.innerHTML = questionObj.multipleChoiceAnswersArr[0];
    choiceBTriviaUI.innerHTML = questionObj.multipleChoiceAnswersArr[1];
    choiceCTriviaUI.innerHTML = questionObj.multipleChoiceAnswersArr[2];
    choiceDTriviaUI.innerHTML = questionObj.multipleChoiceAnswersArr[3];

    multipleChoiceAnswerBtns.forEach(function (btn) {
      let answer = btn.getAttribute("data-ans");
      if (answer == questionObj.correctAnswer) {
        btn.classList.add("correctAnswer");
      }

      btn.style.display = `inline-block`;
    });

    multipleChoiceAnswerField.style.display = `flex`;
  }

  function renderBooleanChoiceAnswers(correctAnswer) {
    if (questionObj.correctAnswer == `True`) {
      answerTrueBtn.classList.add("correctAnswer");
      answerTrueBtn.setAttribute(`data-ans`, `True`);
    } else {
      answerFalseBtn.classList.add("correctAnswer");
      answerFalseBtn.setAttribute(`data-ans`, "False");
    }

    booleanChoiceAnswerBtns.forEach(function (btn) {
      btn.style.display = `inline-block`;
    });
  }
}

export function resetTriviaMode(answerCorrectly) {
  triviaModal.style.display = `none`;

  clearTriviaUI();
  clearAnswerBtnData(answerCorrectly);
  resetTriviaBtns();
}

function clearTriviaUI() {
  categoryTriviaUI.textContent = ``;
  difficultyTriviaUI.textContent = ``;
  questionTriviaUI.innerHTML = ``;
  choiceATriviaUI.innerHTML = ``;
  choiceBTriviaUI.innerHTML = ``;
  choiceCTriviaUI.innerHTML = ``;
  choiceDTriviaUI.innerHTML = ``;
  correctAnswerTriviaUI.innerHTML = ` `;
  triviaLabelContainer.style.display = `none`;
  triviaCorrectAnswerField.style.display = `none`;
  multipleChoiceAnswerField.style.display = `none`;
  triviaModalHeading.textContent = `Hit Trivia Question`;
  triviaModalHeading.style.color = `black`;
  questionTriviaUI.textContent = `Select Trivia Difficulty`;
}

function clearAnswerBtnData(answerCorrectly) {
  answerABtn.removeAttribute(`data-ans`);
  answerBBtn.removeAttribute(`data-ans`);
  answerCBtn.removeAttribute(`data-ans`);
  answerDBtn.removeAttribute(`data-ans`);
  // correctAnswer = ``;
  // currentTriviaDifficulty = ``;

  document.querySelector(".correctAnswer").style.backgroundColor = `grey`;
  document.querySelector(`.correctAnswer`).classList.remove(`correctAnswer`);

  if (!answerCorrectly) {
    document.querySelector(`#incorrectAnswer`).removeAttribute(`id`);
  }
}

function resetTriviaBtns() {
  answerBtns.forEach(function (btn) {
    btn.disabled = false;
    btn.style.display = `none`;
  });

  toggleTriviaDifficultyBtns(true);
}

export function renderTriviaCorrectAnswer() {
  document.querySelector(".correctAnswer").style.backgroundColor = `green`;
  triviaModalHeading.textContent = `Correct Answer!`;
  triviaModalHeading.style.color = `green`;
}

export function renderTriviaIncorrectAnswer(event) {
  document.querySelector(".correctAnswer").style.backgroundColor = `green`;
  event.target.id = `incorrectAnswer`;

  triviaModalHeading.textContent = `Wrong Answer...`;
  triviaModalHeading.style.color = `red`;
}
