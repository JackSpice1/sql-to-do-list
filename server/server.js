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
// ROUTES
app.get('/tasks', (req, res)=>{
    const queryString = `SELECT * FROM tasks ORDER BY id`;
    pool.query( queryString ).then( (results)=> {
      res.send(results.rows );
    }).catch( (err )=>{
      console.log( err);
      res.sendStatus( 500);
    })
  })
//POST
app.post('/tasks', (req, res)=>{
    console.log('/tasks POST:', req.body);
    const queryString = 'INSERT INTO tasks  (task, completed) VALUES ($1, $2)';
    const values = [req.body.task, req.body.completed];
    pool.query( queryString, values).then( (results)=>{
        res.sendStatus(201); //item creaated
    }).catch( (err)=>{
        console.log('err');
        res.sendStatus(500);
    })
})
//UPDATE
app.put('/tasks', (req,res)=> {
    console.log('/tasks PUT hit:', req.query);
    let queryString= '';
    //if statement to make button toggle 
    if(req.body.completed ==="true"){
        queryString= `UPDATE "tasks" SET completed=false WHERE id=${req.query.id};`
    }else{
        queryString= `UPDATE "tasks" SET completed=true WHERE id=${req.query.id};`
    }
    pool.query(queryString).then((results)=>{
      res.sendStatus(200);
    }).catch((err)=>{
      console.log('error deleting task from database:', err);
      res.sendStatus(500);
    })
  })

//DELETE
app.delete('/tasks', (req,res)=> {
    console.log('/tasks delete hit:', req.query);
    const queryString = `DELETE FROM tasks WHERE id='${req.query.id}';`;
    pool.query(queryString).then((results)=>{
      res.sendStatus(200);
    }).catch((err)=>{
      console.log('error deleting task from database:', err);
      res.sendStatus(500);
    })
  })

 

