export type Item = string
export type PriceInCents = number
/**
 * A function that calculates thhe price of an item based on its quantity.
 * @param quantity - The quantity of the item.
 * @returns An object containing the price in cents and the name of the item.
 */
export type PricingStrategy = (quantity: number) => {
  price: PriceInCents
  name: string
}

/**
 * Defines a pricing rule for an item.
 * @property item - The item to which the pricing rule applies.
 * @property calculatePrice - A function that calculates the price of the item based on its quantity & current going on special.
 */
export type PricingRule = {
  item: Item
  calculatePrice: PricingStrategy
  priority?: number
}

/**
 * Represents the state of the checkout, including the items scanned and their quantities.
 * @property items - A record of items and their quantities.
 */
export type CheckoutState = { items: Record<Item, number> }

export type Checkout = {
  state: CheckoutState
  isValidItem: (item: Item) => boolean
  scan: (item: Item) => ScanResult
  total: PriceInCents
}

export type ScanResult =
  | { success: true; checkout: Checkout }
  | { success: false; checkout: Checkout; error: InvalidCheckoutError }

/**
 * Custom error class for handling invalid scanned items.
 */

export class InvalidCheckoutError extends Error {
  constructor(public item: Item) {
    super(`Invalid item scanned: ${item}`)
    this.name = 'InvalidItemError'
  }
}
