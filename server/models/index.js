"use strict";
const fs = require("fs");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    define: {
      timestamps: false
    }
  }
);

let db = {};
fs.readdirSync(__dirname).forEach(file => {
  if (file !== "index.js") {
    let keyName = file.split(".")[0].split("-")[0];
    keyName = keyName[0].toUpperCase() + keyName.slice(1, keyName.length);
    let moduleName = file.split(".")[0];
    db[keyName] = sequelize.import(moduleName);
  }
});

db["sequelize"] = sequelize;

db.User.belongsToMany(db.Project, { through: db.Project_access });
db.Project.belongsToMany(db.User, { through: db.Project_access });
db.Project.hasMany(db.Bug);

module.exports = db;
