import { sort, get } from '../../utils/index';
import { myFetch } from '../../request.js';
import Choices from 'choices.js';
import {
  addAccountBtn,
  createAccountsList,
  sortingAccountsSelect,
  renderControlPanel,
} from './dom';
import { getToken, saveAccountsList } from '../../store/index.js';
import { showPreloader } from '../../components/common';
import { main } from '../../components/container';

const customSelect = (select) => {
  return new Choices(select, {
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false,
    position: 'bottom',
    duplicateItemsAllowed: false,
    allowHTML: true,
  });
};

const handleAddAccount = () => {
  addAccountBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    showPreloader(addAccountBtn);

    myFetch(
      'create-account',
      {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Basic ' + getToken(),
        }),
      },
      () => {
        renderList();
        alert('Новый счёт успешно добавлен');
      }
    );
  });
};

const accountsSort = (accounts, updateList) => {
  sortingAccountsSelect.addEventListener('choice', () => {
    const selected = document.querySelector(
      '.choices__item--choice.is-highlighted'
    );
    const selectValue = selected.dataset.value;

    sort(accounts, selectValue);
    updateList();
  });
};

const getLastTransactions = (accounts) => {
  accounts.map((account) => {
    account.last_transaction = new Date(
      account.transactions?.at(-1)?.date
    ).getTime();
  });

  return accounts;
};

const renderList = () => {
  showPreloader(main, true);
  myFetch(
    'accounts',
    {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Basic ' + getToken(),
      }),
    },
    (payload) => {
      const accounts = getLastTransactions(payload);
      createAccountsList(accounts);
      accountsSort(accounts, () => {
        createAccountsList(accounts);
      });

      const accountNumbers = accounts.map((account) => account.account);
      saveAccountsList(accountNumbers);
    }
  );
};

export default () => {
  renderControlPanel();
  customSelect('#sorting_accounts');
  handleAddAccount();
  renderList();
};
