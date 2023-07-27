import { el } from 'redom';

const preloader = el(
  'div',
  { class: 'preloader' },
  el('div', { class: 'spinner' })
);

export const showPreloader = (element, notBtn = false) => {
  element.classList.add('preloading');
  if (notBtn) {
    element.classList.add('preloader-not-btn');
  }
  element.append(preloader);
};
