import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useCustomerStore from '../Store/customerStore';

function AccountInformation() {
  const logout = useCustomerStore(state => state.logout);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
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
                  {/*dashboard*/}
                </div>
              </div>
              <aside
                className="col-right sidebar col-sm-3 animated"
                style={{ visibility: 'visible' }}
              >
                <div className="block block-account">
                  <div className="block-title"> My Account </div>
                  <div className="block-content">
                    <ul>
                      <li
                        className={
                          location.pathname ===
                          '/account-information/edit-account'
                            ? 'current'
                            : ''
                        }
                      >
                        <Link to="./edit-account">
                          <span>Edit Account Information</span>
                        </Link>
                      </li>
                      <li
                        className={
                          location.pathname ===
                          '/account-information/address-book'
                            ? 'current'
                            : ''
                        }
                      >
                        <Link to="./address-book">
                          <span> Address Book</span>
                        </Link>
                      </li>
                      <li
                        className={
                          location.pathname ===
                          '/account-information/account-dashboard'
                            ? 'current'
                            : ''
                        }
                      >
                        <Link to="./account-dashboard">
                          <span> Account Dashboard</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/products-list">
                          <span onClick={logout}> Log out</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/*block-content*/}
                </div>
                {/*block block-account*/}
              </aside>
              {/*col-right sidebar col-sm-3*/}
            </div>
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
}

export default AccountInformation;
