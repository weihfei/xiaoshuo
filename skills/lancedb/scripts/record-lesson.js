/**
 * Record a lesson learned for a team role
 * 
 * Usage:
 * node skills/lancedb/scripts/record-lesson.js --project <project-key> --role <role-key> --title "<title>" --content "<content>"
 */

const fs = require('fs');
const path = require('path');
const LanceDBClient = require('./lancedb-client');
const { BASE_DIR } = require('./team-training-init');

// Generate random placeholder vector (384 dimensions)
function randomVector() {
  return Array.from({length: 384}, () => Math.random() * 2 - 1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    result[key] = args[i + 1];
  }
  return result;
}

async function recordLesson(project, role, title, content) {
  const dbPath = path.join(BASE_DIR, project, role);
  const db = new LanceDBClient(dbPath);
  await db.open();
  
  const lesson = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    title: title,
    content: content,
    vector: randomVector()
  };
  
  const tables = await db.listTables();
  if (!tables.includes('lessons')) {
    await db.createTable('lessons', [lesson]);
  } else {
    await db.add('lessons', [lesson]);
  }
  
  await db.close();
  console.log(`✅ Lesson recorded for ${project}/${role}`);
  console.log(`   Date: ${lesson.date}`);
  console.log(`   Title: ${title}`);
  return true;
}

// Search lessons by vector similarity
async function searchLessons(project, role, queryVector, limit = 10) {
  const dbPath = path.join(BASE_DIR, project, role);
  const db = new LanceDBClient(dbPath);
  await db.open();
  
  const results = await db.search('lessons', queryVector, limit);
  await db.close();
  return results;
}

// Run if called directly
if (require.main === module) {
  const args = parseArgs();
  
  if (!args.project || !args.role || !args.title || !args.content) {
    console.error('Usage: node record-lesson.js --project <project-key> --role <role-key> --title "<title>" --content "<content>"');
    console.error('Available projects: novel-bulao-busidewo, dboms-dev');
    process.exit(1);
  }
  
  recordLesson(args.project, args.role, args.title, args.content)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error recording lesson:', err);
      process.exit(1);
    });
}

module.exports = { recordLesson, searchLessons, randomVector };
