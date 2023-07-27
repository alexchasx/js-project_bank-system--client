import Choices from 'choices.js';
import { get, submit, disableSubmitBtn, getAll } from '../../utils/index';
import { myFetch } from '../../request.js';
import JustValidate from 'just-validate';
import { currenciesSubmitBtn, paramsListString } from './dom.js';
import { getToken } from '../../store/index.js';
import { showPreloader } from '../../components/common';

const FORM_SELECTOR = '#currencies_form';

const customSelect = (selector) => {
  return new Choices(selector, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
    position: 'bottom',
    duplicateItemsAllowed: false,
    allowHTML: true,
    addItems: true,
    removeItems: true,
  });
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
      errorMessage: 'Минимальное значение: 0.01',
    },
  ];
  validation.addField('#currency_amount', rules);

  disableSubmitBtn(form);
};

export default () => {
  const selects = getAll(FORM_SELECTOR + ' select');
  selects.forEach((select) => {
    customSelect(select);
  });

  const form = get(FORM_SELECTOR);
  validateForm(form);

  submit(form, async (event) => {
    event.preventDefault();
    const from = get('#currency_from').value;
    const to = get('#currency_to').value;
    const amount = get('#currency_amount').value;
    if (get('.just-validate-error-label')) {
      return false;
    }

    showPreloader(currenciesSubmitBtn);
    myFetch(
      'currency-buy',
      {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Basic ' + getToken(),
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ from, to, amount }),
      },
      async (payload) => {
        const filteredPayload = Object.values(payload).filter((obj) => {
          return obj.amount > 0;
        });
        const paramsStr = paramsListString(filteredPayload);
        const ul = get('.params__list');
        ul.innerHTML = '';
        paramsStr.forEach((param) => {
          ul.append(param);
        });
        alert('Успешно выполнено!');
      }
    );
  });
};
