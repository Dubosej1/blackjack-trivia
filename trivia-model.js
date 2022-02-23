export const triviaObj = {
  easyCurrentIndex: 0,
  mediumCurrentIndex: 0,
  hardCurrentIndex: 0,
  credits: 10,

  generateTriviaQuestions() {
    if (this.easyQuestions) return;

    this.fetchTriviaQuestions(`easy`).then((questions) => {
      this.easyQuestions = questions;
    });

    this.fetchTriviaQuestions(`medium`).then((questions) => {
      this.mediumQuestions = questions;
    });

    this.fetchTriviaQuestions(`hard`).then((questions) => {
      this.hardQuestions = questions;
    });
  },

  fetchTriviaQuestions(difficulty) {
    return fetch(
      `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let questions = [];
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
          question.difficulty = capitalizeFirstLetter(question.difficulty);
          let questionObj = new TriviaQuestion(question);

          questions.push(questionObj);
        }
        return questions;
      })
      .catch(function (err) {
        alert(err);
      });

    function capitalizeFirstLetter([first, ...rest]) {
      return first.toUpperCase() + rest.join(``);
    }
  },

  selectTriviaDifficulty(difficulty) {
    switch (difficulty) {
      case `easy`:
        this.updateActiveTriviaQuestion(
          this.easyQuestions,
          this.easyCurrentIndex
        );
        this.easyCurrentIndex++;

        if (this.easyCurrentIndex == 10) {
          this.easyCurrentIndex = 0;
          this.easyQuestions.splice(0);
          this.fetchTriviaQuestions(easy).then((questions) => {
            this.easyQuestions = questions;
          });
        }

        break;
      case `medium`:
        this.updateActiveTriviaQuestion(
          this.mediumQuestions,
          this.mediumCurrentIndex
        );
        this.mediumCurrentIndex++;

        if (this.mediumCurrentIndex == 10) {
          this.mediumCurrentIndex = 0;
          this.mediumQuestions.splice(0);
          this.fetchTriviaQuestions(easy).then((questions) => {
            this.mediumQuestions = questions;
          });
        }

        break;
      case `hard`:
        this.updateActiveTriviaQuestion(
          this.hardQuestions,
          this.hardCurrentIndex
        );
        this.hardCurrentIndex++;

        if (this.hardCurrentIndex == 10) {
          this.hardCurrentIndex = 0;
          this.hardQuestions.splice(0);
          this.fetchTriviaQuestions(easy).then((questions) => {
            this.hardQuestions = questions;
          });
        }

        break;
      default:
        updateActiveTriviaQuestion(this.easyQuestions, this.easyCurrentIndex);
    }
  },

  updateActiveTriviaQuestion(questions, questionIndex) {
    this.activeQuestion = questions[questionIndex];
    this.activeQuestion.shuffleAnswerChoices();
  },

  determineCorrectAnswer(selectedAnswer) {
    return selectedAnswer === this.activeQuestion.correctAnswer;
  },

  toggleDoubleDownToken(toggle) {
    toggle ? (this.doubleDownToken = true) : (this.doubleDownToken = false);
  },

  getTriviaCredits() {
    return this.credits;
  },

  updateTriviaCredits(answerCorrectly) {
    let difficulty = this.activeQuestion.difficulty;
    let modifier;

    if (answerCorrectly) {
      if (difficulty == `medium`) {
        this.credits += 1;
        modifier = `plus1`;
      }

      if (difficulty == `hard`) {
        this.credits += 5;
        modifier = `plus5`;
      }
    } else {
      this.credits -= 1;
      modifier = `minus1`;
    }

    let arr = [this.credits, modifier];

    return arr;
  },

  resetTriviaCredits() {
    this.credits = 10;
  },
};

class TriviaQuestion {
  answerChoices = [];

  constructor(questionObj) {
    this.question = questionObj.question;
    this.difficulty = questionObj.difficulty;
    this.category = questionObj.category;
    this.type = questionObj.type;
    this.correctAnswer = questionObj.correctAnswer;
    this.incorrectAnswers = questionObj.incorrectAnswers;
  }

  shuffleAnswerChoices() {
    if (this.type != `multiple`) return;

    let answers = [...this.incorrectAnswers, this.correctAnswer];

    this.answerChoices = shuffleArray(answers);

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
