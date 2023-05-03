import { db } from '../db/db.js';

// Connect to MySQL
db.connect();

//Run migration
const promisePool = db.get();
await promisePool.query("CREATE TABLE IF NOT EXISTS notes (id_note INT NOT NULL AUTO_INCREMENT, title VARCHAR(255) NOT NULL, content TEXT NULL, PRIMARY KEY (id_note))");

//Disconnect from MySQL
db.end();