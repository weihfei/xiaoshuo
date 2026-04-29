/**
 * Add shared knowledge to project or global
 * 
 * Usage:
 * node skills/lancedb/scripts/add-shared-knowledge.js --scope [global|project] --project <project-key> --topic "<topic>" --content "<content>"
 */

const path = require('path');
const LanceDBClient = require('./lancedb-client');
const { randomVector } = require('./record-lesson');

const GLOBAL_DB_PATH = '/Users/weihefei/Documents/openclaw/workspace/data/lancedb/global';
const { BASE_DIR } = require('./team-training-init');

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    result[key] = args[i + 1];
  }
  return result;
}

async function addKnowledge(scope, project, topic, content) {
  let dbPath;
  let tableName = 'team-shared';
  
  if (scope === 'global') {
    dbPath = GLOBAL_DB_PATH;
  } else if (scope === 'project') {
    if (!project) {
      throw new Error('Project key required for project scope');
    }
    dbPath = path.join(BASE_DIR, project, 'shared');
    tableName = 'knowledge';
  } else {
    throw new Error('Scope must be "global" or "project"');
  }
  
  const db = new LanceDBClient(dbPath);
  await db.open();
  
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    topic: topic,
    content: content,
    vector: randomVector()
  };
  
  const tables = await db.listTables();
  
  if (scope === 'global' && !tables.includes(tableName)) {
    await db.createTable(tableName, [entry]);
  } else if (scope === 'project' && !tables.includes(tableName)) {
    await db.createTable(tableName, [entry]);
  } else {
    await db.add(tableName, [entry]);
  }
  
  await db.close();
  
  console.log(`✅ Shared knowledge added to ${scope}`);
  if (project) console.log(`   Project: ${project}`);
  console.log(`   Topic: ${topic}`);
  return true;
}

// Run if called directly
if (require.main === module) {
  const args = parseArgs();
  
  if (!args.scope || !args.topic || !args.content) {
    console.error('Usage: node add-shared-knowledge.js --scope [global|project] --topic "<topic>" --content "<content>" [--project <project-key>]');
    process.exit(1);
  }
  
  if (args.scope === 'project' && !args.project) {
    console.error('Project key required when scope=project');
    process.exit(1);
  }
  
  addKnowledge(args.scope, args.project, args.topic, args.content)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error adding shared knowledge:', err);
      process.exit(1);
    });
}

module.exports = { addKnowledge, GLOBAL_DB_PATH };
