const db = require("../db/conn");
const { DataTypes } = require("sequelize");

const Jogo = db.define("Jogo", {
  titulo: {
    type: DataTypes.STRING,
  },

  descricao: {
    type: DataTypes.STRING,
  },

  preco: {
    type: DataTypes.STRING,
  },
  // Há outros campos a serem inseridos aqui...
});

module.exports = Jogo;
