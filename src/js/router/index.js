import Navigo from 'navigo';
import showLoginForm from '../pages/login/index';
import showAccounts from '../pages/accounts/index';
import showOneAccount from '../pages/account/index';
import showBalanceHistory from '../pages/balance-history/index';
import showCurrencies from '../pages/currencies/index';
import { get } from '../utils/index';
import showBanks from '../pages/banks/index';
import { getToken, removeToken } from '../store/index';

const fillHeaderLinks = () => {
  const links = {
    '#banks-link': '/banks',
    '#accounts-link': '/accounts',
    '#currencies-link': '/currencies',
    '#exit-link': '/logout',
  };
  for (const [key, value] of Object.entries(links)) {
    get(key).href = value;
  }
};

export const router = new Navigo('/');

const checkAuth = () => {
  const token = getToken();
  if (Array.isArray(token) && token.length > 0) {
    return true;
  }
  router.navigate('/login');
  return false;
};

export const login = () => {
  showLoginForm(() => router.navigate('/accounts'));
};

router
  .on('/', () => {
    if (!checkAuth()) return;
    router.navigate('/accounts');
  })

  .on('/login', () => {
    const token = getToken();
    if (Array.isArray(token) && token.length > 0) {
      router.navigate('/');
      return;
    }
    login();
  })

  .on('/accounts', () => {
    if (!checkAuth()) return;
    showAccounts();
    fillHeaderLinks();
  })

  .on('/account/:id', ({ data: { id } }) => {
    if (!checkAuth()) return;
    showOneAccount({ id });
    fillHeaderLinks();
  })

  .on('/history/:account', ({ data: { account } }) => {
    if (!checkAuth()) return;
    showBalanceHistory({ account });
    fillHeaderLinks();
  })

  .on('/currencies', () => {
    if (!checkAuth()) return;
    showCurrencies();
    fillHeaderLinks();
  })

  .on('/banks', () => {
    if (!checkAuth()) return;
    showBanks();
    fillHeaderLinks();
  })

  .on('/logout', () => {
    removeToken();
    router.navigate('/login');
  })
  .resolve();

export const redirectByName = (name, data) => {
  router.navigateByName(name, data);
};

export const redirectTo = (path, data = null) => {
  router.navigate(path, data);
};
