import { createElementFromHTML, get, getAll } from '../../utils/index';

const paramsItemHtml = (data) => {
  const colorArray = { 0: 'grey', 1: 'green', '-1': 'red' };
  const color = colorArray[data.change];

  return `
    <li id="${data.from}-${data.to}" class="params__item">
      <div class="params__cell params__cell--1">${data.from}/${data.to}</div>
      <div class="dotted">...............................................................................</div>
      <div class="params__cell params__cell--2">${data.rate}</div>
      <div class="arrow arrow--${color}"></div>
    </li>
  `;
};

export const realTimeExchange = () => {
  const socket = new WebSocket('ws://localhost:3000/currency-feed');
  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    const ul = get('#realtime-exchange');
    let li = get(`#${data.from}-${data.to}`, ul);
    const countLi = getAll('li', ul).length;

    if (li) {
      get('.params__cell--1', li).textContent = data.from + '/' + data.to;
      get('.params__cell--2', li).textContent = data.rate;
    } else if (countLi < 21) {
      li = createElementFromHTML(paramsItemHtml(data));
      ul.append(li);
    }
  };
};
