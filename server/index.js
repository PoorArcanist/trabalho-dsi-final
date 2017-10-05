"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

function getClient() {
  return new pg.Client({
    host: 'localhost',
    port: 5432,
    database: 'cadpessoa',
    user: 'postgres',
    password: 'univel',
  });
}

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('.'));

app.get('/api', (req, res) => {
  const nome = req.body.nome;
  console.log(nome)
  res.status(200).send('Aplicação executando')
});

app.post('/app/cadpessoa', (req, res) => {

  const nome = req.body.nome;
  const idade = req.body.idade;
  const sobrenome = req.body.sobrenome;
  const profissao = req.body.profissao;
  const client = getClient();
  client.connect()
  client.query("INSERT INTO pessoa VALUES($1,$2,$3,$4)",[nome,sobrenome,profissao,idade], (err, item) => {
    if(err){
      res.json(err)
      return next(err)
    } else {
      res.redirect("http://localhost:4200/");
    }
    client.end();
  })
})

app.get('/todos', (req, res) => {
  const client = getClient();

  client.connect();

  client.query("SELECT * FROM pessoa", (err, result) => {

    if(err){
      res.json(err)
      return next(err)
    } else {
      res.status(200).json(result.rows)
    }

    client.end();
  })
});

app.listen(3000, function () {
  console.log('Servidor iniciado.')
})
