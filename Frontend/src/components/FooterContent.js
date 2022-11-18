import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useValidationStore from '../Store/validationStore';

const FooterContent = () => {
  const validateIsEmail = useValidationStore(state => state.validateIsEmail);
  
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState({
    email: '',
  });

  const invalidEmailErrMsg = 'Please type a valid email address';
  
  /// Validations
  let hasInputError = {};
  let subscribeBtn = false;
  const [touched, setTouched] = useState({});
  hasInputError = { ...validateIsEmail(emailInput.email) };
  /// Validations ends

  const handleChange = e => {
    setTouched({ [e.target.name]: true });
    const value = e.target.value;
    setEmailInput({ [e.target.name]: value });
  };

  return (
    <footer>
      <div className="footer-inner">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-xs-12 col-lg-8">
              <div className="footer-column pull-left">
                <h4>CUSTOMMER SERVICE</h4>
                <ul className="links">
                  <li className="first">
                    <Link
                      to={'/account-information/edit-account'}
                      title="My account"
                    >
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={'/account-information/account-dashboard'}
                      title="Account dashboard"
                    >
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link to={'./'} title="faq">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to={'./'} title="Specials">
                      Specials
                    </Link>
                  </li>
                  <li className="last">
                    <Link to={'./'} title="Where is my order?">
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="footer-column pull-left">
                <h4>Corporation</h4>
                <ul className="links">
                  <li className="first">
                    <Link title="About us" to={'./'}>
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link title="Information" to={'./'}>
                      Customer Service
                    </Link>
                  </li>
                  <li>
                    <Link title="Company" to={'./'}>
                      Company
                    </Link>
                  </li>
                  <li>
                    <Link title="Addresses" to={'./'}>
                      Investor Relations
                    </Link>
                  </li>
                  <li className="last">
                    <Link title="Search" to={'./'}>
                      Advanced Search
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="footer-column pull-left">
                <h4>Why choose Us</h4>
                <ul className="links">
                  <li className="first">
                    <Link to={'./'} title="Guide">
                      Shopping Guide
                    </Link>
                  </li>
                  <li>
                    <Link to={'./'} title="FAQ">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to={'./'} title="Company">
                      Company
                    </Link>
                  </li>
                  <li>
                    <Link to={'./'} title="Investor Relations">
                      Investor Relations
                    </Link>
                  </li>
                  <li>
                    {' '}
                    <Link to={'./'} title="Suppliers">
                      Suppliers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xs-12 col-lg-4">
              <div className="footer-column-last">
                <div className="newsletter-wrap">
                  <h4>Sign up for emails</h4>
                  {!subscribed ? (
                    <form id="newsletter-validate-detail" action="#">
                      <div id="container_form_news">
                        <div id="container_form_news2">
                          <input
                            onChange={handleChange}
                            value={emailInput.email}
                            type="text"
                            className="input-text required-entry validate-email"
                            placeholder="Enter your email address"
                            title="Sign up for our newsletter"
                            id="newsletter"
                            name="email"
                          />
                          <button
                            disabled={subscribeBtn}
                            className="button subscribe"
                            title="Subscribe"
                            type="button"
                            onClick={() => setSubscribed(true)}
                            style={{
                              backgroundColor: subscribeBtn ? '#CFD2CF' : '',
                              pointerEvents: subscribeBtn ? 'none' : '',
                            }}
                          >
                            <span>Subscribe</span>
                          </button>
                          {hasInputError.emailInputError && touched.email && (
                            <p className="required">{invalidEmailErrMsg}</p>
                          )}
                        </div>
                      </div>
                    </form>
                  ) : (
                    <h5>You have successfully subscribed</h5>
                  )}
                </div>
                <br />
                <div className="social">
                  <h4>Follow Us</h4>
                  <ul className="link">
                    <li className="fb pull-left">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {' '}
                      </a>
                    </li>
                    <li className="tw pull-left">
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {' '}
                      </a>
                    </li>
                    <li className="googleplus pull-left">
                      <a
                        href="https://google.com"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {' '}
                      </a>
                    </li>
                    <li className="rss pull-left">
                      <a
                        href="https://rss.com"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {' '}
                      </a>
                    </li>
                    <li className="pintrest pull-left">
                      <a
                        href="https://pinterest.com"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {' '}
                      </a>
                    </li>
                    <li className="linkedin pull-left">
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {' '}
                      </a>
                    </li>
                    <li className="youtube pull-left">
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {' '}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="col-sm-12 col-xs-12 footer-logo">
            <img crossOrigin='anonymous' alt="Datson" src="/images/logo.png" />
          </div>
          <address>
            <i className="fa fa-map-marker" />
            1165 Budapest, Hungary <i className="fa fa-mobile" />
            <span> +(888) 123-4567</span> <i className="fa fa-envelope" />
            <span> gabor.jelenfi@gmail.com</span>
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-xs-12 coppyright">
              © 2022 ThemesGround. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterContent;
