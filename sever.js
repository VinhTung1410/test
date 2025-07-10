const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.text());

app.post('/api/tts', async (req, res) => {
  const apiKey = '0ZT07pR1crUIWOxM67kURF01CAepJKmc';
  const url = 'https://api.fpt.ai/hmi/tts/v5';
  try {
    const fptRes = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'speed': '0',
        'voice': 'banmai',
        'Content-Type': 'text/plain'
      },
      body: req.body
    });
    const audioUrl = fptRes.headers.get('location');
    if (audioUrl) {
      res.json({ audioUrl });
    } else {
      res.status(500).json({ error: 'No audio URL returned' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('TTS server running on port 3001'));