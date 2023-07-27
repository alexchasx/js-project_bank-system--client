/// <reference types="cypress" />

import validationMessages from '../../src/js/validation-messages';

const HOST = 'http://localhost:9000';
const forceTrue = { force: true };
const MIN_LENGTH = 6;
const VALID_LOGIN = 'developer';
const VALID_PASSWORD = 'skillbox';

const checkErrorMessage = (message) => {
  cy.get('.just-validate-error-label').should(($el) => {
    expect($el.first()).to.contain(message);
  });
};

/* eslint-disable no-undef */
describe('Валидация формы', () => {
  beforeEach(() => {
    cy.visit(HOST + '/logout');
  });

  it('Авторизация должна проходить с валидными данными', () => {
    cy.get('#login_input').type(VALID_LOGIN, forceTrue);
    cy.get('#login_pass').type(VALID_PASSWORD, forceTrue);
    cy.get('[type=submit]').click(forceTrue);
    cy.url().should('include', '/accounts');
  });

  describe('Валидация поля "Логин"', () => {
    it('Поле не должено быть пустым', () => {
      cy.get('#login_pass').type(VALID_PASSWORD, forceTrue);
      cy.get('[type=submit]').click(forceTrue);
      checkErrorMessage(validationMessages.requred);
    });

    it('Количество символов не должно быть менее ' + MIN_LENGTH, () => {
      cy.get('#login_input').type('12345', forceTrue);
      cy.get('#login_pass').type(VALID_PASSWORD, forceTrue);
      cy.get('[type=submit]').click(forceTrue);
      checkErrorMessage(validationMessages.minLength);
    });
  });

  describe('Валидация поля "Пароль"', () => {
    it('Поле не должено быть пустым', () => {
      cy.get('#login_input').type(VALID_LOGIN, forceTrue);
      cy.get('[type=submit]').click(forceTrue);
      checkErrorMessage(validationMessages.requred);
    });

    it('Количество символов не должно быть менее ' + MIN_LENGTH, () => {
      cy.get('#login_pass').type('12345', forceTrue);
      cy.get('#login_input').type(VALID_LOGIN, forceTrue);
      cy.get('[type=submit]').click(forceTrue);
      checkErrorMessage(validationMessages.minLength);
    });
  });
});
