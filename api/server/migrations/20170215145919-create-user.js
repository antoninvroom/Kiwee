'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        unique: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false
      },
      picture: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timezone: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      locale: {
        type: Sequelize.STRING,
        allowNull: false
      },
      verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      facebookId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      facebookToken: {
        type: Sequelize.STRING,
        allowNull: false
      },
      facebookFriends: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: false,
        defaultValue: []
      },
      facebookSync: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
    down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Users')
};
