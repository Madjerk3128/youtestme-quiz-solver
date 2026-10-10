// Frontend Application Logic
document.addEventListener('DOMContentLoaded', () => {
  const quizInput = document.getElementById('quizInput');
  const solveBtn = document.getElementById('solveBtn');
  const btnIcon = document.getElementById('btnIcon');
  const btnText = document.getElementById('btnText');
  const pasteBtn = document.getElementById('pasteBtn');
  const demoBtn = document.getElementById('demoBtn');
  const errorAlert = document.getElementById('errorAlert');
  const errorMsg = document.getElementById('errorMsg');
  const resultsSection = document.getElementById('resultsSection');
  const creatorName = document.getElementById('creatorName');
  const genderBadge = document.getElementById('genderBadge');
  const creatorMeta = document.getElementById('creatorMeta');
  const avatarIcon = document.getElementById('avatarIcon');
  const avatarBg = document.getElementById('avatarBg');
  const answersList = document.getElementById('answersList');
  const copyAllBtn = document.getElementById('copyAllBtn');
  const copyBtnText = document.getElementById('copyBtnText');

  let currentAnswersData = null;

  // Preloaded Swarnaa Quiz Data (Offline / GitHub Pages fallback)
  const SWARNAA_CACHED_DATA = {
    success: true,
    quizId: "LMC96Xp",
    creator: {
      name: "Swarnaa",
      gender: "female",
      country: "IN",
      language: "en"
    },
    totalQuestions: 10,
    answers: [
      {
        number: 1,
        questionId: "24",
        question: "When did Swarnaa usually study for exams? 📝",
        chosenIndex: 1,
        correctAnswer: "The night before 🌙",
        allOptions: ["Days in advance 📚", "The night before 🌙", "5 minutes before 😭", "Didn't study 💀"]
      },
      {
        number: 2,
        questionId: "41",
        question: "Which cartoon does Swarnaa like most? 📺",
        chosenIndex: 0,
        correctAnswer: "Shinchan 😂",
        allOptions: ["Shinchan 😂", "Doraemon 🤖", "Ninja Hattori 🥷", "Chhota Bheem 💪", "Motu Patlu 🤩", "Oggy and the Cockroaches 😆", "Tom and Jerry 🐱", "Pokémon ⚡", "Ben 10 👽", "SpongeBob SquarePants 🧽", "Naruto 🍥", "Dragon Ball Z 🐉"]
      },
      {
        number: 3,
        questionId: "459",
        question: "What’s Swarnaa’s go-to sweet or tangy treat? 🍬",
        chosenIndex: 8,
        correctAnswer: "KitKat Chocolate 🍫",
        allOptions: ["Pulse Kachcha Aam 🥭", "Mango Bite 🟡", "Melody 🍫", "Alpenliebe Gold 🍮", "Alpenliebe Juzt Jelly Strawberry 🍓", "Poppins 🌈", "Boomer bubble gum 🫧", "Dairy Milk Chocolate 🍫", "KitKat Chocolate 🍫", "Center Fresh 🫧"]
      },
      {
        number: 4,
        questionId: "43",
        question: "What was Swarnaa's favorite game as a kid? 🛝",
        chosenIndex: 2,
        correctAnswer: "Badminton 🏸",
        allOptions: ["Hide-and-seek 🫣", "Tag 🏃", "Badminton 🏸", "Jump rope 🪢", "Ludo 🎲", "Carrom 🎯", "Snakes and Ladders 🐍", "Rock Paper Scissors ✂️"]
      },
      {
        number: 5,
        questionId: "10",
        question: "What’s Swarnaa’s bad habit? 😬",
        chosenIndex: 4,
        correctAnswer: "Scrolling on her phone 📱",
        allOptions: ["Forgetting passwords 🔐", "Overthinking everything 🧠", "Staying up too late 🌙", "Shopping too much 🛍️", "Scrolling on her phone 📱", "Eating too many snacks 🍫", "Sleeping too much 😴", "Biting her nails 😬", "Chewing on pens 🖊️"]
      },
      {
        number: 6,
        questionId: "34",
        question: "How does Swarnaa usually text? 📱",
        chosenIndex: 0,
        correctAnswer: "Lots of messages in a row 💬",
        allOptions: ["Lots of messages in a row 💬", "One long message 📝"]
      },
      {
        number: 7,
        questionId: "36",
        question: "What's Swarnaa's favorite fast food? 🍔",
        chosenIndex: 11,
        correctAnswer: "Biryani 🍲",
        allOptions: ["Burger 🍔", "Pizza 🍕", "Momos 🥟", "Pani Puri 😋", "Samosa 🥟", "Vada Pav 🌭", "Masala Maggi 🍜", "Chow Mein 🍝", "Manchurian 🥡", "Pav Bhaji 🍛", "Kathi Roll 🌯", "Biryani 🍲"]
      },
      {
        number: 8,
        questionId: "18",
        question: "What position does Swarnaa usually sleep in? 💤",
        chosenIndex: 0,
        correctAnswer: "On her side 😴",
        allOptions: ["On her side 😴", "On her stomach 🛏️", "On her back 😌"]
      },
      {
        number: 9,
        questionId: "22",
        question: "How fast does Swarnaa usually eat? 🍽️",
        chosenIndex: 1,
        correctAnswer: "Really slow 🐢",
        allOptions: ["Super fast ⚡", "Really slow 🐢"]
      },
      {
        number: 10,
        questionId: "15",
        question: "Where did Swarnaa usually sit in class? 🏫",
        chosenIndex: 1,
        correctAnswer: "Back 😎",
        allOptions: ["Front 🥇", "Back 😎"]
      }
    ]
  };

  function extractQuizId(input) {
    if (!input) return null;
    const str = input.trim();
    const urlMatch = str.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (urlMatch) return urlMatch[1];
    const idMatch = str.match(/^[a-zA-Z0-9_-]{4,20}$/);
    if (idMatch) return idMatch[0];
    const pathMatch = str.match(/\/([a-zA-Z0-9_-]{4,20})(?:[?#]|$)/);
    if (pathMatch) return pathMatch[1];
    return str;
  }

  // Paste from clipboard
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) quizInput.value = text.trim();
    } catch (e) {
      quizInput.focus();
    }
  });

  // Demo button
  demoBtn.addEventListener('click', () => {
    quizInput.value = 'https://block.youtest.me/find?id=LMC96Xp&q=f';
    solveQuiz();
  });

  // Solve button click
  solveBtn.addEventListener('click', solveQuiz);

  // Enter key press
  quizInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') solveQuiz();
  });

  async function solveQuiz() {
    const rawVal = quizInput.value.trim();
    if (!rawVal) {
      showError('Please paste a quiz link or enter a Quiz ID first.');
      return;
    }

    setLoading(true);
    hideError();

    const quizId = extractQuizId(rawVal);

    // Fast local match if it's the demo / Swarnaa quiz
    if (quizId && quizId.toLowerCase() === 'lmc96xp') {
      setTimeout(() => {
        renderResults(SWARNAA_CACHED_DATA);
        setLoading(false);
      }, 400);
      return;
    }

    try {
      // 1. Try local or Vercel /api/solve endpoint
      const apiUrl = `/api/solve?url=${encodeURIComponent(rawVal)}`;
      let data = null;
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          data = await response.json();
        }
      } catch (err) {
        // Ignored, proceed to proxy
      }

      if (data && data.success) {
        renderResults(data);
        return;
      }

      // 2. On static GitHub Pages without backend:
      showError(
        'For new quizzes, please use the in-browser Bookmarklet below directly on block.youtest.me to reveal answers instantly!'
      );
    } catch (err) {
      showError(err.message || 'Unable to retrieve quiz answers.');
    } finally {
      setLoading(false);
    }
  }

  function renderResults(data) {
    currentAnswersData = data;
    const { creator, answers, totalQuestions } = data;

    creatorName.textContent = creator.name || 'Quiz Creator';
    genderBadge.textContent = creator.gender || 'unknown';
    
    if (creator.gender === 'female') {
      avatarIcon.textContent = '👩';
      avatarBg.className = 'w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-2xl shadow-lg';
      genderBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-medium';
    } else {
      avatarIcon.textContent = '👨';
      avatarBg.className = 'w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-500 flex items-center justify-center text-2xl shadow-lg';
      genderBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium';
    }

    creatorMeta.textContent = `Region: ${creator.country || 'IN'} • Language: ${creator.language || 'en'} • ${totalQuestions} Questions`;

    answersList.innerHTML = '';
    answers.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl p-5 md:p-6 border border-slate-700/60 transition hover:border-slate-600/80 space-y-3';

      const allOptionsHtml = item.allOptions && item.allOptions.length > 0
        ? `
          <div class="pt-2 border-t border-slate-800">
            <span class="text-xs text-slate-400 font-medium">All Available Options:</span>
            <div class="flex flex-wrap gap-2 mt-2">
              ${item.allOptions.map((opt, i) => {
                const isSelected = i === item.chosenIndex;
                return `
                  <span class="text-xs px-2.5 py-1 rounded-lg ${
                    isSelected 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold' 
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                  }">
                    ${opt} ${isSelected ? '✓' : ''}
                  </span>
                `;
              }).join('')}
            </div>
          </div>
        `
        : '';

      card.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-bold">
              #${item.number}
            </span>
            <h4 class="text-base md:text-lg font-bold text-white">${escapeHtml(item.question)}</h4>
          </div>
        </div>

        <div class="bg-gradient-to-r from-emerald-950/60 to-slate-900/80 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3 glow-green">
          <div class="space-y-0.5">
            <span class="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
              Correct Answer (Chosen by ${escapeHtml(creator.name)})
            </span>
            <div class="text-sm md:text-base font-bold text-emerald-100 flex items-center gap-2">
              <span>🎯</span>
              <span>${escapeHtml(item.correctAnswer)}</span>
            </div>
          </div>
          <span class="text-emerald-400 text-lg">✅</span>
        </div>

        ${allOptionsHtml}
      `;

      answersList.appendChild(card);
    });

    resultsSection.classList.remove('hidden');
    copyBtnText.textContent = `Copy All ${answers.length} Answers`;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Copy all answers to clipboard
  copyAllBtn.addEventListener('click', () => {
    if (!currentAnswersData) return;
    const { creator, answers } = currentAnswersData;

    let text = `🎭 ${creator.name}'s Quiz Answers (YouTest.me):\n\n`;
    answers.forEach((a) => {
      text += `${a.number}. ${a.question}\n👉 Answer: ${a.correctAnswer}\n\n`;
    });

    navigator.clipboard.writeText(text.trim()).then(() => {
      copyBtnText.textContent = 'Copied to Clipboard! 🎉';
      setTimeout(() => {
        copyBtnText.textContent = `Copy All ${answers.length} Answers`;
      }, 2500);
    });
  });

  function setLoading(isLoading) {
    if (isLoading) {
      solveBtn.disabled = true;
      solveBtn.classList.add('opacity-75', 'cursor-not-allowed');
      btnIcon.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`;
      btnText.textContent = 'Solving Quiz...';
    } else {
      solveBtn.disabled = false;
      solveBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      btnIcon.textContent = '🔍';
      btnText.textContent = 'Reveal Answers';
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorAlert.classList.remove('hidden');
  }

  function hideError() {
    errorAlert.classList.add('hidden');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
