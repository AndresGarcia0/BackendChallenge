type tOptions = {
  [key: number]: string
}

export const typeOptions: tOptions = {
  1: 'Letter',
  2: 'Package'
}

export const statusOptions: tOptions = {
  1: 'Received and processed in the parcel center of origin',
  2: 'Received and processed in the destination parcel center',
  3: 'Delivered'
}

export const weightOptions: tOptions = {
  1: 'Less than 1kg',
  2: 'Between 1kg and 5kg',
  3: 'More than 5kg'
}

export interface IShipment {
  postOffice: string,
  type: keyof typeof typeOptions,
  status: keyof typeof statusOptions,
  weight: keyof typeof weightOptions
}

export default class Shipment {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public postOffice: string,
    public type: string,
    public status: string,
    public weight: string
  ) {}
}
