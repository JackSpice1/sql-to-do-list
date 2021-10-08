//requires
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//uses
app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended:true}));

//global variables 
const PORT = 5000;
const pool = require( './modules/pool');

// listening requests to port
app.listen(PORT, ()=> {
    console.log('listening on port:', PORT);
});

//routes 

//GET

//POST

//UPDATE

//DELETE