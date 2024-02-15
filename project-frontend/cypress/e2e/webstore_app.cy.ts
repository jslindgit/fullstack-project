const url = 'http://localhost:3001';

describe('Pages can be opened', function () {
    beforeEach(function () {
        cy.visit(url);
    });

    it('frontpage can be opened', function () {
        cy.get('[data-testid="welcome-message"]').should('exist');
    });

    it('products page can be opened', function () {
        cy.get('[data-testid="menu-shop"]').click();
        cy.get('[data-testid="categories-header"]').should('exist');
    });

    it('info page can be opened', function () {
        cy.get('[data-testid="menu-info"]').click();
        cy.get('[data-testid="info-header"]').should('exist');
    });

    it('shopping cart can be opened', function () {
        cy.get('[data-testid="menu-cart"]').click();
        cy.get('[data-testid="cart-header"]').should('exist');
    });
});

describe('Login', function () {
    it('login works with test credentials, account page can be opened, logout works, registration page can be opened', function () {
        cy.visit(url);

        // Log in with test credentials:
        cy.get('[data-testid="menu-login"]').click();
        cy.get('[data-testid="input-username"]').type('cypress@testingcypress123.com');
        cy.get('[data-testid="input-password"]').type('cypress123');
        cy.get('[data-testid="button-submit"]').click();
        cy.get('[data-testid="login-success"]').should('exist');

        // Open Account page:
        cy.get('[data-testid="menu-account"]').click();
        cy.get('[data-testid="account-header"]').should('exist');

        // Log out:
        cy.get('[data-testid="menu-logout"]').click();
        cy.visit(url + '/you'); // When not logged it, the Account page should re-direct to the Login page
        cy.get('[data-testid="login-header"]').should('exist');

        // Open registration page:
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

    it('items can be added to shopping cart, can proceed to checkout, payment selection page works', function () {
        // Add 3 pcs of the test item to shopping cart:
        cy.get('[data-testid="increase-quantity"]').click().click();
        cy.get('[data-testid="button-add-to-cart"]').click();
        cy.get('[data-testid="cart-item-amount"]').contains('3');
        cy.get('[data-testid="added-to-cart-notification"]').should('exist');

        // Proceed to check out:
        cy.get('[data-testid="menu-cart"]').click();
        cy.get('[data-testid="button-checkout"]').click();
        cy.get('[data-testid="checkout-contactinfo-header"]').should('exist');
        cy.get('[data-testid="checkout-delivery-header"]').should('exist');

        // Fill customer info:
        cy.get('[data-testid="checkout-firstname"]').type('Cypress');
        cy.get('[data-testid="checkout-lastname"]').type('Testing');
        cy.get('[data-testid="checkout-address"]').type('Cypress Street 1');
        cy.get('[data-testid="checkout-zipcode"]').type('12345');
        cy.get('[data-testid="checkout-city"]').type('Cypress City');
        cy.get('[data-testid="checkout-country"]').then(($select) => {
            if ($select.find('option:contains("Finland")').length > 0) {
                cy.get('[data-testid="checkout-country"]').select('Finland');
            } else {
                cy.get('[data-testid="checkout-country"]').select('Suomi');
            }
        });
        cy.get('[data-testid="checkout-email"]').type('cypress@testingcypress123.com');
        cy.get('[data-testid="checkout-phone"]').type('+358 09 1234567890');

        // Select delivery method:
        cy.get('[data-testid="checkout-delivery-last-method"]').click();

        // Proceed to payment method selection page:
        cy.get('[data-testid="checkout-button-choose-payment-method"]').click();
        cy.get('[data-testid="payment-choose-method"]').should('exist');
        cy.get('[data-testid="payment-providers"]').should('exist');
    });
});
