import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultSchema = {
  users: [],
  problems: [],
  history: [],
  chat_threads: [],
  notifications: [],
};

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return { ...defaultSchema, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error("Error reading database file, initializing defaults:", err);
  }
  return { ...defaultSchema };
}

let dbMemory = loadDb();

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbMemory, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

// Ensure initial file exists
if (!fs.existsSync(DB_FILE)) {
  saveDb();
}

export const db = {
  get(collection) {
    return dbMemory[collection] || [];
  },

  findOne(collection, filterFn) {
    const list = dbMemory[collection] || [];
    return list.find(filterFn) || null;
  },

  find(collection, filterFn) {
    const list = dbMemory[collection] || [];
    return filterFn ? list.filter(filterFn) : [...list];
  },

  insert(collection, item) {
    if (!dbMemory[collection]) {
      dbMemory[collection] = [];
    }
    const maxId = dbMemory[collection].reduce((max, obj) => Math.max(max, obj.id || 0), 0);
    const newItem = {
      id: maxId + 1,
      ...item,
      created_at: item.created_at || new Date().toISOString(),
    };
    dbMemory[collection].push(newItem);
    saveDb();
    return newItem;
  },

  update(collection, filterFn, updaterFn) {
    if (!dbMemory[collection]) return null;
    const index = dbMemory[collection].findIndex(filterFn);
    if (index === -1) return null;

    const current = dbMemory[collection][index];
    const updated = typeof updaterFn === "function" ? updaterFn(current) : { ...current, ...updaterFn };
    dbMemory[collection][index] = updated;
    saveDb();
    return updated;
  },

  delete(collection, filterFn) {
    if (!dbMemory[collection]) return false;
    const initialLen = dbMemory[collection].length;
    dbMemory[collection] = dbMemory[collection].filter((item) => !filterFn(item));
    saveDb();
    return dbMemory[collection].length !== initialLen;
  },

  getPath() {
    return DB_FILE;
  },
};

export default db;
