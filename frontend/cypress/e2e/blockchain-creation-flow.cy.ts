describe('Blockchain Creation E2E Flow', () => {
  beforeEach(() => {
    // Start with a clean state for each test
    cy.visit('/')
    
    // Wait for the page to load
    cy.get('[data-testid="page-header"]').should('be.visible')
  })

  it('should complete the full blockchain creation flow', () => {
    // Step 1: Navigate from landing page to create page
    cy.get('a[href="/create"]').first().click()
    
    // Step 2: Verify we're on the create page
    cy.url().should('include', '/create')
    cy.get('[data-testid="blockchain-form"]').should('be.visible')
    cy.get('[data-testid="page-title"]').should('contain', 'Create Your Blockchain')
    
    // Step 3: Fill out the blockchain configuration form
    cy.get('[data-testid="blockchain-name-input"]').type('MyTestCoin')
    cy.get('[data-testid="blockchain-symbol-input"]').type('MTC')
    cy.get('[data-testid="blockchain-description-input"]').type('This is a test cryptocurrency created through Cypress E2E testing to verify the complete blockchain creation flow.')
    
    // Select difficulty level
    cy.get('[data-testid="blockchain-difficulty-select"]').select('2')
    
    // Set reward and max supply
    cy.get('[data-testid="blockchain-reward-input"]').clear().type('75')
    cy.get('[data-testid="blockchain-maxsupply-input"]').clear().type('2500000')
    
    // Step 4: Submit the form
    cy.get('[data-testid="create-blockchain-button"]').click()
    
    // Step 5: Wait for blockchain creation (show loading state)
    cy.get('[data-testid="create-blockchain-button"]').should('contain', 'Creating Blockchain')
    cy.get('[data-testid="create-blockchain-button"]').should('be.disabled')
    
    // Step 6: Verify success view appears
    cy.get('[data-testid="blockchain-success-view"]', { timeout: 15000 }).should('be.visible')
    cy.get('h1').should('contain', 'Blockchain Created Successfully!')
    cy.get('[data-testid="blockchain-name"]').should('contain', 'MyTestCoin')
    
    // Step 7: Verify blockchain details are displayed correctly
    cy.get('[data-testid="blockchain-details-card"]').should('be.visible')
    cy.get('[data-testid="detail-name"]').should('contain', 'MyTestCoin')
    cy.get('[data-testid="detail-symbol"]').should('contain', 'MTC')
    cy.get('[data-testid="detail-description"]').should('contain', 'This is a test cryptocurrency')
    cy.get('[data-testid="detail-difficulty"]').should('contain', '2')
    cy.get('[data-testid="detail-reward"]').should('contain', '75')
    cy.get('[data-testid="blockchain-status"]').should('contain', 'Active')
    
    // Step 8: Test download functionality
    cy.get('[data-testid="download-button"]').click()
    
    // Verify download loading state
    cy.get('[data-testid="download-button"]').should('contain', 'Downloading')
    
    // Verify download completes (button text changes back)
    cy.get('[data-testid="download-button"]', { timeout: 10000 }).should('contain', 'Download Blockchain')
    
    // Step 9: Test publish functionality (shows coming soon modal)
    cy.get('[data-testid="publish-button"]').click()
    
    // Should show notification modal
    cy.get('[data-testid="notification-modal"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-testid="modal-title"]').should('contain', 'Coming Soon!')
    
    // Close modal
    cy.get('[data-testid="modal-close-button"]').click()
    cy.get('[data-testid="notification-modal"]').should('not.exist')
    
    // Step 10: Test "Create Another Blockchain" functionality
    cy.get('[data-testid="create-another-button"]').click()
    
    // Should return to the form
    cy.get('[data-testid="blockchain-form"]').should('be.visible')
    cy.get('[data-testid="page-title"]').should('contain', 'Create Your Blockchain')
    
    // Form should be reset
    cy.get('[data-testid="blockchain-name-input"]').should('have.value', '')
    cy.get('[data-testid="blockchain-symbol-input"]').should('have.value', '')
    cy.get('[data-testid="blockchain-description-input"]').should('have.value', '')
  })

  it('should handle form validation errors', () => {
    // Navigate to create page
    cy.get('a[href="/create"]').first().click()
    
    // Try to submit empty form
    cy.get('[data-testid="create-blockchain-button"]').click()
    
    // Should show validation errors
    cy.get('[data-testid="name-error"]').should('be.visible').should('contain', 'required')
    cy.get('[data-testid="symbol-error"]').should('be.visible').should('contain', 'required')
    cy.get('[data-testid="description-error"]').should('be.visible').should('contain', 'required')
    
    // Fill with invalid data
    cy.get('[data-testid="blockchain-name-input"]').type('A') // Too short
    cy.get('[data-testid="blockchain-symbol-input"]').type('TOOLONG') // Too long
    cy.get('[data-testid="blockchain-description-input"]').type('Short') // Too short
    cy.get('[data-testid="blockchain-reward-input"]').clear().type('0') // Invalid
    cy.get('[data-testid="blockchain-maxsupply-input"]').clear().type('500') // Too low
    
    cy.get('[data-testid="create-blockchain-button"]').click()
    
    // Should show specific validation errors
    cy.get('[data-testid="name-error"]').should('contain', 'at least 2 characters')
    cy.get('[data-testid="symbol-error"]').should('contain', '5 characters or less')
    cy.get('[data-testid="description-error"]').should('contain', 'at least 10 characters')
    cy.get('[data-testid="reward-error"]').should('contain', 'greater than 0')
    cy.get('[data-testid="maxsupply-error"]').should('contain', 'at least 1,000')
  })

  it('should handle navigation correctly', () => {
    // Test back navigation from create page
    cy.get('a[href="/create"]').first().click()
    cy.url().should('include', '/create')
    
    // Click back navigation
    cy.get('[data-testid="back-navigation"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Test support banner link
    cy.get('a[href="/create"]').first().click()
    cy.get('[data-testid="support-link"]').should('have.attr', 'href', 'https://buymeacoffee.com/notjustweb')
    cy.get('[data-testid="support-link"]').should('have.attr', 'target', '_blank')
  })

  it('should handle symbol input formatting', () => {
    cy.get('a[href="/create"]').first().click()
    
    // Type lowercase - should be converted to uppercase
    cy.get('[data-testid="blockchain-symbol-input"]').type('btc')
    cy.get('[data-testid="blockchain-symbol-input"]').should('have.value', 'BTC')
    
    // Test maxlength
    cy.get('[data-testid="blockchain-symbol-input"]').clear().type('VERYLONGSYMBOL')
    cy.get('[data-testid="blockchain-symbol-input"]').should('have.value', 'VERYL') // Should be truncated to 5 chars
  })

  it('should persist form state during validation', () => {
    cy.get('a[href="/create"]').first().click()
    
    // Fill form partially
    cy.get('[data-testid="blockchain-name-input"]').type('TestCoin')
    cy.get('[data-testid="blockchain-difficulty-select"]').select('4')
    cy.get('[data-testid="blockchain-reward-input"]').clear().type('100')
    
    // Submit to trigger validation (description missing)
    cy.get('[data-testid="create-blockchain-button"]').click()
    
    // Form values should still be there
    cy.get('[data-testid="blockchain-name-input"]').should('have.value', 'TestCoin')
    cy.get('[data-testid="blockchain-difficulty-select"]').should('have.value', '4')
    cy.get('[data-testid="blockchain-reward-input"]').should('have.value', '100')
    
    // Fill missing description
    cy.get('[data-testid="blockchain-description-input"]').type('A test cryptocurrency for validation testing')
    cy.get('[data-testid="blockchain-symbol-input"]').type('TST')
    
    // Should now submit successfully
    cy.get('[data-testid="create-blockchain-button"]').click()
    cy.get('[data-testid="blockchain-success-view"]', { timeout: 15000 }).should('be.visible')
  })

  it('should show proper loading states', () => {
    cy.get('a[href="/create"]').first().click()
    
    // Fill form with valid data
    cy.get('[data-testid="blockchain-name-input"]').type('LoadingTest')
    cy.get('[data-testid="blockchain-symbol-input"]').type('LT')
    cy.get('[data-testid="blockchain-description-input"]').type('Testing loading states during blockchain creation process')
    
    // Submit and check loading state
    cy.get('[data-testid="create-blockchain-button"]').click()
    
    // Should show loading state
    cy.get('[data-testid="create-blockchain-button"]').should('be.disabled')
    cy.get('[data-testid="create-blockchain-button"]').should('contain', 'Creating Blockchain')
    cy.get('.spinner').should('be.visible')
    
    // Wait for completion
    cy.get('[data-testid="blockchain-success-view"]', { timeout: 15000 }).should('be.visible')
  })

  it('should handle error scenarios gracefully', () => {
    // Intercept API call to return error
    cy.intercept('POST', '**/api/blockchain/create', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('createBlockchainError')
    
    cy.get('a[href="/create"]').first().click()
    
    // Fill form
    cy.get('[data-testid="blockchain-name-input"]').type('ErrorTest')
    cy.get('[data-testid="blockchain-symbol-input"]').type('ERR')
    cy.get('[data-testid="blockchain-description-input"]').type('Testing error handling in blockchain creation')
    
    // Submit
    cy.get('[data-testid="create-blockchain-button"]').click()
    
    // Wait for API call
    cy.wait('@createBlockchainError')
    
    // Should show error notification
    cy.get('[data-testid="notification-modal"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-testid="modal-title"]').should('contain', 'Creation Failed')
    
    // Button should be enabled again
    cy.get('[data-testid="create-blockchain-button"]').should('not.be.disabled')
    cy.get('[data-testid="create-blockchain-button"]').should('contain', 'Create Blockchain')
  })
})
