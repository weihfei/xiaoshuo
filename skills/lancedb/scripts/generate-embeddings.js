/**
 * Generate embeddings using OpenAI-compatible API
 * 
 * Config stored in .credentials/openai.json:
 * {
 *   "apiKey": "your-api-key",
 *   "baseURL": "https://api.example.com/v1",
 *   "defaultModel": "text-embedding-3-small"
 * }
 * 
 * Direct implementation - bypasses LanceDB variable checking for API key
 */

const fs = require('fs');
const { OpenAI } = require('openai');

function getConfig() {
  const configPath = '/Users/weihefei/Documents/openclaw/workspace/.credentials/openai.json';
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  throw new Error('Config not found: /Users/weihefei/Documents/openclaw/workspace/.credentials/openai.json');
}

function createClient() {
  const config = getConfig();
  if (!config.apiKey) {
    throw new Error('API key not found in config');
  }
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL
  });
}

async function generateEmbedding(text) {
  const client = createClient();
  const config = getConfig();
  const model = config.defaultModel;
  
  const response = await client.embeddings.create({
    model: model,
    input: text,
    encoding_format: 'float',
  });

  return response.data[0].embedding;
}

async function generateEmbeddings(texts) {
  const client = createClient();
  const config = getConfig();
  const model = config.defaultModel;
  
  const response = await client.embeddings.create({
    model: model,
    input: texts,
    encoding_format: 'float',
  });

  return response.data.map(item => item.embedding);
}

module.exports = { generateEmbedding, generateEmbeddings, createClient, getConfig };
