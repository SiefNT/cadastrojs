const user = JSON.parse(localStorage.getItem('user')); // Recupera as informações do usuário do localStorage
const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const dados = document.createElement("div");
dados.innerHTML = `<p>Nome: ${name}</p><p>E-mail: ${email}</p><p>Senha: ${password}</p>`;
document.body.appendChild(dados);