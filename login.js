// Importando o Express e o Bcrypt
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./database");
const app = express();

// Definindo a porta do servidor
const PORT = 3000;


// Middleware para processar JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.send('Servidor rodando com Node.js e Express!');
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


app.post('/sign-in', async(req, res) => {
    const body = req.body;
    validaCamposRequisicao(body, res);
    // const resultado = usuarioExiste(body)
    if (await usuarioExiste(body)) {
        res.status(200).send('Passou!!!');
    }
    res.status(401).send('Não passou!!!')
});

async function usuarioExiste(body) {
   const usuario = await db.query(
        "SELECT * FROM usuarios WHERE nome = $1",
        [body.nome]
      );
      const match = await bcrypt.compare(body.senha, usuario.senha);
      return match;
}
 async function compararHashSenha(hash, senha) {
    const match = await bcrypt.compare(senha, hash);
    return match;
}


app.post('/sign-up', (req, res) => {
    const body = req.body;
    const saltRounds = 10;
    validaCamposRequisicao(body, res);
    bcrypt.hash(body.senha, saltRounds, async function(err, hash) {
        // Store hash in your password DB.
        body.senha = hash;
        await db.query(
            "INSERT INTO usuarios (nome, senha) VALUES ($1, $2);",
            [body.nome, body.senha]
          );
    });
    res.status(201).send('Usuário registrado com sucesso!')
});

function validaCamposRequisicao(body, res) {
    if (body.nome == '' || body.nome == undefined) {
        return res.status(422).send('Nome Inválido.');
    }
    if (body.senha == '' || body.senha == undefined) {
        return res.status(422).send('Senha Inválida.');
    }
    if (body.senha.length > 20 || body.nome.length > 35) {
        return res.status(422).send('Nome ou senha ultrapassou o limite de caracteres.')
    }
}