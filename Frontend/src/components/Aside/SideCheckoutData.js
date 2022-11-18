import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../Store/cartStore';
import useCustomerStore from '../../Store/customerStore';

const SideCheckoutData = () => {
  const isAuth = useCustomerStore(state => state.isAuth);
  const cartItems = useCartStore(state => state.cartItems);
  const billingAddress = useCustomerStore(state => state.billingAddress);
  const shippingAddress = useCustomerStore(state => state.shippingAddress);
  const setIsBillingAddressDefault = useCustomerStore(
    state => state.setIsBillingAddressDefault
  );
  const setIsShippingAddressDefault = useCustomerStore(
    state => state.setIsShippingAddressDefault
  );

  let delivery = 0;
  let subTotal = 0;

  if (cartItems.length < 1) delivery = 0;
  if (cartItems.length > 0) delivery = 10;

  if (cartItems) {
    subTotal = cartItems.reduce(
      (total, current) => total + current.cartQty * current.price,
      0
    );
  }

  const grandTotal = delivery + subTotal;

  return (
    <aside className="col-right sidebar col-sm-3">
      <div className="block block-progress">
        <div className="block-title ">Your Checkout</div>
        <div className="block-content">
          <dl>
            {isAuth && billingAddress.firstName && (
              <>
                <dt className="complete">
                  {' '}
                  Billing Address <span className="separator">|</span>{' '}
                  <Link
                    to={'/account-information/address-book/update-address'}
                    onClick={() => {
                      setIsBillingAddressDefault(true);
                      setIsShippingAddressDefault(false);
                    }}
                  >
                    Change
                  </Link>{' '}
                </dt>
                <dd className="complete">
                  <address>
                    {billingAddress.firstName + ' ' + billingAddress.lastName}
                    <br />
                    {billingAddress.company && (
                      <>
                        {billingAddress.company}
                        <br />
                      </>
                    )}
                    {billingAddress.country}
                    {billingAddress.stateOrProvince && (
                      <>
                        <br />
                        {billingAddress.stateOrProvince}
                      </>
                    )}
                    <br />
                    {billingAddress.zipCode}
                    <br />
                    {billingAddress.street}
                    <br />
                    {`T: ${billingAddress.telephone}`} <br />
                  </address>
                </dd>
              </>
            )}
            {isAuth && shippingAddress.firstName && (
              <>
                <dt className="complete">
                  {' '}
                  Shipping Address <span className="separator">|</span>{' '}
                  <Link
                    to={'/account-information/address-book/update-address'}
                    onClick={() => {
                      setIsBillingAddressDefault(false);
                      setIsShippingAddressDefault(true);
                    }}
                  >
                    Change
                  </Link>{' '}
                </dt>
                <dd className="complete">
                  <address>
                    {shippingAddress.firstName + ' ' + shippingAddress.lastName}
                    <br />
                    {shippingAddress.company && (
                      <>
                        {shippingAddress.company}
                        <br />
                      </>
                    )}
                    {shippingAddress.country}
                    {shippingAddress.stateOrProvince && (
                      <>
                        <br />
                        {shippingAddress.stateOrProvince}
                      </>
                    )}
                    <br />
                    {shippingAddress.zipCode}
                    <br />
                    {shippingAddress.street}
                    <br />
                    {`T: ${shippingAddress.telephone}`} <br />
                  </address>
                </dd>
              </>
            )}
            <table
              className="table shopping-cart-table-total"
              id="shopping-cart-totals-table"
            >
              <colgroup>
                <col />
                <col width={1} />
              </colgroup>
              <tfoot>
                <tr>
                  <td colSpan={1} className="a-left">
                    <strong>Grand Total</strong>
                  </td>
                  <td className="a-right">
                    <strong>
                      <span className="price">${grandTotal.toFixed(2)}</span>
                    </strong>
                  </td>
                </tr>
              </tfoot>
              <tbody>
                <tr>
                  <td colSpan={1} className="a-left">
                    {' '}
                    Subtotal{' '}
                  </td>
                  <td className="a-right">
                    <span className="price">${subTotal.toFixed(2)}</span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={1} className="a-left">
                    {' '}
                    Delivery{' '}
                  </td>
                  <td className="a-right">
                    <span className="price">${delivery.toFixed(2)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </dl>
        </div>
      </div>
    </aside>
  );
};

export default SideCheckoutData;
