import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { collections } from '../services/database'
import Office from '../models/office'

export const officeRouter = express.Router()

officeRouter.use(express.json())

/* Getting all the offices from the database. */
officeRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const offices = (await collections.offices?.find({}).toArray()) as unknown as Office[]
    res.status(200).send(offices)
  } catch (err) {
    const message = (err instanceof Error) ? err.message : String(err)
    res.status(500).send(message)
  }
})

/* Getting the office with the id that is passed in the url. */
officeRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req?.params?.id

  try {
    const query = { _id: new ObjectId(id) }
    const office = (await collections.offices?.findOne(query)) as unknown as Office

    if (office) res.status(200).send(office)
  } catch (err) {
    res.status(404).send(`The office with id: ${id} is not available`)
  }
})

/* Checking if the office with the same zip code already exist. If it does, it will return a 400 status
code with a message. If it doesn't, it will create a new office. */
officeRouter.post('/', async (req: Request, res: Response) => {
  try {
    const query = { zipCode: req.body.zipCode }
    const checkBeforeInsert = await collections.offices?.count(query)

    if (checkBeforeInsert !== 0) {
      res.status(400).send(`Office with zip code ${req.body.zipCode} already exist`)
    } else {
      const newOffice = req.body as Office
      const result = await collections.offices?.insertOne(newOffice)

      result
        ? res.status(201).send(result)
        : res.status(500).send('Failed creating a new office')
    }
  } catch (err) {
    const message = (err instanceof Error) ? err.message : String(err)
    res.status(400).send(message)
  }
})

/* Updating the office with the id that is passed in the url and the body inside the request. */
officeRouter.put('/:id', async (req: Request, res: Response) => {
  const id = req?.params?.id

  try {
    const updatedOffice = req.body as Office
    const query = { _id: new ObjectId(id) }

    const result = await collections.offices?.updateOne(query, { $set: updatedOffice })

    result
      ? res.status(200).send(result)
      : res.status(304).send(`Failed updating the office with id: ${id}`)
  } catch (err) {
    const message = (err instanceof Error) ? err.message : String(err)
    res.status(400).send(message)
  }
})

/* Deleting the office with the id that is passed in the url. */
officeRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = req?.params?.id

  try {
    const query = { _id: new ObjectId(id) }
    const result = await collections.offices?.deleteOne(query)

    if (result && result.deletedCount) {
      res.status(202).send(`Successfully removed office with id ${id}`)
    } else if (!result) {
      res.status(400).send(`Failed removing office with id ${id}`)
    } else if (!result.deletedCount) {
      res.status(404).send(`Office with id ${id} does not exist`)
    }
  } catch (err) {
    const message = (err instanceof Error) ? err.message : String(err)
    res.status(400).send(message)
  }
})
