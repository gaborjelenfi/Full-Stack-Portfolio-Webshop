import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../Store/adminStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

const AdminPage = () => {
  const navigate = useNavigate();
  
  const URL = useUrlStore(state => state.baseURL);

  const login = useAdminStore(state => state.login);
  const errorMessage = useAdminStore(state => state.errorMessage);
  const setErrorMessage = useAdminStore(state => state.setErrorMessage);
  const isAdminAuth = useAdminStore(state => state.isAdminAuth);

  const validateIsEmail = useValidationStore(state => state.validateIsEmail);
  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsLength = useValidationStore(state => state.validateIsLength);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const invalidEmailErrMsg = 'Please type a valid email address';
  const invalidPasswordErrMsg =
    'Please enter a password of at least 6 characters';

  /// Validations
  const [touched, setTouched] = useState({});
  let hasInputError = {};

  let isLoginBtnDisabled = Object.values(loginData).every(value => {
    if (!value) return true;
    return false;
  });

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
  /// Validations ends

  // Input change handler
  const handleChange = e => {
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value.trim();
    setLoginData({ ...loginData, [e.target.name]: value });
  };

  const loginAdmin = () => {
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
    // Successful login then navigate to admin/dashboard
    if (isAdminAuth) {
      setErrorMessage('');
      navigate('/admin/dashboard');
    }
  }, [isAdminAuth, errorMessage, navigate, setErrorMessage]);

  return (
    <div className="inner-page">
      <div
        id="page"
        style={{
          marginTop: '100px',
        }}
      >
        {/* Main Container */}
        <section className="main-container col1-layout bounceInUp animated">
          <div className="main container" style={{ maxWidth: '500px' }}>
            <div className="account-login">
              <div className="page-title">
                <h1 style={{ textAlign: 'center' }}>
                  Login with your Admin account
                </h1>
              </div>
              <div className="col-2 registered-users">
                <div className="content">
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
                      />
                      {(hasInputError.lengthInputError ||
                        hasInputError.passwordInputError) &&
                        touched.password && (
                          <p className="required">{invalidPasswordErrMsg}</p>
                        )}
                    </li>
                  </ul>
                  {errorMessage && <p className="required">{errorMessage}</p>}
                  <p className="required">* Required Fields</p>
                  <div className="buttons-set">
                    <button
                      disabled={isLoginBtnDisabled}
                      onClick={loginAdmin}
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

export default AdminPage;
