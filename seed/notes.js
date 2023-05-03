import { db } from '../db/db.js';

// Connect to MySQL
db.connect();

//Run seed
const promisePool = db.get();
await promisePool.query("INSERT INTO notes(id_note, title, content) VALUES (1, 'Nota 1', 'Esta es una nota de prueba');");
await promisePool.query("INSERT INTO notes(id_note, title, content) VALUES (2, 'Nota 2', 'Esta también es una nota de prueba');");

//Disconnect from MySQL
db.end();


