function validaCamposRequisicao(body, res) {
   if (body.nome == "" || body.nome == undefined) {
      return res.status(422).send("Nome Inválido.");
   }
   if (body.senha == "" || body.senha == undefined) {
      return res.status(422).send("Senha Inválida.");
   }
   if (body.senha.length > 20 || body.nome.length > 35) {
      return res
         .status(422)
         .send("Nome ou senha ultrapassou o limite de caracteres.");
   }
}
async function compararHashSenha(hash, senha) {
   const match = await bcrypt.compare(senha, hash);
   return match;
}

module.exports = { validaCamposRequisicao, compararHashSenha };
