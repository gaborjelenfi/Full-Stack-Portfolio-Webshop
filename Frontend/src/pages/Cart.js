import React, { useEffect } from 'react';
import CartTableRow from '../components/Cart/CartTableRow';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../Store/cartStore';

function Cart() {
  const cartItems = useCartStore(state => state.cartItems);
  const clearCart = useCartStore(state => state.clearCart);

  let delivery = 0;
  let subTotal = 0;

  if (cartItems.length < 1) delivery = 0;
  if (cartItems.length > 0) delivery = 10; // delivery cost is static because this is just a demo

  // get total price of products in cart
  if (cartItems) {
    subTotal = cartItems.reduce(
      (total, current) => total + current.cartQty * current.price,
      0
    );
  }

  const grandTotal = delivery + subTotal;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  return (
    <div className="inner-page">
      <div id="page">
        {/* Main Container */}
        <section className="main-container col1-layout">
          <div className="main container">
            <div className="col-main">
              <div className="cart">
                <div className="page-title">
                  <h1>Shopping Cart</h1>
                </div>
                <div className="table-responsive">
                  <form method="post" action="#">
                    <fieldset>
                      <table
                        className="data-table cart-table"
                        id="shopping-cart-table"
                      >
                        <thead>
                          <tr className="first last">
                            <th rowSpan={1}>&nbsp;</th>
                            <th rowSpan={1}>
                              <span className="nobr">Product Name</span>
                            </th>
                            <th colSpan={1} className="a-center">
                              <span className="nobr">Unit Price</span>
                            </th>
                            <th className="a-center " rowSpan={1}>
                              Qty
                            </th>
                            <th colSpan={1} className="a-center">
                              Subtotal
                            </th>
                            <th className="a-center" rowSpan={1}>
                              &nbsp;
                            </th>
                          </tr>
                        </thead>
                        <tfoot>
                          <tr className="first last">
                            <td className="a-right last" colSpan={50}>
                              <button
                                onClick={() => navigate('/products-list')}
                                className="button btn-continue"
                                title="Continue Shopping"
                                type="button"
                              >
                                <span>Continue Shopping</span>
                              </button>
                              <button
                                onClick={() => clearCart()}
                                id="empty_cart_button"
                                className="button"
                                title="Clear Cart"
                                value="empty_cart"
                                name="update_cart_action"
                                type="button"
                              >
                                <span>Clear Cart</span>
                              </button>
                            </td>
                          </tr>
                        </tfoot>
                        <tbody>
                          {cartItems.length ? (
                            cartItems.map(productInCart => (
                              <CartTableRow
                                key={productInCart._id}
                                _id={productInCart._id}
                                name={productInCart.name}
                                price={productInCart.price}
                                imgPath={productInCart.imgPath}
                                cartQty={productInCart.cartQty}
                              />
                            ))
                          ) : (
                            <tr>
                              <td>
                                <h4>No product in your cart</h4>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </fieldset>
                  </form>
                </div>
                {/* BEGIN CART COLLATERALS */}
                <div className="cart-collaterals row">
                  <div className="col-sm-4">
                    <div className="shipping">
                      <h3>Estimate Shipping and Tax</h3>
                      <div className="shipping-form">
                        <form id="shipping-zip-form" method="post" action="#">
                          <p>
                            Enter your destination to get a shipping estimate.
                          </p>
                          <ul className="form-list">
                            <li>
                              <label className="required" htmlFor="country">
                                <em>*</em>Country
                              </label>
                              <div className="input-box">
                                <select
                                  title="Country"
                                  className="validate-select"
                                  id="country"
                                  name="country_id"
                                >
                                  <option value> </option>
                                  <option value="AF">Afghanistan</option>
                                  <option value="AX">Åland Islands</option>
                                  <option value="AL">Albania</option>
                                </select>
                              </div>
                            </li>
                            <li>
                              <label htmlFor="region_id">State/Province</label>
                              <div className="input-box">
                                <select
                                  title="State/Province"
                                  name="region_id"
                                  id="region_id"
                                >
                                  <option value>
                                    Please select region, state or province
                                  </option>
                                  <option value={1} title="Alabama">
                                    Alabama
                                  </option>
                                  <option value={2} title="Alaska">
                                    Alaska
                                  </option>
                                </select>
                              </div>
                            </li>
                            <li>
                              <label htmlFor="postcode">Zip/Postal Code</label>
                              <div className="input-box">
                                <input
                                  type="text"
                                  name="estimate_postcode"
                                  id="postcode"
                                  className="input-text validate-postcode"
                                />
                              </div>
                            </li>
                          </ul>
                          <div className="buttons-set11">
                            <button
                              className="button get-quote"
                              title="Get a Quote"
                              type="button"
                            >
                              <span>Get a Quote</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="discount">
                      <h3>Discount Codes</h3>
                      <form method="post" action="#" id="discount-coupon-form">
                        <label htmlFor="coupon_code">
                          Enter your coupon code if you have one.
                        </label>
                        <input
                          type="hidden"
                          defaultValue={0}
                          id="remove-coupone"
                          name="remove"
                        />
                        <input
                          type="text"
                          name="coupon_code"
                          id="coupon_code"
                          className="input-text fullwidth"
                        />
                        <button
                          value="Apply Coupon"
                          className="button coupon "
                          title="Apply Coupon"
                          type="button"
                        >
                          <span>Apply Coupon</span>
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="totals">
                      <h3>Shopping Cart Total</h3>
                      <div className="inner">
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
                                  <span className="price">
                                    ${grandTotal.toFixed(2)}
                                  </span>
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
                                <span className="price">
                                  ${subTotal.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={1} className="a-left">
                                {' '}
                                Delivery{' '}
                              </td>
                              <td className="a-right">
                                <span className="price">
                                  ${delivery.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <ul className="checkout">
                          <li>
                            <button
                              className="button btn-proceed-checkout"
                              title="Proceed to Checkout"
                              type="button"
                              onClick={() => navigate('/checkout')}
                            >
                              <span>Proceed to Checkout</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/*inner*/}
                  </div>
                </div>
                {/*cart-collaterals*/}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Cart;
