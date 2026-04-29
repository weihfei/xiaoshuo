/**
 * LanceDB Client Wrapper
 * 
 * Provides simplified interface for common vector database operations
 */

const lancedb = require('@lancedb/lancedb');

class LanceDBClient {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  /**
   * Open or create the database
   */
  async open() {
    this.db = await lancedb.connect(this.dbPath);
    return this;
  }

  /**
   * List all tables in the database
   */
  async listTables() {
    return await this.db.tableNames();
  }

  /**
   * Open a table
   */
  async openTable(tableName) {
    return await this.db.openTable(tableName);
  }

  /**
   * Create a new table with initial data
   */
  async createTable(tableName, data) {
    return await this.db.createTable(tableName, data);
  }

  /**
   * Add data to an existing table
   */
  async add(tableName, data) {
    const table = await this.openTable(tableName);
    await table.add(data);
    return table;
  }

  /**
   * Search for similar vectors
   * @param {string} tableName - Table to search
   * @param {number[]} queryVector - Query embedding
   * @param {number} limit - Number of results to return
   */
  async search(tableName, queryVector, limit = 10) {
    const table = await this.openTable(tableName);
    return await table.search(queryVector)
      .limit(limit)
      .toArray();
  }

  /**
   * Delete the table
   */
  async dropTable(tableName) {
    await this.db.dropTable(tableName);
  }

  /**
   * Close the database connection
   */
  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

module.exports = LanceDBClient;
