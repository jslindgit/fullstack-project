const url = 'http://localhost:3000';

describe('Basic', function () {
    beforeEach(function () {
        cy.visit(url);
    });

    it('frontpage can be opened', function () {
        cy.get('[data-testid="welcome-message"]').should('exist');
    });

    it('products can be opened', function () {
        cy.get('[data-testid="menu-shop"]').click();
        cy.get('[data-testid="categories-header"]').should('exist');
    });

    it('info can be opened', function () {
        cy.get('[data-testid="menu-info"]').click();
        cy.get('[data-testid="info-header"]').should('exist');
    });

    it('shopping cart can be opened', function () {
        cy.get('[data-testid="menu-cart"]').click();
        cy.get('[data-testid="cart-header"]').should('exist');
    });
});

describe('Login', function () {
    it('login works with test credentials, account page can be opened, logout works, register can be opened', function () {
        cy.visit(url);
        cy.get('[data-testid="menu-login"]').click();
        cy.get('[data-testid="input-username"]').type('cypress@testingcypress123.com');
        cy.get('[data-testid="input-password"]').type('cypress123');
        cy.get('[data-testid="button-submit"]').click();
        cy.get('[data-testid="login-success"]').should('exist');

        cy.get('[data-testid="menu-account"]').click();
        cy.get('[data-testid="account-header"]').should('exist');

        cy.get('[data-testid="menu-logout"]').click();
        cy.visit('http://localhost:3000/you'); // When not logged it, the Account page should re-direct to the Login page
        cy.get('[data-testid="login-header"]').should('exist');

        cy.get('[data-testid="register-link"]').click();
        cy.get('[data-testid="register-header"]').should('exist');
    });
});

describe('Shopping cart', function () {
    beforeEach(function () {
        cy.visit(url + '/shop/item/89');
    });

    it('item details page can be opened', function () {
        cy.get('[data-testid="item-name"]').should('exist');
    });

    it('items can be added to shopping cart', function () {
        cy.get('[data-testid="increase-quantity"]').click().click();
        cy.get('[data-testid="button-add-to-cart"]').click();
        cy.get('[data-testid="cart-item-amount"]').contains('3');
    });
});
