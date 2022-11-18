import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useCustomerStore from '../../Store/customerStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

const AccountLogin = () => {
  const navigate = useNavigate();
  const URL = useUrlStore(state => state.baseURL);

  const login = useCustomerStore(state => state.login);
  const errorMessage = useCustomerStore(state => state.errorMessage);
  const setErrorMessage = useCustomerStore(state => state.setErrorMessage);
  const isAuth = useCustomerStore(state => state.isAuth);

  const validateIsEmail = useValidationStore(state => state.validateIsEmail);
  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsLength = useValidationStore(state => state.validateIsLength);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  /// Validation
  const [touched, setTouched] = useState({});
  let hasInputError = {};
  const invalidEmailErrMsg = 'Please type a valid email address';
  const invalidPasswordErrMsg =
    'Please enter a password of at least 6 characters';

  let isLoginBtnDisabled = false;

  const isEmptyDatas = [
    { inputKey: 'email', data: loginData.email },
    { inputKey: 'password', data: loginData.password },
  ];

  hasInputError = { ...hasInputError, ...validateIsEmpty(...isEmptyDatas) };
  hasInputError = { ...hasInputError, ...validateIsLength(loginData.password) };
  hasInputError = { ...hasInputError, ...validateIsEmail(loginData.email) };

  if (!(Object.keys(hasInputError).length === 0)) {
    isLoginBtnDisabled = true;
  }
  /// Validation ends

  // Input change handler
  const handleChange = e => {
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value.trim();
    setLoginData({ ...loginData, [e.target.name]: value });
  };

  const loginCustomer = () => {
    login(loginData.email, loginData.password, URL);

    if (!errorMessage) {
      setTouched({});
      setLoginData({
        email: '',
        password: '',
      });
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [setErrorMessage]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (errorMessage) setLoginData({ email: '', password: '' });
    // if login was successful, navigate to products
    if (isAuth) {
      setErrorMessage('');
      navigate('/products-list');
    }
  }, [isAuth, errorMessage, navigate, setErrorMessage]);

  return (
    <div className="content">
      <p>If you have an account with us, please log in.</p>
          <form action="#">
      <ul className="form-list">
        <li>
          <label htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <br />
          <input
            onChange={handleChange}
            value={loginData.email}
            autoFocus
            type="text"
            title="Email"
            className="input-text"
            id="email"
            placeholder="email@forexample.com"
            name="email"
          />
          {hasInputError.emailInputError && touched.email && (
            <p className="required">{invalidEmailErrMsg}</p>
          )}
        </li>
        <li>
          <label htmlFor="pass">
            Password <span className="required">*</span>
          </label>
          <br />
          <input
            onChange={handleChange}
            value={loginData.password}
            type="password"
            title="Password"
            id="pass"
            className="input-text"
            name="password"
            autoComplete='off'
          />
          {(hasInputError.lengthInputError ||
            hasInputError.passwordInputError) &&
            touched.password && (
              <p className="required">{invalidPasswordErrMsg}</p>
            )}
        </li>
      </ul>
      </form>
      {errorMessage && <p className="required">{errorMessage}</p>}
      <p className="required">* Required Fields</p>
      <div className="buttons-set">
        <button
          disabled={isLoginBtnDisabled}
          onClick={loginCustomer}
          id="send2"
          name="login"
          type="button"
          className="button login"
          style={{
            backgroundColor: isLoginBtnDisabled ? '#CFD2CF' : '',
            pointerEvents: isLoginBtnDisabled ? 'none' : '',
          }}
        >
          <span>Login</span>
        </button>
        <Link className="forgot-word" to="/forgot-password">
          Forgot Your Password?
        </Link>{' '}
      </div>
    </div>
  );
};

export default AccountLogin;
