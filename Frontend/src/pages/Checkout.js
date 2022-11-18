import React, { useEffect, useState } from 'react';
import BillingInfo from '../components/Checkout/BillingInfo';
import NotLoggedInCheckout from '../components/Checkout/NotLoggedInCheckout';
import ShippingInfo from '../components/Checkout/ShippingInfo';
import OrderReview from '../components/Checkout/OrderReview';
import SideCheckoutData from '../components/Aside/SideCheckoutData';
import useCustomerStore from '../Store/customerStore';
import useValidationStore from '../Store/validationStore';

function Checkout() {
  const isAuth = useCustomerStore(state => state.isAuth);
  const isStepOpen = useValidationStore(state => state.isStepOpen);
  const activateCheckoutStep = useValidationStore(
    state => state.activateCheckoutStep
  );
  const [isGuest, setIsGuest] = useState(false);
  const [isLoadData, setIsLoadData] = useState();
  useEffect(() => {
    window.scrollTo(0, 0);
    activateCheckoutStep('firstStep');
  }, [activateCheckoutStep]);
  const handleGuestValue = () => {
    setIsGuest(true);
  };

  // set isLoad to true if customer choose billing and shipping address to be same
  const handleShippingLoad = isLoad => {
    setIsLoadData(isLoad);
  };

  const handleBack = () => {
    setIsGuest(false);
  };

  return (
    <div>
      <div id="page">
        {/* Main Container */}
        <section className="main-container col2-right-layout bounceInUp animated">
          <div className="main container">
            <div className="row">
              <div className="col-main col-sm-9">
                <div className="page-title">
                  <h1>Checkout</h1>
                </div>
                <ol className="one-page-checkout" id="checkoutSteps">
                  <li
                    id="opc-billing"
                    className={`section allow ${
                      isStepOpen.firstStep && 'active'
                    }`}
                  >
                    {isGuest && (
                      <div className="step-title">
                        {' '}
                        <span className="number">1</span>
                        <h3 className="one_page_heading">
                          Billing Information
                        </h3>
                      </div>
                    )}
                    {!isGuest && (
                      <div className="step-title">
                        {' '}
                        <span className="number">1</span>
                        <h3>
                          {isAuth ? 'Billing Information' : 'Checkout method'}
                        </h3>
                      </div>
                    )}
                    {isAuth || isGuest ? (
                      <BillingInfo
                        handleBack={handleBack}
                        handleShippingLoad={handleShippingLoad}
                      />
                    ) : (
                      !isGuest && (
                        <NotLoggedInCheckout
                          handleGuestValue={handleGuestValue}
                        />
                      )
                    )}
                  </li>
                  <li
                    id="opc-shipping"
                    className={`section allow ${
                      isStepOpen.secondStep && 'active'
                    }`}
                  >
                    <div className="step-title">
                      {' '}
                      <span className="number">2</span>
                      <h3 className="one_page_heading">
                        {' '}
                        Shipping Information
                      </h3>
                    </div>
                    <ShippingInfo isLoadData={isLoadData} />
                  </li>
                  <li
                    id="opc-review"
                    className={`section allow ${
                      isStepOpen.thirdStep && 'active'
                    }`}
                  >
                    <div className="step-title">
                      {' '}
                      <span className="number">3</span>
                      <h3 className="one_page_heading">Order Review</h3>
                    </div>
                    <OrderReview />
                  </li>
                </ol>
              </div>
              <SideCheckoutData />
            </div>
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
}

export default Checkout;
