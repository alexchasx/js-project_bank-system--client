import Chart from 'chart.js/auto';
import moment from 'moment';
import { config, dataFilter } from '../../chart-settings';
import { transactionChart } from './dom';

let chartObj = null;
export const createBarChart = (xData, yData, yData2 = null) => {
  const COLOR_BLUE = '#116ACC';
  const COLOR_GREEN = '#76CA66';
  const COLOR_RED = '#FD4E5D';

  const sumYData = [...yData, ...yData2];
  const datasets = [
    {
      label: false,
      data: yData,
      backgroundColor: yData2 ? COLOR_GREEN : COLOR_BLUE,
    },
  ];

  if (yData2) {
    datasets.unshift({
      label: false,
      data: yData2,
      backgroundColor: COLOR_RED,
    });
  }

  const data = {
    labels: xData,
    datasets,
  };

  if (chartObj) {
    chartObj.destroy();
  }
  transactionChart.innerHTML = '';
  chartObj = new Chart(transactionChart, config(data, sumYData));
};

export default (payload, timeInterval) => {
  if (chartObj) {
    chartObj.destroy();
  }
  chartObj = null;

  if (Array.isArray(payload.transactions) && payload.transactions.length > 0) {
    const dataInMonth = {};
    dataFilter(payload, timeInterval).forEach((transaction) => {
      const month = moment(transaction.date).format('YYYY.MM');
      let amount = transaction.amount;

      if (transaction.to === payload.account) {
        if (!dataInMonth[month]) {
          dataInMonth[month] = {
            month,
            balance: amount,
            negativeBalance: 0,
          };
        } else {
          dataInMonth[month].balance += amount;
        }
      } else if (transaction.from === payload.account) {
        if (!dataInMonth[month]) {
          dataInMonth[month] = {
            month,
            negativeBalance: amount,
            balance: 0,
          };
        } else {
          dataInMonth[month].negativeBalance += amount;
        }
      }
    });

    const data = Object.values(dataInMonth).reverse();
    const xData = data.map((row) => row.month);
    const yDate = data.map((row) => row.balance.toFixed(2));
    const yDate2 = data.map((row) => row.negativeBalance.toFixed(2));
    createBarChart(xData, yDate, yDate2);
  }
};
