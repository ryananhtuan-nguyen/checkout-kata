import {
  createMultiPriceStrategy,
  createUnitPriceStrategy,
} from '../../../src/core/pricing/pricingStrategies'
import { calculateTotal } from '../../../src/core/pricing/calculateTotal'
import type { CheckoutState, PricingRule } from '../../../src/types'

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
]

describe('calculateTotal', () => {
  it('should return 0 for empty checkout', () => {
    const state: CheckoutState = { items: {} }
    expect(calculateTotal(state, pricingRules)).toBe(0)
  })

  it('should calculate correct prices for individual items', () => {
    const stateA: CheckoutState = { items: { A: 1 } }
    expect(calculateTotal(stateA, pricingRules)).toBe(50)

    const stateB: CheckoutState = { items: { B: 1 } }
    expect(calculateTotal(stateB, pricingRules)).toBe(30)

    const stateC: CheckoutState = { items: { C: 1 } }
    expect(calculateTotal(stateC, pricingRules)).toBe(20)

    const stateD: CheckoutState = { items: { D: 1 } }
    expect(calculateTotal(stateD, pricingRules)).toBe(15)
  })

  it('should apply special pricing correctly', () => {
    const stateA3: CheckoutState = { items: { A: 3 } }
    expect(calculateTotal(stateA3, pricingRules)).toBe(130) // Special price for 3 A's

    const stateA4: CheckoutState = { items: { A: 4 } }
    expect(calculateTotal(stateA4, pricingRules)).toBe(180) // 130 + 50

    const stateA6: CheckoutState = { items: { A: 6 } }
    expect(calculateTotal(stateA6, pricingRules)).toBe(260) // 130 + 130

    const stateB2: CheckoutState = { items: { B: 2 } }
    expect(calculateTotal(stateB2, pricingRules)).toBe(45) // Special price for 2 B's

    const stateB3: CheckoutState = { items: { B: 3 } }
    expect(calculateTotal(stateB3, pricingRules)).toBe(75) // 45 + 30
  })

  it('should calculate correct prices for mixed items', () => {
    const stateMixed1: CheckoutState = { items: { A: 1, B: 1, C: 1, D: 1 } }
    expect(calculateTotal(stateMixed1, pricingRules)).toBe(115) // 50 + 30 + 20 + 15

    const stateMixed2: CheckoutState = { items: { A: 3, B: 2 } }
    expect(calculateTotal(stateMixed2, pricingRules)).toBe(175) // 130 + 45

    const stateMixed3: CheckoutState = { items: { A: 3, B: 2, D: 1 } }
    expect(calculateTotal(stateMixed3, pricingRules)).toBe(190) // 130 + 45 + 15
  })

  it('should handle unknown items by ignoring them', () => {
    const stateUnknown: CheckoutState = { items: { A: 1, X: 1 } }
    expect(calculateTotal(stateUnknown, pricingRules)).toBe(50) // Only counts A
  })

  it('should handle empty pricing rules', () => {
    const state: CheckoutState = { items: { A: 1, B: 1 } }
    expect(calculateTotal(state, [])).toBe(0)
  })
})
