const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const Registeruser = require('./model')
const BrandName = require('./model1')
const middleware = require('./middleware')
const app = express()

app.use(express.json())
app.use(cors())
mongoose
  .connect(
    'mongodb+srv://vinay:vinay@cluster0.fv2hjsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err))

app.post('/register', async (req, res) => {
  try {
    const {username, email, password, confirmpassword} = req.body
    let exits = await Registeruser.findOne({email})
    if (exits) {
      return res.status(400).send('User Already Exist')
    }
    if (password !== confirmpassword) {
      return res.status(400).send('Passwords are not Matching')
    }
    let newUser = new Registeruser({
      username,
      email,
      password,
      confirmpassword,
    })
    await newUser.save()
    res.status(200).send('Register Succesfully')
  } catch (err) {
    console.log(err)
    return res.status(500).send('Internal Server Error')
  }
})

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    let exits = await Registeruser.findOne({email})
    if (!exits) {
      return res.status(400).send('User Not Found')
    }
    if (exits.password !== password) {
      return res.status(400).send('Invalid Password')
    }
    let payload = {
      user: {
        id: exits.id,
      },
    }
    jwt.sign(payload, 'jwtSecret', {expiresIn: 100000000000}, (err, token) => {
      if (err) throw err
      return res.json({token})
    })
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

app.get('/product', middleware, async (req, res) => {
  try {
    let exits = await Registeruser.findById(req.user.id)
    if (!exits) {
      return res.status(400).send('User Not Found')
    }
     return res.send(await BrandName.find())
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

app.post('/brand', async (req, res) => {
  const {brandname} = req.body
  try {
    const newData = new BrandName({brandname})
    await newData.save()
    return res.send(await BrandName.find())
  } catch (err) {
    console.log(err)
  }
})

app.get('/brand', async (req, res) => {
  try {
    const allData = await BrandName.find()
    return res.json(allData)
  } catch (err) {
    console.log(err)
  }
})
app.get('/brand/:id', async (req, res) => {
  try {
    const allData = await BrandName.findById(req.params.id)
    return res.json(allData)
  } catch (err) {
    console.log(err)
  }
})

app.delete('/brand/:id', async (req, res) => {
  try {
    await BrandName.findByIdAndDelete(req.params.id)
    return res.json(await BrandName.find())
  } catch (err) {
    console.log(err)
  }
})
app.listen(3000, () => {
  console.log('Server Running.....')
})

module.exports = app
