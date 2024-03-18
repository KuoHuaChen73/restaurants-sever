// 載入需要的工具
const express = require('express')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
// 載入model
const db = require('./models')
const Restaurant = db.Restaurants
// 宣告樣板引擎為express-handlebars
app.engine('.hbs', engine({ extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))


// 設定路由
app.get('/', (req, res) => {
  res.redirect('/restaurants')
})
// 透過Restaurant模型使用findAll找到資料表的所有資料，因為首頁資料不需過多描述，所以只過濾出['id', 'name', 'image', 'category', 'rating']這幾項屬性
app.get('/restaurants', (req, res) => {
  return Restaurant.findAll({
    attributes: ['id', 'name', 'image', 'category', 'rating'],
    raw: true
  })
  // 找到資料後放入restaurants變數傳送給樣板引擎並渲染首頁畫面
    .then((restaurants) => res.render('restaurants', { restaurants }))
    .catch((err) => res.status(422).json(err))
})

// 渲染建立餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
//  渲染餐廳細節頁面
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.findByPk(id, {
    raw: true
  })
  .then((restaurant) => res.render('restaurant', { restaurant }))
  .catch((err) => console.log(err))
})
// 渲染餐廳編輯頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id

  return Restaurant.findByPk(id, {
    raw: true
  })
  .then((restaurant) => res.render('edit', {restaurant}))
})

// 將create頁面傳送過來的資料建立在資料庫裡，然後再導向首頁
app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const category = req.body.category
  const location = req.body.location
  const image = req.body.image
  const phone = req.body.phone
  const rating = Number(req.body.rating) // 因為資料庫設定rating欄位需放入數字，使用者在網頁輸入的值，傳送過來為字串，所以強制將字串更改為數字
  const description = req.body.description
  return Restaurant.create({
    name,
    category,
    location,
    phone,
    image,
    rating,
    description
  })
  .then(() => res.redirect('./restaurants'))
  .catch((err) => console.log(err))
})
// 將edit頁面傳送過來的資料更新到資料庫並導向到餐廳細節頁面
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
// 取得req.params.id並刪除資料庫內該項目，然後導向首頁
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({
    where: {id}
  })
  .then(() => res.redirect('/restaurants'))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})