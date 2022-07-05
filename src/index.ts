import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { connectToDB } from './services/database'
import { officeRouter } from './routes/offices'
import { shipmentRouter } from './routes/shipments'

const app: Express = express()
const port = process.env.EXPRESS_PORT
const allowedOrigins = ['http://localhost:5002']

const options: cors.CorsOptions = {
  origin: allowedOrigins
}

connectToDB()
  .then(() => {
    app.use(cors(options))

    app.get('/', (req: Request, res: Response) => {
      res.send('Coding Challenge REST API')
    })

    app.use('/shipments', shipmentRouter)
    app.use('/offices', officeRouter)

    app.listen(port, () => {
      console.log(`[server]: Server is running at https://localhost:${port}`)
    })
  })
  .catch((err: Error) => {
    console.error('Database connection failed', err)
    process.exit()
  })
