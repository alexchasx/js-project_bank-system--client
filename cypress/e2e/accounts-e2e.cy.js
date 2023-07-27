/// <reference types="cypress" />

import { getNewAccount } from '../../src/js/store/index';

const HOST = 'http://localhost:9000';
const forceTrue = { force: true };

const login = () => {
  cy.get('#login_input').type('developer', forceTrue);
  cy.get('#login_pass').type('skillbox', forceTrue);
  cy.get('[type=submit]').click(forceTrue);
  cy.url().should('include', '/accounts');
};

const openAccount = () => {
  cy.get('.open-account').first().click(forceTrue);
};

const before = () => {
  cy.visit(HOST + '/logout');
  login();
};

describe('Список счетов и страница отдельного счёта', () => {
  beforeEach(before);

  it(`При нажатии на кнопку "Создать новый счёт" количество счетов должно
      увеличиться на 1`, () => {
    cy.get('.control-panel__title').should('contain.text', 'Ваши счета');

    let countAccounts = [];
    cy.get('.accounts__item')
      .each((el) => {
        countAccounts.push(el);
      })
      .then(() => {
        cy.get('#create-account-btn').click();
        cy.get('.accounts__item').should(
          'have.length',
          countAccounts.length + 1
        );
      });
  });

  it('По клику на кнопку "Открыть" должны открывать страница счёта', () => {
    openAccount();
    cy.url().should('include', '/account/');
  });

  it('Сумма должна переводиться на новый счёт и вычитаться из баланса', () => {
    openAccount();

    let afterBalance = 0;
    cy.get('.account__balance').then((el) => {
      const beforeBalance = parseFloat(el.get(0).textContent);
      const amount = 100;
      afterBalance = beforeBalance - amount;
      const newAccount = getNewAccount();
      cy.get('[name=search_terms]').type(newAccount, forceTrue);
      cy.get('#transfer_amount').type(amount, forceTrue);
      cy.get('#transfer_submit').click(forceTrue);
      if (afterBalance - amount > 0) {
        cy.get('.account__balance').should('have.text', afterBalance);
      }
    });
  });
});
