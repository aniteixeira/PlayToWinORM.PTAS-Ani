// Importações de módulos:
require("dotenv").config();
const conn = require("./db/conn");
const express = require("express");
const exphbs = require("express-handlebars");

const Conquis = require("./models/Conquis")
const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");
const Jogo = require("./models/Jogo");

Jogo.belongsToMany(Usuario, { through: "aquisicoes" });
Usuario.belongsToMany(Jogo, { through: "aquisicoes" });

// Instanciação do servidor:
const app = express();

// Vinculação do Handlebars ao Express:
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Configurações no express para facilitar a captura
// de dados recebidos de formulários
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.render("home");
}); 

//Rotas de usuario

app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll({ raw: true });

  res.render("usuarios", { usuarios });
});

app.get("/usuarios/novo", (req, res) => {
  res.render("formUsuario");
});

app.post("/usuarios/novo", async (req, res) => {
  const dadosUsuario = {
    nickname: req.body.nickname,
    nome: req.body.nome,
  };

  const usuario = await Usuario.create(dadosUsuario);
  res.send("Usuário inserido sob o id " + usuario.id);
});

app.get("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formUsuario", { usuario });
  // const usuario = Usuario.findOne({
  //   where: { id: id },
  //   raw: true,
  // });
});

app.post("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosUsuario = {
    nickname: req.body.nickname,
    nome: req.body.nome,
  };

  const retorno = await Usuario.update(dadosUsuario, { where: { id: id } });

  if (retorno > 0) {
    res.redirect("/usuarios");
  } else {
    res.send("Erro ao atualizar usuário");
  }
});

app.post("/usuarios/:id/delete", async (req, res) => {
  const id = parseInt(req.params.id);

  const retorno = await Usuario.destroy({ where: { id: id } });

  if (retorno > 0) {
    res.redirect("/usuarios");
  } else {
    res.send("Erro ao excluir usuário");
  }
});

// Rotas para cartões

//Ver cartões do usuário
app.get("/usuarios/:id/cartoes", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  const cartoes = await Cartao.findAll({
    raw: true,
    where: { UsuarioId: id },
  });

  res.render("cartoes.handlebars", { usuario, cartoes });
});

//Formulário de cadastro de cartão
app.get("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formCartao", { usuario });
});

//Cadastro de cartão
app.post("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosCartao = {
    numero: req.body.numero,
    nome: req.body.nome,
    codSeguranca: req.body.codSeguranca,
    UsuarioId: id,
  };

  await Cartao.create(dadosCartao);

  res.redirect(`/usuarios/${id}/cartoes`);
});

//Rotas de jogo

app.get("/jogos", async (req, res) => {
  const jogos = await Jogo.findAll({ raw: true });

  res.render("jogos", { jogos });
});

app.get("/jogos/novo", (req, res) => {
  res.render("formJogo");
});

app.post("/jogos/novo", async (req, res) => {
  const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    preco: req.body.preco,
    
  };

  const jogo = await Jogo.create(dadosJogo);
  res.send("Jogo inserido sob o id " + jogo.id);
});

app.get("/jogos/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  res.render("formJogo", { jogo });
  // const usuario = Usuario.findOne({
  //   where: { id: id },
  //   raw: true,
  // });
});

app.post("/jogos/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    preco: req.body.preco,
  };

  const retorno = await Jogo.update(dadosJogo, { where: { id: id } });

  if (retorno > 0) {
    res.redirect("/jogos");
  } else {
    res.send("Erro ao atualizar jogo");
  }
});

app.post("/jogos/:id/delete", async (req, res) => {
  const id = parseInt(req.params.id);

  const retorno = await Jogo.destroy({ where: { id: id } });

  if (retorno > 0) {
    res.redirect("/jogos");
  } else {
    res.send("Erro ao excluir jogo");
  }
});

// Rotas para conquis

//Ver conquis do jogo
app.get("/jogos/:id/conquis", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  const conquis = await Conquis.findAll({
    raw: true,
    where: { JogoId: id },
  });

  res.render("conquis.handlebars", { jogo, conquis });
});

//Formulário de cadastro de conquis
app.get("/jogos/:id/novaConquis", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  res.render("formConquis", { jogo });
});

//Cadastro de conquis
app.post("/jogos/:id/novaConquis", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosConquis = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    JogoId: id,
  };

  await Conquis.create(dadosConquis);

  res.redirect(`/jogos/${id}/conquis`);
});


app.listen(8000, () => {
  console.log("Server rodando!");
});

conn
  .sync()
  .then(() => {
    console.log("Conectado e sincronizado com o banco de dados!");
  })
  .catch((err) => {
    console.log("Ocorreu um erro: " + err);
  });

// conn
//   .authenticate()
//   .then(() => {
//     console.log("Conectado ao banco de dados com sucesso!");
//   })
//   .catch((err) => {
//     console.log("Ocorreu um erro: " + err);
//   });
