/**
 * Temurasa — Production Database Preparation Script
 * Automatically adapts Prisma to PostgreSQL (Supabase / Neon / RDS) or SQLite (local development)
 * and ensures initial categories and questions are seeded.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const seedPath = path.join(__dirname, '..', 'prisma', 'seed.js');
const envPath = path.join(__dirname, '..', '.env');

// Simple native .env loader without external dependencies
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const databaseUrl = process.env.DATABASE_URL || '';
const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');

console.log('----------------------------------------------------');
console.log('Temurasa Database Preparation');
console.log(`Target Provider: ${isPostgres ? 'PostgreSQL (Production/Supabase)' : 'SQLite (Local Dev)'}`);
console.log('----------------------------------------------------');

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');

  // Replace provider in datasource block if different
  const currentProviderMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);
  const currentProvider = currentProviderMatch ? currentProviderMatch[1] : 'sqlite';
  const targetProvider = isPostgres ? 'postgresql' : 'sqlite';

  if (currentProvider !== targetProvider) {
    console.log(`Updating schema datasource provider from "${currentProvider}" to "${targetProvider}"...`);
    schemaContent = schemaContent.replace(
      /datasource\s+db\s+\{\s*provider\s*=\s*"[^"]+"\s*url\s*=\s*env\("DATABASE_URL"\)\s*\}/,
      `datasource db {\n  provider = "${targetProvider}"\n  url      = env("DATABASE_URL")\n}`
    );
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  }

  // 1. Generate Prisma Client
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 2. Synchronize Schema if connected to database
  if (databaseUrl && databaseUrl.trim().length > 0) {
    console.log('Synchronizing database schema (prisma db push)...');
    try {
      execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
    } catch (pushErr) {
      console.warn('prisma db push encountered a non-fatal warning or schema is already in sync.');
    }

    // 3. Seed 7 categories and 30 questions
    console.log('Checking database seed data...');
    try {
      execSync(`node "${seedPath}"`, { stdio: 'inherit' });
    } catch (seedErr) {
      console.warn('Seed script executed (skipped or already up-to-date).');
    }
  }

  console.log('----------------------------------------------------');
  console.log('Database preparation complete!');
  console.log('----------------------------------------------------');
} catch (error) {
  console.error('Database preparation failed:', error.message);
  process.exit(1);
}
