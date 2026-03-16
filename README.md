# DVA Wizard v3.0

A sophisticated Retrieval-Augmented Generation (RAG) application designed to assist with Australian Department of Veterans' Affairs (DVA) claims and legislation. It runs entirely locally, ensuring data privacy while providing accurate, source-cited answers.

![DVA Wizard](https://img.shields.io/badge/React-18-blue) ![Ollama](https://img.shields.io/badge/Ollama-Local-green) ![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector-orange) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

- **Local LLM Inference**: Powered by Ollama (Llama 3.1, Qwen, etc.). No API keys required.
- **RAG Pipeline**: Integrates ChromaDB for semantic search over DVA legislation (MRCA, VEA, SRCA).
- **Source Citations**: Every answer includes direct links to the specific legislation or policy document used.
- **Real-time Metrics**: Dashboard monitoring GPU, VRAM, and CPU usage.
- **Model Selection**: Switch between different local models dynamically via the UI.
- **Modern UI**: Built with React, TypeScript, Tailwind CSS v4, and Shadcn UI.

## 🏗️ Architecture

The application is split into a **Frontend** (React) and a **Backend** (Node.js/Express).
