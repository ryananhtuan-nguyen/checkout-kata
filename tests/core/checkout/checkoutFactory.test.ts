import type { CheckoutState, PricingRule } from '../../../src/types'
import { createCheckout } from '../../../src/core/checkout/checkoutFactory'
import {
  createMultiPriceStrategy,
  createUnitPriceStrategy,
} from '../../../src/core/pricing/pricingStrategies'

const pricingRules: PricingRule[] = [
  {
    item: 'A',
    calculatePrice: createMultiPriceStrategy({
      unitPrice: 50,
      specialPrice: 130,
      specialQuantity: 3,
    }),
  },
  {
    item: 'B',
    calculatePrice: createMultiPriceStrategy({
      unitPrice: 30,
      specialPrice: 45,
      specialQuantity: 2,
    }),
  },
  { item: 'C', calculatePrice: createUnitPriceStrategy(20) },
  { item: 'D', calculatePrice: createUnitPriceStrategy(15) },
  {
    item: 'E',
    calculatePrice: createMultiPriceStrategy({
      unitPrice: 50,
      specialPrice: 200,
      specialQuantity: 5,
    }),
  },
]

describe('Checkout', () => {
  it('Should start with empty cart', () => {
    const checkout = createCheckout(pricingRules)
    expect(
      checkout.state.items && Object.keys(checkout.state.items).length === 0
    ).toBe(true)
  })

  it('Should start with 0 total', () => {
    const checkout = createCheckout(pricingRules)
    expect(checkout.total).toBe(0)
  })

  it('Should update total when items are scanned', () => {
    let checkout = createCheckout(pricingRules)

    const resultA = checkout.scan('A')
    expect(resultA.success).toBe(true)
    if (resultA.success) {
      checkout = resultA.checkout
      expect(checkout.total).toBe(50)
    }

    const resultB = checkout.scan('B')
    expect(resultB.success).toBe(true)
    if (resultB.success) {
      checkout = resultB.checkout
      expect(checkout.total).toBe(80)
    }

    const resultA2 = checkout.scan('A')
    expect(resultA2.success).toBe(true)
    if (resultA2.success) {
      checkout = resultA2.checkout
      expect(checkout.total).toBe(130)
    }

    const resultC = checkout.scan('C')
    expect(resultC.success).toBe(true)
    if (resultC.success) {
      checkout = resultC.checkout
      expect(checkout.total).toBe(150)
    }

    const resultA3 = checkout.scan('A')
    expect(resultA3.success).toBe(true)
    if (resultA3.success) {
      checkout = resultA3.checkout
      expect(checkout.total).toBe(180)
    }
  })

  it('Should check if item is valid', () => {
    const checkout = createCheckout(pricingRules)
    expect(checkout.isValidItem('A')).toBe(true)
    expect(checkout.isValidItem('B')).toBe(true)
    expect(checkout.isValidItem('X')).toBe(false)
    expect(checkout.isValidItem('')).toBe(false)
  })

  it('Should handle invalid items gracefully', () => {
    let checkout = createCheckout(pricingRules)

    // Scan valid item first
    const validResult = checkout.scan('A')
    expect(validResult.success).toBe(true)
    expect(validResult.checkout.total).toBe(50)

    if (validResult.success) {
      checkout = validResult.checkout
    }

    // Now scan invalid item
    const invalidResult = checkout.scan('X')
    expect(invalidResult.success).toBe(false)

    // Type assertion to help TypeScript understand we're testing the error case
    if (!invalidResult.success) {
      expect(invalidResult.error).toBeDefined()
      expect(invalidResult.error.name).toBe('InvalidItemError')
      expect(invalidResult.error.item).toBe('X')
    }

    // Checkout state should be preserved
    expect(invalidResult.checkout.total).toBe(50)
    expect(invalidResult.checkout.state.items['A']).toBe(1)
    expect(Object.keys(invalidResult.checkout.state.items).length).toBe(1)
  })

  it('Should allow continued scanning after invalid item', () => {
    let checkout = createCheckout(pricingRules)

    // Scan valid item
    let result = checkout.scan('A')
    if (result.success) {
      checkout = result.checkout
    }

    // Scan invalid item
    result = checkout.scan('X')
    // State should be preserved despite invalid item
    expect(result.success).toBe(false)

    // Continue scanning with valid item
    result = checkout.scan('B')
    expect(result.success).toBe(true)

    if (result.success) {
      checkout = result.checkout
      expect(checkout.total).toBe(80) // 50 + 30
      expect(checkout.state.items['A']).toBe(1)
      expect(checkout.state.items['B']).toBe(1)
    }
  })
})
