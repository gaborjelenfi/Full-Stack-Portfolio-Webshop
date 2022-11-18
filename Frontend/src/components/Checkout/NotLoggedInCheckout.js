import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCustomerStore from '../../Store/customerStore';
import useValidationStore from '../../Store/validationStore';
import AccountLogin from '../AccountInfo/AccountLogin';

// If customers do not want to register, they can order without registration
const NotLoggedInCheckout = ({ handleGuestValue }) => {
  const navigate = useNavigate();

  const clearCustomerData = useCustomerStore(state => state.clearCustomerData);
  
  const steps = useValidationStore(state => state.steps);
  const activateCheckoutStep = useValidationStore(
    state => state.activateCheckoutStep
  );
  const [guestOrRegister, setGuestOrRegister] = useState({
    checkoutMethod: 'guest',
  });

  const handleRadioBtnChange = e => {
    const value = e.target.value;
    setGuestOrRegister({ [e.target.name]: value });
  };

  const handleContinueBtn = () => {
    const radioValue = guestOrRegister.checkoutMethod;
    if (radioValue === 'guest') {
      clearCustomerData();
      handleGuestValue();
    }
    if (radioValue === 'register') {
      navigate('/create-account');
    }
  };

  return (
    <div id="checkout-step-login" className="step a-item">
      <div className="col2-set">
        <div className="col-1">
          <h2>Checkout as a Guest or Register</h2>
          <p>Register with us for future convenience:</p>
          <ul className="form-list">
            <li className="control">
              <input
                type="radio"
                className="radio"
                defaultValue="guest"
                id="login:guest"
                name="checkoutMethod"
                defaultChecked="checked"
                onChange={handleRadioBtnChange}
              />
              <label htmlFor="login:guest">Checkout as Guest</label>
            </li>
            <li className="control">
              <input
                type="radio"
                className="radio"
                defaultValue="register"
                id="login:register"
                name="checkoutMethod"
                onChange={handleRadioBtnChange}
              />
              <label htmlFor="login:register">Register</label>
            </li>
          </ul>
          <br />
          <h4>Register and save time!</h4>
          <p>Register with us for future convenience:</p>
          <ul className="ul">
            <li>Fast and easy check out</li>
            <li>Easy access to your order history and status</li>
          </ul>
          <div className="buttons-set">
            <p className="required">&nbsp;</p>
            <button
              className="button continue"
              type="button"
              id="onepage-guest-register-button"
              onClick={() => {
                handleContinueBtn();
                activateCheckoutStep(steps.firstStep);
              }}
            >
              <span>
                <span>Continue</span>
              </span>
            </button>
          </div>
        </div>
        <div className="col-2 registered-users">
          <h5>Registered Customers</h5>
          <AccountLogin />
        </div>
      </div>
    </div>
  );
};

export default NotLoggedInCheckout;
