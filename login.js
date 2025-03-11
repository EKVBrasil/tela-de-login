// Importando o Express e o Bcrypt
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./database");
const cors = require('cors');  // Importa o middleware CORS
const app = express();
const { validaCamposRequisicao, compararHashSenha } = require("./utils");

// Definindo a porta do servidor
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());
app.use(cors());  


// Iniciando o servidor
app.listen(PORT, async () => {
   console.log(`Servidor rodando na porta ${PORT}`);
   try {
      await db.query("SELECT NOW()");
   } catch (error) {
      console.error("Erro ao conectar com o banco de dados:", error.stack);
      process.exit(1);
   }
});

app.post("/sign-in", async (req, res) => {
   const body = req.body;
   validaCamposRequisicao(body, res);
   // const resultado = usuarioExiste(body)
   if (await usuarioExiste(body)) {
      return res.status(200).send(true);
   }
   return res.status(401).send("Não passou!!!");
});

async function usuarioExiste(body) {
   try {
      const usuario = await db.query("SELECT * FROM usuarios WHERE nome = $1", [
         body.nome,
      ]);
      const match = await bcrypt.compare(body.senha, usuario.rows[0].senha);
      return match;
   } catch (error) {
      console.log(error)
   }
}

app.post("/sign-up", (req, res) => {
   const body = req.body;
   const saltRounds = 10;
   validaCamposRequisicao(body, res);
   bcrypt.hash(body.senha, saltRounds, async function (err, hash) {
      body.senha = hash;
      try {
         await db.query("INSERT INTO usuarios (nome, senha) VALUES ($1, $2);", [
            body.nome,
            body.senha,
         ]);
         return res.status(201).send("Usuário registrado com sucesso!");
      } catch (error) {
         if (error.code == "23505") {
            return res.status(409).send("Usuário já registrado");
         }
         return res.status(500).send("erro de servidor");
      }
   });
});
