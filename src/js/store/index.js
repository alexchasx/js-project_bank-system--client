const STORAGE_KEY = 'bankSysytem';
export const AUTOCOMPLETION_KEY = 'autocompletion';
export const AUTH_KEY = 'auth';
export const ACCOUNTS_LIST_KEY = 'accountsList';

export const saveToStorage = (prop, value, key = STORAGE_KEY) => {
  if (!value) {
    return false;
  }

  let items = getFromStorage();
  if (items && items[prop]) {
    if (items[prop].includes(value)) {
      return false;
    }

    items[prop].push(value);
  } else {
    items = { [prop]: [value] };
  }

  localStorage.setItem(key, JSON.stringify(items));
};

export const getFromStorage = (prop = null, key = STORAGE_KEY) => {
  const all = JSON.parse(localStorage.getItem(key) || '[]');
  if (prop && all && all[prop]) {
    return all[prop];
  }

  return all;
};

export const removeFromStorage = (prop, value, key = STORAGE_KEY) => {
  let items = getFromStorage();
  if (items && items[prop]) {
    items[prop] = items[prop].filter((item) => item !== value);
  }

  localStorage.setItem(key, JSON.stringify(items));
};

export const getToken = () => {
  return getFromStorage('token', AUTH_KEY);
};

export const saveAccountsList = (data) => {
  return saveToStorage(ACCOUNTS_LIST_KEY, data, ACCOUNTS_LIST_KEY);
};

export const getAccountsList = () => {
  return getFromStorage(ACCOUNTS_LIST_KEY, ACCOUNTS_LIST_KEY)[0];
};

export const saveToken = (token) => {
  return saveToStorage('token', token, AUTH_KEY);
};

export const removeToken = () => {
  return removeFromStorage('token', getToken(), AUTH_KEY);
};

export const getNewAccount = () => {
  const newAccount = getAccountsList();
  return newAccount.pop();
};
