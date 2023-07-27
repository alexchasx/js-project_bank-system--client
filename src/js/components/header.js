import { el, setChildren } from 'redom';

const ul = el('ul', { class: 'list-reset nav__list' });

const linkList = [
  { id: 'banks-link', text: 'Банкоматы', href: '/banks' },
  { id: 'accounts-link', text: 'Счета', href: '/accounts' },
  { id: 'currencies-link', text: 'Валюта', href: '/currencies' },
  { id: 'exit-link', text: 'Выйти', href: '/logout' },
];

setChildren(
  ul,
  linkList.map((link) =>
    el(
      'li',
      { class: 'nav__item' },
      el(
        'a',
        {
          id: link.id,
          class: 'nav__link btn',
          href: link.href,
        },
        link.text
      )
    )
  )
);

export const headerNav = el('nav', { class: 'nav header__nav' }, ul);

export const header = el(
  'header',
  { class: 'header' },
  el('div', { class: 'container header__container' }, [
    el(
      'div',
      { class: 'header__logo' },
      el('a', { class: 'logo', href: '/' }, 'Coin.')
    ),
    headerNav,
  ])
);
