const fetch = require('node-fetch');

const HF_API_KEY = process.env.HF_API_KEY;

const MODEL_URL =
  'https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6';

async function summarizeText(text) {
  const response = await fetch(MODEL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_length: 100,
        min_length: 30,
      },
    }),
  });

  const data = await response.json();

  if (!Array.isArray(data) || !data[0]?.summary_text) {
    console.error('HF RESPONSE:', data);
    throw new Error('HF failed');
  }

  return data[0].summary_text;
}

module.exports = { summarizeText };
