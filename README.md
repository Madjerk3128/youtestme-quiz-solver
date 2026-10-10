# 🎭 YouTest.me Quiz Solver & Answer Viewer

An instant, automated quiz solver and answer revealer for quizzes hosted on [block.youtest.me](https://block.youtest.me) ("Don't Block Me / Fake Friend Finder").

Simply paste any quiz link or Quiz ID, and it automatically reveals 100% of the creator's true answers with question cards, emojis, badges, and 1-click clipboard copying.

---

## 🚀 Features

- **Instant Answer Revelation**: Extracts the creator's chosen options directly from the YouTest.me backend API.
- **Link & ID Autodetection**: Paste full URLs (`https://block.youtest.me/find?id=LMC96Xp&q=f`), playing links, or direct IDs (`LMC96Xp`).
- **Creator Profile Card**: Displays the quiz creator's Name, Gender, Region/Country, and question count.
- **Side-by-side Options Preview**: Highlights the true answer with a glowing checkmark while showing all available alternative options.
- **1-Click Copy**: Copies all questions and answers formatted cleanly for WhatsApp, Telegram, or Notes.
- **⚡ In-Browser Bookmarklet**: Drag-and-drop bookmarklet to view answers directly on `block.youtest.me` without leaving the page.
- **Serverless & Express Ready**: Deployable to Vercel, Netlify, Render, Railway, or local Node.js with zero configuration.

---

## 📦 Quick Start (Local)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Madjerk3128/youtestme-quiz-solver.git
   cd youtestme-quiz-solver
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```

---

## 🌐 Deploy Permanently for Free (Vercel)

1. Push this repository to your GitHub account.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your `youtestme-quiz-solver` repository and click **Deploy**.
4. You will get a permanent public link: `https://youtestme-quiz-solver.vercel.app`!

---

## 🛠️ API Documentation

### Endpoint: `/api/solve`
- **Method**: `GET` or `POST`
- **Query Parameter**: `?url=<QUIZ_URL_OR_ID>` or `?id=<QUIZ_ID>`

#### Example Request:
```http
GET /api/solve?id=LMC96Xp
```

#### Example Response:
```json
{
  "success": true,
  "quizId": "LMC96Xp",
  "creator": {
    "name": "Swarnaa",
    "gender": "female",
    "country": "IN",
    "language": "en"
  },
  "totalQuestions": 10,
  "answers": [
    {
      "number": 1,
      "questionId": "24",
      "question": "When did Swarnaa usually study for exams? 📝",
      "chosenIndex": 1,
      "correctAnswer": "The night before 🌙",
      "allOptions": [
        "Days in advance 📚",
        "The night before 🌙",
        "5 minutes before 😭",
        "Didn't study 💀"
      ]
    }
  ]
}
```

---

## 📜 License
MIT License. Created for educational and web exploration purposes.
