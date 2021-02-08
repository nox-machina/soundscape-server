const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express()
const port = process.env.PORT || 3000;

//-- routes --//
const users = require('./routes/users');

//-- middleware --//
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: ['*'],
        exposedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Access-Control-Allow-Headers']
    })
);
app.use('/', users);

//-- database --//
mongoose.connect(`${process.env.SSDB}`, {useNewUrlParser:true, useUnifiedTopology: true}, () => {
    console.log("SSDB Online.")
})

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}`))