// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for blockchain testing
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to fill blockchain form with test data
       */
      fillBlockchainForm(data: {
        name: string
        symbol: string
        description: string
        difficulty?: number
        reward?: number
        maxSupply?: number
      }): Chainable<Element>
      
      /**
       * Custom command to wait for blockchain creation
       */
      waitForBlockchainCreation(): Chainable<Element>
      
      /**
       * Custom command to verify blockchain details
       */
      verifyBlockchainDetails(data: {
        name: string
        symbol: string
        description: string
        difficulty: number
        reward: number
      }): Chainable<Element>
    }
  }
}
