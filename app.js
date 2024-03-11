const express = require('express')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const db = require('./models')
const Restaurant = db.Restaurants

app.engine('.hbs', engine({ extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/restaurants', (req, res) => {
  return Restaurant.findAll({
    attributes: ['id', 'name', 'image', 'category', 'rating'],
    raw: true
  })
    .then((restaurants) => res.render('restaurants', { restaurants }))
    .catch((err) => res.status(422).json(err))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.findByPk(id, {
    raw: true
  })
  .then((restaurant) => res.render('restaurant', { restaurant }))
  .catch((err) => console.log(err))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id

  return Restaurant.findByPk(id, {
    raw: true
  })
  .then((restaurant) => res.render('edit', {restaurant}))
})

app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const category = req.body.category
  const location = req.body.location
  const phone = req.body.phone
  const rating = Number(req.body.rating)
  const description = req.body.description
  return Restaurant.create({
    name,
    category,
    location,
    phone,
    rating,
    description
  })
  .then(() => res.redirect('./restaurants'))
  .catch((err) => console.log(err))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const body = req.body
  return Restaurant.update({
    name: body.name,
    category: body.category,
    location: body.location,
    phone: body.phone,
    rating: body.rating,
    description: body.description
  }, { where: { id }})
  .then(() => res.redirect(`/restaurants/${id}`))
})

app.delete('/restaurants/:id', (req, res) => {
  res.send(`delete restaurant: ${req.params.id}`)
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})