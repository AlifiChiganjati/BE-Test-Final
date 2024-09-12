module.exports = (sequelize, Sequelize) => {
  const Survey = sequelize.define(
    "Survey",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      values: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    { timestamps: true },
  );

  Survey.associate = (models) => {
    // Associations can be defined here
    Survey.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Survey;
};
