import '../../../scss/components/_currencies.scss';
import { myFetch } from '../../request.js';
import currenciesHtml from './dom';
import currenciesForm from './currencies-form';
import { realTimeExchange } from './realtime-exchange';
import { getToken } from '../../store/index.js';
import { preloadCurrenciesPage } from './dom';

export default async () => {
  preloadCurrenciesPage();

  const paramsFetch = {
    method: 'GET',
    headers: new Headers({
      Authorization: 'Basic ' + getToken(),
    }),
  };
  myFetch('currencies', paramsFetch, (payload) => {
    myFetch('all-currencies', paramsFetch, (currenciesList) => {
      const filteredPayload = Object.values(payload).filter((obj) => {
        return obj.amount > 0;
      });

      currenciesHtml(filteredPayload, currenciesList);

      currenciesForm();
      realTimeExchange();
    });
  });
};
