import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { mockedStateFromCartView, mockedStateFromMyAccountView, mockedStateFromAnyOtherView } from './mock'

const mockedStore = configureStore();
Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @return {ReactWrapper}
 */
const createComponent = (mockedState) => {
  const GuestCheckoutLink = require('./index').default;
  return Enzyme.mount(
    <Provider store={mockedStore(mockedState)}>
      <GuestCheckoutLink />
    </Provider>,
    mockRenderOptions
  );
};

describe('<GuestCheckoutLink />', () => {
  it('should render with one link for login in checkout page', () => {
    const component = createComponent(mockedStateFromCartView);
    expect(component).toMatchSnapshot();
    expect(component.find('Link').exists()).toBe(true);
  });

  it('should render null in case of default login', () => {
    const component = createComponent(mockedStateFromMyAccountView);
    expect(component).toMatchSnapshot();
    expect(component.find('Link').exists()).toBe(false);
  });

  it('should render null in case of all other', () => {
    const component = createComponent(mockedStateFromAnyOtherView);
    expect(component).toMatchSnapshot();
    expect(component.find('Link').exists()).toBe(false);
  });
});
