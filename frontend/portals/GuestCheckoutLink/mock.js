/**
 * Mocked state with redirectLocation to checkout page.
 * @type {Object}
 */
export const mockedContextFromCartView = {
  state: {
    redirect: {
      location: '/checkout',
    },
  },
  visible: true,
};

/**
 * Mocked state with redirectLocation to more page.
 * @type {Object}
 */
export const mockedContextFromMyAccountView = {
  state: {
    redirect: {
      location: '/more',
    },
  },
  visible: true,
};

/**
 * Mocked state with redirectLocation to home page.
 * @type {Object}
 */
export const mockedContextFromAnyOtherView = {
  state: {
    redirect: {
      location: '/',
    },
  },
  visible: true,
};
