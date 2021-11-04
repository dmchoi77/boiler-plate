const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require('./models/User')
const cookieParser = require('cookie-parser')
const config = require('./config/key')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//application/json
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB Connected..'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello'))

app.post('/register', (req, res) => {
    //회원가입시 필요한 정보를 클라이언트에서 가져오면 
    //DB에 넣어준다.
    const user = new User(req.body)
    //정보들을 user model에 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {
    //요청된 아이디를 DB에 있는지 찾는다
    User.findOne({ id: req.body.id }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "해당하는 아이디가 없습니다."
            })
        }
        //요청된 아이디가 DB에 있다면 비밀번호가 일치하는지 확인
        user.comparePassword(req.body.pw, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 일치하지 않습니다." })

            //비밀번호 일치하면 토큰을 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //token을 쿠키에 저장한다. 
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })

            })
        })
    })

})


app.listen(port, () => console.log(`Example app listening on port ${port}`))