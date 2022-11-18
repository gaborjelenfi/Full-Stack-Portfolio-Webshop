import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountLogin from '../components/AccountInfo/AccountLogin';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="customer-account-login inner-page">
      <div id="page">
        {/* Main Container */}
        <section className="main-container col1-layout bounceInUp animated">
          <div className="main container">
            <div className="account-login">
              <div className="page-title">
                <h1>Login or Create an Account</h1>
              </div>
              <fieldset className="col2-set">
                <legend>Login or Create an Account</legend>
                <div className="col-1 new-users">
                  <strong>New Customers</strong>
                  <div className="content">
                    <p>
                      By creating an account with our store, you will be able to
                      move through the checkout process faster, store multiple
                      shipping addresses, view and track your orders in your
                      account and more.
                    </p>
                    <div className="buttons-set">
                      <button
                        className="button create-account"
                        onClick={() => navigate('/create-account')}
                      >
                        <span>Create an Account</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-2 registered-users">
                  <strong>Registered Customers</strong>
                  <AccountLogin />
                </div>
              </fieldset>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
};

export default Login;
