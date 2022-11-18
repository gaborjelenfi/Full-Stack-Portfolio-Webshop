import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validator from 'validator';

function ForgotPassword() {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState({
    email: '',
  });
  const [touched, setTouched] = useState({});
  const invalidEmailErrMsg = 'Please type a valid email address';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Input change handler
  const handleChange = e => {
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value.trim();
    setEmailInput({ ...emailInput, [e.target.name]: value });
  };
  
  /// Validations
  let hasInputError = {};
  let isSubmitBtnDisabled = false;
  if (
    !validator.isEmail(emailInput.email) ||
    validator.isEmpty(emailInput.email)
  ) {
    hasInputError = { ...hasInputError, emailInputError: true };
  }

  if (!(Object.keys(hasInputError).length === 0)) {
    isSubmitBtnDisabled = true;
  }
  /// Validations ends

  return (
    <div className=" customer-account-forgotpassword inner-page">
      <div id="page">
        {/* Main Container */}
        <section className="main-container col1-layout bounceInUp animated">
          <div className="main container">
            <div className="col-main">
              <div className="account-login">
                <div className="page-title">
                  <h1>Forgot Your Password?</h1>
                </div>
                {/*page-title*/}
                <form action="#" method="post" id="form-validate">
                  <fieldset className="col2-set">
                    <strong>Retrieve your password here</strong>
                    <div className="content">
                      <p>
                        Please enter your email address below. You will receive
                        a link to reset your password.
                      </p>
                      <ul className="form-list">
                        <li>
                          <label htmlFor="email_address">
                            Email Address<em className="required">*</em>
                          </label>
                          <div className="input-box">
                            <input
                              onChange={handleChange}
                              value={emailInput.email}
                              title="Email"
                              type="text"
                              name="email"
                              alt="email"
                              id="email_address"
                              className="input-text required-entry validate-email"
                              placeholder="email@forexample.com"
                            />
                            {hasInputError.emailInputError && touched.email && (
                              <p className="required">{invalidEmailErrMsg}</p>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                    {/*content*/}
                    <p className="required">* Required Fields</p>
                    <button
                      disabled={isSubmitBtnDisabled}
                      type="button"
                      title="Submit"
                      className="button submit"
                      onClick={() => navigate('/login')}
                      style={{
                        backgroundColor: isSubmitBtnDisabled ? '#CFD2CF' : '',
                        pointerEvents: isSubmitBtnDisabled ? 'none' : '',
                      }}
                    >
                      <span>Submit</span>
                    </button>
                    <Link to="/login">
                      <small>&emsp;« </small>Back to Login
                    </Link>
                  </fieldset>
                </form>
              </div>
            </div>
            {/*col-main*/}
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
}

export default ForgotPassword;
