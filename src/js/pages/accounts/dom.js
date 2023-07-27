import '../../../scss/components/_accounts.scss';
import '../../../scss/vendor/choices.scss';
import '../../../scss/_my-choices.scss';
import { el, mount, text } from 'redom';
import { main } from '../../components/container';
import { click, get } from '../../utils';
import { redirectTo } from '../../router';
import { headerNav } from '../../components/header';

const PAGE_TITLE = 'Ваши счета';

export const addAccountBtn = el(
  'button',
  {
    id: 'create-account-btn',
    class: 'btn btn-fill control-panel__create-account',
  },
  [
    el('div', { class: 'control-panel__create-account--icon' }),
    'Создать новый счёт',
  ]
);

export const sortingAccountsSelect = el(
  'div',
  {
    class: 'control-panel__sorting',
  },
  el(
    'select',
    {
      id: 'sorting_accounts',
      class: 'control-panel__select',
      title: 'Сортировка счетов',
      name: 'select',
    },
    [
      el('option', { value: '' }, 'Сортировка'),
      el('option', { value: 'account' }, 'По номеру'),
      el('option', { value: 'balance' }, 'По балансу'),
      el('option', { value: 'last_transaction' }, 'По последней транзакции'),
    ]
  )
);

export const controlPanelHtml = el(
  'section',
  { class: 'control-panel' },
  el('div', { class: 'container control-panel__container' }, [
    el('h1', { class: 'control-panel__title' }, PAGE_TITLE),
    sortingAccountsSelect,
    addAccountBtn,
  ])
);

export const htmlAccount = (data) => {
  let htmlDate = '';
  if (data.date) {
    htmlDate = el('div', { class: 'account__last-transaction' }, [
      text('Последняя транзакция:'),
      el('div', { class: 'date' }, data.date),
    ]);
  }

  const openBtn = el(
    'button',
    {
      class: 'btn btn-fill account__btn open-account',
      'data-id': data.account,
    },
    'Открыть'
  );
  click(openBtn, () => {
    redirectTo('/account/' + data.account);
  });

  return el('div', { class: 'accounts__item account' }, [
    el('h3', { class: 'account__number' }, data.account),
    el('p', { class: 'account__price' }, data.balance + ' ₽'),
    htmlDate,
    openBtn,
  ]);
};

const createAccount = (account) => {
  let date = '';
  const lastTransaction = account.last_transaction;
  if (lastTransaction) {
    date = new Date(lastTransaction).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return htmlAccount({ ...account, date });
};

const section = el('section', { class: 'accounts' });

export const createAccountsList = (accounts) => {
  section.innerHTML = '';
  const list = accounts.map((account) => createAccount(account));
  const listContainer = el(
    'div',
    { class: 'container accounts__container' },
    list
  );
  mount(section, listContainer);
  mount(main, section);
};

export const renderControlPanel = () => {
  main.innerHTML = '';
  mount(main, controlPanelHtml);
  document.title = PAGE_TITLE;
  headerNav.style.display = 'block';
  get('#accounts-link').classList.add('active');
};
