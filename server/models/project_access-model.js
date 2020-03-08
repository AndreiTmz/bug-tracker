module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "project_access",
    {
      accessType: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );
};
