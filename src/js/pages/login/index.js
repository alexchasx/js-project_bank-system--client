import {
  loginForm,
  loginInput,
  loginPass,
  renderLoginForm,
  submitBtn,
} from './dom';
import JustValidate from 'just-validate';
import { get, submit, disableSubmitBtn } from '../../utils/index';
import { myFetch } from '../../request.js';
import validationMessages from '../../validation-messages';
import { saveToken } from '../../store/index.js';
import { showPreloader } from '../../components/common';

const validateForm = (form) => {
  const validation = new JustValidate(form);
  const rules = [
    {
      rule: 'required',
      errorMessage: validationMessages.requred,
    },
    {
      rule: 'minLength',
      value: 6,
      errorMessage: validationMessages.minLength,
    },
    {
      rule: 'customRegexp',
      value: /^\S*$/gi,
      errorMessage: validationMessages.noSpace,
    },
  ];
  validation.addField('#login_input', rules).addField('#login_pass', rules);

  disableSubmitBtn(form);
};

export default (callback) => {
  renderLoginForm();
  validateForm(loginForm);

  submit(loginForm, async (event) => {
    event.preventDefault();
    if (get('.just-validate-error-label')) {
      return false;
    }
    showPreloader(submitBtn);

    myFetch(
      'login',
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          login: loginInput.value,
          password: loginPass.value,
        }),
      },
      (payload) => {
        saveToken(payload.token);
        callback();
      }
    );
  });
};
