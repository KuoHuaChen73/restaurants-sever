'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('Restaurants', 'category', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Restaurants', 'image', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Restaurants', 'location', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Restaurants', 'phone', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Restaurants', 'description', {
        allowNull: true,
        type: Sequelize.TEXT
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('Restaurants', 'category', {
        allowNull: false,
        type: Sequelize.STRING
      }),
      queryInterface.changeColumn('Restaurants', 'image', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('Restaurants', 'location', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('Restaurants', 'phone', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn('Restaurants', 'description', {
        allowNull: false,
        type: Sequelize.STRING
      })
    ])
  }
};
