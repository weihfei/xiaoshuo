/**
 * Generate embeddings locally using Transformers.js
 * 
 * No remote API required - runs completely offline!
 */

const { pipeline, env } = require('@xenova/transformers');

// Skip downloading model that requires sharp (for image processing)
// We don't need it for text embeddings
env.allowLocalModels = false;
env.useBrowserCache = false;

// Use a small, fast embedding model that works well in Node.js
// XENOVA/all-MiniLM-L6-v2 - 80MB download on first run, cached after that
const DEFAULT_MODEL = 'Xenova/all-MiniLM-L6-v2';

let generator = null;
let currentModel = null;

async function getGenerator(modelName = DEFAULT_MODEL) {
  if (generator && currentModel === modelName) {
    return generator;
  }
  // Load without requiring sharp
  generator = await pipeline('feature-extraction', modelName, {
    pooling: 'mean',
  });
  currentModel = modelName;
  return generator;
}

async function generateEmbedding(text, modelName = DEFAULT_MODEL) {
  const generator = await getGenerator(modelName);
  const output = await generator(text, {
    pooling: 'mean',
    normalize: true,
  });
  return Array.from(output.data);
}

async function generateEmbeddings(texts, modelName = DEFAULT_MODEL) {
  const generator = await getGenerator(modelName);
  const embeddings = [];
  for (const text of texts) {
    const output = await generator(text, {
      pooling: 'mean',
      normalize: true,
    });
    embeddings.push(Array.from(output.data));
  }
  return embeddings;
}

module.exports = { generateEmbedding, generateEmbeddings, DEFAULT_MODEL };
