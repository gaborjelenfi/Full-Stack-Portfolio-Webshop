import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../Store/cartStore';
import useValidationStore from '../../Store/validationStore';
import axios from 'axios';
import useCustomerStore from '../../Store/customerStore';
import useUrlStore from '../../Store/urlStore';

const OrderReview = () => {
  const URL = useUrlStore(state => state.baseURL);

  const steps = useValidationStore(state => state.steps);
  const isStepOpen = useValidationStore(state => state.isStepOpen);
  const activateCheckoutStep = useValidationStore(
    state => state.activateCheckoutStep
  );
  const isFormComplete = useValidationStore(state => state.isFormComplete);

  const cartItems = useCartStore(state => state.cartItems);

  const setRouteAccess = useCustomerStore(state => state.setRouteAccess);
  const setOrderData = useCustomerStore(state => state.setOrderData);

  // if billing or shipping address fields have not filled up somehow set order button to disabled
  let isPlaceOrderBtnDisabled = !(
    isFormComplete.isBillingFormComplete &&
    isFormComplete.isShippingFormComplete &&
    cartItems.length
  );
  let delivery = 0;
  let subTotal = 0;

  if (cartItems.length < 1) delivery = 0;
  if (cartItems.length > 0) delivery = 10; // delivery price is static because this is just a demo

  // get total price
  if (cartItems) {
    subTotal = cartItems.reduce(
      (total, current) => total + current.cartQty * current.price,
      0
    );
  }
  // reduce the cart items data for payments demo, other data added from backend to Stripe
  const requiredCartItemsDataToBackend = cartItems.map(element => {
    return {
      _id: element._id,
      cartQty: element.cartQty,
    };
  });

  const grandTotal = delivery + subTotal;

  const sendCheckoutRequest = async () => {
    try {
      const response = await axios.post(
        `${URL}/stripe-checkout`,
        requiredCartItemsDataToBackend
      );
      if (response.status === 200) {
        // if post was successful, navigate to Stripe payment page
        window.location = response.data.url;
        // Grant access after payment to navigate to the Success page to finish the order request
        setRouteAccess(response.data.isRouteAccess);
      }
    } catch (error) {
      console.log(error);
      console.log(error.response.status, error.response.data);
    }
  };

  return (
    <div
      id="checkout-step-review"
      className="step a-item"
      style={{
        display: isStepOpen.thirdStep ? 'block' : 'none',
      }}
    >
      <div className="order-review" id="checkout-review-load">
        <table className="data-table cart-table" id="shopping-cart-table">
          <tbody>
            {cartItems.length ? (
              cartItems.map(item => (
                <tr key={item._id} className="product-image">
                  <td>
                    <img
                      crossOrigin='anonymous'
                      width={45}
                      height={45}
                      src={`${URL}/${item.imgPath}`}
                      alt="product img"
                      style={{ marginRight: '10px' }}
                    />
                  </td>
                  <td style={{ width: '150px', verticalAlign: 'middle' }}>
                    <span className="product-name">
                      {item.name[0].toUpperCase() + item.name.substring(1)}
                    </span>
                  </td>
                  <td
                    className="a-center"
                    style={{ width: '80px', verticalAlign: 'middle' }}
                  >
                    <span className="cart-price">
                      {' '}
                      <span className="price">{`$${item.price}`}</span>{' '}
                    </span>
                  </td>
                  <td style={{ width: '50px', verticalAlign: 'middle' }}>
                    <span>{`X ${item.cartQty} =`}</span>
                  </td>
                  <td
                    className="a-center movewishlist"
                    style={{ width: 'auto', verticalAlign: 'middle' }}
                  >
                    <span className="cart-price">
                      <span className="price">{`$${(
                        item.price * item.cartQty
                      ).toFixed(2)}`}</span>{' '}
                    </span>
                  </td>
                </tr>
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
        <br />
      </div>
      <strong>
        <span className="price">{`Grand Total: $${grandTotal.toFixed(
          2
        )}`}</span>
      </strong>
      <br />
      <br />
      <div className="buttons-set13" id="review-buttons-container">
        <p className="f-left">
          Forgot an Item? <Link to="/cart">Edit Your Cart</Link>
        </p>
        <br />
        <button
          type="button"
          className="button continue"
          disabled={isPlaceOrderBtnDisabled}
          title="Continue button"
          onClick={() => {
            setOrderData({ key: 'orderProducts', value: cartItems });
            sendCheckoutRequest();
          }}
          style={{
            backgroundColor: isPlaceOrderBtnDisabled ? '#CFD2CF' : '',
            pointerEvents: isPlaceOrderBtnDisabled ? 'none' : '',
          }}
        >
          <span>Place Order</span>
        </button>
        <Link
          to={'./'}
          className="back-link"
          onClick={() => {
            activateCheckoutStep(steps.secondStep);
          }}
        >
          &emsp;« Back
        </Link>{' '}
      </div>
    </div>
  );
};

export default OrderReview;
