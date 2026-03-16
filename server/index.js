require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ChromaClient } = require('chromadb');
const { Ollama } = require('ollama');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const ollama = new Ollama({ host: 'http://localhost:11434' });
const chroma = new ChromaClient({ path: 'http://localhost:8000' });

const SYSTEM_PROMPT = `
You are DVA Wizard v3.0, an expert assistant for Australian Department of Veterans' Affairs claims.
Use the following pieces of retrieved context to answer the question. 
If the context doesn't contain the answer, say that you don't know based on the provided information, but provide general guidance if possible.
Always cite the source title in your answer.

Context:
{context}
`;

app.post('/api/chat', async (req, res) => {
  // Set headers for Server-Sent Events (Streaming)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const { messages, model = 'llama3.1' } = req.body;
    const userMessage = messages[messages.length - 1].content;

    // 1. Generate Embedding
    const embedResponse = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: userMessage,
    });

    // 2. Retrieve Context
    const collection = await chroma.getCollection({ name: 'dva_knowledge_base' });
    const results = await collection.query({
      queryEmbeddings: embedResponse.embedding,
      nResults: 3,
    });

    // 3. Construct Context
    let contextText = '';
    const sources = [];

    if (results.documents && results.documents.length > 0) {
      results.documents[0].forEach((doc, i) => {
        const metadata = results.metadatas[0][i];
        contextText += `[Source: ${metadata.title}]\n${doc}\n\n`;
        sources.push({
          title: metadata.title,
          level: metadata.level,
          type: metadata.type
        });
      });
    } else {
      contextText = 'No specific documents found in the knowledge base.';
    }

    // 4. Send Sources as the first event
    res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);

    // 5. Stream Generation
    const finalPrompt = SYSTEM_PROMPT.replace('{context}', contextText);
    
    const stream = await ollama.chat({
      model: model,
      messages: [
        { role: 'system', content: finalPrompt },
        ...messages.slice(0, -1),
        { role: 'user', content: userMessage }
      ],
      stream: true,
    });

    for await (const part of stream) {
      if (part.message && part.message.content) {
        res.write(`data: ${JSON.stringify({ type: 'content', content: part.message.content })}\n\n`);
      }
    }

    // 6. Send Done signal
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);

  } catch (error) {
    console.error('Streaming Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
  } finally {
    res.end();
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DVA Wizard RAG Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 DVA Wizard RAG Server running on http://localhost:${PORT}`);
});