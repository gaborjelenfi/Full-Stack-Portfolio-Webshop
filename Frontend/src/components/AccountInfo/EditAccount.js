import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCustomerStore from '../../Store/customerStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

const EditAccount = () => {
  const navigate = useNavigate();

  const URL = useUrlStore(state => state.baseURL);

  const customerId = useCustomerStore(state => state.customerId);
  const isAuth = useCustomerStore(state => state.isAuth);
  const logout = useCustomerStore(state => state.logout);
  const editAccount = useCustomerStore(state => state.editAccount);
  const fetchCustomerData = useCustomerStore(state => state.fetchCustomerData);
  const errorMessage = useCustomerStore(state => state.errorMessage);
  const setErrorMessage = useCustomerStore(state => state.setErrorMessage);
  const isPasswordCheckboxChecked = useCustomerStore(
    state => state.isPasswordCheckboxChecked
  );
  const setPasswordCheckbox = useCustomerStore(
    state => state.setPasswordCheckbox
  );

  const validateIsAlpha = useValidationStore(state => state.validateIsAlpha);
  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsEmail = useValidationStore(state => state.validateIsEmail);
  const validateIsLength = useValidationStore(state => state.validateIsLength);
  
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [touched, setTouched] = useState({});
  let hasInputError = {};
  const onlyAlphaErrMsg = 'Please type only English alphabetic characters';
  const invalidEmailErrMsg = 'Please type a valid email address';
  const invalidPasswordErrMsg =
    'Please enter a password of at least 6 characters';
  let isSaveBtnDisabled = false;

  useEffect(() => {
    // if not authenticated then navigate to login page
    if (!isAuth || !customerId) {
      logout();
      navigate('./login');
    }
  }, [customerId, isAuth, logout, navigate]);


  /// Validation
  const isAlphaDatas = [
    { inputKey: 'firstName', data: customerData.firstName },
    { inputKey: 'lastName', data: customerData.lastName },
  ];
  const isEmptyDatas = [
    ...isAlphaDatas,
    { inputKey: 'email', data: customerData.email },
  ];

  hasInputError = { ...hasInputError, ...validateIsAlpha(...isAlphaDatas) };
  hasInputError = { ...hasInputError, ...validateIsEmpty(...isEmptyDatas) };
  hasInputError = { ...hasInputError, ...validateIsEmail(customerData.email) };

  if (isPasswordCheckboxChecked) {
    hasInputError = {
      ...hasInputError,
      ...validateIsLength(passwordData.newPassword),
    };
  }

  if (passwordData.newPassword !== passwordData.confirmNewPassword) {
    hasInputError = { ...hasInputError, confirmNewPasswordInputError: true };
  }

  if (!(Object.keys(hasInputError).length === 0)) {
    isSaveBtnDisabled = true;
  }
  /// Validations ends

  // input change handler
  const handleChange = e => {
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    // password change is not required, but if it is changed then save to PasswordData state
    if (
      e.target.name === 'currentPassword' ||
      e.target.name === 'newPassword' ||
      e.target.name === 'confirmNewPassword'
    ) {
      setPasswordData({ ...passwordData, [e.target.name]: value });
    }
    setCustomerData({ ...customerData, [e.target.name]: value });
  };

  const updateCustomer = async () => {
    let updateCustomerQueryString = `mutation EditAccount{
      updateCustomer(
        id:"${customerId}", 
        firstName: "${customerData.firstName}", 
        lastName:"${customerData.lastName}",
        email:"${customerData.email}"`;
    if (isPasswordCheckboxChecked) {
      updateCustomerQueryString += `,
        currentPassword: "${passwordData.currentPassword}",
        confirmNewPassword: "${passwordData.confirmNewPassword}"`;
    }
    const updateCustomerQuery = {
      query: `${updateCustomerQueryString}
          ) 
            {
              _id
              firstName
              lastName
              email
              password
            }
      }`,
    };

    await editAccount(updateCustomerQuery, URL);
    await fetchCustomerData(URL);
    // If update wass successful then reset the inputs and navigate away.
    if (!errorMessage) {
      setTouched({});
      setPasswordCheckbox(false);
      navigate('/');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setErrorMessage('');
  }, [setErrorMessage]);

  return (
    <>
      <br />
      <div className="page-title">
        <h1>Edit Account Information</h1>
      </div>
      <div className="line" />
      <div className="dashboard">
        <form action="#" method="post" id="form-validate">
          <div className="fieldset">
            <input type="hidden" defaultValue="bO6ubPokBJ71l86o" />
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
                        placeholder="Enter your first name"
                        title="First name"
                        maxLength={255}
                        className="input-text required-entry"
                      />
                      {hasInputError.firstNameInputError &&
                        touched.firstName && (
                          <p className="required">{onlyAlphaErrMsg}</p>
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
                        placeholder="Enter your last name"
                        title="Last name"
                        maxLength={255}
                        className="input-text required-entry"
                      />
                      {hasInputError.lastNameInputError && touched.lastName && (
                        <p className="required">{onlyAlphaErrMsg}</p>
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
                    placeholder="Enter your email address"
                    title="Email Address"
                    className="input-text required-entry validate-email"
                  />
                  {hasInputError.emailInputError && touched.email && (
                    <p className="required">{invalidEmailErrMsg}</p>
                  )}
                </div>
              </li>
              <li className="control">
                <input
                  type="checkbox"
                  name="changePasswordCheckbox"
                  id="change_password"
                  checked={isPasswordCheckboxChecked}
                  onChange={() =>
                    setPasswordCheckbox(!isPasswordCheckboxChecked)
                  }
                  title="Change Password"
                  className="checkbox"
                />
                <label htmlFor="change_password">Change Password</label>
              </li>
            </ul>
          </div>
          <div
            className="fieldset"
            style={{
              display: isPasswordCheckboxChecked ? 'block' : 'none',
            }}
          >
            <h2 className="legend">Change Password</h2>
            <ul className="form-list">
              <li>
                <label htmlFor="current_password">
                  Current Password<em className="required">*</em>
                </label>
                <div className="input-box">
                  <input
                    onChange={handleChange}
                    value={passwordData.currentPassword}
                    type="password"
                    title="Current Password"
                    className="input-text"
                    name="currentPassword"
                    id="current_password"
                    autoComplete="off"
                  />
                </div>
              </li>
              <li className="fields">
                <div className="field">
                  <label htmlFor="password">
                    New Password<em className="required">*</em>
                  </label>
                  <div className="input-box">
                    <input
                      onChange={handleChange}
                      value={passwordData.newPassword}
                      type="password"
                      title="New Password"
                      className="input-text validate-password"
                      name="newPassword"
                      id="password"
                      autoComplete="off"
                    />
                    {(hasInputError.lengthInputError ||
                      hasInputError.newPasswordInputError) &&
                      touched.newPassword && (
                        <p className="required">{invalidPasswordErrMsg}</p>
                      )}
                  </div>
                </div>
                <br />
                <div className="field">
                  <label htmlFor="confirmation">
                    Confirm New Password
                    <em className="required">*</em>
                  </label>
                  <div className="input-box">
                    <input
                      onChange={handleChange}
                      value={passwordData.confirmNewPassword}
                      type="password"
                      title="Confirm New Password"
                      className="input-text validate-cpassword"
                      name="confirmNewPassword"
                      id="confirmation"
                      autoComplete="off"
                    />
                    {hasInputError.confirmNewPasswordInputError && (
                      <p className="required">Passwords have to be equal</p>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="buttons-set">
            <p className="required">* Required Fields</p>
            <p className="required">{errorMessage}</p>
            <button
              disabled={isSaveBtnDisabled}
              onClick={updateCustomer}
              type="button"
              title="Save"
              className="button"
              style={{
                backgroundColor: isSaveBtnDisabled ? '#CFD2CF' : '',
                pointerEvents: isSaveBtnDisabled ? 'none' : '',
              }}
            >
              <span>Save</span>
            </button>
            <Link to="/" onClick={() => setPasswordCheckbox(false)}>
              <small>« </small>Back
            </Link>{' '}
          </div>
        </form>
      </div>
      <br />
    </>
  );
};

export default EditAccount;
