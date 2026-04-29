/**
 * Log work done by a team role into vector database
 * 
 * Usage:
 * node skills/lancedb/scripts/log-work.js --project <project-key> --role <role-key> --task "<task>" --output "<output>" --feedback "<feedback>"
 */

const fs = require('fs');
const path = require('path');
const LanceDBClient = require('./lancedb-client');
const { BASE_DIR } = require('./team-training-init');
const { randomVector } = require('./record-lesson');

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    result[key] = args[i + 1];
  }
  return result;
}

async function logWork(project, role, task, output, feedback = null) {
  const dbPath = path.join(BASE_DIR, project, role);
  const db = new LanceDBClient(dbPath);
  await db.open();
  
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    task: task,
    output: output,
    feedback: feedback,
    vector: randomVector()
  };
  
  const tables = await db.listTables();
  if (!tables.includes('worklog')) {
    await db.createTable('worklog', [entry]);
  } else {
    await db.add('worklog', [entry]);
  }
  
  await db.close();
  console.log(`✅ Work logged for ${project}/${role}`);
  console.log(`   Date: ${entry.date}`);
  console.log(`   Task: ${task}`);
  if (feedback) {
    console.log(`   Feedback recorded`);
  }
  return true;
}

// Search worklog by similarity
async function searchWorklog(project, role, queryVector, limit = 10) {
  const dbPath = path.join(BASE_DIR, project, role);
  const db = new LanceDBClient(dbPath);
  await db.open();
  
  const results = await db.search('worklog', queryVector, limit);
  await db.close();
  return results;
}

// Run if called directly
if (require.main === module) {
  const args = parseArgs();
  
  if (!args.project || !args.role || !args.task || !args.output) {
    console.error('Usage: node log-work.js --project <project-key> --role <role-key> --task "<task>" --output "<output>" [--feedback "<feedback>"]');
    console.error('Available projects: novel-bulao-busidewo, dboms-dev');
    process.exit(1);
  }
  
  logWork(args.project, args.role, args.task, args.output, args.feedback)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error logging work:', err);
      process.exit(1);
    });
}

module.exports = { logWork, searchWorklog };
