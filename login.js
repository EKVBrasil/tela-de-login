// Importando o Express
const { ALL } = require('dns');
const express = require('express');
const app = express();

// Definindo a porta do servidor
const PORT = 3000;
const usuarios = [{ nome: 'Eduardo', senha: '123' }, { nome: 'Lucas', senha: '1234' }]

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


app.post('/sign-in', (req, res) => {
    const body = req.body;
    // const resultado = estaNaLista(body)
    if (estaNaLista(body)) {
        res.send('Passou!!!');
    }
    res.send('Não passou!!!')
});

function estaNaLista(body) {
    for (let i = 0; i < usuarios.length; i++) {
        const usuario = usuarios[i];
        if (usuario.nome === body.nome && usuario.senha === body.senha) {
            return true;
        }
    }
    return false;
}


app.post('/sign-up', (req, res) => {
    const body = req.body;
    console.log(body);
    console.log(usuarios);
    usuarios.push(body);
    console.log(usuarios);
    res.send('Usuário registrado com sucesso!')
});