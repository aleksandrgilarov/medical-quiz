let selectedQuestions = [];

function startQuiz() {
  const count = parseInt(document.getElementById("questionCount").value, 10);
  const showSection = document.getElementById("showSection").checked;

  selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, count);

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";

  const form = document.getElementById('quizForm');
  form.innerHTML = '';

  selectedQuestions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'question';

    let header = `<strong>${idx + 1}.</strong> ${q.text}`;
    if (showSection && q.section) {
      header += ` <span style="font-style:italic; color:gray;">[${q.section}]</span>`;
    }

    const title = document.createElement('p');
    title.innerHTML = header;
    div.appendChild(title);

    const inputType = q.correct.length > 1 ? 'checkbox' : 'radio';

    q.options.forEach((opt, optIdx) => {
      const id = `q${idx}_opt${optIdx}`;
      const label = document.createElement('label');
      label.htmlFor = id;

      const input = document.createElement('input');
      input.type = inputType;
      input.name = `q${idx}`;
      input.value = optIdx;
      input.id = id;

      label.appendChild(input);
      label.innerHTML += " " + opt;
      div.appendChild(label);
      div.appendChild(document.createElement('br'));
    });

    form.appendChild(div);
  });
}

function submitAnswers() {
  const results = document.getElementById('results');
  results.innerHTML = '';

  let correctCount = 0;

  selectedQuestions.forEach((q, idx) => {
    const selected = Array.from(document.querySelectorAll(`input[name="q${idx}"]:checked`)).map(i => parseInt(i.value));
    const correct = q.correct;

    const isCorrect = correct.length === selected.length && correct.every(val => selected.includes(val));
    if (isCorrect) correctCount++;

    const div = document.createElement('div');
    div.innerHTML = `<strong>${idx + 1}.</strong> ${q.text}<br/>`;

    q.options.forEach((opt, optIdx) => {
      const display = correct.includes(optIdx) ? `<span class="correct">${opt}</span>` : opt;
      div.innerHTML += `- ${display}<br/>`;
    });

    div.innerHTML += `<em>${isCorrect ? '✅ Correct' : '❌ Incorrect'}</em><hr/>`;
    results.appendChild(div);
  });

  const percentage = (correctCount / selectedQuestions.length) * 100;
  const pass = percentage >= 75;
  const summary = document.createElement('div');
  summary.innerHTML = `<h2>Score: ${correctCount} / ${selectedQuestions.length} (${percentage.toFixed(1)}%)</h2>
    <h3 style="color: ${pass ? 'green' : 'red'};">${pass ? '✅ Passed' : '❌ Failed'} (minimum 75%)</h3><hr/>`;
  results.prepend(summary);

  window.scrollTo({ top: results.offsetTop, behavior: 'smooth' });
}
