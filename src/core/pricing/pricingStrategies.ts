import type { PriceInCents, PricingStrategy } from '../../types'

/**
 * Create a function that calculates the price of an item based on its quantity with no special pricing.
 * @param unitPrice - The price of a single unit in cents.
 */
export const createUnitPriceStrategy = (
  unitPrice: PriceInCents
): PricingStrategy => {
  return (quantity: number) => ({
    price: quantity * unitPrice,
    name: `Single unit price`,
  })
}

/**
 * Create a function that calculates the price of an item based on its quantity with special pricing.
 * @param unitPrice - The price of a single unit in cents.
 * @param specialPrice - The special price for a specific quantity in cents.
 * @param specialQuantity - The quantity that qualifies for the special price.
 */

export const createMultiPriceStrategy = ({
  unitPrice,
  specialPrice,
  specialQuantity,
}: {
  unitPrice: PriceInCents
  specialPrice: PriceInCents
  specialQuantity: number
}): PricingStrategy => {
  return (quantity: number) => {
    const specialPriceCount = Math.floor(quantity / specialQuantity)
    const remainingCount = quantity % specialQuantity
    const totalPrice =
      specialPriceCount * specialPrice + remainingCount * unitPrice
    return {
      price: totalPrice,
      name: `${specialQuantity} for ${specialPrice}¢`,
    }
  }
}
