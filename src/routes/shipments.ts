import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { collections } from '../services/database'
import Shipment, { typeOptions, statusOptions, weightOptions } from '../models/shipment'

export const shipmentRouter = express.Router()

shipmentRouter.use(express.json())

/* Getting all the shipments from the database. */
shipmentRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const shipments = (await collections.shipments?.find({}).toArray()) as unknown as Shipment[]
    res.status(200).send(shipments)
  } catch (err) {
    const message = (err instanceof Error) ? err.message : String(err)
    res.status(500).send(message)
  }
})

/* Getting a shipment by id. */
shipmentRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req?.params?.id

  try {
    const query = { _id: new ObjectId(id) }
    const shipment = (await collections.shipments?.findOne(query)) as unknown as Shipment

    if (shipment) res.status(200).send(shipment)
  } catch (err) {
    res.status(404).send(`The shipment with id: ${id} is not available`)
  }
})

/* Creating a new shipment. */
shipmentRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { postOffice, type, status, weight } = req.body
    const query = { zipCode: req.body.postOffice }
    const checkBeforeInsert = await collections.offices?.count(query)

    if (checkBeforeInsert === 0) {
      res.status(400).send(`There is no office available with code ${req.body.postOffice}`)
    } else {
      if (!typeOptions[type] || !statusOptions[status] || !weightOptions[weight]) {
        res.status(400).send('Please check again your request')
      } else {
        const newShipment = new Shipment(
          postOffice,
          typeOptions[type],
          statusOptions[status],
          weightOptions[weight]
        )
        const result = await collections.shipments?.insertOne(newShipment)

        result
          ? res.status(201).send(result)
          : res.status(500).send('Failed creating a new shipment')
      }
    }
  } catch (err) {
    const message = (err instanceof Error) ? err.message : String(err)
    res.status(400).send(message)
  }
})

/* Updating a shipment by id. */
shipmentRouter.put('/:id', async (req: Request, res: Response) => {
  const id = req?.params?.id

  try {
    const updatedShipment = req.body as Shipment
    const query = { _id: new ObjectId(id) }

    const result = await collections.shipments?.updateOne(query, { $set: updatedShipment })

    result
      ? res.status(200).send(result)
      : res.status(304).send(`Failed updating the shipment with id: ${id}`)
  } catch (err) {
    const message = (err instanceof Error) ? err.message : String(err)
    res.status(400).send(message)
  }
})

/* Deleting a shipment by id. */
shipmentRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = req?.params?.id

  try {
    const query = { _id: new ObjectId(id) }
    const result = await collections.shipments?.deleteOne(query)

    if (result && result.deletedCount) {
      res.status(202).send(`Successfully removed shipment with id ${id}`)
    } else if (!result) {
      res.status(400).send(`Failed removing shipment with id ${id}`)
    } else if (!result.deletedCount) {
      res.status(404).send(`shipment with id ${id} does not exist`)
    }
  } catch (err) {
    const message = (err instanceof Error) ? err.message : String(err)
    res.status(400).send(message)
  }
})
