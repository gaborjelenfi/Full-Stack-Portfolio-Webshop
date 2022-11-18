import AddressInputForm from '../InputForm/AddressInputForm';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUrlStore from '../../Store/urlStore';
import useCustomerStore from '../../Store/customerStore';
import useValidationStore from '../../Store/validationStore';

const UpdateAddress = () => {
  const navigate = useNavigate();
  
  const URL = useUrlStore(state => state.baseURL);

  const customerId = useCustomerStore(state => state.customerId);
  const errorMessage = useCustomerStore(state => state.errorMessage);
  const setErrorMessage = useCustomerStore(state => state.setErrorMessage);
  const updateCustomerAddresses = useCustomerStore(
    state => state.updateCustomerAddresses
  );
  const isBillingAddressDefault = useCustomerStore(
    state => state.isBillingAddressDefault
  );
  const isShippingAddressDefault = useCustomerStore(
    state => state.isShippingAddressDefault
  );
  const setIsBillingAddressDefault = useCustomerStore(
    state => state.setIsBillingAddressDefault
  );
  const setIsShippingAddressDefault = useCustomerStore(
    state => state.setIsShippingAddressDefault
  );

  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsAlpha = useValidationStore(state => state.validateIsAlpha);
  const validateIsMobilePhone = useValidationStore(
    state => state.validateIsMobilePhone
  );
  const validateIsEmail = useValidationStore(state => state.validateIsEmail);
  const validateIsAlphanumeric = useValidationStore(
    state => state.validateIsAlphanumeric
  );
  const emptyAddress = useCustomerStore(state => state.emptyAddress);
  const [addressData, setAddressData] = useState(emptyAddress);
  const [checkboxValue, setCheckboxValue] = useState({
    isBillingAddress: isBillingAddressDefault,
    isShippingAddress: isShippingAddressDefault,
  });

  /// Validations
  const [touched, setTouched] = useState({});
  let isSaveBtnDisabled = false;
  let hasInputError = {};

  const isAlphaDatas = [
    { inputKey: 'firstName', data: addressData.firstName },
    { inputKey: 'lastName', data: addressData.lastName },
    { inputKey: 'city', data: addressData.city },
    { inputKey: 'country', data: addressData.country },
  ];
  const isEmptyDatas = [
    ...isAlphaDatas,
    { inputKey: 'telephone', data: addressData.telephone },
    { inputKey: 'email', data: addressData.email },
    { inputKey: 'street', data: addressData.street },
    { inputKey: 'zipCode', data: addressData.zipCode },
  ];

  hasInputError = { ...hasInputError, ...validateIsAlpha(...isAlphaDatas) };
  hasInputError = { ...hasInputError, ...validateIsEmpty(...isEmptyDatas) };
  hasInputError = { ...hasInputError, ...validateIsEmail(addressData.email) };
  hasInputError = {
    ...hasInputError,
    ...validateIsAlphanumeric(addressData.zipCode),
  };
  hasInputError = {
    ...hasInputError,
    ...validateIsMobilePhone(addressData.telephone),
  };

  if (!(Object.keys(hasInputError).length === 0)) {
    isSaveBtnDisabled = true;
  }

  if (!checkboxValue.isBillingAddress && !checkboxValue.isShippingAddress) {
    isSaveBtnDisabled = true;
  }
  /// Validations ends

  const handleCheckboxChange = e => {
    setErrorMessage('');
    const value = e.target.checked;
    setCheckboxValue({ ...checkboxValue, [e.target.name]: value });
  };
  
  // Input change handler
  const handleChange = e => {
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    setAddressData({ ...addressData, [e.target.name]: value });
  };

  const updateAddressHandler = async () => {
    const updateCustomerAddressesQuery = {
      query: `mutation UpdateAddresses{
        updateCustomerAddress(
          customerId:"${customerId}",
          firstName: "${addressData.firstName}",
          lastName: "${addressData.lastName}",
          company: "${addressData.company}",
          country: "${addressData.country}",
          stateOrProvince: "${addressData.stateOrProvince}",
          zipCode: "${addressData.zipCode}",
          city: "${addressData.city}",
          street: "${addressData.street}",
          email: "${addressData.email}",
          telephone: "${addressData.telephone}",
          isBillingAddress: "${checkboxValue.isBillingAddress}",
          isShippingAddress: "${checkboxValue.isShippingAddress}"
        ){
          firstName
          lastName
          company
          stateOrProvince
          country
          zipCode
          city
          street
          email
          telephone
          isBillingAddress
          isShippingAddress
        }
      }`,
    };
    await updateCustomerAddresses(updateCustomerAddressesQuery, URL);
    // if address update was successful then reset inputs and navigate backward 1 page.
    if (!errorMessage) {
      setTouched({});
      setIsBillingAddressDefault(false);
      setIsShippingAddressDefault(false);
      navigate(-1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                <div className="my-account">
                  <div className="page-title">
                    <h1>Add New Address</h1>
                  </div>
                  <form action="#" method="post" id="form-validate">
                    <input name="form_key" type="hidden" defaultValue />
                    <input type="hidden" name="success_url" defaultValue />
                    <input type="hidden" name="error_url" defaultValue />
                    <h2 className="legend">Contact Information</h2>
                    <AddressInputForm
                      touched={touched}
                      hasInputError={hasInputError}
                      handleChange={handleChange}
                      addressData={addressData}
                    />
                    One box is required to be checked{' '}
                    <em className="required">*</em>
                    <br />
                    <div className="fieldset group-select">
                      <li className="control">
                        <input
                          onChange={handleCheckboxChange}
                          value={checkboxValue.isBillingAddress}
                          defaultChecked={isBillingAddressDefault}
                          type="checkbox"
                          id="primary_billing"
                          name="isBillingAddress"
                          title="isBillingAddress"
                          className="checkbox"
                        />
                        <label htmlFor="primary_billing">
                          Use as my default billing address
                        </label>
                      </li>
                      <li className="control">
                        <input
                          onChange={handleCheckboxChange}
                          value={checkboxValue.isShippingAddress}
                          defaultChecked={isShippingAddressDefault}
                          type="checkbox"
                          id="primary_shipping"
                          name="isShippingAddress"
                          title="isShippingAddress"
                          className="checkbox"
                        />
                        <label htmlFor="primary_shipping">
                          Use as my default shipping address
                        </label>
                      </li>
                    </div>
                    <div className="buttons-set">
                      <p className="required">* Required Fields</p>
                      <button
                        disabled={isSaveBtnDisabled}
                        type="button"
                        title="Save button"
                        className="button"
                        onClick={updateAddressHandler}
                        style={{
                          backgroundColor: isSaveBtnDisabled ? '#CFD2CF' : '',
                          pointerEvents: isSaveBtnDisabled ? 'none' : '',
                        }}
                      >
                        <span>Save Address</span>
                      </button>
                      <Link
                        to="/account-information/address-book"
                        onClick={() => {
                          setIsBillingAddressDefault(false);
                          setIsShippingAddressDefault(false);
                        }}
                      >
                        <small>« </small>Back
                      </Link>{' '}
                    </div>
                    <br />
                  </form>
                </div>
              </div>
              <aside
                className="col-right sidebar col-sm-3 animated"
                style={{ visibility: 'visible' }}
              ></aside>
            </div>
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
};

export default UpdateAddress;
