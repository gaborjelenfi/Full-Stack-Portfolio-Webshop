import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Content404 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="inner-page">
      <div id="page">
        {/* Main Container */}
        <section className="content-wrapper bounceInUp animated">
          <div className="container">
            <div className="std">
              <div className="page-not-found">
                <h1>404</h1>
                <h3>Oops! The Page you requested was not found!</h3>
                <div>
                  <Link to="/products-list" className="btn-home">
                    <span>Back To Home</span>
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

export default Content404;
