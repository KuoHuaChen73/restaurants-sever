// 載入需要的工具
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const router = require('./routes')

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
app.use(router)



app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})