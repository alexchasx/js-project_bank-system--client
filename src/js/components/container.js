import '../../scss/components/_header.scss';
import { header } from './header';
import { el, mount } from 'redom';

export const main = el('main', { id: 'main', class: 'main' });

export const siteContainer = el('div', { class: 'site-container' }, [
  header,
  main,
]);

mount(document.body, siteContainer);
