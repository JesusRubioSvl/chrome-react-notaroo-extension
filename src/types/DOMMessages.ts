import {SigningOrder} from "../models/signingOrder"

export type DOMMessage = {
  type: 'GET_DOM',
  order: SigningOrder
}

export type DOMMessageResponse = {
  title: string
}