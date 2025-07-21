## Problem:

- Create a checkout system that handles pricing schemes and special prices such as apple costs 50 cents each, 3 apples cost $1.30.
- Items are identified using Stock Keeping Units, in this case, individual letters of the alphabet.

## Requirements:

- Checkout accepts items in any order, and it should regconized the special prices/promotion.
- Pricing changes frequently => a set of pricing rules passed in each time start handling a checkout transaction

## Design

- Functional Programming approach
- Test-driven development.

## Key considerations and components:

- Pure functions: no side effects, highly testable in isolation.
- Immutable data structures: prevent unexpected state changes.
- Price in cents instead of dollars: avoid floating-point arithmetic errors that can occur with decimal values.
- Strategy Pattern: PricingStrategy interface to abstract different pricing calculations.
