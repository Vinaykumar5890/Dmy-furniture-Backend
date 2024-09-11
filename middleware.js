const jwt = require('jsonwebtoken')

module.exports = function (request, response, next) {
  try {
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
  } catch (err) {
    console.log(err)
    return res.status(500).send('Server Error ')
  }
}
