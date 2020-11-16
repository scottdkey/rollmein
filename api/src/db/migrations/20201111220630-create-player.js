'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Players", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      playerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tank: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      dps: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      healer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      in: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      userId: {
        type: Sequelize.STRING,
        model: "Users",
        key: "id",
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }

    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "Users",
      "UserId"
    )
  }
};
