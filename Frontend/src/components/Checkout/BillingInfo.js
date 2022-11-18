import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCustomerStore from '../../Store/customerStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';
import AddressInputForm from '../InputForm/AddressInputForm';

const BillingInfo = ({ handleBack, handleShippingLoad }) => {
  const URL = useUrlStore(state => state.baseURL);
  const setErrorMessage = useCustomerStore(state => state.setErrorMessage);
  const isAuth = useCustomerStore(state => state.isAuth);
  const fetchCustomerAddresses = useCustomerStore(
    state => state.fetchCustomerAddresses
  );
  const customerId = useCustomerStore(state => state.customerId);
  const billingAddress = useCustomerStore(state => state.billingAddress);
  const {
    firstName,
    lastName,
    company,
    country,
    stateOrProvince,
    zipCode,
    street,
  } = useCustomerStore(state => state.billingAddress);
  const emptyAddress = useCustomerStore(state => state.emptyAddress);
  const setOrderData = useCustomerStore(state => state.setOrderData);
  const orderData = useCustomerStore(state => state.orderData);

  const steps = useValidationStore(state => state.steps);
  const isStepOpen = useValidationStore(state => state.isStepOpen);
  const activateCheckoutStep = useValidationStore(
    state => state.activateCheckoutStep
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
  const setIsFormComplete = useValidationStore(
    state => state.setIsFormComplete
  );
  
  const [touched, setTouched] = useState({});
  const [isCheckbox, setIsCheckbox] = useState(false);
  const [addressData, setAddressData] = useState(emptyAddress);
  const [loadOrNoLoadData, setLoadOrNoLoadData] = useState({
    ShippingLoadRadioBtn: 'loadData',
  });

  useEffect(() => {
    if(isAuth) {
      fetchCustomerAddresses(customerId, URL);
    }
  },[URL, customerId, fetchCustomerAddresses, isAuth])

  /// Validations
  let hasInputError = {};
  let isContinueBtnDisabled = false;

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
    isContinueBtnDisabled = true;
  }
  /// Validations ends

  // Input change handler
  const handleChange = e => {
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    setAddressData({ ...addressData, [e.target.name]: value });
  };

  const handleRadioBtnChange = e => {
    const value = e.target.value;
    setLoadOrNoLoadData({ [e.target.name]: value });
  };
  const handleContinueBtn = () => {
    const radioValue = loadOrNoLoadData.ShippingLoadRadioBtn;
    if (radioValue === 'loadData') {
      handleShippingLoad(true);
    }
    if (radioValue === 'noLoadData') {
      handleShippingLoad(false);
    }
  };

  const handleBackBtn = () => {
    handleBack();
  };

  useEffect(() => {
    // deciding which data loads
    if (isCheckbox) setAddressData(billingAddress);
    if (!isCheckbox && orderData.orderBillingAddress)
      setAddressData(orderData.orderBillingAddress);
    if (!isCheckbox && !orderData.orderBillingAddress)
      setAddressData(emptyAddress);
  }, [emptyAddress, isCheckbox, billingAddress, orderData]);

  useEffect(() => {
    // check if billing address fields have filled up
    if (!isContinueBtnDisabled) {
      setIsFormComplete({ key: 'isBillingFormComplete', value: true });
      return;
    }
    setIsFormComplete({ key: 'isBillingFormComplete', value: false });
  }, [isContinueBtnDisabled, setIsFormComplete]);

  return (
    <>
      <div
        id="checkout-step-billing"
        className="step a-item"
        style={{
          display: isStepOpen.firstStep ? 'block' : 'none',
        }}
      >
        <form id="co-billing-form">
          <fieldset className="group-select">
            <ul>
              {isAuth && (
                <li>
                  <label htmlFor="shipping-address-select">
                    You can use your saved billing address to fill the form
                  </label>
                  <br />
                  {firstName.length !== 0 ? (
                    <>
                      <input
                        type="checkbox"
                        name="changeLoadShippingAddress"
                        checked={isCheckbox}
                        onChange={() => setIsCheckbox(!isCheckbox)}
                        title="Load shipping address"
                        className="checkbox"
                      />
                      <span>
                        {` ${firstName} 
                      ${lastName}, `}
                        {company && `${company}, `}
                        {`${country}, 
                      ${stateOrProvince} 
                      ${zipCode}, 
                      ${street} ...`}{' '}
                      </span>
                    </>
                  ) : (
                    <p>No billing address saved yet</p>
                  )}
                </li>
              )}
              <li id="billing-new-address-form">
                <fieldset>
                  <legend>New Address</legend>
                  <input type="hidden" id="billing:address_id" />
                  <AddressInputForm
                    touched={touched}
                    hasInputError={hasInputError}
                    handleChange={handleChange}
                    addressData={addressData}
                  />
                </fieldset>
              </li>
              <li className="control">
                <input
                  type="radio"
                  className="radio"
                  onChange={handleRadioBtnChange}
                  title="Ship to this address"
                  defaultValue="loadData"
                  defaultChecked="checked"
                  id="billing:use_for_shipping_yes"
                  name="ShippingLoadRadioBtn"
                />
                <label htmlFor="billing:use_for_shipping_yes">
                  Ship to this address
                </label>
              </li>
              <li className="control">
                <input
                  type="radio"
                  className="radio"
                  onChange={handleRadioBtnChange}
                  title="Ship to different address"
                  defaultValue="noLoadData"
                  id="billing:use_for_shipping_no"
                  name="ShippingLoadRadioBtn"
                />
                <label htmlFor="billing:use_for_shipping_no">
                  Ship to different address
                </label>
              </li>
            </ul>
            <p className="require">
              <em className="required">* </em>Required Fields
            </p>
            <button
              disabled={isContinueBtnDisabled}
              type="button"
              className="button continue"
              onClick={() => {
                setOrderData({
                  key: 'orderBillingAddress',
                  value: addressData,
                });
                setIsFormComplete({
                  key: 'isBillingFormComplete',
                  value: true,
                });
                handleContinueBtn();
                activateCheckoutStep(steps.secondStep);
              }}
              style={{
                backgroundColor: isContinueBtnDisabled ? '#CFD2CF' : '',
                pointerEvents: isContinueBtnDisabled ? 'none' : '',
              }}
            >
              <span>Continue</span>
            </button>
            <Link
              to={'./'}
              className="back-link"
              onClick={() => {
                handleBackBtn();
                activateCheckoutStep(steps.firstStep);
              }}
            >
              &emsp;« Back
            </Link>{' '}
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default BillingInfo;
