const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: messages
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Kuch gadbad ho gayi!';
    res.json({ reply });

  } catch (err) {
    res.status(500).json({ reply: 'Server error aa gaya, dobara try karo!' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('MIET Mitra backend running on port', PORT));
