import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../Store/cartStore';
import useUrlStore from '../../Store/urlStore';

export function CartTableRow({ _id, name, price, imgPath, cartQty }) {
  const URL = useUrlStore(state => state.baseURL);
  const navigate = useNavigate();

  const incrementCartItemsQty = useCartStore(
    state => state.incrementCartItemsQty
  );
  const decrementCartItemsQty = useCartStore(
    state => state.decrementCartItemsQty
  );
  const removeItem = useCartStore(state => state.removeItem);
  
  const [inCartQty, setInCartQty] = useState(cartQty);

  const incrementInCartQty = () => {
    setInCartQty(inCartQty + 1); // add by 1 to cart that show in the header
    // add item details to cart
    incrementCartItemsQty({ _id, imgPath, name, price, cartQty: 1 }, 1);
  };

  const decrementInCartQty = () => {
    if (inCartQty > 1) {
      setInCartQty(inCartQty - 1); // reduce by 1 to cart that show in the header
      decrementCartItemsQty(_id, 1);
    }
  };

  const goTo = () => {
    navigate({
      pathname: '/product-detail',
      search: `id=${_id}`,
    });
  };

  return (
    <tr className="first odd">
      <td className="image" style={{ verticalAlign: 'middle' }}>
        <button style={{backgroundColor: 'transparent'}} className="product-image" onClick={goTo}>
          <img
            crossOrigin='anonymous'
            width={75}
            height={75}
            alt={name}
            src={`${URL}/${imgPath}`}
          />
        </button>
      </td>
      <td style={{ verticalAlign: 'middle' }}>
        <h2 className="product-name">
          {' '}
          <button style={{backgroundColor: 'transparent'}} onClick={goTo}>{name}</button>{' '}
        </h2>
      </td>

      <td className="a-center hidden-table" style={{ verticalAlign: 'middle' }}>
        <span className="cart-price">
          {' '}
          <span className="price">{`$${price}`}</span>{' '}
        </span>
      </td>
      <td className="a-center movewishlist" style={{ verticalAlign: 'middle' }}>
        <div className="custom pull-left">
          <button
            onClick={decrementInCartQty}
            className="reduced items-count"
            type="button"
          >
            <i className="fa fa-minus">&nbsp;</i>
          </button>
          <input
            readOnly
            maxLength={2}
            className="input-text qty"
            title="Qty"
            size={4}
            value={inCartQty}
            name="qty"
            style={{ maxWidth: '40px' }}
          />
          <button
            onClick={incrementInCartQty}
            className="increase items-count"
            type="button"
          >
            <i className="fa fa-plus">&nbsp;</i>
          </button>
        </div>
      </td>
      <td className="a-center movewishlist" style={{ verticalAlign: 'middle' }}>
        <span className="cart-price">
          {' '}
          <span className="price">{`$${(price * inCartQty).toFixed(2)}`}</span>{' '}
        </span>
      </td>
      <td className="a-center last" style={{ verticalAlign: 'middle' }}>
        <Link
          className="button remove-item"
          title="Remove item"
          to={`${window.location.pathname}${window.location.search}`}
          onClick={() => removeItem(_id)}
        >
          <span>
            <span>Remove item</span>
          </span>
        </Link>
      </td>
    </tr>
  );
}

export default CartTableRow;
