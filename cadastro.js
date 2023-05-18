const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar o body-parser para lidar com as requisições POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conectar-se ao banco de dados MongoDB
MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db();

    // Definir o esquema do modelo de dados
    const userCollection = db.collection('users');

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

    // Rota para criar um novo usuário
    router.post('/users', (req, res) => {
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      userCollection.insertOne(user)
        .then(() => {
          res.json({ message: 'Usuário criado com sucesso!' });
        })
        .catch((err) => {
          res.status(500).json({ error: 'Erro ao criar o usuário.' });
        });
    });

    // Iniciar o servidor
    app.use('/api', router);
    app.listen(port, () => {
      console.log(`Servidor em execução no endereço http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Erro na conexão com o banco de dados:', err);
  });
