const Jogo = require("../models/Jogo");
const db = require("../db/conn");
const { DataTypes } = require("sequelize");

const Conquis = db.define("Conquis", {
  titulo: {
    type: DataTypes.STRING,
  },

  descricao: {
    type: DataTypes.STRING,
  },

  // Há outros campos a serem inseridos aqui...
},
{
    tableName: "Conquis",
  }

);

Conquis.belongsTo(Jogo);
Jogo.hasMany(Conquis);

module.exports = Conquis;
