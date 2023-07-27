import Chart from 'chart.js/auto';
import moment from 'moment';
import { config, dataFilter } from '../../chart-settings';
import { accountChartElement } from './dom';

export let chartObj = null;
export const createBarChart = (xData, yData) => {
  const COLOR_BLUE = '#116ACC';
  const sumYData = yData;
  const data = {
    labels: xData,
    datasets: [
      {
        label: false,
        data: yData,
        backgroundColor: COLOR_BLUE,
      },
    ],
  };

  chartObj = new Chart(accountChartElement, config(data, sumYData));
};

export default (payload, timeInterval) => {
  if (chartObj) {
    chartObj.destroy();
  }
  chartObj = null;

  if (Array.isArray(payload.transactions) && payload.transactions.length > 0) {
    const dataInMonth = {};
    let balance = payload.balance;
    dataFilter(payload, timeInterval).forEach((transaction) => {
      const month = moment(transaction.date).format('YYYY.MM');
      let amount = transaction.amount;

      if (transaction.to === payload.account) {
        balance -= amount;
      } else if (transaction.from === payload.account) {
        balance += amount;
        if (!dataInMonth[month]) {
          dataInMonth[month] = {
            month,
            negativeBalance: amount,
            balance,
          };
        } else {
          dataInMonth[month].negativeBalance += amount;
        }
      }

      if (!dataInMonth[month]) {
        dataInMonth[month] = {
          month,
          balance,
          negativeBalance: 0,
        };
      } else {
        dataInMonth[month].balance = balance;
      }
    });

    const data = Object.values(dataInMonth).reverse();
    const xData = data.map((row) => row.month);
    const yDate = data.map((row) => row.balance.toFixed(2));
    createBarChart(xData, yDate, payload.account);
  }
};
