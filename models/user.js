const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userschema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    customer_code:{
        type: Number,
        // required:true
    },
    password:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    designation:{
        type: String,
        required:true
    },
    salary:{
        type: Number,
        // required:true
    },

    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
    
})

userschema.statics.findbycredentials = async (customer_code, password)=>{
    const user = await User.findOne({customer_code})
    if(!user){
        throw new Error('username is not valid')
    }
    const isMatch =  bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('password is not macthing')
    }
    return user
}

userschema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'weoinfotech')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userschema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User= mongoose.model('User', userschema)
module.exports= User
