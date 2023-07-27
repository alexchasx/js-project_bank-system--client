import { el } from 'redom';
import { showPreloader } from '../../components/common';
import { main } from '../../components/container';
import { headerNav } from '../../components/header';

const PAGE_TITLE = 'История баланса';

export const transactionChart = el('canvas', {
  id: 'transaction-chart',
  class: 'transfer-history-chart',
});

export const transferRatio = el(
  'section',
  {
    class: 'account__hero section-offset',
  },
  el(
    'div',
    { class: 'container account-hero__container' },
    el('div', { class: 'account__dynamics page-transfer-ratio' }, [
      el(
        'h2',
        { class: 'account__sec-title' },
        'Соотношение входящих исходящих транзакций'
      ),
      el('div', { class: 'account__chart' }, transactionChart),
    ])
  )
);

export const moreBtn = el(
  'button',
  {
    id: 'show_more',
    class: 'btn btn-fill control-panel__create-account',
    style: 'display: none',
  },
  'Показать ещё'
);

export const preloadBalanceHistory = () => {
  document.title = PAGE_TITLE;
  headerNav.style.display = 'block';
  moreBtn.style.display = 'none';
  showPreloader(main, true);
};
