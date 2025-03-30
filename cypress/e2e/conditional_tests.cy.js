import { cytest } from 'cypress-smart-tests';

describe('Cypress Smart Tests Plugin - Conditional Execution', () => {
    beforeEach(() => {
        Cypress.env('ENABLE_FEATURE_X', true);
        Cypress.env('ENABLE_FEATURE_Y', false);
    });

    context('Conditional Tests with runIf', () => {
        cytest('Test that always runs (no condition)', () => {
            cy.log('This test should always run');
            cy.wrap(true).should('be.true');
        });

        cytest('Test that runs when condition is true',
            { runIf: () => Cypress.env('ENABLE_FEATURE_X') },
            () => {
                cy.log('This test should run because ENABLE_FEATURE_X is true');
                cy.wrap(true).should('be.true');
            }
        );

        cytest('Test that is skipped when condition is false',
            { runIf: () => Cypress.env('ENABLE_FEATURE_Y') },
            () => {
                cy.log('This test should be skipped because ENABLE_FEATURE_Y is false');
                cy.wrap(false).should('be.true'); // This would fail if the test ran
            }
        );

        cytest('Test with dynamic condition',
            { runIf: () => {
                    // You can put any logic here
                    const currentBrowser = Cypress.browser.name;
                    const isChrome = currentBrowser === 'chrome';
                    cy.log(`Current browser: ${currentBrowser}, isChrome: ${isChrome}`);
                    return isChrome;
                }},
            () => {
                cy.log('This test only runs in Chrome');
                cy.wrap(true).should('be.true');
            }
        );
    });

    context('Conditional Tests with skip', () => {
        // Test that skip works with options
        cytest.skip('Skipped test with condition',
            { runIf: () => Cypress.env('ENABLE_FEATURE_X') },
            () => {
                cy.log('This test should be skipped regardless of the condition');
                cy.wrap(false).should('be.true'); // This would fail if the test ran
            }
        );
    });
});
