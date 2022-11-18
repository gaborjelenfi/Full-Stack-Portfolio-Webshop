import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../Store/cartStore';
import useUrlStore from '../Store/urlStore';
import Loader from '../utility/Loader/Loader';

const Product = ({
  _id,
  name,
  description,
  storageQuantity,
  price,
  imgPath,
  onSale,
  furnitureCategory,
  color,
  manufacturer,
  isLoading,
}) => {
  const incrementCartItemsQty = useCartStore(
    state => state.incrementCartItemsQty
  );

  const URL = useUrlStore(state => state.baseURL);
  const navigate = useNavigate();

  const goTo = () => {
    navigate({
      pathname: `/product-detail`,
      search: `id=${_id}`,
    });
  };

  return (
    <li className="item">
      <div className="product-image">
        {' '}
        <button style={{ backgroundColor: 'transparent' }} onClick={goTo}>
          {' '}
          {isLoading && <Loader />}
          {!isLoading && (
            <img
              crossOrigin="anonymous"
              className="small-image"
              src={`${URL}/${imgPath}`}
              alt={'title'}
            />
          )}{' '}
        </button>{' '}
      </div>
      <div className="product-shop">
        <h2 className="product-name">
          <button
            style={{
              backgroundColor: 'transparent',
              textDecoration: 'none',
              fontSize: '18px',
              textTransform: 'uppercase',
              fontWeight: '300',
              letterSpacing: '1px',
              color: '#C2A476',
              marginLeft: '-5px',
            }}
            onClick={goTo}
          >
            {name}
          </button>
        </h2>
        <h6 className="product-name">{manufacturer}</h6>
        <div className="desc std">
          <p>
            {description}{' '}
            <button
              style={{
                backgroundColor: 'transparent',
                fontWeight: 'normal',
                color: '#C2A476',
              }}
              className="link-learn"
              onClick={goTo}
            >
              Learn More
            </button>{' '}
          </p>
        </div>
        <p className="product-name">color: {color}</p>
        <br />
        {storageQuantity > 0 ? (
          <p className="availability in-stock not-pull-right">
            <span>In Stock</span>
          </p>
        ) : (
          <p className="availability out-of-stock not-pull-right">
            <span>Out of Stock</span>
          </p>
        )}
        <div className="price-box">
          <p className="special-price">
            {' '}
            <span className="price-label" />{' '}
            <span className="price"> {`$${price}`} </span>{' '}
          </p>{' '}
          {onSale && (
            <p className="old-price">
              {' '}
              <span className="price-label" />{' '}
              <span className="price">
                {' '}
                {`$${(price + price / 10).toFixed(2)}`}{' '}
              </span>{' '}
            </p>
          )}
        </div>
        <div className="actions">
          <button
            onClick={() =>
              incrementCartItemsQty(
                {
                  _id,
                  name,
                  storageQuantity,
                  price,
                  imgPath,
                  onSale,
                  furnitureCategory,
                  color,
                  manufacturer,
                  cartQty: 1,
                },
                1
              )
            }
            disabled={storageQuantity <= 0}
            className="button btn-cart ajx-cart"
            title="Add to Cart"
            type="button"
            style={{
              backgroundColor: storageQuantity <= 0 ? '#CFD2CF' : '',
              pointerEvents: storageQuantity <= 0 ? 'none' : '',
            }}
          >
            <span>Add to Cart</span>
          </button>
          <span className="add-to-links"> </span>{' '}
        </div>
      </div>
    </li>
  );
};

export default Product;
