const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 30
    },
    id: {
        type: String,
        unique: 1,
        maxlength: 10
    },
    pw: {
        type: String,
        minlength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    token: { // 유효성 검사
        type: String
    },
    tokenEXP: { // 토큰 기간
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }