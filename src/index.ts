import cors from 'cors'
import express from 'express'

import '@/config'
import server from '@/server'

const app = express()

app.use(express.json())

app.enable('trust proxy')

app.use(cors())

app.use('/', server)

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
