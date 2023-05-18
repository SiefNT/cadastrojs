const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar o body-parser para lidar com as requisições POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conectar-se ao banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Verificar a conexão com o banco de dados
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o banco de dados:'));
db.once('open', () => {
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

// Definir o esquema do modelo de dados
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

// Criar o modelo "User" baseado no esquema
const User = mongoose.model('User', userSchema);

// Rotas da API
const router = express.Router();

// Middleware para todas as requisições
router.use((req, res, next) => {
  console.log('Requisição sendo processada...');
  next();
});

// Rota de exemplo
router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de cadastro!' });
});

// Rotas para CRUD de usuários
router.route('/users')
  // Criar um novo usuário
  .post((req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
    });

    user.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: 'Usuário criado com sucesso!' });
      }
    });
  })
  // Obter todos os usuários
  .get((req, res) => {
    User.find((err, users) => {
      if (err) {
        res.send(err);
      } else {
        res.json(users);
      }
    });
  });

// Rotas para um usuário específico
router.route('/users/:user_id')
  // Obter um usuário por ID
  .get((req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) {
        res.send(err);
      } else if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Usuário não encontrado!' });
      }
    });
  });

// Registrar as rotas
app.use('/api', router);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
