const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const { authenticateToken } = require('./middleware/auth')
const { users } = require('./users')

const app = express()
const PORT = 3000
const SECRET = 'your-secret-key'

app.use(cors())
app.use(bodyParser.json())

app.post('/register', (req, res) => {
  const { username, password } = req.body
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' })
  }
  users.push({ username, password })
  res.json({ message: 'User registered successfully' })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' })
  res.json({ token })
})

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}! This is protected data.` })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
