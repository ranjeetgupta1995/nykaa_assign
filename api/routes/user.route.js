const express = require('express');
const UserModel = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRouter = express.Router();

const salt = bcrypt.genSaltSync(8);
const secret = 'masai';

userRouter.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await UserModel.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.status(200).json(userDoc); 
    } catch(err){
        res.status(400).json({'error': err})
    }
})

userRouter.post('/login', async(req, res) => {
    const {username, password} = req.body;
    const userDoc = await UserModel.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        //logged in
        jwt.sign({username: userDoc.username, id: userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });  
        });
    }else{
        res.status(400).json('wrong credentials')
    }
})



module.exports = userRouter;
