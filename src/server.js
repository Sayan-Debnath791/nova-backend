import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('NOVA website backend')
})

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from NOVA' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NOVA backend running on port ${PORT}`)
})
