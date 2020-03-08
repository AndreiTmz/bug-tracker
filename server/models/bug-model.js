module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "bug",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      commitLink: {
        type: DataTypes.STRING,
        allowNull: false
      },
      severity: {
        type: DataTypes.STRING,
        allowNull: false
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false
      },
      submittedBy: {
        type: DataTypes.STRING,
        allowNull: false
      },
      assignedTo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      solutionLink: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  );
};
