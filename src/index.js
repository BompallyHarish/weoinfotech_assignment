const express= require('express')
const path = require('path')
const hbs = require('hbs')
const mongoose = require('mongoose')
const userRouter = require('../router/user')
const cookieparser = require('cookie-parser')

const app = express()

//databse initailization
mongoose.connect('mongodb://127.0.0.1:27018/project1',{
    useUnifiedTopology: true
}).then((result)=>console.log('connected to project1 database successfully')).catch((error)=>console.log(error))


//path intialization
const publicPath = path.join(__dirname, '../public')
const viewspath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//defining port number
const port = 3000 || process.env.PORT

//public path initialization
app.use(express.static(publicPath))

//hbs intialization
app.set('view engine','hbs')
app.set('views', viewspath)
hbs.registerPartials(partialsPath)

//
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Router Initialization
app.use(userRouter)

//cookie-parser initialization
app.use(cookieparser())


// server Initialization
app.listen(port,()=>{
    console.log(`Hello Weoinfotech, we have started server running on port no:${port}`)
})


