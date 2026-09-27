import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const rows = await sql`SELECT tree, updated_at FROM family_tree WHERE id = 1`;
    if (!rows.length) return res.status(404).json({ error: 'Tree not seeded' });
    return res.status(200).json({ tree: rows[0].tree, updatedAt: rows[0].updated_at });
  }

  if (req.method === 'PUT') {
    const supplied = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!process.env.EDIT_PIN || supplied !== process.env.EDIT_PIN) {
      return res.status(401).json({ error: 'Invalid edit PIN' });
    }
    const tree = req.body?.tree;
    if (!tree || typeof tree !== 'object' || !tree.id || !tree.name) {
      return res.status(400).json({ error: 'Invalid tree payload' });
    }
    const payload = JSON.stringify(tree);
    const rows = await sql`
      INSERT INTO family_tree (id, tree, updated_at)
      VALUES (1, ${payload}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET tree = EXCLUDED.tree, updated_at = NOW()
      RETURNING updated_at
    `;
    return res.status(200).json({ ok: true, updatedAt: rows[0].updated_at });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
