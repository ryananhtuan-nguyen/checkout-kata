import {
  InvalidCheckoutError,
  type Checkout,
  type CheckoutState,
  type Item,
  type PriceInCents,
  type PricingRule,
  type ScanResult,
} from '../../types'
import { calculateTotal } from '../pricing/calculateTotal'

/**
 * Function that creates a new immutable checkout with the specified pricing rules
 * @param pricingRules - The Pricing rules to apply for this checkout session.
 * @returns An immutable checkout with scanning and total calculation functionality. Also validates the scanned items.
 */
export const createCheckout = (pricingRules: PricingRule[]): Checkout => {
  const createNewCheckoutWithState = (state: CheckoutState) => {
    const checkout = {
      state,
      isValidItem: (item: Item): boolean => {
        return pricingRules.some((rule) => rule.item === item)
      },
      scan: (item: Item): ScanResult => {
        if (!checkout.isValidItem(item)) {
          return {
            success: false,
            checkout,
            error: new InvalidCheckoutError(item),
          }
        }

        const newState: CheckoutState = {
          items: { ...state.items, [item]: (state.items[item] || 0) + 1 },
        }
        //Create a new checkout instance with the updated state - immutable data structure
        return { success: true, checkout: createNewCheckoutWithState(newState) }
      },
      get total(): PriceInCents {
        return calculateTotal(state, pricingRules)
      },
    }
    return checkout
  }

  return createNewCheckoutWithState({ items: {} }) // initial state
}
