/**
 * Core Solver Logic for block.youtest.me quizzes
 * Can be deployed directly as a Vercel Serverless Function or used in Express.
 */

function extractQuizId(input) {
  if (!input) return null;
  const str = input.trim();

  // Match URL parameter id=...
  const urlMatch = str.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (urlMatch) return urlMatch[1];

  // Match direct ID if just alphanumeric
  const idMatch = str.match(/^[a-zA-Z0-9_-]{4,20}$/);
  if (idMatch) return idMatch[0];

  // Match path ending with ID
  const pathMatch = str.match(/\/([a-zA-Z0-9_-]{4,20})(?:[?#]|$)/);
  if (pathMatch) return pathMatch[1];

  return str;
}

async function solveQuiz(quizInput) {
  const quizId = extractQuizId(quizInput);
  if (!quizId) {
    throw new Error('Could not parse a valid Quiz ID from the provided link or text.');
  }

  const userApiUrl = `https://api3.youtest.me/dontBlockMe/users/${quizId}`;
  const userResp = await fetch(userApiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://block.youtest.me',
      'Referer': 'https://block.youtest.me/'
    }
  });

  if (!userResp.ok) {
    throw new Error(`Failed to fetch quiz creator data. Status: ${userResp.status}`);
  }

  const userData = await userResp.json();
  if (!userData || !userData.success || !userData.responseObject) {
    throw new Error((userData && userData.message) || 'Quiz not found or invalid ID.');
  }

  const user = userData.responseObject;
  const userName = user.userName || 'Creator';
  const userGender = user.userGender || 'female';
  const userCountry = user.userCountry || 'IN';
  const userLanguage = user.userLanguage || 'en';
  const userQuesAnsData = user.userQuesAnsData || [];

  if (userQuesAnsData.length === 0) {
    throw new Error('This quiz has no recorded answers.');
  }

  const qIds = userQuesAnsData.map(q => q.quesID).join(',');
  const questionsApiUrl = `https://api3.youtest.me/dontBlockMe/questions?country=${encodeURIComponent(userCountry)}&gender=${encodeURIComponent(userGender)}&language=${encodeURIComponent(userLanguage)}&ids=${encodeURIComponent(qIds)}`;

  const questionsResp = await fetch(questionsApiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://block.youtest.me',
      'Referer': 'https://block.youtest.me/'
    }
  });

  if (!questionsResp.ok) {
    throw new Error(`Failed to fetch questions catalog. Status: ${questionsResp.status}`);
  }

  const questionsData = await questionsResp.json();
  const rawQuestions = (questionsData && questionsData.responseObject) || [];
  const questionsMap = new Map();
  for (const q of rawQuestions) {
    questionsMap.set(String(q.id), q);
  }

  const results = [];
  userQuesAnsData.forEach((item, index) => {
    const qid = String(item.quesID);
    const chosenIndex = item.optionIndex;
    const qObj = questionsMap.get(qid);

    if (qObj) {
      const trans = (qObj.translations && (qObj.translations[userLanguage] || qObj.translations.en || Object.values(qObj.translations)[0])) || {};
      const rawQuestionText = trans.question || `Question ${index + 1}`;
      const questionText = rawQuestionText.replace(/userName|prm/gi, userName);
      const allOptions = trans.options || [];
      const correctAnswer = allOptions[chosenIndex] !== undefined ? allOptions[chosenIndex] : `Option ${chosenIndex + 1}`;

      results.push({
        number: index + 1,
        questionId: qid,
        question: questionText,
        chosenIndex: chosenIndex,
        correctAnswer: correctAnswer,
        allOptions: allOptions
      });
    } else {
      results.push({
        number: index + 1,
        questionId: qid,
        question: `Question #${index + 1} (ID: ${qid})`,
        chosenIndex: chosenIndex,
        correctAnswer: `Option #${chosenIndex + 1}`,
        allOptions: []
      });
    }
  });

  return {
    success: true,
    quizId,
    creator: {
      name: userName,
      gender: userGender,
      country: userCountry,
      language: userLanguage
    },
    totalQuestions: results.length,
    answers: results
  };
}

// Handler for Vercel Serverless Function
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryOrBody = req.method === 'POST' ? req.body : req.query;
  const input = (queryOrBody && (queryOrBody.url || queryOrBody.id || queryOrBody.q)) || req.query.url || req.query.id;

  if (!input) {
    return res.status(400).json({
      success: false,
      error: 'Missing query parameter: Please provide a quiz URL or ID (e.g., ?id=LMC96Xp or ?url=...)'
    });
  }

  try {
    const data = await solveQuiz(input);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred while fetching the quiz.'
    });
  }
};

module.exports.solveQuiz = solveQuiz;
module.exports.extractQuizId = extractQuizId;
