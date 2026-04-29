---
name: lancedb
description: Lightweight embedded vector database powered by LanceDB. Provides local vector storage, semantic search, and embeddings management for AI agents. Use when you need to store and query vector embeddings for semantic search, knowledge base, RAG applications.
---

# LanceDB Skill

Lightweight embedded vector database for local semantic search and RAG.

## Installation

First install the LanceDB npm package in your project:

```bash
npm install lancedb @lancedb/vectordb
```

## Basic Usage

### Create or open a database

```javascript
const lancedb = require('lancedb');
const db = await lancedb.open('./path/to/db');
```

### Create a table with embeddings

```javascript
const table = await db.createTable('my_table', [
  { vector: [0.1, 0.2, ...], text: "Sample text", id: 1 }
]);
```

### Semantic search

```javascript
const results = await table.search(queryVector)
  .limit(10)
  .toArray();
```

## Common Operations

See `scripts/` for ready-to-use helper functions:

- `scripts/lancedb-client.js` - Client wrapper with common operations
- `scripts/generate-embeddings.js` - Generate embeddings using OpenAI API

## When to use

- Local RAG applications
- Semantic search over documents/code
- Embeddings storage for agent memory
- Small to medium scale vector datasets

## When not to use

- Large-scale production datasets (100M+ vectors) - use Pinecone/Weaviate
- Distributed vector search - needs client-server architecture
