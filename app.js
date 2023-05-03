import express from 'express';
import cors from 'cors';

import { db } from './db/db.js';

// Connect to MySQL on start
db.connect();

//Create app
const app = express();

//Enable ALL CORS Requests
app.use(cors());

//App modules
app.use(express.urlencoded({extended:false, limit: '50mb'}));
app.use(express.json({type: ['json', 'text'], limit: '50mb'}));

//Base routes
app.get('/welcome', (req, res) =>{
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({message:`Welcome to Notes API`}));
});

//Load routes
import { router as noteRoutes } from './routes/note_routes.js';
app.use('/note',noteRoutes);

//Start server
global.server = app.listen(3080, () => {
  console.log("API running on port 3080");
});


