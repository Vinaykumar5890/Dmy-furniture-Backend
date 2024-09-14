const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const Registeruser = require('./model')
const BrandName = require('./model1')
const middleware = require('./middleware')
const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
mongoose
  .connect(
    'mongodb+srv://vinay:vinay@cluster0.fv2hjsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err))

function authenticateToken(request, response, next) {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Your Not Authorized User To  Make Changes On Assignments')
  } else {
    jwt.verify(jwtToken, 'jwt', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send(
          'Your Not Authorized User To  Make Changes On Assignments',
        )
      } else {
        next()
      }
    })
  }
}

app.post('/register', async (req, res) => {
  try {
    const {username, email, password} = req.body
    let exits = await Registeruser.findOne({email})
    if (exits) {
      return res.status(400).send('User Already Exist')
    }
    
    let newUser = new Registeruser({
      username,
      email,
      password
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
    jwt.sign(payload, 'jwt', (err, jwtToken) => {
      if (err) throw err
      return res.json({jwtToken})
    })
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

app.get('/product', authenticateToken , async (req, res) => {
  try{
    return res.send(await BrandName.find())
  }
  catch (err) {
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
  const { category, sort, search } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  try {
    const allData = await BrandName.find(filter)
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
