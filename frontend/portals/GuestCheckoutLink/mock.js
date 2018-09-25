/**
 * Mocked state with redirectLocation to checkout page.
 * @type {Object}
 */
export const mockedStateFromCartView = {
  history: {
    pathname: '/',
    redirectLocation: {
      pathname: '/checkout',
    },
  },
};

/**
 * Mocked state with redirectLocation to more page.
 * @type {Object}
 */
export const mockedStateFromMyAccountView = {
  history: {
    pathname: '/',
    redirectLocation: {
      pathname: '/more',
    },
  },
};

/**
 * Mocked state with redirectLocation to home page.
 * @type {Object}
 */
export const mockedStateFromAnyOtherView = {
  history: {
    pathname: '/',
    redirectLocation: {
      pathname: '/',
    },
  },
};
