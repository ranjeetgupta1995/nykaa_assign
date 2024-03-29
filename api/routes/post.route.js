const express = require('express');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
const PostModel = require('../models/Post.model');
const jwt = require('jsonwebtoken');

const secret = 'masai';

const postRouter = express.Router();

postRouter.post('/', uploadMiddleware.single('file'), async(req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req. cookies;
    jwt.verify(token, secret, {}, async(err, info) => {
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await PostModel.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
    
});

postRouter.put('/', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if(req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async(err, info) => {
        if(err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await PostModel.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            title, 
            summary, 
            content,
            cover: newPath? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });

});

postRouter.get('/', async(req, res) => { 
    res.json(
        await PostModel.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

postRouter.get('/:id', async(req, res) => {
    const {id} = req.params;
    const postDoc = await PostModel.findById(id).populate('author', ['username']);
    res.json(postDoc);
});



module.exports = postRouter;
