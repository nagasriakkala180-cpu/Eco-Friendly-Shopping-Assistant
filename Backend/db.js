const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database(path.join(__dirname, 'greencart.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  price INTEGER NOT NULL CHECK (price >= 0),
  emoji TEXT,
  eco_score INTEGER NOT NULL,
  eco_grade TEXT NOT NULL CHECK (eco_grade IN ('A','B','C','D','E','F')),
  is_provisional INTEGER NOT NULL DEFAULT 0,
  missing_fields TEXT NOT NULL DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS eco_data (
  product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  carbon INTEGER, materials INTEGER, packaging INTEGER,
  ethics INTEGER, water INTEGER, durability INTEGER
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS wishlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS wishlist_items (
  wishlist_id INTEGER NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (wishlist_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_products_filter ON products(category_id, eco_grade, price);
CREATE INDEX IF NOT EXISTS idx_products_grade ON products(eco_grade);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_cat ON products(category_id);
`);

const FIELDS = ['Carbon footprint', 'Recycled materials', 'Packaging', 'Ethical certification', 'Water use', 'Durability'];
const WEIGHTS = [0.3, 0.2, 0.15, 0.15, 0.1, 0.1];

function computeScore(values) {
  let tw = 0, t = 0;
  values.forEach((v, i) => { if (v != null) { tw += WEIGHTS[i]; t += v * WEIGHTS[i]; } });
  const score = tw ? Math.round(t / tw) : 0;
  const grade = !tw ? 'F' : score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : score >= 20 ? 'E' : 'F';
  const missing = FIELDS.filter((_, i) => values[i] == null);
  return { score, grade, missing };
}
const confidence = (miss) => (miss === 0 ? 'High' : miss <= 2 ? 'Medium' : 'Low');

if (!db.prepare('SELECT COUNT(*) AS n FROM products').get().n) {
  const lines = fs.readFileSync(path.join(__dirname, 'data.txt'), 'utf8').trim().split('\n');
  const insCat = db.prepare('INSERT OR IGNORE INTO categories(name) VALUES (?)');
  const getCat = db.prepare('SELECT id FROM categories WHERE name = ?');
  const insProd = db.prepare(`INSERT INTO products(name,category_id,price,emoji,eco_score,eco_grade,is_provisional,missing_fields)
                              VALUES (?,?,?,?,?,?,?,?)`);
  const insEco = db.prepare('INSERT INTO eco_data VALUES (?,?,?,?,?,?,?)');
  db.transaction(() => {
    for (const line of lines) {
      const [name, cat, price, emoji, s] = line.split('|');
      const v = s.split(',').map((x) => (x === '-' ? null : Number(x)));
      const { score, grade, missing } = computeScore(v);
      insCat.run(cat);
      const pid = insProd.run(name, getCat.get(cat).id, Number(price), emoji, score, grade,
        missing.length ? 1 : 0, JSON.stringify(missing)).lastInsertRowid;
      insEco.run(pid, ...v);
    }
  })();
  console.log(`Seeded ${lines.length} products`);
}

module.exports = { db, FIELDS, confidence };