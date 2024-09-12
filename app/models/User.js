module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      digits: {
        type: Sequelize.STRING(155),
        allowNull: true,
      },
      fotoUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      workType: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      positionTitle: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      lat: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      lon: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      company: {
        type: Sequelize.STRING(155),
        allowNull: true,
      },
      isLogin: {
        type: Sequelize.BOOLEAN,
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
      dovote: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      dosurvey: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      dofeedback: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      fullname: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      cuurentLeave: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    { timestamps: true },
  );

  return User;
};
