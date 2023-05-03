import { Router } from 'express';
import { check, oneOf, validationResult, matchedData } from 'express-validator';

import { db } from '../db/db.js';

export const router = Router();

////////////////////////////////////////////////////////////////////////
//                 Get all notes
////////////////////////////////////////////////////////////////////////
router.get('/all', async(req,res) => { try {
  res.setHeader('Content-Type', 'application/json');
  console.log('GET note/all');
  
  //Get notes
  const promisePool = db.get();
  const [Notes] = await promisePool.query("SELECT id_note, title, content FROM notes;");
  
  return res.status(200).send(JSON.stringify({success:true,data:{notes:Notes}}, null, 3));
} catch(err){
  req.err = err;
  return res.status(500).send(JSON.stringify({success:false,error:{code:301,message:"Error in service or database", details:err.toString()}}, null, 3));
}});

////////////////////////////////////////////////////////////////////////
//                 Get a note
////////////////////////////////////////////////////////////////////////
router.get('/:note_id', [
  check('note_id')
    .exists().withMessage('note_id is required')
    .isInt({min:1}).withMessage('Should be an integer greater than 0')], 
async function(req,res){ try {
  res.setHeader('Content-Type', 'application/json');
  console.log('GET note/:id_note');
	
  //Handle validation errors
  let error, errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(JSON.stringify({success:false,error:{code:201, message:"Request has invalid data",details:errors}}, null, 3));
  
  //Get matched data
  const data = matchedData(req);

	//Get note
  const promisePool = db.get();
  const [[Note]] = await promisePool.query("SELECT id_note, title, content FROM notes WHERE id_note = ?;", [data.note_id]);
  
  return res.status(200).send(JSON.stringify({success:true,data:{note:Note}}, null, 3));
} catch(err){
  req.err = err;
  return res.status(500).send(JSON.stringify({success:false,error:{code:301,message:"Error in service or database", details:err.toString()}}, null, 3));
}});

////////////////////////////////////////////////////////////////////////
//                     Create a new note 
////////////////////////////////////////////////////////////////////////
router.post('', [
  check('title')
    .exists().withMessage('title is required')
    .isLength({min:1, max: 255}).withMessage('Must be between 1 and 255 characters long')
    .trim(),
  check('content')
    .optional()
    .isLength({min:1, max: 16535}).withMessage('Must be between 1 and 16535 characters long')
    .trim()],
async (req,res) => { try {
  res.setHeader('Content-Type', 'application/json');
  console.log('POST note');
    	
  //Handle validation errors
  let error, errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send(JSON.stringify({success:false,error:{code:201, message:"Request has invalid data",details:errors}}, null, 3));
      
  //Get matched data
  const data = matchedData(req);

  //Create note
  const promisePool = db.get();
  const [Note] = await promisePool.query("INSERT INTO notes (title, content) VALUES(?,?);", [data.title, data.content]);

  return res.status(200).send(JSON.stringify({success:true,data:{note_id:Note.insertId}}, null, 3));
}
catch(err){
  req.err = err;
  return res.status(500).send(JSON.stringify({success:false,error:{code:301,message:"Error in service or database", details:err.toString()}}, null, 3));
}});

////////////////////////////////////////////////////////////////////////
//                     Edit a note 
////////////////////////////////////////////////////////////////////////
router.patch('/:note_id', [
  check('note_id')
    .exists().withMessage('note_id is required')
    .isInt({min:1}).withMessage('Should be an integer greater than 0'),
  check('title')
    .optional()
    .isLength({min:1, max: 255}).withMessage('Must be between 1 and 255 characters long')
    .trim(),
  check('content')
    .optional()
    .isLength({min:1, max: 16535}).withMessage('Must be between 1 and 16535 characters long')
    .trim()],
async (req,res) => { try {
  res.setHeader('Content-Type', 'application/json');
  console.log('PATCH note/:id_note');
    	
  //Handle validation errors
  let error, errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send(JSON.stringify({success:false,error:{code:201, message:"Request has invalid data",details:errors}}, null, 3));
      
  //Get matched data
  const data = matchedData(req);

  //Edit note
  if(data.title && data.content) {
    const promisePool = db.get();
    const [Note] = await promisePool.query("UPDATE notes SET title = ?, content = ? WHERE id_note = ?;", [data.title, data.content, data.note_id]);
  } else if (data.title) {
    const promisePool = db.get();
    const [Note] = await promisePool.query("UPDATE notes SET title = ? WHERE id_note = ?;", [data.title, data.note_id]);
  } else if (data.content) {
    const promisePool = db.get();
    const [Note] = await promisePool.query("UPDATE notes SET content = ? WHERE id_note = ?;", [data.content, data.note_id]);
  }

  return res.status(200).send(JSON.stringify({success:true,data:{}}, null, 3));
}
catch(err){
  req.err = err;
  return res.status(500).send(JSON.stringify({success:false,error:{code:301,message:"Error in service or database", details:err.toString()}}, null, 3));
}});

////////////////////////////////////////////////////////////////////////
//                     Delete a note 
////////////////////////////////////////////////////////////////////////
router.delete('/:note_id', [
  check('note_id')
    .exists().withMessage('note_id is required')
    .isInt({min:1}).withMessage('Should be an integer greater than 0')],
async (req,res) => { try {
  res.setHeader('Content-Type', 'application/json');
  console.log('DELETE note/:id_note');
    	
  //Handle validation errors
  let error, errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send(JSON.stringify({success:false,error:{code:201, message:"Request has invalid data",details:errors}}, null, 3));
      
  //Get matched data
  const data = matchedData(req);

  //Delete note
  
  const promisePool = db.get();
  const [Note] = await promisePool.query("DELETE FROM notes WHERE id_note = ?;", [data.note_id]);

  return res.status(200).send(JSON.stringify({success:true,data:{}}, null, 3));
}
catch(err){
  req.err = err;
  return res.status(500).send(JSON.stringify({success:false,error:{code:301,message:"Error in service or database", details:err.toString()}}, null, 3));
}});