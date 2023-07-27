import '../../../scss/components/_currencies.scss';
import { el, mount } from 'redom';
import { main } from '../../components/container';
import { headerNav } from '../../components/header';
import { get } from '../../utils';
import { showPreloader } from '../../components/common';

const PAGE_TITLE = 'Валютный обмен';

const paramsItemHtml = (data) => {
  return el('li', { className: 'params__item' }, [
    el('div', { class: 'params__cell params__cell--1' }, data.code),
    el(
      'div',
      { class: 'dotted' },
      '.................................................'
    ),
    el(
      'div',
      { class: 'params__cell params__cell--2' },
      data.amount.toFixed(2)
    ),
  ]);
};

export const paramsListString = (data) => {
  return data.map((currency) => {
    return paramsItemHtml(currency);
  });
};

const currenciesListHtml = (currenciesList) => {
  return currenciesList.map((code) => {
    return el('option', { value: code }, code);
  });
};

export const realtimeExchange = el('div', { class: 'realtime-exchange card' }, [
  el(
    'h2',
    { class: 'realtime-exchange__title card__title' },
    'Изменение курсов в реальном времени'
  ),
  el(
    'div',
    { class: 'realtime-exchange__content params' },
    el('ul', { id: 'realtime-exchange', class: 'params__list list-reset' })
  ),
]);

export const currenciesSubmitBtn = el(
  'button',
  {
    id: 'currency_submit',
    class: 'btn-reset btn btn-fill form__submit form__btn',
    type: 'submit',
  },
  'Обменять'
);

export const getCurrenciesForm = (currenciesList) => {
  return el('form', { id: 'currencies_form', class: 'form__form' }, [
    el('div', { class: 'field-container' }, [
      el('div', { class: 'field-wrap currencie-list-wrap' }, [
        el('label', { for: 'currency_from' }, 'Из'),
        el(
          'select',
          {
            id: 'currency_from',
            class: 'control-panel__select',
            name: 'currency_from',
          },
          currenciesListHtml(currenciesList)
        ),
      ]),
      el('div', { class: 'field-wrap currencie-list-wrap' }, [
        el('label', { for: 'currency_to' }, 'в'),
        el(
          'select',
          {
            id: 'currency_to',
            class: 'control-panel__select',
            name: 'currency_to',
          },
          currenciesListHtml(currenciesList)
        ),
      ]),
      el('div', { class: 'field-wrap' }, [
        el('label', { for: 'currency_amount' }, 'в'),
        el('input', {
          id: 'currency_amount',
          class: 'input-reset form__input form-field',
          name: 'currency_amount',
          type: 'number',
        }),
      ]),
    ]),
    currenciesSubmitBtn,
  ]);
};

export const wrap = el('div', { id: 'ya-map', class: 'currencies__wrap' });

const section = el(
  'section',
  { class: 'currencies' },
  el('div', { class: 'container currencies__container' }, [
    el('h1', { class: 'currencies__title' }, 'Валютный обмен'),
    wrap,
  ])
);

export const getSection = (title) => {
  return el(
    'section',
    { class: 'currencies' },
    el('div', { class: 'container currencies__container' }, [
      el('h1', { class: 'currencies__title' }, title),
      wrap,
    ])
  );
}

export default (data, currenciesList) => {
  const content = el('div', { class: 'currencies__left-block' }, [
    el('div', { class: 'your-currencies card' }, [
      el('h2', { class: 'your-currencies__title card__title' }, 'Ваши валюты'),
      el(
        'div',
        { class: 'your-currencies__content params' },
        el('ul', { class: 'params__list list-reset' }, paramsListString(data))
      ),
    ]),
    el('div', { class: 'currencies__form form card' }, [
      el('h2', { class: 'form__title card__title' }, 'Обмен валюты'),
      getCurrenciesForm(currenciesList),
    ]),
  ]);

  mount(wrap, content);
  mount(wrap, realtimeExchange);
  main.innerHTML = '';
  mount(main, section);
};

export const preloadCurrenciesPage = () => {
  document.title = PAGE_TITLE;
  headerNav.style.display = 'block';
  get('#currencies-link').classList.add('active');
  showPreloader(main, true);
};
