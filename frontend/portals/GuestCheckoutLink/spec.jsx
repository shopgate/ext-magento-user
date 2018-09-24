import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import styles from './style'
import { CHECKOUT_GUEST_PATH } from './route';

Enzyme.configure({ adapter: new Adapter() });

describe('<div />', () => {
  it('should render with one link', () => {
    const component = Enzyme.mount(
      <div className={styles.container}>
        <I18n.Text string="checkout.or" className={styles.or} />
        <Link href={CHECKOUT_GUEST_PATH} className={styles.guestCheckout}>
          <I18n.Text string="checkout.continue_as_guest" />.
        </Link>
      </div>
    )
    expect(component).toMatchSnapshot();
  });
});
