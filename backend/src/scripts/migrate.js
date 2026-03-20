const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function runMigrations() {
  try {
    console.log('Running migrations...');

    const initSql = fs.readFileSync(path.join(__dirname, '../../migrations/001_init.sql'), 'utf8');
    await pool.query(initSql);
    console.log('001_init.sql applied');

    const seedSql = fs.readFileSync(path.join(__dirname, '../../migrations/002_seed.sql'), 'utf8');
    await pool.query(seedSql);
    console.log('002_seed.sql applied');

    console.log('Migrations complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
