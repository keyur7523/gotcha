# 🎯 Gotcha

**Code Review Agent with Verified Bug Detection**

> *Every code reviewer says "this might fail with empty input." But does it? Gotcha doesn't guess—it proves it.*

Gotcha is an AI-powered code review agent that doesn't just identify potential bugs—it **verifies** them by generating and executing targeted test cases. Built for the Google DeepMind Gemini 3 Hackathon.

---

## ✨ Features

- **🔍 AI-Powered Analysis** — Gemini 3 Flash analyzes code for bugs, edge cases, and potential issues
- **🧪 Verified Bug Detection** — Automatically generates test cases that prove bugs exist
- **⚡ Real-Time Updates** — WebSocket-powered live progress tracking as the agent works
- **🔧 Suggested Fixes** — Get AI-generated fixes for every verified issue
- **🎨 Modern UI** — Beautiful dark/light themes with smooth animations
- **⌨️ Keyboard Shortcuts** — Power-user friendly with `⌘+Enter` to review, `⌘+,` for settings
- **🔑 BYOK** — Bring your own Gemini API key or use the default

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+ (for frontend dev & JavaScript code review)
- Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit **http://localhost:5173** and start reviewing code!

---

## 🎮 How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Paste Code    │────▶│  Gemini 3 Flash │────▶│ Potential Issues│
└─────────────────┘     │    Analysis     │     └────────┬────────┘
                        └─────────────────┘              │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Verified Issues │◀────│  Execute Tests  │◀────│  Generate Tests │
│   with Fixes    │     │   (Sandbox)     │     │  (Gemini 3)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Analyze** — Gemini 3 scans your code for potential bugs and edge cases
2. **Generate Tests** — For each issue, Gemini creates a minimal test case
3. **Execute** — Tests run in a sandboxed environment
4. **Verify** — If the test fails, the bug is **verified** (not just suspected)
5. **Fix** — Gemini generates a suggested fix for verified bugs

---

## 🖥️ Screenshots

### Code Review Interface
The split-pane interface lets you see your code and issues side-by-side with real-time highlighting.

### Agent Timeline
Watch the agent work through analysis, test generation, and execution in real-time.

### Issue Details
Expand any issue to see the test code that proves the bug and the suggested fix.

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Gemini API key | Required |
| `DEBUG` | Enable debug mode | `false` |

### Settings (In-App)

| Setting | Description | Options |
|---------|-------------|---------|
| **Strictness** | How aggressively to report issues | Relaxed / Normal / Strict |
| **Max Issues** | Maximum issues to report | 3-20 |
| **Theme** | UI color scheme | Dark / Light |
| **Custom API Key** | Override the default API key | Optional |

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** — Modern async Python web framework
- **google-genai** — Official Gemini API SDK
- **WebSockets** — Real-time bidirectional communication
- **Pydantic** — Data validation and settings management

### Frontend
- **React 19** — Latest React with concurrent features
- **TypeScript** — Type-safe development
- **Vite 7** — Lightning-fast build tool
- **TailwindCSS v4** — Utility-first styling
- **Zustand** — Lightweight state management
- **Framer Motion** — Smooth animations
- **Monaco Editor** — VS Code's editor in the browser
- **React Query** — Server state management
- **Sonner** — Beautiful toast notifications

---

## 📁 Project Structure

```
gotcha/
├── backend/
│   ├── api/
│   │   └── routes/
│   │       ├── analysis.py      # Create/get analysis sessions
│   │       ├── execute.py       # Code execution endpoint
│   │       ├── history.py       # Session history
│   │       └── websocket.py     # Real-time updates
│   ├── core/
│   │   └── config.py            # Settings & environment
│   ├── models/
│   │   └── analysis.py          # Pydantic models
│   ├── services/
│   │   ├── agent/
│   │   │   ├── analyzer.py      # Code analysis with Gemini
│   │   │   ├── test_generator.py# Test case generation
│   │   │   ├── fix_generator.py # Fix suggestion generation
│   │   │   └── orchestrator.py  # Agent workflow coordination
│   │   ├── executor.py          # Sandboxed code execution
│   │   ├── gemini.py            # Gemini API client
│   │   └── session_store.py     # In-memory session storage
│   ├── main.py                  # FastAPI application
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # API client
│   │   ├── components/
│   │   │   ├── editor/          # Code editor components
│   │   │   ├── layout/          # App layout
│   │   │   ├── review/          # Issue cards & badges
│   │   │   ├── settings/        # Settings modal
│   │   │   ├── timeline/        # Agent progress timeline
│   │   │   └── ui/              # Shared UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Route pages
│   │   ├── stores/              # Zustand stores
│   │   ├── types/               # TypeScript types
│   │   └── main.tsx             # App entry point
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + Enter` | Run code review |
| `⌘/Ctrl + ,` | Open settings |
| `⌘/Ctrl + /` | Show shortcuts help |
| `Escape` | Close modal |

---

## 🔒 Security

- Code execution runs in isolated subprocess with timeout limits
- No persistent storage of executed code
- Custom API keys are stored locally in browser (never sent to our servers)
- Temporary files are deleted immediately after execution
- JavaScript review requires Node.js installed on the server

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">
  <b>Gotcha catches what others miss. Every bug comes with proof.</b>
</p>