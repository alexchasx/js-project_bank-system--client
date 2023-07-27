export const dataFilter = (payload, timeInterval) => {
  const startMonth = new Date().setMonth(new Date().getMonth() - timeInterval);

  const filteredByInterval = payload.transactions.filter((transaction) => {
    return new Date(transaction.date) > startMonth;
  });

  const sortedByDateDesc = filteredByInterval.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return sortedByDateDesc;
};

export const config = (data, sumYData) => {
  return {
    type: 'bar',
    data,
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            color: 'black',
            font: {
              size: '16',
            },
          },
        },
        y: {
          stacked: true,
          max: Math.max(...sumYData),
          min: Math.min(...sumYData),
          position: 'right',
          grid: {
            display: false,
          },
          ticks: {
            callback: (value, index, values) =>
              index > 0 && index < values.length - 1
                ? ''
                : Math[index ? 'max' : 'min'](...values.map((n) => n.value)),
            color: 'black',
            font: {
              size: '16',
            },
          },
        },
      },
    },
    plugins: [
      {
        id: 'chartAreaBorder',
        afterDatasetsDraw(chart, args, options) {
          const {
            ctx,
            chartArea: { top, bottom, left, right, width, height },
          } = chart;
          ctx.save();

          ctx.fillStyle = 'black';
          ctx.strokeRect(left, top, width, height);
          ctx.restore();
        },
      },
    ],
  };
};
