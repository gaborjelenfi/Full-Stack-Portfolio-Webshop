import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCustomerStore from '../Store/customerStore';

// payment failed
const Failed = () => {
  const navigate = useNavigate();
  const setRouteAccess = useCustomerStore(state => state.setRouteAccess);
  let timer = 5;
  let timeout = undefined;
  // after 5 sec, route access denied and navigate to checkout page
  timeout = setTimeout(() => {
    navigate('/checkout');
    setRouteAccess(false);
  }, 5000);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate, setRouteAccess]);

  window.onbeforeunload = () => {
    setRouteAccess(false);
  };
  return (
    <div className="inner-page">
      <div id="page">
        {/* Main Container */}
        <section className="content-wrapper bounceInUp animated">
          <div className="container">
            <div className="std">
              <div className="page-not-found">
                <h1 style={{ color: '#ed4337' }}>Failed</h1>
                <h2>
                  Your payment failed!
                  <br /> Please try again.
                </h2>
                <h5>You are going to be redirect in {timer} seconds</h5>
                <br />
                <div>
                  <Link
                    to="/checkout"
                    className="btn-home"
                    onClick={() => {
                      clearTimeout(timeout);
                      navigate('/checkout');
                      setRouteAccess(false)}}
                  >
                    <span>Try Again</span>
                  </Link>
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

export default Failed;
