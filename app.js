const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt  = require('bcrypt')
const Registeruser = require('./model')
const BrandName = require('./model1')
const Order  = require('./model2')
const Post = require('./model3')
const middleware = require('./middleware')
const app = express()


app.use(express.json())
app.use(cors({origin: '*'}))

  mongoose
  .connect("mongodb+srv://vinay:vinay@cluster0.fv2hjsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
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
    response.send('Your Not Authorized User')
  } else {
    jwt.verify(jwtToken, 'jwt', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send(
          'Your Not Authorized User',
        )
      } else {
        next()
      }
    })
  }
}

///Order Using Post Methid : /order   

app.post('/order',authenticateToken,async (req, res) => {
  const { user, products, shippingAddress, paymentDetails, totalAmount } = req.body;

  try {
     if (!products || ! shippingAddress || !paymentDetails || !totalAmount ) {
      return res.status(400).send('All fields are required')
    }
    else {
    const newOrder = new Order({
     user,
      products,
      shippingAddress,
      paymentDetails,
      totalAmount,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
     }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//User Register Using Post Method : /register

app.post('/register', async (req, res) => {
  try {
    const {username, email, password} = req.body
    let exits = await Registeruser.findOne({email})
    if (exits) {
      return res.status(400).send('User Already Exist')
    } else if (!email || !username || !password) {
      return res.status(400).send('All fields are required')
    }
    if (password.length > 6) {
      const hashedPassword = await bcrypt.hash(password, 10)

      let newUser = new Registeruser({
        username,
        email,
        password: hashedPassword,
      })
      await newUser.save()
      res.status(200).send('Register Succesfully')
    } else {
      res.status(400).send('Password Too Short')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send('Internal Server Error')
  }
})

//User Login Using Post Method : /Login

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    let exits = await Registeruser.findOne({email})
    if (!exits) {
      return res.status(400).send("User Doesn't Exits")
    } else if (!email || !password) {
      return res.status(400).send('All fields are required')
    } else {
      const isPasswordMatched = await bcrypt.compare(password, exits.password)
      if (isPasswordMatched === true) {
        let payload = {
          user: {
            id: exits.id,
          },
        }
        jwt.sign(payload, 'jwt', (err, jwtToken) => {
          if (err) throw err
          return res.json({jwtToken})
        })
      } else {
        return res.status(400).send('Invalid Password')
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

//User Change Password using Put Method  : /changePassword

app.put('/changePassword',async (req, res) => {
  try {
    const {email, oldPassword, newPassword} = req.body
    let exits = await Registeruser.findOne({email})
    const isPasswordCorrect = await bcrypt.compare(oldPassword, exits.password)
    if (!exits) {
      return res.status(400).send("User Doesn't Exits")
    } 
    else if (!email || !oldPassword || !newPassword) {
      return res.status(400).send('All fields are required')
    }
      else if (oldPassword === newPassword) {
      return res.status(400).send('Passwords are Same')
    } 
      else if (!isPasswordCorrect) {
      return res.status(401).send('Old password is incorrect')
    } 
      else if (newPassword.length < 6){
         return res.status(401).send('New password is Too Short')
      }
      else {
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update the user's password in the database

      const updated = await Registeruser.updateOne(
        {email},
        {$set: {password: hashedPassword}},
      )
      return res.status(200).send('Password updated successfully')
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})




app.get('/product', authenticateToken , async (req, res) => {
  const { category, sort, search } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
    let sortOption = {};
    if (sort) {
        const [key, order] = sort.split(':');
        sortOption[key] = order === 'desc' ? -1 : 1;
    } 
  try {
    const allData = await BrandName.find(filter).sort(sortOption);
    return res.json(allData)
  } 
  catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

app.post('/product',authenticateToken,async (req, res) => {
  const {name,description,price,category,dimensions,images} = req.body
  try {
    const newData = new BrandName({name,description,price,category,dimensions,images})
    await newData.save()
    return res.send(await BrandName.find())
  } catch (err) {
    console.log(err)
  }
})
app.post('/post-media',async (req, res) => {
  const {images,description,profile,name,likes} = req.body
  try {
    const newData = new Post({images,description,profile,name,likes})
    await newData.save()
    return  res.status(200).send(await Post.find())
  } catch (err) {
    console.log(err)
  }
})

app.get('/post-media', async (req, res) => { 
  try { 
    const posts = await Post.find(); 
    return res.json(posts); 
  } catch (err) {
    return res.status(400).json({ error: err.message }); } });

app.get('/brand',authenticateToken,async (req, res) => {
  const { category, sort, search } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
    let sortOption = {};
    if (sort) {
        const [key, order] = sort.split(':');
        sortOption[key] = order === 'desc' ? -1 : 1;
    } 
  try {
    const allData = await BrandName.find(filter).sort(sortOption);
    return res.json(allData)
  } catch (err) {
    console.log(err)
  }
})
app.get('/product/:id',authenticateToken,async (req, res) => {
  try {
    const allData = await BrandName.findById(req.params.id)
    return res.json(allData)
  } catch (err) {
    console.log(err)
  }
})    





app.get("/order/:user",authenticateToken,async (req, res) => {
  const { user} = req.params;

  try {
    // Find orders where userId matches the provided userId
    const orders = await Order.find({ user: user });

    // Check if orders exist for the user
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    // Return the orders if found
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving orders." });
  }
});


app.delete('/product/:id',authenticateToken,async (req, res) => {
  try {
    await BrandName.findByIdAndDelete(req.params.id)
    return res.json(await BrandName.find())
  } catch (err) {
    console.log(err)
  }
})
app.delete('/order/:id',authenticateToken,async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    return res.json(await Order.find())
  } catch (err) {
    console.log(err)
  }
})

    app.listen(3000, () => {
      console.log('✅ Server is running and DB Connected...')
    });


module.exports = app
