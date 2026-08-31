// DOM elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");

const currentQuestionSpan = document.getElementById("current-questions");
const totalQuestionsSpan = document.getElementById("total-questions");

const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");

const resultMessage = document.getElementById("result-message");
const progressBar = document.getElementById("progress");


// Quiz questions
const quizQuestions = [
    {
        question: "Who played Jack in Titanic?",
        answers: [
            { text: "Leonardo DiCaprio", correct: true },
            { text: "Brad Pitt", correct: false },
            { text: "Tom Cruise", correct: false },
            { text: "Johnny Depp", correct: false }
        ]
    },

    {
        question: "Who played Iron Man in the MCU?",
        answers: [
            { text: "Chris Evans", correct: false },
            { text: "Robert Downey Jr", correct: true },
            { text: "Chris Hemsworth", correct: false },
            { text: "Mark Ruffalo", correct: false }
        ]
    },

    {
        question: "Which movie features the song 'Tum Hi Ho'?",
        answers: [
            { text: "Aashiqui 2", correct: true },
            { text: "Yeh Jawaani Hai Deewani", correct: false },
            { text: "Kabir Singh", correct: false },
            { text: "Tamasha", correct: false }
        ]
    },

    {
        question: "What is Thor's hammer called?",
        answers: [
            { text: "Stormbreaker", correct: false },
            { text: "Gungnir", correct: false },
            { text: "Mjolnir", correct: true },
            { text: "Mjellynir", correct: false }
        ]
    },

    {
        question: "Ali's fav movie is?",
        answers: [
            { text: "3 Idiots", correct: false },
            { text: "Dangal", correct: false },
            { text: "Fukrey", correct: false },
            { text: "Rang De Basanti", correct: true }
        ]
    }
];


// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;


// Initial values
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;


// Events
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);


// Start quiz
function startQuiz() {

    currentQuestionIndex = 0;
    score = 0;

    scoreSpan.textContent = score;

    startScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    quizScreen.classList.add("active");

    showQuestion();
}


// Show question
function showQuestion() {

    answersDisabled = false;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    const progressPercent =
        ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    progressBar.style.width = progressPercent + "%";

    questionText.textContent = currentQuestion.question;

    answersContainer.innerHTML = "";


    currentQuestion.answers.forEach((answer) => {

        const button = document.createElement("button");

        button.textContent = answer.text;

        button.classList.add("answer-btn");

        button.dataset.correct = answer.correct;

        button.addEventListener("click", selectAnswer);

        answersContainer.appendChild(button);
    });
}


// Select answer
function selectAnswer(event) {

    if (answersDisabled) return;

    answersDisabled = true;

    const selectedButton = event.target;

    const isCorrect =
        selectedButton.dataset.correct === "true";


    // Show correct and incorrect answers
    Array.from(answersContainer.children).forEach((button) => {

        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else {
            button.classList.add("incorrect");
        }

    });


    // Update score
    if (isCorrect) {
        score++;
        scoreSpan.textContent = score;
    }


    // Go to next question
    setTimeout(() => {

        currentQuestionIndex++;

        if (currentQuestionIndex < quizQuestions.length) {

            showQuestion();

        } else {

            showResults();

        }

    }, 1000);
}


// Show results
function showResults() {

    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScoreSpan.textContent = score;

    const percentage =
        (score / quizQuestions.length) * 100;


    if (percentage === 100) {

        resultMessage.textContent =
            "Perfect! You're a genius!";

    } else if (percentage >= 80) {

        resultMessage.textContent =
            "Great job! You know your stuff!";

    } else if (percentage >= 40) {

        resultMessage.textContent =
            "Not bad! Try again to improve!";

    } else {

        resultMessage.textContent =
            "Keep studying! Please study more!";

    }
}


// Restart quiz
function restartQuiz() {

    resultScreen.classList.remove("active");

    startQuiz();
}