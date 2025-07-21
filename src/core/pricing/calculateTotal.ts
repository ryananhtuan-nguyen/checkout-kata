import type { CheckoutState, PriceInCents, PricingRule } from '../../types'

/**
 * Calculate the total price of all items in the checkout state
 * @param state - Current checkout state containing scanned items and their quantities.
 * @param pricingRules - Pricing rules to apply to items
 * @returns - The total price in cents for the scanned items in current checkout state.
 */
export const calculateTotal = (
  state: CheckoutState,
  pricingRules: PricingRule[]
): PriceInCents => {
  const { items } = state
  const totalPrice = Object.entries(items).reduce((total, [item, quantity]) => {
    const currentRule = pricingRules.find((rule) => rule.item === item)
    if (currentRule) {
      return total + currentRule.calculatePrice(quantity).price
    }
    return total
  }, 0)
  return totalPrice
}
