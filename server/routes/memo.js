import express from 'express';
import { processQuery } from '../database/pool';

const router = express.Router();

router.post('/', async (req, res) => {
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }
    
    if(typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    if(req.body.contents === "") {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });   
    }
    const ID = req.session.loginInfo._id;
    const content = req.body.contents;
    const now = new Date();
    await processQuery(
        `INSERT INTO memo (uid,content,created,edited) VALUES (?,?,?,?)`
        ,[ID,content,now,now]);
    return res.json({ success: true });
});

router.put('/:id',async (req, res) => {
    if(isNaN(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }
    if(typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }
    if(req.body.contents === "") {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });   
    }
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 3
        });
    }
    const result = await processQuery(
        `SELECT * FROM memo WHERE memo_id = ?`
        ,[req.params.id]);
    if(!result) {
        return res.status(404).json({
            error: "NO RESOURCE",
            code: 4
        });
    }
    const memo = result[0];
    if(memo.uid != req.session.loginInfo._id) {
        return res.status(403).json({
            error: "PERMISSION FAILURE",
            code: 5
        });
    }
    const now = new Date();
    await processQuery(
        `UPDATE memo SET content = ?, edited = ?, is_edited = 1 WHERE memo_id = ?`
        ,[req.body.contents,now,req.params.id]);
    return res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
    if(isNaN(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 2
        });
    }
    const result = await processQuery(
        `SELECT * FROM memo WHERE memo_id = ?`
        ,[req.params.id]);
    if(!result) {
        return res.status(404).json({
            error: "NO RESOURCE",
            code: 3
        });
    }
    const memo = result[0];
    if(memo.uid != req.session.loginInfo._id) {
        return res.status(403).json({
            error: "PERMISSION FAILURE",
            code: 4
        });
    }
    await processQuery(
        `DELETE FROM memo WHERE memo_id = ?`
        ,[req.params.id]);
    res.json({ success: true });
});

router.get('/', async (req, res) => {
    const memos = await processQuery(
        `SELECT memo_id, username,content, starred, created, edited, is_edited 
        FROM memo NATURAL JOIN account ORDER BY memo_id DESC LIMIT 6`
        ,[]);
    res.json(memos);
});

export default router;