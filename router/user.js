const User = require('../models/user')
const express= require('express')
const auth = require('../middleware')
const router = new express.Router()

router.get('/',(req,res)=>{
    res.render('welcome')
})

router.get('/signin',(req,res)=>{
    res.render('signin')
})

router.post('/signin', async (req,res)=>{
    
    var count = await User.find().count()
    var code = 1101+count
   try{
        var password= req.body.password
        var cpassword = req.body.confirmpassword
        //salary declaration
        var designation = req.body.designation
        var salary= 0
        if(designation==='manager'){
             salary= 50000
        }else if(designation==='employee'){
             salary= 25000
        }else if(designation==='Officeassistant'){
             salary= 10000
        }
        //password matching
        if(!(cpassword===password)){
        return console.log('passwords are not matching')
        }
        //storing user data in an object
        const userdata = {
            name: req.body.name,
            password: password,
            customer_code: code,
            designation: designation,
            salary: salary
        }
        const user = new User(userdata)
        const token = await user.generateAuthToken()
        res.cookie("jwt", token)
        await user.save()
        // console.log(req.cookies.jwt)
        res.render('success',{user})


    } catch(e){
            res.send(e)
    }    


})

router.get('/signin/success', (req,res)=>{
    res.render('success',{user})
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login', async (req,res)=>{
    try{
        const user = await User.findbycredentials(req.body.customercode, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie("jwt",token)
        res.render('success')
        console.log(req.cookies.jwt)
    }catch(e){
        res.send(e)
    }
})


router.get('/attendance', auth,async (req,res)=>{
    res.render('attendance')    
})

router.get('/logout',(req,res)=>{
    res.render('login')
})

module.exports= router
