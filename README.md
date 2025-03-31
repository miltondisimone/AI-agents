# 🧠 AI Agent System

Memory-driven React + TypeScript coding assistant system with Dev and Reviewer agents.

## 📦 Overview

This project is a local-first AI development assistant that helps you:
- ✨ Generate clean, modern React components (Dev Agent)
- 🔍 Review code for best practices and accessibility (Reviewer Agent)
- 🧠 Use memory components + style rules to ensure consistency
- ⚡ Prompt LLMs locally via a custom frontend + memory context

## 🛠 Tech Stack

- React + TypeScript
- Vite
- Custom Dev Agent + Reviewer Agent logic
- Local LLM integration (DeepSeek, Code Llama, Mixtral, etc.)

## 🧠 Memory System

The system uses `.txt` files to load:
- Component examples for the Dev Agent
- Code review standards for the Reviewer Agent

Examples:
/src/agent-memory/components/... /src/agent-memory/reviewer/...

yaml
Copy
Edit

## 🚀 Usage

1. Write a goal or task in the Dev Agent textarea
2. Click **Run Agent** to generate code based on memory
3. Paste generated code into the Reviewer Agent to get suggestions

> Both agents are powered by prompt templates that inject memory references into each request.

## 🧪 Versioning

See [`CHANGELOG.md`](./CHANGELOG.md) for full release history.

---

## 📌 Status: v0.0.1

✅ First working version with:
- Dev Agent using reusable memory components
- Reviewer Agent enforcing accessibility and best practices
- Memory-driven prompts and session tracking

---

## 🧑‍💻 Author

[Milton Di Simone](https://github.com/miltondisimone)