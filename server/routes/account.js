import express from 'express';
import bcrypt from 'bcryptjs';
import { processQuery } from '../database/pool';

const router = express.Router();

const generateHash = (password) => bcrypt.hashSync(password, 8);
const validateHash = (password,input) => bcrypt.compareSync(password, input);

router.post('/signup', async (req, res) => {
    let usernameRegex = /^[a-z0-9]+$/;
    console.log(req.body);

    if(!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }
    
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }
    const ID = req.body.username;
    const result = await processQuery('SELECT * FROM account WHERE username = ?', [ID]);
    if(result.length > 0) {
        return res.status(409).json({
            error: "USERNAME EXISTS",
            code: 3
        });
    } else {
        const PW = generateHash(req.body.password);
        const NOW = new Date();
        await processQuery(
            'INSERT INTO account (username,password,created_at) VALUES (?,?,?);'
            , [ID,PW,NOW]);
        return res.json({ success: true });
    }
});

router.post('/signin', async (req, res) => {
    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }
    const ID = req.body.username;
    const result = await processQuery('SELECT * FROM account WHERE username = ?',[ID]);
    if(result.length > 0) {
        if(!validateHash(req.body.password,result[0].password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }
        let session = req.session;
        session.loginInfo = {
            _id: result[0].uid,
            username: result[0].username
        };

        return res.json({ success: true });
    } else {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }
});

router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ sucess: true });
});

export default router;