import { MongoClient, Db, Collection } from 'mongodb'

export const collections: {offices?: Collection, shipments?: Collection } = {}

let dbConnection: Db

const connect = async function () {
  const client = new MongoClient(process.env.CONFIG_MONGODB_URL!)
  await client.connect()

  dbConnection = client.db(process.env.CONFIG_MONGODB_NAME)
  console.info('Successfullly connected to MongoDB')

  collections.offices = dbConnection.collection(process.env.MONGODB_OFFICE_COLLECTION!)
  collections.shipments = dbConnection.collection(process.env.MONGODB_SHIPMENT_COLLECTION!)
}

export {
  connect as connectToDB,
  dbConnection as getDb
}
