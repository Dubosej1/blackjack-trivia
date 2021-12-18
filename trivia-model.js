import { executePlayerHit, updateModelBank } from "./blackjack-model.js";
import { updateTriviaResult, updateTriviaQuestions } from "./controller.js";

let easyQuestions, mediumQuestions, hardQuestions, correctAnswer;
let easy = `easy`,
  medium = `medium`,
  hard = `hard`;
let currentTriviaDifficulty;
let easyCurrentIndex = 0,
  mediumCurrentIndex = 0,
  hardCurrentIndex = 0;

export function generateTriviaQuestions() {
  fetchTriviaQuestions(easy).then((questions) => {
    easyQuestions = questions;
  });
  fetchTriviaQuestions(medium).then((questions) => {
    mediumQuestions = questions;
  });
  fetchTriviaQuestions(hard).then((questions) => {
    hardQuestions = questions;
  });
}

// export function regenerateTriviaQuestions(difficulty) {
//   switch (difficulty) {
//     case `easy`:
//       fetchTriviaQuestions(easy).then((questions) => {
//         easyQuestions = questions;
//       })
//       .finally(function () {
//         askTriviaQuestion(easyQuestions, easyCurrentIndex);
//         easyCurrentIndex++;
//       });
//       break;
//     case `medium`:
//       generateTriviaQuestions(medium).then((questions) => {
//         mediumQuestions = questions;
//       })
//     }
//     askTriviaQuestion(mediumQuestions, mediumCurrentIndex);
//     mediumCurrentIndex++;

//   }

//   fetchTriviaQuestions(medium).then((questions) => {
//     mediumQuestions = questions;
//   });
//   fetchTriviaQuestions(hard).then((questions) => {
//     hardQuestions = questions;
//   });
// }

const fetchTriviaQuestions = function (difficulty) {
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
};

export function selectTriviaDifficulty(difficulty) {
  switch (difficulty) {
    case `easy`:
      askTriviaQuestion(easyQuestions, easyCurrentIndex);
      easyCurrentIndex++;

      if (easyCurrentIndex == 10) {
        easyCurrentIndex = 0;
        easyQuestions.splice(0);
        fetchTriviaQuestions(easy).then((questions) => {
          easyQuestions = questions;
        });
      }

      break;
    case `medium`:
      askTriviaQuestion(mediumQuestions, mediumCurrentIndex);
      mediumCurrentIndex++;

      if (mediumCurrentIndex == 10) {
        mediumCurrentIndex = 0;
        mediumQuestions.splice(0);
        fetchTriviaQuestions(medium).then((questions) => {
          mediumQuestions = questions;
        });
      }

      break;
    case `hard`:
      askTriviaQuestion(hardQuestions, hardCurrentIndex);
      hardCurrentIndex++;

      if (hardCurrentIndex == 10) {
        hardCurrentIndex = 0;
        hardQuestions.splice(0);
        fetchTriviaQuestions(hard).then((questions) => {
          hardQuestions = questions;
        });
      }

      break;
    default:
      askTriviaQuestion(easyQuestions, easyCurrentIndex);
  }
}

function askTriviaQuestion(questions, questionIndex) {
  let questionObj = {
    question: questions[questionIndex].question,
    difficulty: questions[questionIndex].difficulty,
    category: questions[questionIndex].category,
    type: questions[questionIndex].type,
    correctAnswer: questions[questionIndex].correctAnswer,
    incorrectAnswers: questions[questionIndex].incorrectAnswers,
  };

  let answers = [];
  const { type, incorrectAnswers } = questionObj;
  correctAnswer = questionObj.correctAnswer;
  currentTriviaDifficulty = questionObj.difficulty;

  if (type == `multiple`)
    shuffleMultipleChoiceAnswers(incorrectAnswers, correctAnswer);

  updateTriviaQuestions(questionObj);

  // console.log(questionType);

  function shuffleMultipleChoiceAnswers(incorrectAnswers, correctAnswer) {
    incorrectAnswers.forEach((ans) => answers.push(ans));
    answers.push(correctAnswer);

    console.log(`Before Shuffle: ${answers}`);

    questionObj.multipleChoiceAnswersArr = shuffleArray(answers);

    console.log(`After Shuffle: ${answers}`);

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }

      return arr;
    }
  }
}

export function determineCorrectAnswer(state, event) {
  let { selectedAnswer, correctAnswer } = state.triviaData;
  let { bank, betAmount } = state;

  if (selectedAnswer == correctAnswer) {
    let answerCorrectly = true;
    determineTriviaScore();
    updateTriviaResult(answerCorrectly, bank, event);
    let playerTimer = setTimeout(function () {
      executePlayerHit();
    }, 5000);
  } else {
    let answerCorrectly = false;
    updateTriviaResult(answerCorrectly, bank, event);
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

    updateModelBank(bank);
  }
}