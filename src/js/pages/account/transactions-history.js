import { tableBody, transactionHtml } from './dom';
import { click } from '../../utils';
import { moreBtn } from '../balance-history/dom';

let restData = null;

export const getColorAmount = (lastTransaction) => {
  let color = { color: 'green', sign: '+' };
  const currentAccount = window.location.pathname.split('/')[2];
  if (+lastTransaction.from === +currentAccount) {
    color.color = 'red';
    color.sign = '-';
  }
  return color;
};

export const transformDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
};

export default (data, count = 10, pagination = false) => {
  restData = data.transactions;
  console.log('restData', typeof restData, restData); // TODO: remove console.log

  tableBody.innerHTML = '';
  if (Array.isArray(restData) && restData.length > 0) {
    const renderItems = (count) => {
      for (let i = 0; i < count; i++) {
        const lastTransaction = restData.pop();
        if (lastTransaction) {
          lastTransaction.date = transformDate(lastTransaction.date);

          const colorAmount = getColorAmount(lastTransaction);
          const transactionList = transactionHtml(lastTransaction, colorAmount);
          tableBody.append(transactionList);
        }
      }
    };

    renderItems(count);

    console.log(
      'data.transactions',
      typeof data.transactions,
      data.transactions
    ); // TODO: remove console.log

    if (pagination && data.transactions.length > count) {
      tableBody.closest('.table').append(moreBtn);
      moreBtn.style.display = 'block';
      click(moreBtn, () => {
        renderItems(count);
      });
    }
  }
};
