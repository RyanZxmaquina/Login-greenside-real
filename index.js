const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Configurar a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'aluno',
  database: 'mydb',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida.');
});

// Configurar a sessão
app.use(
  session({
    secret: 'sua_chave_secreta',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); // se acontecer algo apaga essa linha 39


// Configurar EJS como o motor de visualização
app.set('view engine', 'ejs');

// Rota para a página de login
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/dashboard');
    } else {
      res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
    }
  });
});

// Rota para a página do painel
app.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(__dirname + '/index.html');
  } else {
    res.send('Faça login para acessar esta página. <a href="/">Login</a>');
  }
});

// Rota para fazer logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});




/////////////////////////////////////////////////////////////////////////oi//////////////////////////////////////////////////////



// Configurar o Express para servir arquivos estáticos da pasta "public".
app.use(express.static('public'));

// Configurar o Express para usar as visualizações da pasta "views".
app.set('view engine', 'ejs'); // Defina o mecanismo de visualização como EJS
app.set('views', 'views'); // Defina o diretório de visualizações como "views"

// Agora você pode definir rotas que renderizam as visualizações EJS.
app.get('/', (req, res) => {
  res.render('index'); // Renderiza a visualização "index.ejs" da pasta "views".
});

// Outras rotas e lógica do aplicativo podem ser definidas aqui.

// Inicie o servidor na porta desejada.
const port = 3001;
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
