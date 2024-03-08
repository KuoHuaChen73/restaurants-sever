const express = require('express')
const app = express()
const port = 3000

const db = require('./models')
const Restaurant = db.Restaurants

app.get('/', (req, res) => {
  res.send('hello word')
})

app.get('/restaurants', (req, res) => {
  return Restaurant.findAll()
    .then((restaurants) => {
      console.log(restaurants)
      return res.send({ restaurants })
    })
    .catch((err) => res.status(422).json(err))
})

app.get('/restaurants/new', (req, res) => {
  res.send('new restaurant')
})

app.get('/restaurants/:id', (req, res) => {
  res.send(`restaurant: ${req.params.id}`)
})

app.get('/restaurants/:id/edit', (req, res) => {
  res.send(`get restaurant edit page: ${req.params.id}`)
})

app.post('/restaurants', (req, res) => {
  res.send('add restaurant')
})

app.put('/restaurants/:id', (req, res) => {
  res.send(`edit restaurant: ${req.params.id}`)
})

app.delete('/restaurants/:id', (req, res) => {
  res.send(`delete restaurant: ${req.params.id}`)
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})