const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('hello word')
})

app.get('/restaurants', (req, res) => {
  res.send('all restaurants')
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