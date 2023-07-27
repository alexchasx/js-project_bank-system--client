import { hidePreloaders } from './utils';
import { login } from './router/index';

const BACKEND_HOST = 'http://localhost:3000/';

const errorMessages = {
  'Invalid password': 'Пытаемся войти с неверным паролем',
  'No such user': 'Пользователя с таким логином не существует',
  Unauthorized: 'Не авторизован',
  'No such account': 'Нет такого счёта',
  'Invalid account from':
    'Не указан адрес счёта списания, или этот счёт не принадлежит нам',
  'Invalid account to':
    'Не указан счёт зачисления, или этого счёта не существует',
  'Invalid amount': 'Не указана сумма перевода, или она отрицательная',
  'Overdraft prevented':
    'Мы попытались перевести больше денег, чем доступно на счёте списания',
  'Unknown currency code':
    'Передан неверный валютный код, код не поддерживается системой ',
  'Not enough currency': 'Не хватает валюты',
  'Invalid route': 'Неверный маршрут',
  'Failed to fetch': 'Скорее всего, сервер не запушен',
};

const alertError = (message) => {
  alert('Произошла ошибка: ' + message);
};

export const myFetch = async (paramUrl, options, callback) => {
  return fetch(BACKEND_HOST + paramUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      hidePreloaders();

      if (json.payload === null && json.error) {
        alertError(errorMessages[json.error]);
        if (json.error === 'Unauthorized') {
          login();
        }
      } else {
        callback(json.payload);
      }
    })
    .catch((error) => {
      hidePreloaders();

      let message = errorMessages[error.message];
      if (!message) {
        message = error.message;
      }
      alertError(message);
    });
};
