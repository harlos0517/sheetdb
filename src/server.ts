import { Router } from 'express'

import { getData } from '@/db'

const router = Router()

router.get('/data/:FILE/:SHEET', async(req, res) => {
  try {
    const FILE = req.params.FILE
    const SHEET = req.params.SHEET
    const page = Number(req.query.page || 0)
    const per = Number(req.query.per || 10)
    const filter = JSON.parse(String(req.query.filter || '{}'))
    const data = await getData(FILE, SHEET, { page, per }, filter)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
})

export default router
