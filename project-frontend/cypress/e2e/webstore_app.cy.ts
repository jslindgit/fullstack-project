describe('Basic', () => {
    beforeEach(function () {
        cy.visit('http://localhost:3000');
    });

    it('frontpage can be opened', function () {
        cy.get('[data-testid="welcome-message"]').should('exist');
    });

    it('login works with test credentials', function () {
        cy.get('[data-testid="menu-login"]').click();
        cy.get('[data-testid="input-username"]').type('cypress@testingcypress123.com');
        cy.get('[data-testid="input-password"]').type('cypress123');
        cy.get('[data-testid="button-submit"]').click();
        cy.get('[data-testid="login-success"]').should('exist');
    });
});
