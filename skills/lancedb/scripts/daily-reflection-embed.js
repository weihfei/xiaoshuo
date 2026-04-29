/**
 * Daily Reflection to LanceDB Storage
 * 
 * Store daily EOD reflections into vector database.
 * Generates embeddings via OpenAI-compatible API directly.
 */

const fs = require('fs');
const path = require('path');
const lancedb = require('@lancedb/lancedb');
const { generateEmbedding } = require('./generate-embeddings');

// Database path
const DB_PATH = '/Users/weihefei/Documents/openclaw/workspace/data/lancedb/daily-reflections';

async function embedDailyReflection(date, content) {
  // Generate embedding ourselves
  const vector = await generateEmbedding(content);
  
  // Connect to DB
  const db = await lancedb.connect(DB_PATH);
  const tables = await db.tableNames();
  
  // Prepare data with generated vector
  const data = [{
    id: Date.now().toString(),
    date: date,
    content: content,
    vector: vector
  }];
  
  if (!tables.includes('reflections')) {
    // Create table
    await db.createTable('reflections', data);
  } else {
    const table = await db.openTable('reflections');
    await table.add(data);
  }
  
  console.log(`Successfully embedded reflection for ${date}`);
  return true;
}

// When we have real embeddings, search will be enabled
// For now, just store data
async function listReflections() {
  const db = new LanceDBClient(DB_PATH);
  await db.open();
  const table = await db.openTable('reflections');
  const results = await table.toArray();
  await db.close();
  return results;
}

// If run from command line: embed the latest daily reflection
if (require.main === module) {
  const reflectionPath = '/Users/weihefei/Documents/openclaw/workspace/.learnings/DAILY-REFLECTION.md';
  const content = fs.readFileSync(reflectionPath, 'utf8');
  
  // Parse latest reflection - extract the most recent entry
  const lines = content.split('\n');
  let latestDate = null;
  let latestContent = [];
  let capturing = false;

  for (const line of lines) {
    if (line.startsWith('## 20')) {
      if (latestDate === null) {
        latestDate = line.trim();
        capturing = true;
      } else {
        break;
      }
    } else if (capturing) {
      if (!line.startsWith('---') || latestContent.length > 0) {
        latestContent.push(line);
      }
    }
  }

  const latestFull = latestDate + '\n' + latestContent.join('\n');
  const dateMatch = latestDate.match(/## (\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  embedDailyReflection(date, latestFull)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error embedding reflection:', err);
      process.exit(1);
    });
}

module.exports = { embedDailyReflection, listReflections, DB_PATH };
