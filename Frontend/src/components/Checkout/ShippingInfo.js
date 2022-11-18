import React, { useEffect, useState } from 'react';
import AddressInputForm from '../InputForm/AddressInputForm';
import useCustomerStore from '../../Store/customerStore';
import { Link } from 'react-router-dom';
import useValidationStore from '../../Store/validationStore';

const ShippingInfo = ({ isLoadData }) => {
  const isAuth = useCustomerStore(state => state.isAuth);
  const shippingAddress = useCustomerStore(state => state.shippingAddress);
  const {
    firstName,
    lastName,
    company,
    country,
    stateOrProvince,
    zipCode,
    street,
  } = useCustomerStore(state => state.shippingAddress);
  const emptyAddress = useCustomerStore(state => state.emptyAddress);
  const orderData = useCustomerStore(state => state.orderData);
  const setOrderData = useCustomerStore(state => state.setOrderData);

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
  const setErrorMessage = useCustomerStore(state => state.setErrorMessage);

  /// Validations
  let isContinueBtnDisabled = false;
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

  useEffect(() => {
    window.scrollTo(0, 0);
    // deciding which data loads
    if (isLoadData && !isCheckbox)
      setAddressData(orderData.orderBillingAddress);
    if (!isLoadData && !isCheckbox && orderData.orderShippingAddress)
      setAddressData(orderData.orderShippingAddress);
    if ((!isLoadData || isLoadData) && isCheckbox)
      setAddressData(shippingAddress);
    if (!isLoadData && !isCheckbox && !orderData.orderShippingAddress)
      setAddressData(emptyAddress);
  }, [emptyAddress, isLoadData, isStepOpen, orderData, isCheckbox]);

  useEffect(() => {
    if (!isContinueBtnDisabled) {
      setIsFormComplete({ key: 'isShippingFormComplete', value: true });
      return;
    }
    setIsFormComplete({ key: 'isShippingFormComplete', value: false });
  }, [isContinueBtnDisabled, setIsFormComplete]);

  return (
    <div
      id="checkout-step-shipping"
      className="step a-item"
      style={{
        display: isStepOpen.secondStep ? 'block' : 'none',
      }}
    >
      <form id="co-shipping-form">
        <fieldset className="group-select">
          <ul>
            {isAuth && (
              <li>
                <label htmlFor="shipping-address-select">
                  You can use your saved shipping address to fill the form
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
                  <p>No shipping address saved yet</p>
                )}
              </li>
            )}
            <li
              id="shipping-new-address-form"
              style={{
                display: 'block',
              }}
            >
              <AddressInputForm
                touched={touched}
                hasInputError={hasInputError}
                handleChange={handleChange}
                addressData={addressData}
              />
            </li>
          </ul>
          <p className="require">
            <em className="required">* </em>Required Fields
          </p>
          <div className="buttons-set1" id="shipping-buttons-container">
            <button
              disabled={isContinueBtnDisabled}
              type="button"
              className="button continue"
              onClick={() => {
                setOrderData({
                  key: 'orderShippingAddress',
                  value: addressData,
                });
                setIsFormComplete({
                  key: 'isShippingFormComplete',
                  value: true,
                });
                activateCheckoutStep(steps.thirdStep);
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
              onClick={() => activateCheckoutStep(steps.firstStep)}
            >
              &emsp;« Back
            </Link>{' '}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ShippingInfo;
