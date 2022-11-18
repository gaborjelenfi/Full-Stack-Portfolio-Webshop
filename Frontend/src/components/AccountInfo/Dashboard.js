import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCustomerStore from '../../Store/customerStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const URL = useUrlStore(state => state.baseURL);

  const isAuth = useCustomerStore(state => state.isAuth);
  const customerId = useCustomerStore(state => state.customerId);
  const logout = useCustomerStore(state => state.logout);
  const setPasswordCheckbox = useCustomerStore(
    state => state.setPasswordCheckbox
  );
  const setIsBillingAddressDefault = useCustomerStore(
    state => state.setIsBillingAddressDefault
  );
  const setIsShippingAddressDefault = useCustomerStore(
    state => state.setIsShippingAddressDefault
  );
  const fetchCustomerData = useCustomerStore(state => state.fetchCustomerData);
  const fetchCustomerOrders = useCustomerStore(
    state => state.fetchCustomerOrders
  );
  const customerOrders = useCustomerStore(state => state.customerOrders);
  const { firstName, lastName, email } = useCustomerStore(
    state => state.customerData
  );
  const billingAddress = useCustomerStore(state => state.billingAddress);
  const shippingAddress = useCustomerStore(state => state.shippingAddress);

  const validateIsEmail = useValidationStore(state => state.validateIsEmail);
  
  const [touched, setTouched] = useState({});
  let hasInputError = {};
  let subscribeBtn = false;
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState({
    email: '',
  });
  const [viewAll, setViewAll] = useState(false);
  const invalidEmailErrMsg = 'Please type a valid email address';

  useEffect(() => {
    // if not authenticated then navigate to login page. 
    if (!isAuth || !customerId) {
      logout();
      navigate('./login');
    }

    fetchCustomerData(URL);
    const customerOrdersQuery = {
      query: `query FetchCustomerOrders{
        customer(id: "${customerId}") {
          orderedProducts {
            orderId
            orderedAt
            shippingAddress
            orderTotal
            orderStatus
            isDeleted
          }
        }
      }`,
    };
    fetchCustomerOrders(customerOrdersQuery, URL);
  }, [
    URL,
    customerId,
    fetchCustomerData,
    fetchCustomerOrders,
    isAuth,
    logout,
    navigate,
  ]);

  // validation
  hasInputError = { ...validateIsEmail(emailInput.email) };

  // input change handler
  const handleChange = e => {
    setTouched({ [e.target.name]: true });
    const value = e.target.value;
    setEmailInput({ [e.target.name]: value });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="customer-account-index customer-account inner-page">
      <div id="page">
        {/* Main Container */}
        <section className="main-container col2-right-layout">
          <div className="main container">
            <div className="row">
              <div className="col-main col-sm-9">
                <div className="page-title">
                  <h1>My Dashboard</h1>
                </div>
                <div className="my-account">
                  <div className="dashboard">
                    <div className="welcome-msg">
                      {' '}
                      <strong>Hello, {firstName + ' ' + lastName}!</strong>
                      <p>
                        From your My Account Dashboard you have the ability to
                        view a snapshot of your recent account activity and
                        update your account information. Select a link below to
                        view or edit information.
                      </p>
                    </div>
                    <div className="recent-orders">
                      <div className="title-buttons">
                        <strong>Recent Orders</strong>{' '}
                        <Link
                          onClick={() => setViewAll(!viewAll)}
                          to={`${window.location.pathname}${window.location.search}`}
                          style={{ textDecoration: 'none' }}
                        >
                          {viewAll ? 'View Less' : 'View All'}{' '}
                        </Link>{' '}
                      </div>
                      <div className="table-responsive">
                        <table className="data-table" id="my-orders-table">
                          <colgroup>
                            <col />
                            <col />
                            <col />
                            <col width={1} />
                            <col width={1} />
                            <col width={1} />
                          </colgroup>
                          <thead>
                            <tr className="first last">
                              <th>Order #</th>
                              <th>Date</th>
                              <th>Ship to</th>
                              <th>
                                <span className="nobr">Total</span>
                              </th>
                              <th>Status</th>
                              <th>&nbsp;</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerOrders.length ? (
                              customerOrders
                                .slice(0, viewAll ? customerOrders.length : 2)
                                .map(e => (
                                  <tr key={e.orderId} className="first odd">
                                    <td>{e.orderId}</td>
                                    <td>{e.orderedAt}</td>
                                    <td>{e.shippingAddress}</td>
                                    <td>
                                      <span className="price">
                                        ${Number(e.orderTotal).toFixed(2)}
                                      </span>
                                    </td>
                                    <td>
                                      <em>{e.orderStatus}</em>
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td>
                                  <p>You have no orders.</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="box-account">
                      <div className="page-title">
                        <br />
                        <h2>Account Information</h2>
                      </div>
                      <div className="col2-set">
                        <div className="col-1">
                          <h5>Contact Information</h5>
                          <Link to={'/account-information/edit-account'}>
                            Edit
                          </Link>
                          <p>
                            {' '}
                            {firstName + ' ' + lastName}
                            <br />
                            {email}
                            <br />
                            <Link
                              to={'/account-information/edit-account'}
                              onClick={() => setPasswordCheckbox(true)}
                            >
                              Change Password
                            </Link>{' '}
                          </p>
                        </div>
                        <div className="col-2">
                          <h5>Newsletters</h5>
                          {!subscribed ? (
                            <div className="input-box">
                              <form action="#">
                                <input
                                  onChange={handleChange}
                                  value={emailInput.email}
                                  type="email"
                                  name="email"
                                  title="Email"
                                  placeholder="Enter your email address"
                                  className="input-text required-entry"
                                />
                                <button
                                  disabled={subscribeBtn}
                                  type="button"
                                  title="Subscribe"
                                  className="button subscribe"
                                  onClick={() => setSubscribed(true)}
                                  style={{
                                    backgroundColor: subscribeBtn
                                      ? '#CFD2CF'
                                      : '',
                                    pointerEvents: subscribeBtn ? 'none' : '',
                                  }}
                                >
                                  <span>Subscribe</span>
                                </button>
                                {hasInputError.emailInputError &&
                                  touched.email && (
                                    <p className="required">
                                      {invalidEmailErrMsg}
                                    </p>
                                  )}
                              </form>
                            </div>
                          ) : (
                            <h4>Thank you for subscribing!</h4>
                          )}
                        </div>
                      </div>
                      <div className="col2-set">
                        <h4>Address Book</h4>
                        <div className="manage_add">
                          <Link to={'/account-information/address-book'}>
                            Manage Addresses
                          </Link>{' '}
                        </div>
                        <div className="col-1">
                          <h5>Primary Billing Address</h5>
                          <address>
                            {billingAddress.firstName.length !== 0 ? (
                              <>
                                {billingAddress.firstName +
                                  ' ' +
                                  billingAddress.lastName}
                                <br />
                                {billingAddress.country}
                                {billingAddress.stateOrProvince && (
                                  <>
                                    <br />
                                    {billingAddress.stateOrProvince}
                                  </>
                                )}
                                <br />
                                {billingAddress.zipCode},
                                <br />
                                {billingAddress.street}
                                <br />
                                T: {billingAddress.telephone} <br />
                              </>
                            ) : (
                              <p>No billing addres saved yet</p>
                            )}
                            <Link
                              to={
                                '/account-information/address-book/update-address'
                              }
                              onClick={() => {
                                setIsBillingAddressDefault(true);
                                setIsShippingAddressDefault(false);
                              }}
                            >
                              Edit Billing Address
                            </Link>
                          </address>
                        </div>
                        <div className="col-2">
                          <h5>Primary Shipping Address</h5>
                          <address>
                            {shippingAddress.firstName.length !== 0 ? (
                              <>
                                {shippingAddress.firstName +
                                  ' ' +
                                  shippingAddress.lastName}
                                <br />
                                {shippingAddress.country}
                                {shippingAddress.stateOrProvince && (
                                  <>
                                    <br />
                                    {shippingAddress.stateOrProvince}
                                  </>
                                )}
                                <br />
                                {shippingAddress.zipCode},
                                <br />
                                {shippingAddress.street}
                                <br />
                                T: {shippingAddress.telephone} <br />
                              </>
                            ) : (
                              <p>No shipping address saved yet</p>
                            )}
                            <Link
                              to={
                                '/account-information/address-book/update-address'
                              }
                              onClick={() => {
                                setIsBillingAddressDefault(false);
                                setIsShippingAddressDefault(true);
                              }}
                            >
                              Edit Shipping Address
                            </Link>
                          </address>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
