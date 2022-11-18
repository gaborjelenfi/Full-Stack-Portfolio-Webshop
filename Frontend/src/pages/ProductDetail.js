import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProductStore from '../Store/productStore';
import { Link } from 'react-router-dom';
import useCartStore from '../Store/cartStore';
import useUrlStore from '../Store/urlStore';

const Product_Detail = () => {
  const URL = useUrlStore(state => state.baseURL);
  const [searchParams] = useSearchParams();
  const idOfProduct = searchParams.get("id");
  const allProducts = useProductStore(state => state.allProducts);
  const addRecentlyViewed = useProductStore(state => state.addRecentlyViewed);
  const incrementCartItemsQty = useCartStore(
    state => state.incrementCartItemsQty
  );
console.log(allProducts)
  const {
    _id,
    description,
    furnitureCategory,
    imgPath,
    name,
    onSale,
    price,
    color,
    manufacturer,
    storageQuantity,
  } = allProducts?.find(product => product._id === idOfProduct);

  const [toCartQty, setToCartQty] = useState(1);
  const incrementToCartQty = () => {
    setToCartQty(toCartQty + 1);
  };

  const decrementToCartQty = () => {
    if (toCartQty > 1) setToCartQty(toCartQty - 1);
  };

  const addToCart = () => {
    incrementCartItemsQty(
      {
        _id,
        furnitureCategory,
        imgPath,
        name,
        onSale,
        price,
        color,
        storageQuantity,
        manufacturer,
        cartQty: toCartQty,
      },
      toCartQty
    );
    setToCartQty(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    addRecentlyViewed({ name, idOfProduct });
  }, [addRecentlyViewed, idOfProduct, name]);
  
  console.log(`${window.location.pathname}${window.location.search}`)

  return (
    <div className="inner-page">
      <div id="page">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <ul className="breadcrumb">
                  <li>
                    <Link to="/products-list">Home</Link>
                  </li>
                  <li>
                    <Link to="/products-list">{furnitureCategory}</Link>
                  </li>
                  <li>
                    <Link to={`${window.location.pathname}${window.location.search}`}>{name}</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Breadcrumbs End */}
        {/* Main Container */}
        <section className="main-container col1-layout wow bounceInUp animated">
          <div className="main container">
            <div className="col-main">
              <div className="row">
                <div className="product-view">
                  <div className="product-essential">
                    <form id="product_addtocart_form">
                      <input
                        name="form_key"
                        defaultValue="6UbXroakyQlbfQzK"
                        type="hidden"
                      />
                      <div className="product-img-box col-sm-4 col-xs-12">
                        <div className="new-label new-top-left"> New </div>
                        <div className="product-image">
                          <div className="large-image">
                              <img
                                crossOrigin='anonymous'
                                src={`${URL}/${imgPath}`}
                                alt={name}
                              />{' '}
                          </div>
                        </div>
                      </div>
                      <div className="product-shop col-sm-8 col-xs-12">
                        <div className="product-name">
                          <h1>{name}</h1>
                        </div>
                        <div className="ratings">
                          <div className="rating-box">
                            <div
                              style={{ width: `${50}%` }}
                              className="rating"
                            />
                          </div>
                          <p className="rating-links">
                            {' '}
                            <Link to={`${window.location.pathname}${window.location.search}`}>1 Review(s)</Link>{' '}
                            <span className="separator">|</span>{' '}
                            <Link to={`${window.location.pathname}${window.location.search}`}>Add Your Review</Link>{' '}
                          </p>
                        </div>
                        <div className="price-block">
                          <div className="price-box">
                            <p className="special-price">
                              {' '}
                              <span className="price-label">
                                Special Price
                              </span>{' '}
                              <span
                                id="product-price-48"
                                className="price"
                                style={{
                                  color: onSale ? '#fb4e4a' : '#C2A476',
                                }}
                              >
                                {' '}
                                {onSale && `$${price}`}{' '}
                              </span>{' '}
                            </p>
                            {onSale && (
                              <p className="old-price">
                                {' '}
                                <span className="price-label">
                                  Regular Price:
                                </span>{' '}
                                <span className="price">
                                  {' '}
                                  {`$${(price + price / 10).toFixed(2)}`}{' '}
                                </span>{' '}
                              </p>
                            )}
                          </div>
                          {storageQuantity > 0 ? (
                            <p className="availability in-stock pull-right">
                              <span>In Stock</span>
                            </p>
                          ) : (
                            <p className="availability out-of-stock pull-right">
                              <span>Out of Stock</span>
                            </p>
                          )}
                        </div>
                        <div className="short-description">
                          <h2>Quick Overview</h2>
                          <p>{description} </p>
                        </div>
                        <div className="add-to-box">
                          <div className="add-to-cart">
                            <div className="pull-left">
                              <div className="custom pull-left">
                                <button
                                  onClick={decrementToCartQty}
                                  className="reduced items-count"
                                  type="button"
                                >
                                  <i className="fa fa-minus">&nbsp;</i>
                                </button>
                                <input
                                  readOnly
                                  type="text"
                                  className="input-text qty"
                                  title="Qty"
                                  value={toCartQty}
                                  maxLength={2}
                                  id="qty"
                                  name="qty"
                                />
                                <button
                                  onClick={incrementToCartQty}
                                  className="increase items-count"
                                  type="button"
                                >
                                  <i className="fa fa-plus">&nbsp;</i>
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={addToCart}
                              disabled={storageQuantity <= 0}
                              className="button btn-cart"
                              title="Add to Cart"
                              type="button"
                              style={{
                                backgroundColor:
                                  storageQuantity <= 0 ? '#CFD2CF' : '',
                                pointerEvents:
                                  storageQuantity <= 0 ? 'none' : '',
                              }}
                            >
                              <span>Add to Cart</span>
                            </button>
                          </div>
                          <div className="email-addto-box">
                            <p className="email-friend">
                              <Link to={`${window.location.pathname}${window.location.search}`}>
                                <span>Email to a Friend</span>
                              </Link>
                            </p>
                            <ul className="add-to-links">
                              <li>
                                {' '}
                                <Link className="link-wishlist" to={`${window.location.pathname}${window.location.search}`}>
                                  <span>Add to Wishlist</span>
                                </Link>
                              </li>
                              <li>
                                <span className="separator">|</span>{' '}
                                <Link className="link-compare" to={`${window.location.pathname}${window.location.search}`}>
                                  <span>Add to Compare</span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="product-collateral col-lg-12 col-sm-12 col-xs-12 bounceInUp animated">
                    <div className="add_info">
                      <ul
                        id="product-detail-tab"
                        className="nav nav-tabs product-tabs"
                      >
                        <li className="active">
                          {' '}
                          <a href="#product_tabs_description" data-toggle="tab">
                            {' '}
                            Description{' '}
                          </a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#product_tabs_custom" data-toggle="tab">
                            Good to know
                          </a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#reviews_tabs" data-toggle="tab">
                            Reviews
                          </a>{' '}
                        </li>
                      </ul>
                      <div id="productTabContent" className="tab-content">
                        <div
                          className="tab-pane fade in active"
                          id="product_tabs_description"
                        >
                          <div className="std">
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Nam fringilla augue nec est tristique
                              auctor. Donec non est at libero vulputate rutrum.
                              Morbi ornare lectus quis justo gravida semper.
                              Nulla tellus mi, vulputate adipiscing cursus eu,
                              suscipit id nulla. Donec a neque libero.
                              Pellentesque aliquet, sem eget laoreet ultrices,
                              ipsum metus feugiat sem, quis fermentum turpis
                              eros eget velit.
                            </p>
                            <p>
                              {' '}
                              Nunc facilisis sagittis ullamcorper. Proin lectus
                              ipsum, gravida et mattis vulputate, tristique ut
                              lectus. Sed et lorem nunc. Vestibulum ante ipsum
                              primis in faucibus orci luctus et ultrices posuere
                              cubilia Curae; Aenean eleifend laoreet congue.
                              Vivamus adipiscing nisl ut dolor dignissim semper.
                            </p>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="reviews_tabs">
                          <div
                            className="box-collateral box-reviews"
                            id="customer-reviews"
                          >
                            <div className="box-reviews1">
                              <div className="form-add">
                                <form id="review-form">
                                  <h3>Write Your Own Review</h3>
                                  <fieldset>
                                    <h4>
                                      How do you rate this product?{' '}
                                      <em className="required">*</em>
                                    </h4>
                                    <span id="input-message-box" />
                                    <table
                                      id="product-review-table"
                                      className="data-table"
                                    >
                                      <thead>
                                        <tr className="first last">
                                          <th>&nbsp;</th>
                                          <th>
                                            <span className="nobr">1 *</span>
                                          </th>
                                          <th>
                                            <span className="nobr">2 *</span>
                                          </th>
                                          <th>
                                            <span className="nobr">3 *</span>
                                          </th>
                                          <th>
                                            <span className="nobr">4 *</span>
                                          </th>
                                          <th>
                                            <span className="nobr">5 *</span>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="first odd">
                                          <th>Price</th>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={11}
                                              id="Price_1"
                                              name="ratings[3]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={12}
                                              id="Price_2"
                                              name="ratings[3]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={13}
                                              id="Price_3"
                                              name="ratings[3]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={14}
                                              id="Price_4"
                                              name="ratings[3]"
                                            />
                                          </td>
                                          <td className="value last">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={15}
                                              id="Price_5"
                                              name="ratings[3]"
                                            />
                                          </td>
                                        </tr>
                                        <tr className="even">
                                          <th>Value</th>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={6}
                                              id="Value_1"
                                              name="ratings[2]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={7}
                                              id="Value_2"
                                              name="ratings[2]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={8}
                                              id="Value_3"
                                              name="ratings[2]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={9}
                                              id="Value_4"
                                              name="ratings[2]"
                                            />
                                          </td>
                                          <td className="value last">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={10}
                                              id="Value_5"
                                              name="ratings[2]"
                                            />
                                          </td>
                                        </tr>
                                        <tr className="last odd">
                                          <th>Quality</th>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={1}
                                              id="Quality_1"
                                              name="ratings[1]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={2}
                                              id="Quality_2"
                                              name="ratings[1]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={3}
                                              id="Quality_3"
                                              name="ratings[1]"
                                            />
                                          </td>
                                          <td className="value">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={4}
                                              id="Quality_4"
                                              name="ratings[1]"
                                            />
                                          </td>
                                          <td className="value last">
                                            <input
                                              type="radio"
                                              className="radio"
                                              defaultValue={5}
                                              id="Quality_5"
                                              name="ratings[1]"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <input
                                      type="hidden"
                                      defaultValue
                                      className="validate-rating"
                                      name="validate_rating"
                                    />
                                    <div className="review1">
                                      <ul className="form-list">
                                        <li>
                                          <label
                                            className="required"
                                            htmlFor="nickname_field"
                                          >
                                            Nickname<em>*</em>
                                          </label>
                                          <div className="input-box">
                                            <input
                                              type="text"
                                              className="input-text"
                                              id="nickname_field"
                                              name="nickname"
                                            />
                                          </div>
                                        </li>
                                        <li>
                                          <label
                                            className="required"
                                            htmlFor="summary_field"
                                          >
                                            Summary<em>*</em>
                                          </label>
                                          <div className="input-box">
                                            <input
                                              type="text"
                                              className="input-text"
                                              id="summary_field"
                                              name="title"
                                            />
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="review2">
                                      <ul>
                                        <li>
                                          <label
                                            className="required "
                                            htmlFor="review_field"
                                          >
                                            Review<em>*</em>
                                          </label>
                                          <div className="input-box">
                                            <textarea
                                              rows={3}
                                              cols={5}
                                              id="review_field"
                                              name="detail"
                                              defaultValue={''}
                                            />
                                          </div>
                                        </li>
                                      </ul>
                                      <div className="buttons-set">
                                        <button
                                          className="button submit"
                                          title="Submit Review"
                                          type="button"
                                        >
                                          <span>Submit Review</span>
                                        </button>
                                      </div>
                                    </div>
                                  </fieldset>
                                </form>
                              </div>
                            </div>
                            <div className="box-reviews2">
                              <h3>Customer Reviews</h3>
                              <div className="box visible">
                                <ul>
                                  <li>
                                    <table className="ratings-table">
                                      <colgroup>
                                        <col width={1} />
                                        <col />
                                      </colgroup>
                                      <tbody>
                                        <tr>
                                          <th>Value</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '100%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Quality</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '100%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Price</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '100%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <div className="review">
                                      <h6>
                                        <Link to={`${window.location.pathname}${window.location.search}`}>Excellent</Link>
                                      </h6>
                                      <small>
                                        Review by <span>Leslie Prichard </span>
                                        on 1/3/2014{' '}
                                      </small>
                                      <div className="review-txt">
                                        {' '}
                                        I have purchased chairs from Superb a
                                        few times and am never disappointed. The
                                        quality is excellent and the shipping is
                                        amazing. It seems like it's at your
                                        front door the minute you get off your
                                        pc. I have received my purchases within
                                        two days - amazing.
                                      </div>
                                    </div>
                                  </li>
                                  <li className="even">
                                    <table className="ratings-table">
                                      <colgroup>
                                        <col width={1} />
                                        <col />
                                      </colgroup>
                                      <tbody>
                                        <tr>
                                          <th>Value</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '100%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Quality</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '100%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Price</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '80%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <div className="review">
                                      <h6>
                                        <a href="#/catalog/product/view/id/60/">
                                          Amazing
                                        </a>
                                      </h6>
                                      <small>
                                        Review by <span>Sandra Parker</span>on
                                        1/3/2014{' '}
                                      </small>
                                      <div className="review-txt">
                                        {' '}
                                        Superb is the online !{' '}
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <table className="ratings-table">
                                      <colgroup>
                                        <col width={1} />
                                        <col />
                                      </colgroup>
                                      <tbody>
                                        <tr>
                                          <th>Value</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '100%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Quality</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '100%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Price</th>
                                          <td>
                                            <div className="rating-box">
                                              <div
                                                className="rating"
                                                style={{ width: '80%' }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <div className="review">
                                      <h6>
                                        <a href="#/catalog/product/view/id/59/">
                                          Nicely
                                        </a>
                                      </h6>
                                      <small>
                                        Review by <span>Anthony Lewis</span>on
                                        1/3/2014{' '}
                                      </small>
                                      <div className="review-txt">
                                        {' '}
                                        Unbeatable service and selection. This
                                        store has the best business model I have
                                        seen on the net. They are true to their
                                        word, and go the extra mile for their
                                        customers. I felt like a purchasing
                                        partner more than a customer. You have a
                                        lifetime client in me.{' '}
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="actions">
                                {' '}
                                <Link
                                  className="button view-all"
                                  id="revies-button"
                                  to={`./?id=${_id}`}
                                >
                                  <span>
                                    <span>View all</span>
                                  </span>
                                </Link>{' '}
                              </div>
                            </div>
                            <div className="clear" />
                          </div>
                        </div>
                        <div className="tab-pane fade" id="product_tabs_custom">
                          <div className="product-tabs-content-inner clearfix">
                            <p>
                              <strong>Lorem Ipsum</strong>
                              <span>
                                &nbsp;is simply dummy text of the printing and
                                typesetting industry. Lorem Ipsum has been the
                                industry's standard dummy text ever since the
                                1500s, when an unknown printer took a galley of
                                type and scrambled it to make a type specimen
                                book. It has survived not only five centuries,
                                but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was
                                popularised in the 1960s with the release of
                                Letraset sheets containing Lorem Ipsum passages,
                                and more recently with desktop publishing
                                software like Aldus PageMaker including versions
                                of Lorem Ipsum.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
};

export default Product_Detail;
