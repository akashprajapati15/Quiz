const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");

let questions = [];
let currentIndex = 0;
let score = 0;
let quizCompleted = false;

// Load new questions from the Trivia API
async function loadQuestions() {
  const url = "https://the-trivia-api.com/v2/questions?limit=10&categories=food_and_drink";
  const res = await fetch(url);
  questions = await res.json();
  quizCompleted = false;
  startQuiz();
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  scoreEl.innerText = `Score: 0 / 0`;
  nextBtn.innerText = "Next";
  nextBtn.style.display = "none";
  showQuestion();
}

function showQuestion() {
  resetState();
  const q = questions[currentIndex];
  questionEl.innerText = `Q${currentIndex + 1}: ${q.question.text}`;

  const answers = [...q.incorrectAnswers, q.correctAnswer];
  shuffle(answers);

  answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.classList.add("btn");
    btn.dataset.correct = answer === q.correctAnswer;
    btn.addEventListener("click", selectAnswer);
    answerButtons.appendChild(btn);
  });
}

function resetState() {
  nextBtn.style.display = "none";
  feedbackEl.innerText = "";
  answerButtons.innerHTML = "";
}

function selectAnswer(e) {
  const selected = e.target;
  const isCorrect = selected.dataset.correct === "true";

  if (isCorrect) {
    selected.classList.add("correct");
    feedbackEl.innerText = "✅ Correct!";
    score++;
  } else {
    selected.classList.add("wrong");
    feedbackEl.innerText = "❌ Wrong!";
  }

  Array.from(answerButtons.children).forEach(btn => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
    btn.disabled = true;
  });

  // Update score display on each answer
  scoreEl.innerText = `Score: ${score} / ${currentIndex + 1}`;

  nextBtn.style.display = "block";
}

function showScore() {
  questionEl.innerText = "🎉 Quiz Completed!";
  answerButtons.innerHTML = "";
  feedbackEl.innerText = "";
  scoreEl.innerText = `Final Score: ${score} / ${questions.length}`;
  nextBtn.innerText = "Play Again";
  nextBtn.style.display = "block";
  quizCompleted = true;
}

nextBtn.addEventListener("click", () => {
  if (quizCompleted) {
    loadQuestions(); // Fetch new questions and reset
  } else {
    currentIndex++;
    if (currentIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  }
});

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

loadQuestions();
