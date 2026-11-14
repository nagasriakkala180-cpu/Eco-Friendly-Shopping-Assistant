const express = require('express');
const path = require('path');
const { db, confidence } = require('./db');

const app = express();
app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const SELECT = `SELECT p.id, p.name, p.price, p.emoji, p.eco_score, p.eco_grade, p.is_provisional, p.missing_fields,
  c.name AS cat, e.carbon, e.materials, e.packaging, e.ethics, e.water, e.durability
  FROM products p JOIN categories c ON c.id = p.category_id JOIN eco_data e ON e.product_id = p.id`;

const shape = (r) => {
  const miss = JSON.parse(r.missing_fields).length;
  return {
    id: r.id, n: r.name, c: r.cat, p: r.price, e: r.emoji,
    v: [r.carbon, r.materials, r.packaging, r.ethics, r.water, r.durability],
    sc: r.eco_score, g: r.eco_grade, prov: !!r.is_provisional, miss, conf: confidence(miss), nu: r.id,
  };
};

const SORTS = {
  eco: 'p.eco_score DESC, p.price ASC',
  pa: 'p.price ASC',
  pd: 'p.price DESC',
  new: 'p.id DESC',
  id: 'p.id ASC',
};
const list = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);
const bad = (res, msg) => res.status(400).json({ error: msg });

app.get('/api/products', (req, res) => {
  const { grade, category, verified, q, sort = 'eco' } = req.query;
  const where = [], args = [];

  if (grade) {
    const g = list(grade).map((x) => x.toUpperCase());
    if (!g.every((x) => /^[A-F]$/.test(x))) return bad(res, 'grade must be letters A-F');
    where.push(`p.eco_grade IN (${g.map(() => '?').join(',')})`); args.push(...g);
  }
  if (category) {
    const c = list(category);
    where.push(`p.category_id IN (SELECT id FROM categories WHERE name IN (${c.map(() => '?').join(',')}))`);
    args.push(...c);
  }
  for (const [key, op] of [['minPrice', '>='], ['maxPrice', '<=']]) {
    if (req.query[key] !== undefined && req.query[key] !== '') {
      const n = Number(req.query[key]);
      if (!Number.isFinite(n) || n < 0) return bad(res, `${key} must be a non-negative number`);
      where.push(`p.price ${op} ?`); args.push(n);
    }
  }
  if (verified === 'true') where.push('p.is_provisional = 0');
  if (q) { where.push('p.name LIKE ?'); args.push(`%${String(q).slice(0, 60)}%`); }
  if (!SORTS[sort]) return bad(res, 'invalid sort');

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit) || 24));
  const w = where.length ? ' WHERE ' + where.join(' AND ') : '';

  const total = db.prepare(`SELECT COUNT(*) AS n FROM products p${w}`).get(...args).n;
  const rows = db.prepare(`${SELECT}${w} ORDER BY ${SORTS[sort]} LIMIT ? OFFSET ?`)
    .all(...args, limit, (page - 1) * limit);
  res.json({ total, page, limit, items: rows.map(shape) });
});

app.get('/api/categories', (_req, res) => {
  res.json(db.prepare('SELECT name FROM categories ORDER BY name').all().map((r) => r.name));
});

app.get('/api/compare', (req, res) => {
  const ids = [...new Set(list(req.query.ids).map(Number))];
  if (!ids.every(Number.isInteger)) return bad(res, 'ids must be integers');
  if (ids.length < 2) return bad(res, 'Select at least 2 products to compare');
  if (ids.length > 5) return bad(res, 'You can compare at most 5 products');
  const rows = db.prepare(`${SELECT} WHERE p.id IN (${ids.map(() => '?').join(',')})`).all(...ids);
  res.json({ items: rows.map(shape) });
});

function userId(req, res) {
  const cid = req.get('x-client-id') || '';
  if (!/^[\w-]{6,80}$/.test(cid)) { bad(res, 'missing or invalid x-client-id'); return null; }
  db.prepare('INSERT OR IGNORE INTO users(client_id) VALUES (?)').run(cid);
  return db.prepare('SELECT id FROM users WHERE client_id = ?').get(cid).id;
}

app.get('/api/wishlists', (req, res) => {
  const uid = userId(req, res); if (uid == null) return;
  const lists = db.prepare('SELECT id, name FROM wishlists WHERE user_id = ? ORDER BY id').all(uid);
  const items = db.prepare('SELECT product_id FROM wishlist_items WHERE wishlist_id = ? ORDER BY rowid');
  res.json({ lists: lists.map((l) => ({ ...l, items: items.all(l.id).map((i) => i.product_id) })) });
});

app.put('/api/wishlists', (req, res) => {
  const uid = userId(req, res); if (uid == null) return;
  const lists = req.body && req.body.lists;
  if (!Array.isArray(lists) || lists.length > 50) return bad(res, 'lists must be an array (max 50)');
  const exists = db.prepare('SELECT 1 FROM products WHERE id = ?');
  const insL = db.prepare('INSERT INTO wishlists(user_id,name) VALUES (?,?)');
  const insI = db.prepare('INSERT OR IGNORE INTO wishlist_items VALUES (?,?)');
  db.transaction(() => {
    db.prepare('DELETE FROM wishlists WHERE user_id = ?').run(uid);
    for (const l of lists) {
      const name = String(l.name || '').trim().slice(0, 40);
      if (!name) continue;
      const wid = insL.run(uid, name).lastInsertRowid;
      for (const pid of Array.isArray(l.items) ? l.items : []) {
        if (Number.isInteger(pid) && exists.get(pid)) insI.run(wid, pid);
      }
    }
  })();
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`GreenCart running at http://localhost:${PORT}`));