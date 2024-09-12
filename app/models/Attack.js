module.exports = (sequelize, Sequelize) => {
  const Attack = sequelize.define(
    "Attack",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      countries: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: false,
      },
      total: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
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
    },
    { timestamps: true },
  );

  return Attack;
};
