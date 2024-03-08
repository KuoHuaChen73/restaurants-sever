'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.addColumn('Restaurants',
      'name_en',
      {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('Restaurants',
      'category',
      {
        type: Sequelize.STRING,
        allowNull: false
      }),
      await queryInterface.addColumn('Restaurants',
      'image',
      {
        type: Sequelize.STRING,
        allowNull: false
      }),
      await queryInterface.addColumn('Restaurants',
      'location',
      {
        type: Sequelize.STRING,
        allowNull: false
      }),
      await queryInterface.addColumn('Restaurants',
      'phone',
      {
        type: Sequelize.STRING,
        allowNull: false
      }),
      await queryInterface.addColumn('Restaurants',
      'google_map',
      {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('Restaurants',
      'rating',
      {
        type: Sequelize.FLOAT
      }),
      await queryInterface.addColumn('Restaurants',
      'description',
      {
        type: Sequelize.STRING,
        allowNull: false
      })
      ])
    
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('Restaurants', 'name_en'),
      await queryInterface.removeColumn('Restaurants', 'category'),
      await queryInterface.removeColumn('Restaurants', 'image'),
      await queryInterface.removeColumn('Restaurants', 'location'),
      await queryInterface.removeColumn('Restaurants', 'phone'),
      await queryInterface.removeColumn('Restaurants', 'google_map'),
      await queryInterface.removeColumn('Restaurants', 'rating'),
      await queryInterface.removeColumn('Restaurants', 'description'),
    ])
  }
};
