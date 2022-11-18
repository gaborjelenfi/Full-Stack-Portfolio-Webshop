import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../Store/adminStore';
import useProductStore from '../../Store/productStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

function AdminAdmins() {
  const URL = useUrlStore(state => state.baseURL);

  const fetchAllAdmins = useAdminStore(state => state.fetchAllAdmins);
  const allAdmins = useAdminStore(state => state.allAdmins);
  const loggedInAdminData = useAdminStore(state => state.loggedInAdminData);
  const adminId = useAdminStore(state => state.adminId);
  const setPasswordCheckbox = useAdminStore(state => state.setPasswordCheckbox);
  const isPasswordCheckboxChecked = useAdminStore(
    state => state.isPasswordCheckboxChecked
  );
  const graphqlQuery = useAdminStore(state => state.graphqlQuery);
  const setErrorMessage = useAdminStore(state => state.setErrorMessage);
  const errorMessage = useAdminStore(state => state.errorMessage);
  const accessDenied = useAdminStore(state => state.accessDenied);
  const setAccessDenied = useAdminStore(state => state.setAccessDenied);
  const accessErrMsg = useAdminStore(state => state.accessErrMsg);

  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsAlpha = useValidationStore(state => state.validateIsAlpha);
  const validateIsLength = useValidationStore(state => state.validateIsLength);
  const validateIsEmail = useValidationStore(state => state.validateIsEmail);

  const toggleAscDesc = useProductStore(state => state.toggleAscDesc);
  const asc = useProductStore(state => state.asc);

  const emptyNewAdminData = {
    firstName: '',
    lastName: '',
    email: '',
  };
  const emptyPasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  const [editMode, setEditMode] = useState(false);
  const [newAdminData, setNewAdminData] = useState(emptyNewAdminData);
  const [passwordData, setPasswordData] = useState(emptyPasswordData);
  const [selectedId, setSelectedId] = useState(null);
  const [touched, setTouched] = useState({});
  const [isShow, setIsShow] = useState(true);

  const onlyAlphaErrMsg = 'Please type only English alphabetic characters';
  const invalidEmailErrMsg = 'Please type a valid email address';
  const invalidPasswordErrMsg =
    'Please enter a password of at least 6 characters';

  const resetErrAndData = () => {
    setErrorMessage('');
    setPasswordCheckbox(false);
    setAccessDenied(false);
    setTouched({});
    setPasswordData(emptyPasswordData);
  };

  useEffect(() => {
    setAccessDenied(false);
    setErrorMessage('');
    fetchAllAdmins(URL);
  }, [URL, fetchAllAdmins, setErrorMessage, setAccessDenied]);

  allAdmins.sort((a, b) => a.firstName.localeCompare(b.firstName));

  if (!asc) allAdmins.reverse();

  const handleNewAdminChange = e => {
    setAccessDenied(false);
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    // password change is not required but if has changed then set PasswordData with it
    if (
      e.target.name === 'currentPassword' ||
      e.target.name === 'newPassword' ||
      e.target.name === 'confirmNewPassword'
    ) {
      setPasswordData({ ...passwordData, [e.target.name]: value });
    }
    setNewAdminData({
      ...newAdminData,
      [e.target.name]: value,
    });
  };

  /// Validations
  let isCreateBtnDisabled = false;
  let hasInputError = {};

  const isAlphaDatas = [
    { inputKey: 'firstName', data: newAdminData.firstName },
    { inputKey: 'lastName', data: newAdminData.lastName },
  ];
  const isEmptyDatas = [
    ...isAlphaDatas,
    { inputKey: 'email', data: newAdminData.email },
  ];

  hasInputError = { ...hasInputError, ...validateIsAlpha(...isAlphaDatas) };
  hasInputError = { ...hasInputError, ...validateIsEmpty(...isEmptyDatas) };
  hasInputError = { ...hasInputError, ...validateIsEmail(newAdminData.email) };
  if (!editMode) {
    hasInputError = {
      ...hasInputError,
      ...validateIsLength(passwordData.newPassword),
    };
  }

  if (isPasswordCheckboxChecked && editMode) {
    hasInputError = {
      ...hasInputError,
      ...validateIsEmpty({
        inputKey: 'password',
        data: passwordData.currentPassword,
      }),
    };
    hasInputError = {
      ...hasInputError,
      ...validateIsLength(passwordData.newPassword),
    };
  }

  if (passwordData.newPassword !== passwordData.confirmNewPassword) {
    hasInputError = { ...hasInputError, confirmNewPasswordInputError: true };
  }

  if (!(Object.keys(hasInputError).length === 0)) {
    isCreateBtnDisabled = true;
  }
  /// Validations ends

  const createNewAdmin = async () => {
    const createAdminMutation = {
      query: `mutation CreateAdmin{
        createAdmin(
          firstName: "${newAdminData.firstName}", 
          lastName: "${newAdminData.lastName}", 
          email: "${newAdminData.email}",
          password: "${newAdminData.confirmNewPassword}") {
            _id
            firstName
            lastName
            email
            password
            mainAdmin
          }
        }`,
    };
    await graphqlQuery(createAdminMutation, URL);
    fetchAllAdmins(URL);
    setNewAdminData(emptyNewAdminData);
    setPasswordData(emptyPasswordData);
    setTouched({});
  };
  const editAdmin = id => {
    window.scrollTo(0, 0);
    resetErrAndData();
    setEditMode(true);
    setIsShow(true);
    const [selectedAdmin] = allAdmins.filter(item => item._id === id);

    setNewAdminData({
      _id: selectedAdmin._id,
      firstName: selectedAdmin.firstName,
      lastName: selectedAdmin.lastName,
      email: selectedAdmin.email,
    });
  };

  const cancelEditAdmin = () => {
    resetErrAndData();
    setEditMode(false);
    setIsShow(false);
    setNewAdminData(emptyNewAdminData);
  };

  const saveEditAdminData = async () => {
    let updateAdmin = `mutation UpdateAdmin{
        updateAdmin(
            id: "${newAdminData._id}",
            firstName: "${newAdminData.firstName}",
            lastName: "${newAdminData.lastName}",
            email: "${newAdminData.email}"`;
    if (isPasswordCheckboxChecked) {
      updateAdmin += `,
                currentPassword: "${passwordData.currentPassword}",
                confirmNewPassword: "${passwordData.confirmNewPassword}"`;
    }
    // return data from mutation response
    const updateAdminMutation = {
      query: `${updateAdmin}
              )
                {
                _id
                firstName
                lastName
                email
                password
                mainAdmin
                }
            }`,
    };

    await graphqlQuery(updateAdminMutation, URL);
    fetchAllAdmins(URL);
    if (!errorMessage) {
      cancelEditAdmin();
    }
  };

  const deleteAdmin = async id => {
    setSelectedId(id);
    const DeleteAdminMutation = {
      query: `mutation DeleteAdmin{
        deleteAdmin(id: "${id}") {
          _id
        }
      }`,
    };
    await graphqlQuery(DeleteAdminMutation, URL);
    fetchAllAdmins(URL);
  };
  
  return (
    <>
      <div className="customer-account-index customer-account inner-page">
        <div id="page">
          {/* Main Container */}
          <section
            className="main-container col2-right-layout"
            style={{ minHeight: '0px' }}
          >
            <div className="main container">
              <div className="row">
                <div
                  className="col-main col-sm-9 animated"
                  style={{ visibility: 'visible' }}
                >
                  <div className="page-title">
                    {loggedInAdminData.mainAdmin && (
                      <div className="title-buttons">
                        <Link
                          onClick={() => setIsShow(!isShow)}
                          to={`${window.location.pathname}${window.location.search}`}
                          style={{
                            textDecoration: 'none',
                            float: 'right',
                            fontSize: '14px',
                          }}
                        >
                          {isShow ? 'Hide' : 'Show'}{' '}
                        </Link>{' '}
                      </div>
                    )}
                    <h1>Admins</h1>
                  </div>
                  <div className="line" />
                  {((loggedInAdminData.mainAdmin && isShow) ||
                    (editMode && isShow)) && (
                    <div className="dashboard">
                      <form action="#" method="post" id="form-validate">
                        <div className="fieldset">
                          <input
                            type="hidden"
                            defaultValue="bO6ubPokBJ71l86o"
                          />
                          <h2 className="legend">Sign up new Admin</h2>
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
                                      onChange={handleNewAdminChange}
                                      value={newAdminData.firstName}
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
                                      onChange={handleNewAdminChange}
                                      value={newAdminData.lastName}
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
                                  onChange={handleNewAdminChange}
                                  value={newAdminData.email}
                                  type="text"
                                  name="email"
                                  id="email"
                                  placeholder="email@forexample"
                                  title="Email Address"
                                  className="input-text required-entry validate-email"
                                />
                                {errorMessage &&
                                  errorMessage !== 'Wrong password' && errorMessage !== 'notAuthenticated is not defined' && (
                                    <p className="required">{errorMessage}</p>
                                  )}
                                {hasInputError.emailInputError &&
                                  touched.email && (
                                    <p className="required">
                                      {invalidEmailErrMsg}
                                    </p>
                                  )}
                              </div>
                            </li>
                          </ul>
                        </div>
                        {editMode ? (
                          <>
                            <li
                              className="control"
                              style={{ listStyle: 'none' }}
                            >
                              <input
                                type="checkbox"
                                name="changePasswordCheckbox"
                                id="change_password"
                                checked={isPasswordCheckboxChecked}
                                onChange={() =>
                                  setPasswordCheckbox(
                                    !isPasswordCheckboxChecked
                                  )
                                }
                                title="Change Password"
                                className="checkbox"
                              />
                              <label
                                htmlFor="change_password"
                                style={{ marginLeft: ' 10px' }}
                              >
                                Change Password
                              </label>
                            </li>
                            <div
                              className="fieldset"
                              style={{
                                display: isPasswordCheckboxChecked
                                  ? 'block'
                                  : 'none',
                              }}
                            >
                              <h2 className="legend">Change Password</h2>
                              <ul className="form-list">
                                <li>
                                  <label htmlFor="current_password">
                                    Current Password
                                    <em className="required">*</em>
                                  </label>
                                  <div className="input-box">
                                    <input
                                      onChange={handleNewAdminChange}
                                      value={passwordData.currentPassword}
                                      type="password"
                                      title="Current Password"
                                      className="input-text"
                                      name="currentPassword"
                                      id="current_password"
                                      autoComplete="off"
                                    />
                                    {errorMessage &&
                                      errorMessage === 'Wrong password' && (
                                        <p className="required">
                                          {errorMessage}
                                        </p>
                                      )}
                                  </div>
                                </li>
                                <li className="fields">
                                  <div className="field">
                                    <label htmlFor="password">
                                      New Password
                                      <em className="required">*</em>
                                    </label>
                                    <div className="input-box">
                                      <input
                                        onChange={handleNewAdminChange}
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
                                          <p className="required">
                                            {invalidPasswordErrMsg}
                                          </p>
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
                                        onChange={handleNewAdminChange}
                                        value={passwordData.confirmNewPassword}
                                        type="password"
                                        title="Confirm New Password"
                                        className="input-text validate-cpassword"
                                        name="confirmNewPassword"
                                        id="confirmation"
                                        autoComplete="off"
                                      />
                                      {hasInputError.confirmNewPasswordInputError && (
                                        <p className="required">
                                          Passwords have to be equal
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </>
                        ) : (
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
                                    Password<em className="required">*</em> (min
                                    6 characters)
                                  </label>
                                  <div className="input-box">
                                    <input
                                      onChange={handleNewAdminChange}
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
                                      onChange={handleNewAdminChange}
                                      value={passwordData.confirmNewPassword}
                                      type="password"
                                      title="Confirm New Password"
                                      className="input-text validate-cpassword"
                                      name="confirmNewPassword"
                                      id="confirmation"
                                      autoComplete="off"
                                    />
                                    {hasInputError.confirmNewPasswordInputError && (
                                      <p className="required">
                                        Passwords have to be equal
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        )}
                        <p className="required">* Required Fields</p>
                        {editMode ? (
                          <>
                            <div
                              className="buttons-set"
                              style={{ float: 'left' }}
                            >
                              <button
                                disabled={isCreateBtnDisabled}
                                onClick={saveEditAdminData}
                                type="button"
                                title="Save"
                                className="button"
                                style={{
                                  borderColor: '#A6D785',
                                  backgroundColor: isCreateBtnDisabled
                                    ? '#CFD2CF'
                                    : '',
                                  pointerEvents: isCreateBtnDisabled
                                    ? 'none'
                                    : '',
                                }}
                              >
                                <span>Save</span>
                              </button>
                            </div>
                            <div
                              className="buttons-set"
                              style={{ float: 'right' }}
                            >
                              <button
                                onClick={cancelEditAdmin}
                                type="button"
                                title="Cancel"
                                className="button"
                              >
                                <span>Cancel</span>
                              </button>
                            </div>
                            <br />
                          </>
                        ) : (
                          <div className="buttons-set">
                            <button
                              disabled={isCreateBtnDisabled}
                              onClick={createNewAdmin}
                              type="button"
                              title="Create"
                              className="button"
                              style={{
                                backgroundColor: isCreateBtnDisabled
                                  ? '#CFD2CF'
                                  : '',
                                pointerEvents: isCreateBtnDisabled
                                  ? 'none'
                                  : '',
                              }}
                            >
                              <span>Create</span>
                            </button>
                          </div>
                        )}
                        <br />
                      </form>
                      <br />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div
        id="sort-by"
        style={{
          float: 'left',
        }}
      >
        <Link
          onClick={() => toggleAscDesc(!asc)}
          className="button-asc left"
          to="./"
          title="Set Descending Direction"
        >
          <span className={asc ? 'top_arrow' : 'buttom_arrow'} />
        </Link>{' '}
      </div>
      <div
        className="box-content box-category"
        style={{ width: '100%', margin: '30px' }}
      >
        <div className="table-responsive">
          <table className="data-table" id="my-orders-table">
            <colgroup>
              <col />
              <col />
              <col />
              <col width={1} />
              <col width={1} />
              <col width={1} />
            </colgroup>
            <thead>
              <tr className="first last">
                <th>Ordered Products</th>
              </tr>
            </thead>
            <tbody>
              {allAdmins?.length ? (
                allAdmins?.map(a => (
                  <tr key={a._id} className="first odd">
                    <td
                      style={{
                        lineHeight: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {' '}
                      {(adminId === a._id || loggedInAdminData.mainAdmin) &&
                        !a.isDeleted && (
                          <button
                            onClick={() => editAdmin(a._id)}
                            disabled={false}
                            className="button"
                            name="edit"
                            title="Edit admin"
                            type="button"
                            style={{
                              borderColor: '#0095EF',
                              marginRight: 'auto',
                            }}
                          >
                            <span>Edit</span>
                          </button>
                        )}{' '}
                      <ol
                        className="products-list"
                        id="products-list"
                        style={{
                          textAlign: 'center',
                          marginTop: '0',
                          margin: 'auto',
                        }}
                      >
                        <li>
                          <h4>{`${a.firstName} ${a.lastName}`}</h4>
                          <h6 className="product-name">{a.email}</h6>
                          {a.isDeleted && (
                            <h6
                              className="product-name"
                              style={{ color: '#FE433C' }}
                            >
                              Deleted Account
                            </h6>
                          )}
                        </li>
                      </ol>
                      {(adminId === a._id || loggedInAdminData.mainAdmin) &&
                        !a.isDeleted && (
                          <div style={{ marginLeft: 'auto' }}>
                            <button
                              onClick={() => deleteAdmin(a._id)}
                              disabled={false}
                              className="button"
                              name="delete"
                              title="Delete manufacturer"
                              type="button"
                              style={{
                                borderColor: '#FE433C',
                              }}
                            >
                              <span>Delete</span>
                            </button>
                            {selectedId === a._id && accessDenied && (
                              <p style={{ color: '#FE433C' }}>{accessErrMsg}</p>
                            )}
                          </div>
                        )}{' '}
                      <ul
                        className="level0_415"
                        style={{
                          display: 'block',
                        }}
                      ></ul>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>
                    <p>No Admin found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminAdmins;
