import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../Store/cartStore';
import useCustomerStore from '../Store/customerStore';
import useProductStore from '../Store/productStore';

const HeaderContent = () => {
  const navigate = useNavigate();
  
  const cartItems = useCartStore(state => state.cartItems);
  const clearCart = useCartStore(state => state.clearCart);

  const isAuth = useCustomerStore(state => state.isAuth);
  const logout = useCustomerStore(state => state.logout);
  const setPasswordCheckbox = useCustomerStore(
    state => state.setPasswordCheckbox
  );
  const customerData = useCustomerStore(state => state.customerData);

  const clearRecentlyViewed = useProductStore(state => state.clearRecentlyViewed);

  const [isAuthState, setIsAuthState] = useState(isAuth);
  
  useEffect(() => {
    setIsAuthState(false);
    if (!isAuth) {
      logout();
    }
  }, [isAuth, logout, isAuthState]);

  const logoutHandler = () => {
    logout();
    clearCart();
    clearRecentlyViewed();
  };

  return (
    <header>
      <div className="header-container">
        <div className="header-top">
          <div className="container">
            <div className="row">
              {/* Header Language */}
              <div className="col-xs-7 col-sm-4">
                <div className="welcome-msg hidden-xs"> SUPERB furnitures </div>
              </div>
              <div className="col-xs-5 col-sm-8">
                <div className="top-cart-contain pull-right">
                  {/* Top Cart */}
                  <div className="mini-cart">
                    <div className="basket dropdown-toggle">
                      <Link to="/cart">
                        {' '}
                        My Cart{' '}
                        <span className="cart_count">{cartItems.length}</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="top-search">
                  <div className="block-icon pull-right">
                    {' '}
                    <a
                      data-target=".bs-example-modal-lg"
                      data-toggle="modal"
                      className="search-focus dropdown-toggle links"
                    >
                      {' '}
                      <i className="fa fa-search" />{' '}
                    </a>
                    <div
                      className="modal fade bs-example-modal-lg"
                      tabIndex={-1}
                      role="dialog"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <button
                              aria-label="Close"
                              data-dismiss="modal"
                              className="close"
                              type="button"
                            >
                              <img
                                crossOrigin='anonymous'
                                src="/images/interstitial-close.png"
                                alt="close"
                              />{' '}
                            </button>
                          </div>
                          <div className="modal-body">
                            <form className="navbar-form">
                              <div id="search">
                                <div className="input-group">
                                  <input
                                    name="search"
                                    placeholder="Search"
                                    className="form-control"
                                    type="text"
                                  />
                                  <button
                                    type="button"
                                    className="btn-search"
                                    onClick={() => navigate('/products-list')}
                                    data-dismiss="modal"
                                  >
                                    <i className="fa fa-search" />
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Header Top Links */}
                <div className="toplinks">
                  <div className="links">
                    {isAuth && (
                      <>
                        <span
                          className="welcomeText"
                          style={{ color: '#ffffff', marginRight: '20px' }}
                        >
                          Welcome:{' '}
                          {`${customerData.firstName} ${customerData.lastName}`}
                        </span>
                        <div className="myaccount">
                          <Link
                            title="My Account"
                            to="/account-information/edit-account"
                            onClick={() => setPasswordCheckbox(false)}
                          >
                            <span>My Account</span>
                          </Link>
                        </div>
                      </>
                    )}
                    <div className="check">
                      <Link title="Checkout" to="/checkout">
                        <span>Checkout</span>
                      </Link>
                    </div>
                    <div className="login">
                      {!isAuth && (
                        <Link to="login">
                          <span>Login</span>
                        </Link>
                      )}
                      {isAuth && (
                        <Link to="products-list">
                          <span onClick={logoutHandler}>Log Out</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                {/* End Header Top Links */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderContent;
