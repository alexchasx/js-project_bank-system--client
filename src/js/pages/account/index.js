import '../../../scss/components/_account.scss';
import { myFetch } from '../../request.js';
import accountForm from './account-form';
import transactionsHistory from './transactions-history';
import accountChart from './account-chart';
import { getToken } from '../../store/index.js';
import {
  accountChartElement,
  accountHtml,
  preloadAccountPage,
  tableBody,
} from './dom';
import { router } from '../../router';

export default ({ id }) => {
  preloadAccountPage();
  myFetch(
    'account/' + id,
    {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Basic ' + getToken(),
      }),
    },
    (payload) => {
      accountHtml(payload, {
        form: true,
        transferRatio: '',
      });

      accountForm('#account_number', payload);

      const intervalByMonth = 5;
      accountChart(payload, intervalByMonth);
      transactionsHistory(payload);

      tableBody.onclick = (e) => {
        e.stopImmediatePropagation();
        router.navigate('/history/' + payload.account);
      };
      accountChartElement.onclick = (e) => {
        e.stopImmediatePropagation();
        router.navigate('/history/' + payload.account);
      };
    }
  );
};
