/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to fill blockchain form
Cypress.Commands.add('fillBlockchainForm', (data) => {
  cy.get('[data-testid="blockchain-name-input"]').type(data.name)
  cy.get('[data-testid="blockchain-symbol-input"]').type(data.symbol)
  cy.get('[data-testid="blockchain-description-input"]').type(data.description)
  
  if (data.difficulty) {
    cy.get('[data-testid="blockchain-difficulty-select"]').select(data.difficulty.toString())
  }
  
  if (data.reward) {
    cy.get('[data-testid="blockchain-reward-input"]').clear().type(data.reward.toString())
  }
  
  if (data.maxSupply) {
    cy.get('[data-testid="blockchain-maxsupply-input"]').clear().type(data.maxSupply.toString())
  }
})

// Custom command to wait for blockchain creation
Cypress.Commands.add('waitForBlockchainCreation', () => {
  cy.get('[data-testid="create-blockchain-button"]').should('contain', 'Creating Blockchain')
  cy.get('[data-testid="create-blockchain-button"]').should('be.disabled')
  cy.get('[data-testid="blockchain-success-view"]', { timeout: 15000 }).should('be.visible')
})

// Custom command to verify blockchain details
Cypress.Commands.add('verifyBlockchainDetails', (data) => {
  cy.get('[data-testid="blockchain-details-card"]').should('be.visible')
  cy.get('[data-testid="detail-name"]').should('contain', data.name)
  cy.get('[data-testid="detail-symbol"]').should('contain', data.symbol)
  cy.get('[data-testid="detail-description"]').should('contain', data.description.substring(0, 20)) // Partial match
  cy.get('[data-testid="detail-difficulty"]').should('contain', data.difficulty.toString())
  cy.get('[data-testid="detail-reward"]').should('contain', data.reward.toString())
  cy.get('[data-testid="blockchain-status"]').should('contain', 'Active')
})
