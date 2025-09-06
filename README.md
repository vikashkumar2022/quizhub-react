# 🧠 QuizHub - Interactive Quiz Application

A modern, feature-rich quiz application built with React and TypeScript, offering an engaging way to test knowledge across multiple categories.

![QuizHub Banner](https://img.shields.io/badge/QuizHub-React%20Quiz%20App-blue?style=for-the-badge&logo=react)

## 🌟 Live Demo

**🚀 [Try QuizHub Now!](https://vikashkumar2022.github.io/quizhub-react/)**

## ✨ Features

### 🎯 Core Features
- **🔢 Smart Scoring System** - Dynamic point distribution (1000-1200 range) that prevents overflow
- **⏸️ Pause & Resume** - Save your progress and continue later with time tracking
- **🧭 Question Navigation** - Previous/Next arrows to navigate freely between questions
- **🏆 Persistent Score Display** - Score cards that stay visible until manually closed
- **⚡ Auto-progression** - Automatically moves to next question after answering
- **🎮 Multiple Lifelines** - 5 different helping options during quiz

### 🎨 User Experience
- **🌙 Dark Theme** - Beautiful dark UI with gradient accents
- **📱 Responsive Design** - Works perfectly on all devices
- **🎭 Smooth Animations** - Framer Motion powered interactions
- **🎪 Interactive Elements** - Hover effects and smooth transitions

### 📚 Quiz Categories
- 🏃 **Sports Arena** - Sports, athletes, and competitions
- 🔬 **Science Lab** - Physics, chemistry, and biology
- 💻 **Tech Innovation** - Technology and computing
- 🏛️ **Time Machine** - Historical events and civilizations
- 📖 **Book Club** - Literature, authors, and poetry
- 🌍 **World Explorer** - Geography and cultures
- 🎬 **Show Time** - Entertainment and pop culture
- 🔢 **Math Masters** - Mathematical concepts
- 🧠 **Brain Boost** - General knowledge
- 🏛️ **Political Arena** - Politics and current affairs

### 🎮 Lifelines Available
- **🎲 50:50** - Remove two incorrect options
- **⏭️ Skip Question** - Skip current question
- **⭐ Double Chance** - Get a second attempt
- **⏱️ Extra Time** - Add 30 seconds to timer
- **💡 Hint** - Get helpful hints

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 19.1.0** - Modern React with latest features
- **📘 TypeScript 4.9.5** - Type-safe development
- **🎨 Material-UI 7.2.0** - Beautiful component library
- **🎭 Framer Motion 12.23.9** - Smooth animations
- **🧭 React Router 7.7.1** - Client-side routing

### State Management
- **🏪 Zustand 5.0.6** - Lightweight state management
- **💾 LocalStorage** - Persistent data storage

### Development Tools
- **📦 Create React App** - Zero-config setup
- **🚀 GitHub Pages** - Free hosting and CI/CD

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vikashkumar2022/quizhub-react.git
cd quizhub-react
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Creates optimized production build |
| `npm test` | Launches test runner in interactive watch mode |
| `npm run deploy` | Deploys to GitHub Pages |

## 📱 Screenshots

### Home Page
Beautiful landing page with category selection and ultimate challenge mode.

### Quiz Interface
Clean, intuitive quiz interface with timer, score display, and lifelines.

### Score Results
Detailed score breakdown with accuracy, time taken, and performance ranking.

## 🏗️ Project Structure

```
quizhub-react/
├── public/
│   ├── data/           # Quiz questions by category
│   ├── index.html      # Main HTML template
│   └── 404.html        # GitHub Pages routing
├── src/
│   ├── components/     # Reusable components
│   │   └── Layout/     # Header and layout components
│   ├── pages/          # Main page components
│   │   ├── Home.tsx    # Landing page
│   │   ├── Quiz.tsx    # Quiz interface
│   │   └── Results.tsx # Results display
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main app component
└── package.json
```

## 🎯 Key Features Implementation

### Smart Scoring Algorithm
```typescript
const baseScorePerQuestion = Math.round(1200 / questionCount);
const score = baseScorePerQuestion * (timeLeft / timeLimit);
```

### Pause & Resume Functionality
- Saves quiz state to localStorage
- Tracks total pause time
- Resumes from exact question with remaining time

### Question Navigation
- Previous/Next navigation with proper state management
- Disabled states during result display
- Question counter with progress tracking

## 🚀 Deployment

The app is automatically deployed to GitHub Pages:

1. **Build the project**
```bash
npm run build
```

2. **Deploy to GitHub Pages**
```bash
npm run deploy
```

3. **Live URL**: https://vikashkumar2022.github.io/quizhub-react/

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Vikash Kumar**
- GitHub: [@vikashkumar2022](https://github.com/vikashkumar2022)
- Email: vikashkumar2022@vitbhopal.ac.in

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Material-UI** for the beautiful components
- **Framer Motion** for smooth animations
- **GitHub Pages** for free hosting

## 📊 Project Stats

- **2000+ Questions** across 10 categories
- **5 Lifelines** to help during quizzes
- **Smart Scoring** with overflow prevention
- **Responsive Design** for all devices
- **TypeScript** for type safety

---

<div align="center">

### 🌟 Show your support

Give a ⭐️ if this project helped you!

**[🚀 Live Demo](https://vikashkumar2022.github.io/quizhub-react/)** • **[📝 Report Bug](https://github.com/vikashkumar2022/quizhub-react/issues)** • **[✨ Request Feature](https://github.com/vikashkumar2022/quizhub-react/issues)**

</div>
