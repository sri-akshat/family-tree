import fs from 'node:fs';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = neon(process.env.DATABASE_URL);
const tree = JSON.parse(fs.readFileSync(new URL('../data/family-tree-seed.json', import.meta.url), 'utf8'));

await sql`
  CREATE TABLE IF NOT EXISTS family_tree (
    id SMALLINT PRIMARY KEY CHECK (id = 1),
    tree JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

const payload = JSON.stringify(tree);
await sql`
  INSERT INTO family_tree (id, tree, updated_at)
  VALUES (1, ${payload}::jsonb, NOW())
  ON CONFLICT (id) DO UPDATE SET tree = EXCLUDED.tree, updated_at = NOW()
`;

console.log('Seeded family_tree id=1 from data/family-tree-seed.json');
