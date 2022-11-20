import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUrlStore from '../Store/urlStore';
import useCustomerStore from '../Store/customerStore';
import useValidationStore from '../Store/validationStore';

const CreateAccount = () => {
  const navigate = useNavigate();
  
  const URL = useUrlStore(state => state.baseURL);
  
  const signUpCustomer = useCustomerStore(state => state.signUpCustomer);
  const login = useCustomerStore(state => state.login);
  const isAuth = useCustomerStore(state => state.isAuth);
  const errorMessage = useCustomerStore(state => state.errorMessage);
  const setErrorMessage = useCustomerStore(state => state.setErrorMessage);

  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsAlpha = useValidationStore(state => state.validateIsAlpha);
  const validateIsEmail = useValidationStore(state => state.validateIsEmail);
  const validateIsLength = useValidationStore(state => state.validateIsLength);
  
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const onlyAlphaErrMsg = 'Please type only English alphabetic characters';
  const invalidEmailErrMsg = 'Please type a valid email address';
  const invalidPasswordErrMsg =
  'Please enter a password of at least 6 characters';
  
  /// Validations
  const [touched, setTouched] = useState({});
  let hasInputError = {};
  let isCreateBtnDisabled = false;

  const isAlphaDatas = [
    { inputKey: 'firstName', data: customerData.firstName },
    { inputKey: 'lastName', data: customerData.lastName },
  ];

  const isEmptyDatas = [
    ...isAlphaDatas,
    { inputKey: 'email', data: customerData.email },
    { inputKey: 'password', data: customerData.password },
  ];

  hasInputError = { ...hasInputError, ...validateIsAlpha(...isAlphaDatas) };
  hasInputError = { ...hasInputError, ...validateIsEmpty(...isEmptyDatas) };
  hasInputError = { ...hasInputError, ...validateIsEmail(customerData.email) };
  hasInputError = {
    ...hasInputError,
    ...validateIsLength(customerData.password),
  };

  if (customerData.password !== customerData.confirmPassword) {
    hasInputError = { ...hasInputError, confirmPasswordInputError: true };
  }

  if (!(Object.keys(hasInputError).length === 0)) {
    isCreateBtnDisabled = true;
  }
  /// Validations ends

  // Input change handler
  const handleChange = e => {
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    setCustomerData({ ...customerData, [e.target.name]: value });
  };

  const createCustomer = async () => {
    const createCustomerMutation = {
      query: `mutation SignUpCustomer{
            createCustomer(
                firstName: "${customerData.firstName}", 
                lastName: "${customerData.lastName}", 
                email: "${customerData.email}", 
                password: "${customerData.password}") {
                  _id
                }
              }`,
    };
    try {
      await signUpCustomer(createCustomerMutation, URL);
      // after successful sign up, login the customer automatically
      await login(customerData.email, customerData.password, URL);
    } catch (error) {
      setErrorMessage(error.message);
      setCustomerData({ ...customerData, email: '' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // after successful login, reset customer sign up data and navigate to products
    if (isAuth) {
      setTouched({});
      setCustomerData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      navigate('/products-list');
    }
  }, [isAuth, navigate]);

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
                <div className="page-title">
                  <h1>Create Account</h1>
                </div>
                <div className="line" />
                <div className="dashboard">
                  <form action="#" method="post" id="form-validate">
                    <div className="fieldset">
                      <input
                        type="hidden"
                        defaultValue="bO6ubPokBJ71l86o"
                      />
                      <h2 className="legend">Account Information</h2>
                      <ul className="form-list">
                        <li className="fields">
                          <div className="customer-name">
                            <div className="input-box name-firstname">
                              <label htmlFor="firstname">
                                First Name
                                <span className="required">*</span>
                              </label>
                              <div className="input-box1">
                                <input
                                  onChange={handleChange}
                                  value={customerData.firstName}
                                  autoFocus
                                  type="text"
                                  id="firstname"
                                  name="firstName"
                                  placeholder="First Name"
                                  title="First name"
                                  maxLength={255}
                                  className="input-text required-entry"
                                />
                                {hasInputError.firstNameInputError &&
                                  touched.firstName && (
                                    <p className="required">
                                      {onlyAlphaErrMsg}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="input-box name-lastname">
                              <label htmlFor="lastname">
                                Last Name<span className="required">*</span>
                              </label>
                              <div className="input-box1">
                                <input
                                  onChange={handleChange}
                                  value={customerData.lastName}
                                  type="text"
                                  id="lastname"
                                  name="lastName"
                                  placeholder="Last Name"
                                  title="Last name"
                                  maxLength={255}
                                  className="input-text required-entry"
                                />
                                {hasInputError.lastNameInputError &&
                                  touched.lastName && (
                                    <p className="required">
                                      {onlyAlphaErrMsg}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <label htmlFor="email">
                            Email Address<em className="required">*</em>
                          </label>
                          <div className="input-box">
                            <input
                              onChange={handleChange}
                              value={customerData.email}
                              type="text"
                              name="email"
                              id="email"
                              placeholder="email@forexample"
                              title="Email Address"
                              className="input-text required-entry validate-email"
                            />
                            {errorMessage && (
                              <p className="required">{errorMessage}</p>
                            )}
                            {hasInputError.emailInputError && touched.email && (
                              <p className="required">{invalidEmailErrMsg}</p>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="fieldset"
                      style={{
                        display: 'block',
                      }}
                    >
                      <h2 className="legend">Add Password</h2>
                      <ul className="form-list">
                        <li className="fields">
                          <div className="field">
                            <label htmlFor="password">
                              Password<em className="required">*</em> (min 6
                              characters)
                            </label>
                            <div className="input-box">
                              <input
                                onChange={handleChange}
                                value={customerData.password}
                                type="password"
                                title="New Password"
                                className="input-text validate-password"
                                name="password"
                                id="password"
                                autoComplete='off'
                              />
                              {(hasInputError.lengthInputError ||
                                hasInputError.passwordInputError) &&
                                touched.password && (
                                  <p className="required">
                                    {invalidPasswordErrMsg}
                                  </p>
                                )}
                            </div>
                          </div>
                          <div className="field">
                            <label htmlFor="confirmation">
                              Confirm Password
                              <em className="required">*</em>
                            </label>
                            <div className="input-box">
                              <input
                                onChange={handleChange}
                                value={customerData.confirmPassword}
                                type="password"
                                title="Confirm New Password"
                                className="input-text validate-cpassword"
                                name="confirmPassword"
                                id="confirmation"
                                autoComplete='off'
                              />
                              {hasInputError.confirmPasswordInputError && (
                                <p className="required">
                                  Passwords have to be equal
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="buttons-set">
                      <p className="required">* Required Fields</p>
                      <button
                        disabled={isCreateBtnDisabled}
                        onClick={createCustomer}
                        type="button"
                        title="Create"
                        className="button"
                        style={{
                          backgroundColor: isCreateBtnDisabled ? '#CFD2CF' : '',
                          pointerEvents: isCreateBtnDisabled ? 'none' : '',
                        }}
                      >
                        <span>Create</span>
                      </button>
                      <Link to="/login">
                        <small>&emsp;« </small>Back
                      </Link>{' '}
                    </div>
                    <br />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateAccount;
