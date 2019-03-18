import React from 'react';
import { mount } from 'enzyme';
import {
  mockedContextFromCartView,
  mockedContextFromMyAccountView,
  mockedContextFromAnyOtherView,
} from './mock';

import GuestCheckoutLink from './index';

jest.mock('./config', () => ({
  getUserAccountSettings: 1,
}));

jest.mock('@shopgate/pwa-common/components/Link');

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided context state.
 * @param {Object} mockedContext Mocked context.
 * @return {ReactWrapper}
 */
const createComponent = (mockedContext) => {
  const mockContext = jest.fn();
  mockContext.mockReturnValue(mockedContext);
  jest.mock('@shopgate/pwa-common/context', () => ({
    RouteContext: {
      Consumer: ({ children }) => children(mockContext()),
    },
  }));

  return mount(<GuestCheckoutLink />);
};

describe('<GuestCheckoutLink />', () => {
  it('should render with one link for login in checkout page', () => {
    const component = createComponent(mockedContextFromCartView);
    expect(component).toMatchSnapshot();
    expect(component.find('Connect(Link)').exists()).toBe(true);
  });

  it('should render null in case of default login', () => {
    const component = createComponent(mockedContextFromMyAccountView);
    expect(component).toMatchSnapshot();
    expect(component.find('Connect(Link)').exists()).toBe(false);
  });

  it('should render null in case of all other', () => {
    const component = createComponent(mockedContextFromAnyOtherView);
    expect(component).toMatchSnapshot();
    expect(component.find('Connect(Link)').exists()).toBe(false);
  });
});
