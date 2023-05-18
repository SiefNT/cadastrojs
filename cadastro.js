//importação dos módulos
const express = require('express');//Framework web para node.js
const bodyParser = require('body-parser');//middleware para lidar com corpos de requisição
const { MongoClient } = require('mongodb');//cliente do mongodb
require('dotenv').config();//carrega as variáveis de ambiente

const app = express();//criação da instância do express
const port = process.env.PORT || 3000;//definição da porta do server

// Configurar o body-parser para lidar com as requisições POST
app.use(bodyParser.urlencoded({ extended: true }));//analisa corpos de requisição codificados em URL
app.use(bodyParser.json());//analisa corpos de requisição em formato JSON

// Conectar-se ao banco de dados MongoDB
MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db();//obtém a referência ao banco de dados

    // Definir o esquema do modelo de dados
    const userCollection = db.collection('users');//referencia a coleção "users" no banco de dados

    // Rotas da API
    const router = express.Router(); //criação do roteador

    // Middleware para todas as requisições
    router.use((req, res, next) => {
      console.log('Requisição sendo processada...');
      next();
    });

    // Rota de exemplo
    router.get('/', (req, res) => {
      res.json({ message: 'Bem-vindo à API de cadastro!' });
    });
    /*Essa rota é uma rota de exemplo que responde a uma requisição GET na raiz ("/") da API.
    Quando essa rota é acessada, ela envia uma resposta JSON com a mensagem "Bem-vindo à API de cadastro!".
    */
    // Rota para criar um novo usuário
    router.post('/users', (req, res) => {
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };/*Essa rota é responsável por criar um novo usuário. Ela é acionada quando uma requisição POST é feita para o endpoint "/users".
        Os dados do usuário são obtidos a partir do corpo da requisição (nome, email e senha) usando req.body.*/ 

      /* é utilizado o método insertOne() da coleção userCollection (referente à coleção "users" no banco de dados) para inserir o objeto user no banco de dados MongoDB.*/
        userCollection.insertOne(user)
        .then(() => {
          res.json({ message: 'Usuário criado com sucesso!' });
        })//Se a inserção for bem-sucedida, a rota responde com uma mensagem JSON indicando que o usuário foi criado com sucesso.
        .catch((err) => {
          res.status(500).json({ error: 'Erro ao criar o usuário.' });
        });//Caso ocorra algum erro durante a inserção, a rota responde com um código de status 500 (erro interno do servidor) e uma mensagem JSON informando que houve um erro ao criar o usuário.
    });

    // Iniciar o servidor
    app.use('/api', router);//Essa parte do código define o prefixo "/api" para todas as rotas, ou seja, todas as rotas definidas no roteador router terão esse prefixo.
    /*Em seguida, é usado o método app.listen() para iniciar o servidor. Ele escuta as requisições na porta definida (port) e, quando o servidor é iniciado com sucesso, imprime uma mensagem indicando
    o endereço em que o servidor está sendo executado (por exemplo, "Servidor em execução no endereço http://localhost:3000").*/ 
    app.listen(port, () => {
      console.log(`Servidor em execução no endereço http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Erro na conexão com o banco de dados:', err);
  });
