const express = require('express');
const low = require('lowdb');
const bodyParser = require('body-parser');
const FileSync = require('lowdb/adapters/FileSync')
const jsoncrement = require('jsoncrement')

const adapter = new FileSync('db.json')
const db = low(adapter)

const app = express();

const hostname = '127.0.0.1';
const port = '3000';

db.defaults({todos: []}).write()

app.use(bodyParser.json())
.set('views', './views')
.use(express.static(__dirname + '/public'))

.use(bodyParser.urlencoded({extended: false}))


.get('/todo', (req, res) => {
  let todos = db.get('todos').filter({status: "todo"}).value();
  let doing = db.get('todos').filter({status: "doing"}).value();
  let done = db.get('todos').filter({status: "done"}).value();

  res.setHeader("Content-type", "text/html");
  res.render('index.ejs', {todos: todos, doing: doing, done: done});
})

.post('/todo/add', (req, res) => {
  if(req.body.todo != '') {
    if (db.get('todos').value().length === 0) {
      db.get('todos').push({title: req.body.title, status: "todo", id: 1}).write()  
    } else {
      db.get('todos').push(jsoncrement.iterate(db.get('todos').value(), 'id', {title: req.body.title, status: "todo"})).write()
    }
  }
  res.end('POST feito');
})

.put('/todo/:id', (req, res) => {
  db.get('todos').find({id: parseInt(req.params.id)}).assign(req.body).write()
  res.end('PUT feito');
})

.delete('/todo/:id', (req, res) => {
  if (req.params.id != '') {
    db.get('todos').remove({ id: parseInt(req.params.id)}).write()
  }
  res.send('DELETE feito');
})

.listen(3000, () => {
  console.log("Server running at https://127.0.0.1:3000/todo");
});