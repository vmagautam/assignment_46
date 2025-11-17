import express from 'express'
import db from '../config/db.js'

const router = express.Router()

router.get('/check', async (req, res) => {
  try {
    const clients = "Hello, I am ok"
    res.json(clients)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router