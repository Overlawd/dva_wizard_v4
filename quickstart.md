# DVA Wizard v3.0 - Quick Start Guide

This guide will help you get the **DVA Wizard RAG System** running in under 10 minutes. This application consists of a React frontend, a Node.js RAG backend, ChromaDB for vector storage, and Ollama for local AI inference.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **Docker** (for running ChromaDB)
- **Ollama** (Download from [ollama.com](https://ollama.com))

---

## Step 1: Setup Ollama & Pull Models

1.  **Install Ollama** if you haven't already.
2.  **Pull the required models.** You need one model for chat and one for embeddings (to understand the meaning of text).

    ```bash
    # Chat Model
    ollama pull llama3.1
    
    # Embedding Model (Crucial for RAG)
    ollama pull nomic-embed-text
    ```

3.  **Start Ollama with CORS enabled.** This allows the browser to talk to Ollama.

    **Mac/Linux:**
    ```bash
    OLLAMA_ORIGINS="*" ollama serve
    ```

    **Windows (PowerShell):**
    ```powershell
    $env:OLLAMA_ORIGINS="*"; ollama serve
    ```

---

## Step 2: Start ChromaDB (Vector Database)

We use Docker to run the vector database.
