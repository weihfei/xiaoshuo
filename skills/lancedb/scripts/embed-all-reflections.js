/**
 * Embed all historical daily reflections into LanceDB
 * 
 * Extract all reflections from DAILY-REFLECTION.md and store them
 * Uses random vectors as placeholders for now
 */

const fs = require('fs');
const LanceDBClient = require('./lancedb-client');

const DB_PATH = '/Users/weihefei/Documents/openclaw/workspace/data/lancedb/daily-reflections';
const REFLECTION_PATH = '/Users/weihefei/Documents/openclaw/workspace/.learnings/DAILY-REFLECTION.md';

function parseAllReflections(content) {
  const lines = content.split('\n');
  const reflections = [];
  
  let currentDate = null;
  let currentContent = [];
  let capturing = false;

  for (const line of lines) {
    if (line.startsWith('## 20')) {
      // Save previous reflection if exists
      if (currentDate !== null) {
        reflections.push({
          date: currentDate,
          content: currentContent.join('\n').trim()
        });
      }
      // Start new reflection
      currentDate = line.trim().match(/## (\d{4}-\d{2}-\d{2})/)[1];
      currentContent = [line.trim()];
      capturing = true;
    } else if (capturing && line.trim() === '---' && currentContent.length > 0) {
      // End of reflection
      if (currentDate !== null) {
        reflections.push({
          date: currentDate,
          content: currentContent.join('\n').trim()
        });
        currentDate = null;
        currentContent = [];
        capturing = false;
      }
    } else if (capturing) {
      currentContent.push(line);
    }
  }

  // Add last reflection
  if (currentDate !== null && currentContent.length > 0) {
    reflections.push({
      date: currentDate,
      content: currentContent.join('\n').trim()
    });
  }

  return reflections;
}

async function embedAllReflections() {
  const content = fs.readFileSync(REFLECTION_PATH, 'utf8');
  const reflections = parseAllReflections(content);
  console.log(`Found ${reflections.length} reflections to import`);

  // Initialize DB
  const db = new LanceDBClient(DB_PATH);
  await db.open();

  // Check if table exists
  const tables = await db.listTables();
  let tableExists = tables.includes('reflections');

  // Generate data
  const data = reflections.map(r => ({
    id: `${r.date}-${Date.now().toString()}`,
    date: r.date,
    content: r.content,
    vector: Array.from({length: 384}, () => Math.random() * 2 - 1)
  }));

  if (!tableExists) {
    await db.createTable('reflections', data);
    console.log(`Created table and imported ${data.length} reflections`);
  } else {
    // Check which dates are already in (simplified - just add all, duplicates are okay)
    await db.add('reflections', data);
    console.log(`Added ${data.length} reflections to existing table`);
  }

  // Verify
  const table = await db.openTable('reflections');
  const count = await table.countRows();
  console.log(`Total rows in table: ${count}`);

  await db.close();
  return reflections.length;
}

// Run if called directly
if (require.main === module) {
  embedAllReflections()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error importing reflections:', err);
      process.exit(1);
    });
}

module.exports = { parseAllReflections, embedAllReflections };
