import Choices from 'choices.js';
import {
  saveToStorage,
  getFromStorage,
  AUTOCOMPLETION_KEY,
  getToken,
  getAccountsList,
} from '../../store/index.js';
import { get, submit, disableSubmitBtn } from '../../utils/index';
import { myFetch } from '../../request.js';
import JustValidate from 'just-validate';
import { getColorAmount, transformDate } from './transactions-history.js';
import {
  tableBody,
  transactionHtml,
  transferAmountInput,
  transferForm,
  transferSubmitBtn,
} from './dom.js';
import validator from 'validator';
import { showPreloader } from '../../components/common.js';

const setChoicesValue = (choicesObj) => {
  const data = getFromStorage(AUTOCOMPLETION_KEY);
  if (Array.isArray(data) && data.length > 0) {
    const choicesValue = choicesObj.getValue(true);
    if (!data.includes(choicesValue)) {
      choicesObj.setValue(data);
    }
  }
};

const handleAutoCompletion = () => {
  let selectValue = get('.choices__item.choices__item--selectable').dataset
    .value;
  const inputValue = get('[name=search_terms]').value;
  if (inputValue && selectValue !== inputValue) {
    selectValue = inputValue;
  }
  const field = get('.choices__item.choices__item--selectable');
  field.textContent = selectValue;
};

const customSelect = (selector) => {
  let values = [];
  const data = getFromStorage(AUTOCOMPLETION_KEY);
  if (Array.isArray(data) && data.length) {
    values = data;
  }
  return new Choices(selector, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
    position: 'bottom',
    duplicateItemsAllowed: false,
    allowHTML: true,
    addItems: true,
    removeItems: true,
    addItemFilter: (value) => {
      return +value > 0;
    },
  }).setValue(values);
};

const validateForm = (form) => {
  const validation = new JustValidate(form);
  const rules = [
    {
      rule: 'required',
      errorMessage: 'Вы не заполнили поле',
    },
    {
      rule: 'minNumber',
      value: 0.01,
      errorMessage: 'Сумма не может быть меньше 0.01',
    },
  ];
  validation.addField('#transfer_amount', rules);
  disableSubmitBtn(form);
};

const addToTable = (lastTransaction) => {
  lastTransaction.date = transformDate(lastTransaction.date);
  const tableRow = transactionHtml(
    lastTransaction,
    getColorAmount(lastTransaction)
  );
  tableBody.prepend(tableRow);
};

export default (selector, payload) => {
  const choicesObj = customSelect('#account_number');
  const select = get(selector);
  select.addEventListener('hideDropdown', () =>
    handleAutoCompletion(choicesObj)
  );
  const input = get('[name=search_terms]');
  input.addEventListener('keyup', (event) => {
    // Enter
    if (event.keyCode === 13) {
      handleAutoCompletion(choicesObj);
    }
  });

  validateForm(transferForm);

  submit(transferForm, async (event) => {
    event.preventDefault();
    if (get('.just-validate-error-label')) {
      return false;
    }
    const to = get('.choices__item.choices__item--selectable').textContent;
    const accountNumbers = getAccountsList();
    if (!accountNumbers.includes(to) && !validator.isCreditCard(to)) {
      alert('Некорректный номер счёта');
      return;
    }

    showPreloader(transferSubmitBtn);
    const currentAccount = payload.account;
    const amount = transferAmountInput.value;
    myFetch(
      'transfer-funds',
      {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Basic ' + getToken(),
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          from: currentAccount,
          to,
          amount,
        }),
      },
      (payload) => {
        if (payload) {
          get('#account__balance').textContent = payload.balance;
          saveToStorage(AUTOCOMPLETION_KEY, to);
          setChoicesValue(choicesObj);
          addToTable(payload.transactions.pop());

          alert('Средства успешно переведены');
        }
      }
    );
  });
};
