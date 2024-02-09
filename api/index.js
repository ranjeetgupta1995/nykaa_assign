const express = require('express');
const cors = require('cors');
const connection = require('./db');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');

const app = express();

const secret = 'masai';

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get("/", (req, res) => {
    res.json("test ok")
})

//userRouter
app.use('/users', userRouter);

//profile
app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    })
    res.json(req.cookies);
});

//logout 
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

//postRouter
app.use('/post', postRouter)

app.listen(4000, async() => {
    try{
        await connection;
        console.log('Server is running at port 4000');
        console.log('Server is connected to DB')
    }
    catch(err){
        console.log(err)
    }
});
