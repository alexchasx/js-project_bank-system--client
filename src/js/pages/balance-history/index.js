import accountChart from '../account/account-chart';
import transferRatioChart from './transfer-ratio-chart';
import { accountChartElement, accountHtml, tableBody } from '../account/dom';
import transactionsHistory from '../account/transactions-history';
import { myFetch } from '../../request.js';
import { getToken } from '../../store/index.js';
import { preloadBalanceHistory, transferRatio } from './dom';

export default async ({ account }) => {
  preloadBalanceHistory();
  myFetch(
    'account/' + account,
    {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Basic ' + getToken(),
      }),
    },
    (payload) => {
      accountHtml(payload, {
        form: false,
        transferRatio,
      });

      const intervalByMonth = 11;
      accountChart(payload, intervalByMonth);
      transferRatioChart(payload, intervalByMonth);
      const [paginationCount, pagination] = [25, true];
      transactionsHistory(payload, paginationCount, pagination);

      tableBody.onclick = null;
      accountChartElement.onclick = null;
      accountChartElement.classList.add('transfer-history-chart');
    }
  );
};
