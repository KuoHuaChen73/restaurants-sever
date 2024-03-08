const Sequelize = require('sequelize')

const sequelize = new Sequelize('restaurant', 'root', 'password', {host: '127.0.0.1', dialect: 'mysql'})

const seedData = require('./restaurant.json').results

async function seed() {
  await sequelize.queryInterface.bulkInsert('Restaurants',
  seedData.map((currentValue) => {
    delete currentValue.id
    currentValue.createdAt = new Date()
    currentValue.updatedAt = new Date()
    return currentValue
  })
)
}

seed()
  .then(() => console.log('Seeding complete'))
  .catch(err => console.error('Seeding failed', err))