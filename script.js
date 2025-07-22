let selectedQuestions = [];
let countdownInterval;

function startQuiz() {
  const count = parseInt(document.getElementById("questionCount").value, 10);
  const showSection = document.getElementById("showSection").checked;
  const timerDisplay = document.getElementById("timerDisplay");

  const selectedSections = Array.from(document.querySelectorAll(".sectionCheckbox:checked"))
      .map(cb => cb.value);

  const eligibleQuestions = questions.filter(q => selectedSections.includes(q.section));
  selectedQuestions = eligibleQuestions.sort(() => 0.5 - Math.random()).slice(0, count);

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";

  const form = document.getElementById('quizForm');
  form.innerHTML = '';

  // Timer setup if 100 questions
  clearInterval(countdownInterval);
  const useTimer = document.getElementById("useTimer").checked;
  if (count === 100 && useTimer) {
    timerDisplay.classList.remove("hidden");
    startCountdown(60 * 60); // 60 minutes
  } else {
    timerDisplay.classList.add("hidden");
  }

  selectedQuestions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';

    let header = `<strong class="text-lg">${idx + 1}.</strong> ${q.text}`;
    if (showSection && q.section) {
      header += ` <span class="italic text-sm text-gray-500">[${q.section}]</span>`;
    }

    const title = document.createElement('p');
    title.className = 'mb-2 font-semibold';
    title.innerHTML = header;
    div.appendChild(title);

    const inputType = q.correct.length > 1 ? 'checkbox' : 'radio';

    q.options.forEach((opt, optIdx) => {
      const id = `q${idx}_opt${optIdx}`;
      const label = document.createElement('label');
      label.htmlFor = id;
      label.className = 'block mb-1';

      const input = document.createElement('input');
      input.type = inputType;
      input.name = `q${idx}`;
      input.value = optIdx;
      input.id = id;
      input.className = 'mr-2';

      label.appendChild(input);
      label.innerHTML += opt;
      div.appendChild(label);
    });

    form.appendChild(div);
  });
}

function startCountdown(duration) {
  const display = document.getElementById("timerDisplay");
  let timer = duration;

  function updateDisplay() {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    display.textContent = `⏱️ Time Left: ${minutes}:${seconds}`;
  }

  updateDisplay();

  countdownInterval = setInterval(() => {
    timer--;
    updateDisplay();

    if (timer <= 0) {
      clearInterval(countdownInterval);
      alert("⏰ Time is up! Submitting your answers.");
      submitAnswers();
    }
  }, 1000);
}

function submitAnswers() {
  clearInterval(countdownInterval);
  const results = document.getElementById('results');
  results.innerHTML = '';

  let correctCount = 0;

  selectedQuestions.forEach((q, idx) => {
    const selected = Array.from(document.querySelectorAll(`input[name="q${idx}"]:checked`)).map(i => parseInt(i.value));
    const correct = q.correct;

    const isCorrect = correct.length === selected.length && correct.every(val => selected.includes(val));
    if (isCorrect) correctCount++;

    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow mb-4';

    div.innerHTML = `<p class="font-semibold mb-1"><strong>${idx + 1}.</strong> ${q.text}</p>`;

    q.options.forEach((opt, optIdx) => {
      const isCorrectAns = correct.includes(optIdx);
      const css = isCorrectAns ? 'text-green-700 font-medium' : 'text-gray-800';
      div.innerHTML += `<div class="${css}">- ${opt}</div>`;
    });

    div.innerHTML += `<div class="mt-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'} font-semibold">
      ${isCorrect ? '✅ Correct' : '❌ Incorrect'}
    </div>`;

    results.appendChild(div);
  });

  const percentage = (correctCount / selectedQuestions.length) * 100;
  const pass = percentage >= 75;

  const summary = document.createElement('div');
  summary.className = 'p-4 bg-gray-100 rounded mb-6 border border-gray-300';
  summary.innerHTML = `
    <h2 class="text-xl font-bold">Score: ${correctCount} / ${selectedQuestions.length} (${percentage.toFixed(1)}%)</h2>
    <h3 class="text-lg font-semibold ${pass ? 'text-green-700' : 'text-red-700'}">
      ${pass ? '✅ Passed' : '❌ Failed'} (minimum 75%)
    </h3>
    <hr class="my-2"/>
  `;
  results.prepend(summary);

  window.scrollTo({ top: results.offsetTop, behavior: 'smooth' });
}