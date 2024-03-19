// 載入需要的工具
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
// 載入model
const db = require('./models')
const Restaurant = db.Restaurant
// 宣告樣板引擎為express-handlebars
app.engine('.hbs', engine({ extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'ThisisSecret',
  resave: false,
  saveUninitialized:false
}))
app.use(flash())


// 設定路由
app.get('/', (req, res) => {
  res.redirect('/restaurants')
})
// 透過Restaurant模型使用findAll找到資料表的所有資料，因為首頁資料不需過多描述，所以只過濾出['id', 'name', 'image', 'category', 'rating']這幾項屬性
app.get('/restaurants', (req, res) => {
  try {
    const sort = req.query.sort || '1'
    console.log(sort)
    return Restaurant.findAll({
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      raw: true
    })
    // 找到資料後放入restaurants變數傳送給樣板引擎並渲染首頁畫面
      .then((restaurants) => {
        let filterRestaurants = new Array()
        if (sort === '2') {
          for (let i = 97; i <= 122; i++) {
            for (const restaurant of restaurants){
              if(restaurant.name.toLowerCase().startsWith(String.fromCharCode(i))) {
                filterRestaurants.push(restaurant)
                restaurants.splice(restaurants.indexOf(restaurant), 1)
              }
            }
          }
          filterRestaurants.push(...restaurants)
        }
        if (filterRestaurants.length !== 0) {
          res.render('restaurants', { restaurants: filterRestaurants, message: req.flash('success'), error: req.flash('error') })
        }
        else res.render('restaurants', { restaurants, message: req.flash('success') })
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
      console.error(error)
      req.flash('error', '資料取得失敗:(')
      return res.redirect('back')
  }
})

// 渲染建立餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new', { error: req.flash('error')})
})
//  渲染餐廳細節頁面
app.get('/restaurants/:id', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      raw: true
    })
    .then((restaurant) => res.render('restaurant', { restaurant, message: req.flash('success'), error: req.flash('error') }))
    .catch((error) => {
      console.error(error)
      req.flash('error', '資料取得失敗:(')
      return res.redirect('back')
    })
  } catch (error) {
    console.error(error)
    req.flash('error', '資料取得失敗:(')
    return res.redirect('back')
  }

  
})
// 渲染餐廳編輯頁面
app.get('/restaurants/:id/edit', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      raw: true
    })
    .then((restaurant) => res.render('edit', {restaurant, error: req.flash('error')}))
    .catch((error) => {
      console.error(error)
      req.flash('error', '伺服器錯誤:(')
      return res.redirect('back')
    })
  } catch (error) {
      console.error(error)
      req.flash('error', '伺服器錯誤:(')
      return res.redirect('back')
  }
  
})

// 將create頁面傳送過來的資料建立在資料庫裡，然後再導向首頁
app.post('/restaurants', (req, res) => {
  try {
  const name = req.body.name
  if (name.length === 0) {throw new Error('未輸入餐廳名稱')}
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
  .then(() => {
    req.flash('success', '新增成功!')
    return res.redirect('./restaurants')
  })
  .catch((error) => {
    console.error(error)
    req.flash('error', '新增失敗:(')
    return res.redirect('back')
  })
  } catch (error) {
      console.error(error)
      req.flash('error', '新增失敗:(')
      return res.redirect('back')
  }
  
})
// 將edit頁面傳送過來的資料更新到資料庫並導向到餐廳細節頁面
app.put('/restaurants/:id', (req, res) => {
  try {
    const id = req.params.id
    const body = req.body
    if (body.name.length === 0) {throw new Error('未輸入餐廳名稱')}
    return Restaurant.update({
      name: body.name,
      category: body.category,
      location: body.location,
      phone: body.phone,
      image: body.image,
      rating: body.rating,
      description: body.description
    }, { where: { id }})
    .then(() => {
      req.flash('success', '修改成功!')
      res.redirect(`/restaurants/${id}`)
    })
    .catch((error) => {
      console.error(error)
      req.flash('error', '修改失敗:(')
      return res.redirect('back')
    })
  } catch (error) {
      console.error(error)
      req.flash('error', '修改失敗:(')
      return res.redirect('back')
  }
  
})
// 取得req.params.id並刪除資料庫內該項目，然後導向首頁
app.delete('/restaurants/:id', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.destroy({
      where: {id}
    })
    .then(() => {
      req.flash('success', '刪除成功!')
      res.redirect('/restaurants')
    })
    .catch((error) => {
      console.error(error)
      req.flash('error', '刪除失敗:(')
      return res.redirect('back')
    })
  } catch (error) {
      console.error(error)
      req.flash('error', '刪除失敗:(')
      return res.redirect('back')
  }
  
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})