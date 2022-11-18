import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../Store/cartStore';
import useUrlStore from '../../Store/urlStore';

const SideMiniCart = () => {
  const navigate = useNavigate();

  const URL = useUrlStore(state => state.baseURL);

  const cartItems = useCartStore(state => state.cartItems);
  const removeItem = useCartStore(state => state.removeItem);

  let subTotal = 0;

  if (cartItems) {
    subTotal = cartItems.reduce(
      (total, current) => total + current.cartQty * current.price,
      0
    );
  }

  const goTo = id => {
    navigate({
      pathname: `/product-detail`,
      search: `id=${id}`,
    });
  };

  return (
    <div className="block block-cart">
      <div className="block-title ">My Cart</div>
      <div className="block-content">
        <div className="summary">
          <p className="amount">
            There are {cartItems.length} items in your cart.
          </p>
          <p className="subtotal">
            {' '}
            <span className="label">Cart Subtotal:</span>{' '}
            <span className="price">{`$${subTotal.toFixed(2)}`}</span>{' '}
          </p>
        </div>
        <div className="ajax-checkout">
          <button
            onClick={() => navigate('/checkout')}
            className="button button-checkout"
            title="Submit"
            type="submit"
          >
            <span>Checkout</span>
          </button>
        </div>
        <p className="block-subtitle">Recently added item(s) </p>
        <ul>
          {cartItems.slice(0, 2).map(cartItem => (
            <li key={cartItem._id} className="item">
              {' '}
              <button
                style={{ backgroundColor: 'transparent' }}
                onClick={() => goTo(cartItem._id)}
                title="Retis lapen casen"
                className="product-image"
              >
                <img
                  crossOrigin="anonymous"
                  src={`${URL}/${cartItem.imgPath}`}
                  alt={cartItem.name}
                />
              </button>
              <div style={{ marginTop: '-50px' }} className="product-details">
                <div className="access">
                  {' '}
                  <Link
                    to={'./'}
                    title="Remove This Item"
                    className="btn-remove1"
                    onClick={() => removeItem(cartItem._id)}
                  >
                    {' '}
                    <span className="icon" /> Remove{' '}
                  </Link>{' '}
                </div>
                <strong>{cartItem.cartQty}</strong> x{' '}
                <span className="price">${cartItem.price}</span>
                <p className="product-name">
                  {' '}
                  <button
                    style={{ backgroundColor: 'transparent' }}
                    onClick={() => goTo(cartItem._id)}
                  >
                    {cartItem.name}
                  </button>{' '}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Link to={'/cart'} className="box-account">
          view all
        </Link>
      </div>
    </div>
  );
};

export default SideMiniCart;
