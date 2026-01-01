const fetch = require('node-fetch');

const HF_API_KEY = process.env.HF_API_KEY;

// Best free summarization model
const MODEL_URL =
  'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

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
        max_length: 120,
        min_length: 40,
      },
    }),
  });

  const data = await response.json();

  // ❗ Handle errors clearly
  if (!Array.isArray(data) || !data[0]?.summary_text) {
    console.error('HF RESPONSE:', data);
    throw new Error('Hugging Face summarization failed');
  }

  return data[0].summary_text;
}

module.exports = { summarizeText };
