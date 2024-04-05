const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

app = express()
app.use(express.json)
const dbpath = path.join(__dirname, 'userData.db')

let database = null
const initializaDBAndServer = async (request, response) => {
  try {
    database = open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('coding running http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Error ${e.massege}`)
    process.exit(1)
  }
}

initializaDBAndServer()
//api 1

app.post('/register', async (request, response) => {
  const {username, name, password, gender, location} = request.body
  const hashedPassword = await bcrypt.hash(request.body.password, 10)
  const selectuserQuery = `SELECT username FROM user WHERE username = ${username};`
  const dbUser = await database.get(selectuserQuery)
  if (dbUser === undefined) {
    const createUserQuery = `
  INSERT INTO
  user (username, name, password, gender, location)
  VALUES
  (
    '${username}',
    '${name}',
    '${hashedPassword}',
    '${gender}',
    '${location}'
  );
  `
    if (password.length < 5) {
      response.status = 400
      response.send('Password is too short')
    } else {
      await database.run(createUserQuery)
      response.status = 200
      response.send('User create successfully')
    }
  } else {
    response.status = 400
    response.send('User already exists')
  }
})

module.exports = app
