import { el, mount } from 'redom';
import { main } from '../../components/container';
import { headerNav } from '../../components/header';
import { moreBtn, transferRatio } from '../balance-history/dom';
import { showPreloader } from '../../components/common';
import { get } from '../../utils';

const PAGE_TITLE = 'Просмотр счёта ';

export const transferSubmitBtn = el(
  'button',
  {
    id: 'transfer_submit',
    class: 'btn-reset btn btn-fill form__submit form__btn',
    type: 'submit',
  },
  'Отправить'
);

export const transferAmountInput = el('input', {
  id: 'transfer_amount',
  class: 'input-reset form__input form-field',
  name: 'transfer_amount',
});

export const transferForm = el(
  'form',
  {
    id: 'transfer_form',
    class: 'form__form form',
  },
  [
    el('div', { class: 'field-wrap' }, [
      el('label', { for: 'account_number' }, 'Номер счёта получателя'),
      el(
        'select',
        {
          id: 'account_number',
          class: 'control-panel__select',
          name: 'account_number',
          title: 'Номер счёта получателя',
        },
        el('option', { value: '' })
      ),
    ]),
    el('div', { class: 'field-wrap' }, [
      el('label', { for: 'transfer_amount' }, 'Сумма перевода'),
      transferAmountInput,
    ]),
    transferSubmitBtn,
  ]
);

const newTransactionForm = el('div', { class: 'account__new-transaction' }, [
  el('h1', { class: 'account__sec-title' }, PAGE_TITLE),
  transferForm,
]);

export const backToAccountsBtn = el(
  'button',
  {
    id: 'back_to_accounts',
    class: 'btn btn-fill control-panel__create-account',
  },
  [
    el('div', {
      class: 'control-panel__create-account--icon account__btn-back',
    }),
    'Вернуться назад',
  ]
);
backToAccountsBtn.addEventListener('click', () => {
  window.history.back();
});

const controlPanelSection = (account) =>
  el('section', { class: 'control-panel' }, [
    el(
      'div',
      {
        class: 'container control-panel__container control-panel__top',
      },
      [
        el('h1', { class: 'control-panel__title' }, PAGE_TITLE),
        backToAccountsBtn,
      ]
    ),

    el(
      'div',
      { class: 'container control-panel__bottom' },
      el('div', { class: 'account__number' }, '№' + account.account),
      el('div', { class: 'account__balance-wrap' }, [
        el('div', { class: 'account__balance-label' }, 'Баланс'),
        el(
          'div',
          {
            id: 'account__balance',
            class: 'account__balance',
          },
          account.balance + ' ₽'
        ),
      ])
    ),
  ]);

export const accountChartElement = el('canvas', { id: 'account-chart' });

export const accountChartWrap = el(
  'div',
  { class: 'account__chart' },
  accountChartElement
);

const accountSection = (params) =>
  el('section', { class: 'account__hero section-offset' }, [
    el('div', { class: 'container account-hero__container' }, [
      params.form ? newTransactionForm : '',
      el(
        'div',
        {
          class:
            'account__dynamics' +
            (params.transferRatio ? ' page-transfer-ratio' : ''),
        },
        [
          el('h2', { class: 'account__sec-title' }, 'Динамика баланса'),
          accountChartWrap,
        ]
      ),
    ]),
  ]);

export const tableBody = el('div', { id: 'table__body', class: 'table_body' });

const transactionsSection = el(
  'section',
  { class: 'transactions-history' },
  el('div', { class: 'container transactions-history__container' }, [
    el('h2', { class: 'account__sec-title' }, 'История переводов'),

    el('div', { class: 'transactions-history__table table' }, [
      el('div', { class: 'table__head' }, [
        el('div', { class: 'table__col' }, 'Счёт отправителя'),
        el('div', { class: 'table__col' }, 'Счёт получателя'),
        el('div', { class: 'table__col' }, 'Сумма'),
        el('div', { class: 'table__col' }, 'Дата'),
      ]),
      tableBody,
    ]),
  ])
);

export const accountHtml = (account, params) => {
  main.innerHTML = '';
  mount(main, controlPanelSection(account));
  mount(main, accountSection(params));
  if (params.transferRatio) {
    mount(main, transferRatio);
  }
  mount(main, transactionsSection);
};

export const transactionHtml = (transaction, colorAmount = 'green') => {
  return el('div', { class: 'table__row' }, [
    el('div', { class: 'table__col' }, transaction.from),
    el('div', { class: 'table__col' }, transaction.to),
    el(
      'div',
      { class: `table__col transaction-amount ${colorAmount.color}-color` },
      `${colorAmount.sign} ${transaction.amount} ₽`
    ),
    el('div', { class: 'table__col' }, transaction.date),
  ]);
};

export const preloadAccountPage = () => {
  document.title = PAGE_TITLE;
  headerNav.style.display = 'block';
  moreBtn.style.display = 'none';
  get('#accounts-link').classList.remove('active');
  showPreloader(main, true);
};
