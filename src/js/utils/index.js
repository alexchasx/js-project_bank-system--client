import Choices from 'choices.js';
import { redirectTo } from '../router';

export const create = (tag, classNames, textContent = '') => {
  const element = document.createElement(tag);
  element.className = classNames;
  element.textContent = textContent;

  return element;
};

export const get = (selector, closest = document) =>
  closest.querySelector(selector);

export const getAll = (selector, closest = document) =>
  closest.querySelectorAll(selector);

export const event = (event, element, callback) => {
  if (element instanceof NodeList) {
    element.forEach((element) => {
      element.addEventListener(event, callback);
    });
    return null;
  }

  if (element instanceof Element) {
    element.addEventListener(event, callback);
  }
};

export const click = (element, callback) => {
  event('click', element, callback);
};

export const submit = (element, callback) => {
  event('submit', element, callback);
};

export const sort = (arr, prop, sortAsc = false) =>
  arr.sort((a, b) =>
    (!sortAsc ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 0
  );

export const hidePreloaders = () => {
  getAll('.preloader').forEach((preloader) => {
    if (preloader) {
      preloader.remove();
    }
  });

  getAll('.preloading').forEach((preloader) => {
    if (preloader) {
      preloader.classList.remove('preloading');
      preloader.classList.remove('preloader-not-btn');
    }
  });
};

// Принудительная задержка скрипта
export const sleep = async (delay) => {
  if (delay) {
    await new Promise((r) => setTimeout(r, delay));
  }
};

export const createElementFromHTML = (htmlString) => {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.firstChild;
};

export const customSelect = (select) => {
  return new Choices(select, {
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false,
    position: 'bottom',
    duplicateItemsAllowed: false,
    allowHTML: true,
  });
};

export const disableSubmitBtn = (form) => {
  getAll('input', form).forEach((input) => {
    event('input', input, () => {
      const btn = get('button[type=submit]');
      if (get('.just-validate-error-label')) {
        btn.setAttribute('disabled', 'disabled');
      } else {
        btn.removeAttribute('disabled');
        hidePreloaders();
      }
    });
  });
};

export const redirectByClick = (element, path) => {
  const handlBackClick = () => {
    element.removeEventListener('click', handlBackClick);
    redirectTo(path);
  };

  click(element, handlBackClick);
};

export const backByHistory = () => {
  window.history.go(-1);
  return false;
};
