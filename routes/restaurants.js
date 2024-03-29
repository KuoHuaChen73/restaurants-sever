const express = require('express')
const router = express.Router()


// 載入model
const db = require('../models')
const Restaurant = db.Restaurant

router.get('/', (req, res, next) => {
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
          res.render('restaurants', { restaurants: filterRestaurants })
        }
        else res.render('restaurants', { restaurants })
      })
      .catch((error) => {
        error.errorMessage = '資料取得失敗:('
        next(error)
      })
})

// 渲染建立餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})
//  渲染餐廳細節頁面
router.get('/:id', (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      raw: true
    })
    .then((restaurant) => res.render('restaurant', { restaurant }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})
// 渲染餐廳編輯頁面
router.get('/:id/edit', (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      raw: true
    })
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    }) 
})

// 將create頁面傳送過來的資料建立在資料庫裡，然後再導向首頁
router.post('/', (req, res, next) => {
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
    error.errorMessage = '新增失敗:('
    next(error)
  })
})
// 將edit頁面傳送過來的資料更新到資料庫並導向到餐廳細節頁面
router.put('/:id', (req, res, next) => {
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
      error.errorMessage = '修改失敗:('
      next(error)
    })
})
// 取得req.params.id並刪除資料庫內該項目，然後導向首頁
router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    return Restaurant.destroy({
      where: {id}
    })
    .then(() => {
      req.flash('success', '刪除成功!')
      res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router