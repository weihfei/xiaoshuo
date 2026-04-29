/**
 * Team Agent Training Framework - Initialization
 * 
 * Initialize vector databases for all team members
 * Supports multiple projects, extensible for new teams
 */

const LanceDBClient = require('./lancedb-client');

// Base directory for all vector data
const BASE_DIR = '/Users/weihefei/Documents/openclaw/workspace/data/lancedb/projects';

// Team definitions - add new teams here
const TEAMS = {
  'novel-bulao-busidewo': {
    name: '《不老不死的我》小说创作团队',
    roles: [
      'chief-editor',        // 总编/项目经理
      'setting-architect',   // 设定架构师
      'plot-director',       // 剧情总监
      'writer',              // 码字官
      'quality-inspector',   // 质检员
      'rhythm-designer',     // 节奏师
      'idea-generator',      // 脑洞师
      'character-designer',  // 人设师
      'reviewer',            // 复盘师
      'project-coordinator'  // 协调
    ]
  },
  'dboms-dev': {
    name: 'DBOMS 软件开发团队',
    roles: [
      'architect',           // 系统架构师
      'requirement-analyst', // 需求分析师
      'frontend-dev',        // 前端开发
      'backend-dev',         // 后端开发
      'tester',              // 测试工程师
      'doc-writer',          // 文档工程师
      'devops',              // 运维部署
      'product-manager',     // 产品经理
      'project-coordinator'  // 协调
    ]
  }
};

async function initTeamProject(projectKey, teamConfig) {
  console.log(`\nInitializing: ${teamConfig.name}`);
  
  for (const role of teamConfig.roles) {
    const dbPath = `${BASE_DIR}/${projectKey}/${role}`;
    const db = new LanceDBClient(dbPath);
    await db.open();
    
    const tables = await db.listTables();
    if (!tables.includes('lessons')) {
      // Create lessons table with placeholder - will be filled when lessons learned
      await db.createTable('lessons', [{
        id: 'init',
        date: '2026-03-26',
        title: 'Initialization',
        content: 'Table initialized, waiting for lessons',
        vector: Array.from({length: 384}, () => 0)
      }]);
      console.log(`  ✅ ${role} - lessons table created`);
    } else {
      console.log(`  ⚠️  ${role} - lessons table already exists`);
    }
    
    if (!tables.includes('worklog')) {
      await db.createTable('worklog', [{
        id: 'init',
        date: '2026-03-26',
        timestamp: '2026-03-26T00:00:00Z',
        task: 'Initialization',
        output: 'Table initialized',
        feedback: '',
        vector: Array.from({length: 384}, () => 0)
      }]);
      console.log(`  ✅ ${role} - worklog table created`);
    }
    
    await db.close();
  }
  
  // Create project shared knowledge table
  const sharedDbPath = `${BASE_DIR}/${projectKey}/shared`;
  const sharedDb = new LanceDBClient(sharedDbPath);
  await sharedDb.open();
  const sharedTables = await sharedDb.listTables();
  
  if (!sharedTables.includes('knowledge')) {
    await sharedDb.createTable('knowledge', [{
      id: 'init',
      date: '2026-03-26',
      topic: 'Initialization',
      content: 'Project shared knowledge initialized',
      vector: Array.from({length: 384}, () => 0)
    }]);
    console.log(`  ✅ project-shared - knowledge table created`);
  }
  await sharedDb.close();
  
  console.log(`  Completed: ${teamConfig.name} (${teamConfig.roles.length} roles)`);
}

async function initAllTeams() {
  console.log('=== Initializing Team Agent Training Framework ===');
  
  // Initialize global shared tables
  const globalDbPath = '/Users/weihefei/Documents/openclaw/workspace/data/lancedb/global';
  const globalDb = new LanceDBClient(globalDbPath);
  await globalDb.open();
  const globalTables = await globalDb.listTables();
  
  if (!globalTables.includes('team-shared')) {
    await globalDb.createTable('team-shared', [{
      id: 'init',
      date: '2026-03-26',
      topic: 'Initialization',
      content: 'Global team shared knowledge initialized',
      vector: Array.from({length: 384}, () => 0)
    }]);
    console.log('✅ Global: team-shared-knowledge created');
  }
  await globalDb.close();
  
  // Initialize each project
  for (const [key, config] of Object.entries(TEAMS)) {
    await initTeamProject(key, config);
  }
  
  console.log('\n=== All teams initialized! ===');
  console.log(`Total projects: ${Object.keys(TEAMS).length}`);
  let totalRoles = 0;
  Object.values(TEAMS).forEach(t => totalRoles += t.roles.length);
  console.log(`Total roles: ${totalRoles}`);
  console.log('\nTo add a new team:');
  console.log('1. Add project to TEAMS object in this script');
  console.log('2. Run: node skills/lancedb/scripts/team-training-init.js');
  console.log('Done automatically.');
}

// Add a method to add new role to existing project
async function addRole(projectKey, roleName) {
  const dbPath = `${BASE_DIR}/${projectKey}/${roleName}`;
  const db = new LanceDBClient(dbPath);
  await db.open();
  const tables = await db.listTables();
  
  if (!tables.includes('lessons')) {
    await db.createTable('lessons', []);
  }
  if (!tables.includes('worklog')) {
    await db.createTable('worklog', []);
  }
  await db.close();
  console.log(`Added role '${roleName}' to project '${projectKey}'`);
}

// Run if called directly
if (require.main === module) {
  initAllTeams()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error initializing teams:', err);
      process.exit(1);
    });
}

module.exports = { initAllTeams, initTeamProject, addRole, TEAMS, BASE_DIR };
