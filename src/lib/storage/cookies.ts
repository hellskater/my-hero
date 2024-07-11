import Cookies from 'js-cookie';

export const setCookie = (key: string, value: string) => {
  Cookies.set(key, value, {
    expires: 365,
  });
};

export const getCookie = (key: string) => {
  return Cookies.get(key);
};
