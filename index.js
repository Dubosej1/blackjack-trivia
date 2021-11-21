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

/////////////////////////////////////////////
////////// Variables
////////////////////////////////////////////

////////// Blackjack Section Game Logic Variables //////////
let bank, betAmount, playerHandTotal, dealerHandTotal;
let insuranceBetPlaced, insuranceStopGameGuard, insuranceAlreadyChecked;
let playerTimer, dealerTimer, gameTimer, playerCurrentAction;
let splitMode,
  splitBetAmount,
  playerSplitHandTotal,
  currentPlayerHand,
  hand2PassNeeded;
let playerHand = [];
let playerSplitHand = [];
let dealerHand = [];
// let deckID = "0x";
// Testing Deck ID
let deckID = "fggxsqn8nt24";
let endGameBtnPressed = false;

////////// Trivia Section Game Logic Variables //////////
let easyQuestions, mediumQuestions, hardQuestions, correctAnswer;
let easy = `easy`,
  medium = `medium`,
  hard = `hard`;
let currentTriviaDifficulty;
let easyCurrentIndex = 0,
  mediumCurrentIndex = 0,
  hardCurrentIndex = 0;

////////// Test cards //////////
// Dealer card for testing Insurance mode logic
const dealerInsTestCard = {
  code: "AH",
  image: `https://deckofcardsapi.com/static/img/AH.png`,
  images: {
    svg: "https://deckofcardsapi.com/static/img/7H.svg",
    png: "https://deckofcardsapi.com/static/img/7H.png",
  },
  suit: "HEARTS",
  value: "ACE",
};

// Player cards for testing Split mode logic
const playerSplitTestCard1 = {
  code: "7S",
  image: `https://deckofcardsapi.com/static/img/7S.png`,
  images: {
    svg: "https://deckofcardsapi.com/static/img/7S.svg",
    png: "https://deckofcardsapi.com/static/img/7S.png",
  },
  suit: "SPADES",
  value: "7",
};

const playerSplitTestCard2 = {
  code: "7H",
  image: `https://deckofcardsapi.com/static/img/7H.png`,
  images: {
    svg: "https://deckofcardsapi.com/static/img/7H.svg",
    png: "https://deckofcardsapi.com/static/img/7H.png",
  },
  suit: "HEARTS",
  value: "7",
};

/////////////////////////////////////////////
////////// Game Buttons Functionality
////////////////////////////////////////////

////////// Main Game Buttons //////////
newGameBtn.addEventListener("click", startNewGame);

endGameBtn.addEventListener("click", function () {
  endGameBtnPressed = true;
  endGameBtn.style.display = `none`;
  endRoundClearUI();
});

submitBetBtn.addEventListener("click", submitBet);
submitBetBtn.style.display = "none";

////////// Blackjack Section Game Buttons //////////
dealCardsBtn.addEventListener("click", initialDeal);

hitBtn.addEventListener("click", function () {
  doubleDownBtn.style.display = "none";
  hitBtn.style.display = "none";
  standBtn.style.display = "none";
  insuranceBtn.style.display = "none";
  splitBtn.style.display = "none";

  selectTriviaQuestion();
});

standBtn.addEventListener("click", standAction);

doubleDownBtn.addEventListener("click", function () {
  playerCurrentAction = "doubleDown";
  bank = bank - betAmount;
  betAmount = betAmount * 2;
  bankUI.textContent = bank;
  betAmountUI.textContent = betAmount;
  noticeUI.textContent = `Player doubles down...`;
  doubleDownBtn.style.display = "none";
  hitBtn.style.display = "none";
  standBtn.style.display = "none";
  insuranceBtn.style.display = "none";
  splitBtn.style.display = "none";
  selectTriviaQuestion();
});

splitBtn.addEventListener("click", splitPlayerHand);

insuranceBtn.addEventListener("click", insuranceAction);

////////// Trivia Section Game Buttons //////////

// Trivia Difficulty Btns
easyDifficultyBtn.addEventListener("click", function () {
  if (easyCurrentIndex == 10) {
    easyCurrentIndex = 0;
    easyQuestions.splice(0);
    generateTriviaQuestions(easy).then((questions) => {
      easyQuestions = questions;
    });
  }
  askTriviaQuestion(easyQuestions, easyCurrentIndex);
  easyCurrentIndex++;
});

mediumDifficultyBtn.addEventListener("click", function () {
  if (mediumCurrentIndex == 10) {
    mediumCurrentIndex = 0;
    mediumQuestions.splice(0);
    generateTriviaQuestions(medium).then((questions) => {
      mediumQuestions = questions;
    });
  }
  askTriviaQuestion(mediumQuestions, mediumCurrentIndex);
  mediumCurrentIndex++;
});

hardDifficultyBtn.addEventListener("click", function () {
  if (hardCurrentIndex == 10) {
    hardCurrentIndex = 0;
    hardQuestions.splice(0);
    generateTriviaQuestions(hard).then((questions) => {
      hardQuestions = questions;
    });
  }
  askTriviaQuestion(hardQuestions, hardCurrentIndex);
  hardCurrentIndex++;
});

// Multiple Choice Answer Btns
answerABtn.addEventListener("click", determineCorrectAnswer);
answerBBtn.addEventListener("click", determineCorrectAnswer);
answerCBtn.addEventListener("click", determineCorrectAnswer);
answerDBtn.addEventListener("click", determineCorrectAnswer);

// Boolean Choice Answer Btns
answerTrueBtn.addEventListener("click", determineCorrectAnswer);
answerFalseBtn.addEventListener("click", determineCorrectAnswer);

/////////////////////////////////////////////
////////// Starting Game Logic
////////////////////////////////////////////

function startNewGame() {
  bank = 1000;
  bankUI.textContent = bank;

  newGameBtn.style.display = `none`;
  endGameBtn.style.display = `inline-block`;

  generateTriviaQuestions(easy).then((questions) => {
    easyQuestions = questions;
  });
  generateTriviaQuestions(medium).then((questions) => {
    mediumQuestions = questions;
  });
  generateTriviaQuestions(hard).then((questions) => {
    hardQuestions = questions;
  });

  if (deckID == "0x") {
    const getNewDeckID = function () {
      return fetch(`https://deckofcardsapi.com/api/deck/new`)
        .then(
          function (response) {
            return response.json();
          },
          (err) => alert(err)
        )
        .then(function (data) {
          deckID = data.deck_id;
          console.log(deckID);
          return deckID;
        })
        .catch(function (err) {
          alert(err);
        });
    };

    deckID = getNewDeckID();
  }

  startNewRound();
}

function startNewRound() {
  noticeUI.textContent = "Place an amount to bet";
  submitBetBtn.style.display = "inline";
}

function submitBet() {
  if (playerCurrentAction == `insurance`) {
    insuranceBetAmount = Math.round(Number(betValueField.value));
    if (insuranceBetAmount > betAmount / 2 || insuranceBetAmount > bank) {
      insuranceBetAmount = 0;
      noticeUI.textContent = `Invalid Insurance Bet.  Please try again.`;
      betValueField.value = null;
      return;
    }

    submitBetBtn.style.display = "none";
    insuranceBetAmountUI.textContent = insuranceBetAmount;
    betValueField.value = null;
    insuranceLogic(insuranceBetAmount);
  } else {
    betAmount = Math.round(Number(betValueField.value));

    if (betAmount > bank) {
      betAmount = 0;
      noticeUI.textContent = `Invalid Bet.  Please try again.`;
      betValueField.value = null;
      return;
    }
    submitBetBtn.style.display = "none";
    noticeUI.textContent = `Bet Placed.  Deal cards to continue...`;

    betValueField.value = null;
    bank = bank - betAmount;
    bankUI.textContent = bank;
    betAmountUI.textContent = betAmount;

    dealCardsBtn.style.display = "inline-block";
  }
}

/////////////////////////////////////////////
////////// Dealing Cards Logic
////////////////////////////////////////////

function initialDeal() {
  dealCardsBtn.style.display = "none";
  shuffleCards(deckID);

  dealDealerCards(deckID);
  dealPlayerCards(deckID);

  hitBtn.style.display = "inline-block";
  standBtn.style.display = "inline-block";
  doubleDownBtn.style.display = "inline-block";

  noticeUI.textContent = `Player's Turn...`;
}

function dealPlayerCards(deckID) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      playerHand.push(cardsObj.card1);
      playerHand.push(cardsObj.card2);

      //Test Split Cards
      // playerHand.push(playerSplitTestCard1);
      // playerHand.push(playerSplitTestCard2);

      console.log(`dealPlayerCards`);
      console.log(playerHand);
      return playerHand;
    })
    .then(function (playerHand) {
      updatePlayerUI(playerHand);
    })
    .catch((err) => dealPlayerCards(deckID))
    .finally(function () {
      checkValidSplit();
      checkValidInsurance();
    });
}

function dealDealerCards(deckID) {
  drawCards(deckID, 2)
    .then(function (cardsObj) {
      dealerHand.push(cardsObj.card1);
      dealerHand.push(cardsObj.card2);

      //To test Insurance functionality (substitute card2)
      // dealerHand.push(dealerInsTestCard);

      return dealerHand;
    })
    .then(function (dealerHand) {
      updateDealerUI(dealerHand, true);
    })
    .catch((err) => dealDealerCards(deckID));
}

function shuffleCards(deckID) {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {})
    .catch((err) => shuffleCards(deckID));
}

/////////////////////////////////////////////
////////// Drawing Cards Logic
////////////////////////////////////////////

function drawCards(deckID, count) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`
  )
    .then(
      function (response) {
        return response.json();
      },
      (err) => alert(err)
    )
    .then(function (data) {
      let [card1, card2] = data.cards;
      let playerCards = {
        card1: card1,
        card2: card2,
        remaining: data.remaining,
      };

      return playerCards;
    })
    .catch(function (err) {
      drawCards(deckID, 2);
    });
}

function drawSingleCard(deckID) {
  return fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let cardData = data.cards;
      let card = {
        value: cardData[0].value,
        code: cardData[0].code,
        image: cardData[0].image,
        remaining: data.remaining,
      };

      return card;
    })
    .catch((err) => {
      cardData = null;
      card = null;
      drawSingleCard(deckID);
    });
}

/////////////////////////////////////////////
////////// Base Blackjack Player Actions
////////////////////////////////////////////

function hitAction() {
  if (splitMode) {
    hand2PassNeeded = false;
    if (currentPlayerHand == 1) {
      playerHit(deckID, playerHand);
      return;
    } else {
      playerHit(deckID, playerSplitHand);
      return;
    }
  }
  playerHit(deckID, playerHand);
}

function standAction() {
  playerCurrentAction = "stand";

  if (splitMode && currentPlayerHand == 1) {
    currentPlayerHand = 2;
    noticeUI.textContent = `Please play 2nd split hand`;
    hitBtn.style.display = "inline-block";
    standBtn.style.display = "inline-block";
    return;
  }
  hitBtn.style.display = "none";
  standBtn.style.display = "none";
  doubleDownBtn.style.display = "none";
  splitBtn.style.display = "none";
  insuranceBtn.style.display = "none";
  noticeUI.textContent = `Dealer's turn...`;
  dealerTimer = setTimeout(dealerTurn, 3000);
}

function playerHit(deckID, arr) {
  drawSingleCard(deckID)
    .then(function (cardsObj) {
      arr.push(cardsObj);
      return arr;
    })
    .then(function (arr) {
      if (splitMode) {
        if (currentPlayerHand == 1) updatePlayerUI(arr, playerSplitHand);
        if (currentPlayerHand == 2 && !hand2PassNeeded)
          updatePlayerUI(playerHand, arr);
        return;
      }
      updatePlayerUI(arr);
    })
    .catch((err) => drawSingleCard(deckID))
    .finally(() => {
      if (playerCurrentAction == "doubleDown" && playerHandTotal < 21) {
        noticeUI.textContent = `Dealer's Turn...`;
        dealerTimer = setTimeout(dealerTurn, 3000);
      }
      checkBust();
      checkFiveCardCharlie();
    });
}

/////////////////////////////////////////////
////////// Main Blackjack Logic
////////////////////////////////////////////

function updatePlayerUI(arr, arr2 = null) {
  let card1UI = [];
  let cards1Value = [];

  let card2UI = [];
  let cards2Value = [];

  for (let card of arr) {
    let imgTag = `<img src='${card.image}' class='card'>`;

    card1UI.push(imgTag);
    cards1Value.push(card.value);
  }

  if (splitMode) {
    for (let card of arr2) {
      let imgTag = `<img src='${card.image}' class='card'>`;

      card2UI.push(imgTag);
      cards2Value.push(card.value);
    }

    playerSplitHandTotal = getPlayerValue(cards2Value);

    playerSplitHandTotalUI.textContent = playerSplitHandTotal;
    playerSplitHandUI.innerHTML = card2UI.join();
  }

  playerHandTotal = getPlayerValue(cards1Value);

  playerHandTotalUI.textContent = playerHandTotal;
  playerHandUI.innerHTML = card1UI.join();

  if (playerHand.length == 2 || playerSplitHand.length == 2) {
    checkNaturalBlackjack();
  }
}

function updateDealerUI(dealerHand, gameActive) {
  let cardUI = [];
  let cardsValue = [];
  let cardsValueUI = [];
  let visibleDealerHandTotal;

  dealerHand.forEach((card, index) => {
    let imgTag;
    if (index == 0) {
      if (gameActive) {
        imgTag = `<img src='img/playing-card-back.svg' class='card'>`;
      } else {
        imgTag = `<img src='${card.image}' class='card'>`;
        cardsValueUI.push(card.value);
      }
    } else {
      imgTag = `<img src='${card.image}' class='card'>`;
      cardsValueUI.push(card.value);
    }

    cardUI.push(imgTag);
    cardsValue.push(card.value);
  });

  visibleDealerHandTotal = getPlayerValue(cardsValueUI);
  dealerHandTotal = getPlayerValue(cardsValue);

  dealerHandTotalUI.textContent = visibleDealerHandTotal;
  dealerHandUI.innerHTML = cardUI.join();

  checkFiveCardCharlie();
}

function getCardValue(value) {
  let num;

  switch (value) {
    case "JACK":
      num = 10;
      break;
    case "QUEEN":
      num = 10;
      break;
    case "KING":
      num = 10;
      break;
    case "ACE":
      num = 11;
      break;
    case "ACELOW":
      num = 1;
      break;
    default:
      num = Number(value);
  }

  return num;
}

function getPlayerValue(arr) {
  let numberArr = arr.map(getCardValue);

  let total = numberArr.reduce((acc, cur) => acc + cur);

  if (total > 21 && arr.includes("ACE")) {
    let index = arr.indexOf("ACE");
    arr[index] = "ACELOW";
    total = getPlayerValue(arr);
  }

  return total;
}

function checkNaturalBlackjack() {
  if (splitMode) {
    if (currentPlayerHand == 1 && playerHandTotal == 21) {
      hand2PassNeeded = true;
      currentPlayerHand = 2;
    } else if (currentPlayerHand == 2 && playerSplitHandTotal == 21) {
      dealerTurn();
    }
  } else {
    if (playerHandTotal == 21) endRound();
  }
}

function checkBust() {
  if (splitMode) {
    switch (true) {
      case currentPlayerHand == 1 && playerHandTotal > 21:
        hand2PassNeeded = true;
        currentPlayerHand = 2;
        noticeUI.textContent = `Hand 1 busts...Please play Hand 2.`;
        hitBtn.style.display = "inline-block";
        standBtn.style.display = "inline-block";
        break;
      case currentPlayerHand == 2 &&
        playerHandTotal > 21 &&
        playerSplitHandTotal > 21:
        endRound();
        break;
      case currentPlayerHand == 2 && playerSplitHandTotal > 21:
        noticeUI.textContent = `Dealer's Turn...`;
        dealerTimer = setTimeout(dealerTurn, 3000);
        break;
      default:
        noticeUI.textContent = `Player's Turn...`;
        hitBtn.style.display = "inline-block";
        standBtn.style.display = "inline-block";
    }
  } else if (playerHandTotal > 21) {
    endRound();
  } else if (playerHandTotal <= 21 || playerSplitHandTotal <= 21) {
    noticeUI.textContent = `Player's Turn...`;
    hitBtn.style.display = "inline-block";
    standBtn.style.display = "inline-block";
  }
}

function checkFiveCardCharlie() {
  if (dealerHandTotal > 21 || playerHandTotal > 21) return;
  if (splitMode) {
    if (currentPlayerHand == 1 && playerHand.length == 5) {
      hand2PassNeeded = true;
      playerHandTotal = 100;
      playerHandTotalUI.textContent = ``;
      currentPlayerHand = 2;
    } else if (currentPlayerHand == 2 && playerSplitHand.length == 5) {
      playerSplitHandTotal = 100;
      playerSplitHandTotalUI.textContent = ``;
      endRound();
    }
  } else if (playerHand.length == 5) {
    playerHandTotal = 100;
    playerHandTotalUI.textContent = ``;
    endRound();
  } else if (dealerHand.length == 5) {
    dealerHandTotal = 100;
    dealerHandTotalUI.textContent = ``;
  }
}

/////////////////////////////////////////////
////////// Split Mode Logic
////////////////////////////////////////////

function checkValidSplit() {
  let card1 = playerHand[0].value;
  let card2 = playerHand[1].value;

  if (card1 == card2) {
    splitBtn.style.display = "inline-block";
  }
}

function splitPlayerHand() {
  let errorState = false;
  if (!errorState) {
    splitMode = true;
    splitBtn.style.display = "none";
    doubleDownBtn.style.display = "none";
    insuranceBtn.style.display = "none";
    playerHandLabel.textContent = `Hand 1 `;
    noticeUI.textContent = `Please play Hand 1`;

    let poppedCard = playerHand.pop();

    playerSplitHand.push(poppedCard);
  }

  drawCards(deckID, 2)
    .then(function (cardsObj) {
      playerHand.push(cardsObj.card1);
      playerSplitHand.push(cardsObj.card2);

      return playerHand;
    })
    .then(function (playerHand) {
      updatePlayerUI(playerHand, playerSplitHand);
    })
    .catch((err) => {
      splitPlayerHand();
    });

  splitBetAmount = betAmount;
  bank = bank - splitBetAmount;
  bankUI.textContent = bank;
  splitBetAmountUI.textContent = splitBetAmount;

  currentPlayerHand = 1;
}

/////////////////////////////////////////////
////////// Insurance Mode Logic
////////////////////////////////////////////

function insuranceAction() {
  playerCurrentAction = `insurance`;
  hitBtn.style.display = "none";
  doubleDownBtn.style.display = "none";
  standBtn.style.display = "none";
  splitBtn.style.display = "none";
  insuranceBtn.style.display = "none";
  submitBetBtn.style.display = "inline";

  noticeUI.textContent = `Please submit an amount up to half your original bet`;
}

function checkValidInsurance() {
  insuranceAlreadyChecked = true;

  if (dealerHand[1].value == "ACE" && bank >= 1 && betAmount >= 2) {
    insuranceBtn.style.display = "inline-block";
  }

  insuranceStopGameGuard = true;
}

function insuranceLogic(insuranceBet) {
  if (dealerHand[1].value == "ACE" && dealerHandTotal == 21) {
    insuranceBetPlaced = true;
    insuranceStopGameGuard = false;
    bank = bank + insuranceBet * 2;
    endRound();
    return;
  }

  bank = bank - insuranceBet;
  bankUI.textContent = bank;
  noticeUI.textContent = `Lost Insurance Bet.  Player's Turn.`;

  hitBtn.style.display = "inline-block";
  standBtn.style.display = "inline-block";
  doubleDownBtn.style.display = "inline-block";
  checkValidSplit();

  insuranceStopGameGuard = false;
}

/////////////////////////////////////////////
////////// Dealer Actions
////////////////////////////////////////////

function dealerTurn() {
  hitBtn.style.display = "none";
  standBtn.style.display = "none";
  doubleDownBtn.style.display = "none";

  if (dealerHandTotal <= 16) {
    noticeUI.textContent = `Dealer Hits...`;
    dealerHit(deckID);
    dealerTimer = setTimeout(dealerTurn, 3000);
    return;
  } else {
    noticeUI.textContent = `Dealer's Turn Ends...`;
    dealerTimer = setTimeout(endRound, 3000);
    return;
  }
}

function dealerHit(deckID) {
  drawSingleCard(deckID)
    .then(function (cardsObj) {
      dealerHand.push(cardsObj);
      return dealerHand;
    })
    .then(function (dealerHand) {
      updateDealerUI(dealerHand, true);
    })
    .catch((err) => {
      drawSingleCard(deckID);
    });
}

/////////////////////////////////////////////
////////// Trivia Section Logic
////////////////////////////////////////////

function generateTriviaQuestions(difficulty) {
  return fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}`)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      let questions = [];
      console.log(data);
      let tempArr = data.results;
      let mapping = {
        category: `category`,
        correct_answer: "correctAnswer",
        difficulty: `difficulty`,
        incorrect_answers: `incorrectAnswers`,
        question: `question`,
        type: `type`,
      };

      for (let obj of tempArr) {
        let question = Object.keys(obj).reduce((acc, key) => {
          acc[mapping[key]] = obj[key];
          return acc;
        }, {});
        questions.push(question);
      }
      return questions;
    })
    .catch(function (err) {
      alert(err);
    });
}

function selectTriviaQuestion() {
  noticeUI.textContent = ` `;
  triviaModal.style.display = `block`;
}

function askTriviaQuestion(questions, questionIndex) {
  let answers = [];
  correctAnswer = questions[questionIndex].correctAnswer;
  let questionType = questions[questionIndex].type;
  currentTriviaDifficulty = questions[questionIndex].difficulty;

  console.log(questionType);

  triviaDifficultyBtns.forEach(function (btn) {
    btn.style.display = "none";
  });

  triviaLabelContainer.style.display = `flex`;

  categoryTriviaUI.textContent = questions[questionIndex].category;
  difficultyTriviaUI.textContent = questions[questionIndex].difficulty;
  questionTriviaUI.innerHTML = questions[questionIndex].question;

  if (questionType == `multiple`) {
    multipleChoiceQuiz(questions, questionIndex);
  } else {
    booleanChoiceQuiz(questions, questionIndex);
  }

  function multipleChoiceQuiz(questions, questionIndex) {
    questions[questionIndex].incorrectAnswers.forEach((ans) =>
      answers.push(ans)
    );
    answers.push(correctAnswer);

    console.log(`Before Shuffle: ${answers}`);

    shuffleArray(answers);

    console.log(`After Shuffle: ${answers}`);

    answerABtn.setAttribute(`data-ans`, answers[0]);
    answerBBtn.setAttribute(`data-ans`, answers[1]);
    answerCBtn.setAttribute(`data-ans`, answers[2]);
    answerDBtn.setAttribute(`data-ans`, answers[3]);

    choiceATriviaUI.innerHTML = answers[0];
    choiceBTriviaUI.innerHTML = answers[1];
    choiceCTriviaUI.innerHTML = answers[2];
    choiceDTriviaUI.innerHTML = answers[3];

    multipleChoiceAnswerBtns.forEach(function (btn) {
      let answer = btn.getAttribute("data-ans");
      if (answer == correctAnswer) {
        btn.classList.add("correctAnswer");
      }

      btn.style.display = `inline-block`;
    });

    multipleChoiceAnswerField.style.display = `flex`;
  }

  function booleanChoiceQuiz(questions, questionIndex) {
    if (correctAnswer == `True`) {
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

function determineCorrectAnswer(e) {
  answerBtns.forEach(function (btn) {
    btn.disabled = true;
  });

  let selectedAnswer = this.getAttribute("data-ans");
  triviaCorrectAnswerField.style.display = `inline-block`;
  correctAnswerTriviaUI.innerHTML = correctAnswer;

  if (selectedAnswer == correctAnswer) {
    let answerCorrectly = true;
    document.querySelector(".correctAnswer").style.backgroundColor = `green`;
    triviaModalHeading.textContent = `Correct Answer!`;
    triviaModalHeading.style.color = `green`;

    if (playerCurrentAction == `doubleDown`) {
      noticeUI.textContent = `Player Doubles Down...`;
    }

    determineTriviaScore();
    bankUI.textContent = bank;
    gameTimer = setTimeout(function () {
      clearTriviaUI(answerCorrectly);
    }, 4000);
    playerTimer = setTimeout(hitAction, 5000);
  } else {
    let answerCorrectly = false;

    document.querySelector(".correctAnswer").style.backgroundColor = `green`;
    this.id = `incorrectAnswer`;

    triviaModalHeading.textContent = `Wrong Answer...`;
    triviaModalHeading.style.color = `red`;
    gameTimer = setTimeout(function () {
      clearTriviaUI(answerCorrectly);
    }, 4000);
    playerTimer = setTimeout(standAction, 5000);
  }

  function determineTriviaScore() {
    switch (currentTriviaDifficulty) {
      case `easy`:
        bank = Math.round(bank + betAmount * 0.25);
        break;
      case `medium`:
        bank = Math.round(bank + betAmount * 0.5);
        break;
      case `hard`:
        bank = Math.round(bank + betAmount * 0.75);
        break;
      default:
        console.log(`invalid trivia difficulty`);
    }
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function clearTriviaUI(answerCorrectly) {
  categoryTriviaUI.textContent = ``;
  difficultyTriviaUI.textContent = ``;
  questionTriviaUI.innerHTML = ``;
  choiceATriviaUI.innerHTML = ``;
  choiceBTriviaUI.innerHTML = ``;
  choiceCTriviaUI.innerHTML = ``;
  choiceDTriviaUI.innerHTML = ``;
  correctAnswerTriviaUI.innerHTML = ` `;

  answerABtn.removeAttribute(`data-ans`);
  answerBBtn.removeAttribute(`data-ans`);
  answerCBtn.removeAttribute(`data-ans`);
  answerDBtn.removeAttribute(`data-ans`);
  correctAnswer = ``;
  currentTriviaDifficulty = ``;

  document.querySelector(".correctAnswer").style.backgroundColor = `grey`;
  document.querySelector(`.correctAnswer`).classList.remove(`correctAnswer`);

  if (!answerCorrectly) {
    document.querySelector(`#incorrectAnswer`).removeAttribute(`id`);
  }
  triviaModal.style.display = `none`;

  answerBtns.forEach(function (btn) {
    btn.disabled = false;
    btn.style.display = `none`;
  });

  triviaDifficultyBtns.forEach(function (btn) {
    btn.style.display = `inline-block`;
  });
  triviaLabelContainer.style.display = `none`;
  triviaCorrectAnswerField.style.display = `none`;
  multipleChoiceAnswerField.style.display = `none`;
  triviaModalHeading.textContent = `Hit Trivia Question`;
  triviaModalHeading.style.color = `black`;
  questionTriviaUI.textContent = `Select Trivia Difficulty`;
}

/////////////////////////////////////////////
////////// End Round Sequence
////////////////////////////////////////////

function chooseWinner(playerHandTotal, betAmount) {
  let outcomeNoticeText;

  switch (true) {
    case playerHandTotal == 100:
      outcomeNoticeText = `Player Wins!  Five Card Charlie!`;
      break;
    case dealerHandTotal == 100:
      outcomeNoticeText = `Player Loses.  Dealer Five Card Charlie...`;
      break;
    case playerHandTotal > 21:
      outcomeNoticeText = `Player loses. Bust...`;
      break;
    case dealerHandTotal > 21:
      outcomeNoticeText = `Player Wins!  Dealer busts...`;
      bank = bank + betAmount * 2;
      break;
    case dealerHandTotal == 21 && playerHandTotal == 21 && !insuranceBetPlaced:
      outcomeNoticeText = `Push.  Both players have blackjack`;
      bank = bank + betAmount;
      break;
    case dealerHandTotal == 21 && playerHandTotal == 21 && insuranceBetPlaced:
      outcomeNoticeText = `Push.  Both players have blackjack. Player wins insurance bet.`;
      bank = bank + betAmount;
      break;
    case playerHandTotal == 21:
      outcomeNoticeText = `Player Wins.  Blackjack!`;
      bank = bank + betAmount * 2 + Math.round(betAmount / 2);
      break;
    case dealerHandTotal == 21 && !insuranceBetPlaced:
      outcomeNoticeText = `Player Loses.  Dealer Blackjack.`;
      break;
    case dealerHandTotal == 21 && insuranceBetPlaced:
      outcomeNoticeText = `Dealer Blackjack.  Player wins insurance bet only.`;
      break;
    case dealerHandTotal > playerHandTotal:
      outcomeNoticeText = `Dealer Wins.`;
      break;
    case dealerHandTotal == playerHandTotal:
      outcomeNoticeText = `Push.`;
      bank = bank + betAmount;
      break;
    default:
      outcomeNoticeText = `Player Wins!`;
      bank = bank + betAmount * 2;
      break;
  }

  let player = { gameOutcome: outcomeNoticeText, betAmount: betAmount };

  return player;
}

function gameOutcomeUI(hand1, hand2 = null) {
  bankUI.textContent = bank;

  if (splitMode) {
    noticeUI.innerHTML = `Hand 1: ${hand1.gameOutcome}<br>Hand 2: ${hand2.gameOutcome}`;
    betAmountUI.textContent = hand1.betAmount;
    splitBetAmountUI.textContent = hand2.betAmount;
  } else {
    noticeUI.textContent = hand1.gameOutcome;
    betAmountUI.textContent = hand1.betAmount;
  }
}

function endRound() {
  updateDealerUI(dealerHand, false);

  if (splitMode) {
    let playerSplitHand1 = chooseWinner(playerHandTotal, betAmount);
    let playerSplitHand2 = chooseWinner(playerSplitHandTotal, splitBetAmount);

    gameOutcomeUI(playerSplitHand1, playerSplitHand2);

    gameTimer = setTimeout(endRoundClearUI, 5000);
    return;
  }

  let playerSplitHand1 = chooseWinner(playerHandTotal, betAmount);
  gameOutcomeUI(playerSplitHand1);
  gameTimer = setTimeout(endRoundClearUI, 5000);
}

function endRoundClearUI() {
  betAmountUI.textContent = ``;
  splitBetAmountUI.textContent = ``;
  insuranceBetAmountUI.textContent = ``;
  dealerHandUI.textContent = ``;
  dealerHandTotalUI.textContent = ``;
  playerHandUI.textContent = `---`;
  playerHandTotalUI.textContent = ``;
  playerSplitHandUI.textContent = ``;
  playerSplitHandTotalUI.textContent = ``;
  playerHandLabel.textContent = `Player `;

  betAmount = 0;
  playerHandTotal = 0;
  dealerHandTotal = 0;
  insuranceBetPlaced = false;
  insuranceStopGuard = true;
  insuranceAlreadyChecked = false;
  playerCurrentAction = ``;
  splitMode = false;
  splitBetAmount = 0;
  playerSplitHandTotal = 0;
  currentPlayerHand = 1;
  hand2PassNeeded = false;

  playerHand.splice(0);
  playerSplitHand.splice(0);
  dealerHand.splice(0);

  if (endGameBtnPressed == true) {
    noticeUI.textContent = `Game Ended.  Select New Game...`;

    newGameBtn.style.display = `inline-block`;
    dealCardsBtn.style.display = `none`;
    submitBetBtn.style.display = `none`;
    hitBtn.style.display = `none`;
    standBtn.style.display = `none`;
    doubleDownBtn.style.display = `none`;
    splitBtn.style.display = `none`;
    insuranceBtn.style.display = `none`;

    bank = 0;
    bankUI.textContent = bank;
    endGameBtnPressed = false;
  } else startNextRound();
}

function startNextRound() {
  if (bank > 0) {
    noticeUI.textContent = "Place an amount to bet";
    submitBetBtn.style.display = "inline";
  } else {
    noticeUI.textContent = `No more money.  Game Over...`;
    endGameBtn.style.display = `none`;
    newGameBtn.style.display = `inline-block`;
  }
}
