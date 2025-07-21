import {
  createUnitPriceStrategy,
  createMultiPriceStrategy,
} from '../../../src/core/pricing/pricingStrategies'

describe('Pricing Strategies', () => {
  describe('Unit Price Strategy', () => {
    it('should calculate price based on quantity and unit price', () => {
      const unitPriceStrategy = createUnitPriceStrategy(50)
      expect(unitPriceStrategy(1).price).toBe(50)
      expect(unitPriceStrategy(3).price).toBe(150)
    })

    it('should provide correct pricing strategy name', () => {
      const unitPriceStrategy = createUnitPriceStrategy(50)
      expect(unitPriceStrategy(1).name).toBe('Single unit price')
    })
  })

  describe('Multi-Item Price Strategy', () => {
    const multiPriceStrategy = createMultiPriceStrategy({
      specialPrice: 130,
      unitPrice: 50,
      specialQuantity: 3,
    })

    it('should apply special price for exact multiples', () => {
      expect(multiPriceStrategy(3).price).toBe(130) // 3 for 130
      expect(multiPriceStrategy(6).price).toBe(260) // 2 x 3 for 130
    })

    it('should mix special and unit price for non-exact multiples', () => {
      expect(multiPriceStrategy(4).price).toBe(180) // 3 for 130 + 1 for 50
      expect(multiPriceStrategy(5).price).toBe(230) // 3 for 130 + 2 for 100
    })

    it('should provide correct pricing strategy name', () => {
      expect(multiPriceStrategy(1).name).toBe('3 for 130¢')
      expect(multiPriceStrategy(3).name).toBe('3 for 130¢')
    })
  })
})

describe('5 for 200 strategy', () => {
  const new5For200Strategy = createMultiPriceStrategy({
    unitPrice: 50,
    specialPrice: 200,
    specialQuantity: 5,
  })

  it('should calculate the correct price for exact multiple', () => {
    expect(new5For200Strategy(5).price).toBe(200)
    expect(new5For200Strategy(10).price).toBe(400)
    expect(new5For200Strategy(15).price).toBe(600)
  })

  it('should calculate the correct price for non-exact multiple', () => {
    expect(new5For200Strategy(6).price).toBe(250)
    expect(new5For200Strategy(7).price).toBe(300)
    expect(new5For200Strategy(8).price).toBe(350)
  })
})
