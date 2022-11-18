import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../Store/cartStore';
import useCustomerStore from '../Store/customerStore';
import useValidationStore from '../Store/validationStore';
import useUrlStore from '../Store/urlStore';

const Success = () => {
  const navigate = useNavigate();

  const URL = useUrlStore(state => state.baseURL);

  const errorMessage = useCustomerStore(state => state.errorMessage);
  const setErrorMessage = useCustomerStore(state => state.setErrorMessage);
  const clearOrderData = useCustomerStore(state => state.clearOrderData);
  const isRouteAccess = useCustomerStore(state => state.isRouteAccess);
  const setRouteAccess = useCustomerStore(state => state.setRouteAccess);
  const createOrder = useCustomerStore(state => state.createOrder);
  const orderIsSaved = useCustomerStore(state => state.orderIsSaved);
  const { orderBillingAddress, orderShippingAddress, orderProducts } =
    useCustomerStore(state => state.orderData);
  const customerData = useCustomerStore(state => state.customerData);
  const customerId = useCustomerStore(state => state.customerId);
  const isAuth = useCustomerStore(state => state.isAuth);

  const clearCart = useCartStore(state => state.clearCart);

  const clearIsFormComplete = useValidationStore(
    state => state.clearIsFormComplete
  );
  let timer = 5;
  // create a new order id
  const orderId = (
    new Date().getTime() +
    Math.floor(Math.random() * 10000) +
    1
  ).toString();

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-');
  }
  // (dd-mm-yyyy)
  const formattedDate = formatDate(new Date());

  let shippingInfo = 'shipping address lost';
  let billingInfo = 'billing address lost';
  if (orderShippingAddress) {
    shippingInfo = `${orderShippingAddress.firstName} ${orderShippingAddress.lastName}, ${orderShippingAddress.company}, ${orderShippingAddress.country}, ${orderShippingAddress.stateOrProvince}, 
    ${orderShippingAddress.city}, ${orderShippingAddress.zipCode}, ${orderShippingAddress.street}, ${orderShippingAddress.email}, Phone: ${orderShippingAddress.telephone}`;
  }
  if (orderBillingAddress) {
    billingInfo = `${orderBillingAddress.firstName} ${orderBillingAddress.lastName}, ${orderBillingAddress.company}, ${orderBillingAddress.country}, ${orderBillingAddress.stateOrProvince}, 
    ${orderBillingAddress.city}, ${orderBillingAddress.zipCode}, ${orderBillingAddress.street}, ${orderBillingAddress.email}, Phone: ${orderBillingAddress.telephone}`;
  }
  let delivery = 0;
  let subTotal = 0;

  if (orderProducts?.length < 1) delivery = 0;
  if (orderProducts?.length > 0) delivery = 10; // delivery cost is static because this is just a demo

  // get total price from ordered products
  if (orderProducts) {
    subTotal = orderProducts.reduce(
      (total, current) => total + current.cartQty * current.price,
      0
    );
  }

  const grandTotal = (delivery + subTotal).toString();

  const status = 'paid';

  let timeout = undefined;

  const createOrderMutation = async () => {
    let customerEmail = 'Not registered';
    if (customerData.email) {
      customerEmail = customerData.email;
    }
    const createOrderQuery = {
      query: `mutation SaveOrderToDB(
                $customerEmail: String,
                $billingInfo: String!, 
                $shippingInfo: String!,
                $orderedProductsArr: [ProductInput]!) {
        createOrder(
          customerId: "${customerId}",
          customerEmail: $customerEmail,
          orderId: "${orderId}",
          orderedAt: "${formattedDate}",
          orderedProductsArr: $orderedProductsArr,
          billingAddress: $billingInfo,
          shippingAddress: $shippingInfo,
          orderTotal: "${grandTotal}",
          orderStatus: "${status}",
          isDeleted: "false") {
            _id
            orderId
            orderedAt
            orderedProductsArr {
              _id
              name
              cartQty
              storageQuantity
              price
              imgPath
              onSale
              furnitureCategory
              color
              manufacturer
            }
            billingAddress
            shippingAddress
            orderTotal
            orderStatus
            isDeleted
          }
        }`,
      variables: {
        customerEmail: customerEmail,
        billingInfo: billingInfo,
        shippingInfo: shippingInfo,
        orderedProductsArr: orderProducts,
      },
    };

    try {
      await createOrder(createOrderQuery, isAuth, URL);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isRouteAccess) createOrderMutation();
  }, []);

  if (orderIsSaved) {
    // after 5 sec, route access denied and navigate to products list page
    timeout = setTimeout(() => {
      if (!errorMessage) {
        clearIsFormComplete();
        clearOrderData();
      }
      // registered customers navigate to account dashboard after successful payment
      if (isAuth) navigate('/account-information/account-dashboard');
      // unregistered customers navigate back to products list after successful payment
      if (!isAuth) navigate('/products-list');
    }, 5000);
    // clear cart after successful payment
    if (isRouteAccess) clearCart();
  }

  window.onbeforeunload = () => {
    setRouteAccess(false);
  };
  return (
    <div className="inner-page">
      <div id="page">
        {/* Main Container */}
        <section className="content-wrapper bounceInUp animated">
          <div className="container">
            <div className="std">
              <div className="page-not-found">
                {!errorMessage ? (
                  <>
                    <h1>Success</h1>
                    <h2>
                      Your payment was successful,
                      <br /> we'll be in touch shortly!
                    </h2>
                    {orderIsSaved && (
                      <h5>You are going to be redirect in {timer} seconds</h5>
                    )}
                  </>
                ) : (
                  <h2>
                    Something went wrong, please contact with customer service.
                  </h2>
                )}
                <br />
                {!orderIsSaved && (
                  <h5>Please wait for registering your order</h5>
                )}
                {(orderIsSaved || errorMessage) && (
                  <div>
                    <Link
                      to="/products-list"
                      className="btn-home"
                      onClick={() => {
                        clearTimeout(timeout);
                        setRouteAccess(false);
                      }}
                    >
                      <span>Back To Home</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
};

export default Success;
