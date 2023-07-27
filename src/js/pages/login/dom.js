import '../../../scss/components/_login_form.scss';
import { main } from '../../components/container';
import { headerNav } from '../../components/header';
import { el, mount } from 'redom';

const PAGE_TITLE = 'Вход в аккаунт';

export const loginInput = el('input', {
  type: 'text',
  id: 'login_input',
  name: 'login_field',
  class: 'input-reset form__input form-field',
});

export const loginPass = el('input', {
  type: 'password',
  id: 'login_pass',
  name: 'login_pass',
  class: 'input-reset form__input form-field',
});

export const submitBtn = el('button', 'Войти', {
  type: 'submit',
  class: 'btn-reset btn btn-fill form__submit form__btn',
});

export const loginForm = el(
  'form',
  { id: 'login_form', class: 'form__form form' },
  el('div', { class: 'field-wrap' }, [
    el('label', { for: 'login_input' }, 'Логин'),
    loginInput,
  ]),
  el('div', { class: 'field-wrap' }, [
    el('label', { for: 'login_pass' }, 'Пароль'),
    loginPass,
  ]),
  submitBtn
);

export const sectionLogin = el(
  'section',
  { class: 'login form' },
  el(
    'div',
    { class: 'container form__container' },
    el('div', { class: 'form__wrap' }, [
      el('h1', { class: 'form__sec-title' }, PAGE_TITLE),
      loginForm,
    ])
  )
);

export const renderLoginForm = () => {
  document.title = PAGE_TITLE;
  headerNav.style.display = 'none';
  main.innerHTML = '';
  mount(main, sectionLogin);
};
