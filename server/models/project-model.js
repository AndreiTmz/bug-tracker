module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "project",
    {
      projectName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      repositoryLink: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  );
};
