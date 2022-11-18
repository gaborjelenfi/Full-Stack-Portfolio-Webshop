import { Link, Outlet, useNavigate } from 'react-router-dom';
import useCustomerStore from '../../Store/customerStore';

const AddressBook = () => {
  const navigate = useNavigate();

  const setIsBillingAddressDefault = useCustomerStore(
    state => state.setIsBillingAddressDefault
  );
  const setIsShippingAddressDefault = useCustomerStore(
    state => state.setIsShippingAddressDefault
  );
  const billingAddress = useCustomerStore(state => state.billingAddress);
  const shippingAddress = useCustomerStore(state => state.shippingAddress);

  return (
    <div className="customer-account-index customer-account inner-page">
      <div id="page">
        {/* Main Container */}
        <section className="main-container col2-right-layout">
          <div className="main container">
            <div className="row">
              <div
                className="col-main col-sm-9 animated"
                style={{ visibility: 'visible' }}
              >
                <div className="my-account">
                  <Outlet />
                  <div className="page-title">
                    <h1>Address Book</h1>
                    <button
                      style={{ float: 'right', marginTop: 4 }}
                      type="button"
                      title="Add New Address"
                      className="button"
                      onClick={() => {
                        setIsBillingAddressDefault(false);
                        setIsShippingAddressDefault(false);
                        navigate('./update-address');
                      }}
                    >
                      <span>Update Address</span>
                    </button>
                  </div>
                  <div className="col2-set ">
                    <div className="col-1 addresses-primary ">
                      <h4>Default Addresses</h4>
                      <hr />
                      <ol>
                        <li className="item">
                          <h4>Default Billing Address</h4>
                          <address>
                            Name:{' '}
                            {`${billingAddress.firstName} ${billingAddress.lastName}`}
                            {billingAddress.company && (
                              <>
                                <br />
                                Company: {billingAddress.company}
                              </>
                            )}
                            <br />
                            Country: {billingAddress.country}
                            {billingAddress.stateOrProvince && (
                              <>
                                <br />
                                State/Province: {billingAddress.stateOrProvince}
                              </>
                            )}
                            <br />
                            Zip code: {billingAddress.zipCode}
                            <br />
                            City: {billingAddress.city}
                            <br />
                            Street/Road: {billingAddress.street}
                            <br />
                            Email: {billingAddress.email}
                            <br />
                            Telephone: {billingAddress.telephone}
                          </address>
                          <p>
                            <Link
                              to={'update-address'}
                              onClick={() => {
                                setIsBillingAddressDefault(true);
                                setIsShippingAddressDefault(false);
                              }}
                            >
                              Change Billing Address
                            </Link>
                          </p>
                        </li>
                        <br />
                        <li className="item">
                          <h4>Default Shipping Address</h4>
                          <address>
                            Name:{' '}
                            {`${shippingAddress.firstName} ${shippingAddress.lastName}`}
                            {shippingAddress.company && (
                              <>
                                <br />
                                Company: {shippingAddress.company}
                              </>
                            )}
                            <br />
                            Country: {shippingAddress.country}
                            {shippingAddress.stateOrProvince && (
                              <>
                                <br />
                                State/Province:{' '}
                                {shippingAddress.stateOrProvince}
                              </>
                            )}
                            <br />
                            Zip code: {shippingAddress.zipCode}
                            <br />
                            City: {shippingAddress.city}
                            <br />
                            Street/Road: {shippingAddress.street}
                            <br />
                            Email: {shippingAddress.email}
                            <br />
                            Telephone: {shippingAddress.telephone}
                          </address>
                          <p>
                            <Link
                              to={'update-address'}
                              onClick={() => {
                                setIsBillingAddressDefault(false);
                                setIsShippingAddressDefault(true);
                              }}
                            >
                              Change Shipping Address
                            </Link>
                          </p>
                        </li>
                      </ol>
                    </div>
                    <div className="col-2 addresses-additional">
                      <h4>Add Billing and Shipping Address</h4>
                      <ol>
                        <li className="item empty1">
                          <p>
                            Add or update your billing or shipping address to
                            your Address Book.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </div>
                  <div className="buttons-set">
                    <p className="back-link">
                      <Link to="/">
                        <small>« </small>Back
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <aside
                className="col-right sidebar col-sm-3 animated"
                style={{ visibility: 'visible' }}
              ></aside>
            </div>
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
};
export default AddressBook;
