import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const TREE_KEY = 'family-tree:current';

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
    const tree = await redis.get(TREE_KEY);
    if (!tree) return res.status(404).json({ error: 'Tree not initialized' });
    return res.status(200).json({ tree, updatedAt: await redis.get(TREE_KEY + ':updatedAt') });
  }

  if (req.method === 'PUT') {
    const expected = process.env.EDIT_PIN;
    const supplied = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!expected || supplied !== expected) return res.status(401).json({ error: 'Invalid edit PIN' });

    const tree = req.body?.tree;
    if (!tree || typeof tree !== 'object' || !tree.id || !tree.name) {
      return res.status(400).json({ error: 'Invalid tree payload' });
    }

    const updatedAt = new Date().toISOString();
    await redis.set(TREE_KEY, tree);
    await redis.set(TREE_KEY + ':updatedAt', updatedAt);
    return res.status(200).json({ ok: true, updatedAt });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
