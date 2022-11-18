import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useAdminStore from '../../Store/adminStore';
import useCustomerStore from '../../Store/customerStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

function AdminOrderFind() {
  const URL = useUrlStore(state => state.baseURL);

  const graphqlQuery = useAdminStore(state => state.graphqlQuery);
  const token = useAdminStore(state => state.token);
  const setErrorMessage = useAdminStore(state => state.setErrorMessage);
  const errorMessage = useAdminStore(state => state.errorMessage);
  const accessDenied = useAdminStore(state => state.accessDenied);
  const setAccessDenied = useAdminStore(state => state.setAccessDenied);
  const accessErrMsg = useAdminStore(state => state.accessErrMsg);

  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsInt = useValidationStore(state => state.validateIsInt);
  
  const customerId = useCustomerStore(state => state.customerId);
  
  const [orderData, setOrderData] = useState();
  const [inputData, setInputData] = useState({ orderId: '' });
  const [touched, setTouched] = useState({});

  const handleChange = e => {
    setAccessDenied(false);
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    setInputData({ ...inputData, [e.target.name]: value });
  };

  useEffect(() => {
    setErrorMessage('');
  }, [setErrorMessage]);

  /// Validations
  let hasInputError = {};
  hasInputError = {
    ...hasInputError,
    ...validateIsEmpty({ inputKey: 'orderId', data: inputData.orderId }),
  };
  hasInputError = {
    ...hasInputError,
    ...validateIsInt({ inputKey: 'orderId', data: inputData.orderId }),
  };
  /// Validations ends

  const findOrderQuery = async () => {
    const orderByOrderIdQuery = {
      query: `query FindOrderByOrderId {
            order(orderId: "${inputData.orderId}") {
                _id
                orderId
                isDeleted
                customerEmail
                orderedAt
                billingAddress
                shippingAddress
                orderTotal
                orderStatus
                orderedProductsArr {
                  _id
                  name
                  cartQty
                  price
                  onSale
                  color
                  manufacturer
                  imgPath
                }
            }
        }`,
    };
    try {
      const response = await axios.post(`${URL}/graphql`, orderByOrderIdQuery, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const responseOrderData = response.data.data.order;
      setOrderData(responseOrderData);
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
      setInputData({ orderId: '' });
      setTouched({});
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
  };

  const deleteOrder = async id => {
    // delete order from customers log and order documents
    const deleteOrderMutation = {
      query: `mutation DeleteOrder{
        deleteOrder(id: "${id}") {
          isDeleted
        }
      }`,
    };
    await graphqlQuery(deleteOrderMutation, URL);

    // if not registered customer then delete order from order documents
    if (orderData.customerEmail !== 'Not registered') {
      const deleteCustomerOrder = {
        query: `mutation DeleteCustomerOrder {
        deleteCustomerOrder(
          customerId: "${customerId}", 
          _id: "${orderData._id}") {
            orderedProductsArr {
              _id
            }
          }
        }`,
      };
      await graphqlQuery(deleteCustomerOrder, URL);
    }
  };

  return (
    <>
      <div className="page-title">
        <h1>Order finder</h1>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '25px 0',
        }}
      >
        <div className="input-box1">
          <label htmlFor="name" style={{ marginLeft: '20px' }}>
            Find an order by order's ID:
          </label>
          <input
            style={{
              width: '300px',
              margin: '7.5px 15px 0',
              padding: '10px',
            }}
            onChange={handleChange}
            value={inputData.orderId}
            type="text"
            placeholder="123456789"
            name="orderId"
            title="Find an order"
            className="input-text required-entry"
          />
        </div>
        <button
          onClick={findOrderQuery}
          disabled={hasInputError.orderId}
          className="button"
          name="find"
          title="Find an order"
          type="button"
          style={{
            display: 'inline-block',
            backgroundColor: hasInputError.orderIdInputError ? '#CFD2CF' : '',
            pointerEvents: hasInputError.orderIdInputError ? 'none' : '',
          }}
        >
          <span>Find</span>
        </button>{' '}
      </div>
      {hasInputError.orderIdInputError && touched.orderId && (
        <p
          style={{
            color: '#ff0000',
            margin: '-20px 0 -10px 0',
            textAlign: 'center',
          }}
        >
          Please use a valid order ID
        </p>
      )}
      <hr />
      <br />
      <div
        className="box-content box-category"
        style={{ width: '100%', margin: '30px' }}
      >
        {orderData ? (
          <>
            {!orderData.isDeleted && (
              <div>
                <button
                  onClick={() => deleteOrder(orderData._id)}
                  disabled={false}
                  className="button"
                  name="delete"
                  title="Delete order"
                  type="button"
                  style={{
                    borderColor: '#FE433C',
                    float: 'right',
                  }}
                >
                  <span>Delete</span>
                </button>
                {accessDenied && (
                  <p
                    style={{ color: '#FE433C', float: 'right', margin: '10px' }}
                  >
                    {accessErrMsg}
                  </p>
                )}
              </div>
            )}
            {orderData.isDeleted && (
              <p style={{ color: '#ff0000' }}>This order has deleted.</p>
            )}
            {orderData.customerId && (
              <p>
                <strong>Customer ID: </strong>
                {orderData.customerId}
              </p>
            )}
            <p>
              <strong>Order ID: </strong>
              {orderData.orderId}
            </p>
            <p>
              <strong>Ordered at: </strong>
              {orderData.orderedAt}
            </p>
            <p>
              <strong>Order total: </strong>${orderData.orderTotal.toFixed(2)}
            </p>
            <p>
              <strong>Order status: </strong>
              {orderData.orderStatus}
            </p>
            <div style={{ display: 'flex' }}>
              <strong>Shipping address: </strong>
              <ul>
                {orderData.shippingAddress.split(',').map((sA, index) => (
                  <li key={index} style={{ marginLeft: '10px' }}>
                    {sA}
                  </li>
                ))}
              </ul>

              <strong style={{ marginLeft: '15px' }}>Billing address: </strong>
              <ul>
                {orderData.billingAddress.split(',').map((sA, index) => (
                  <li key={index} style={{ marginLeft: '10px' }}>
                    {sA}
                  </li>
                ))}
              </ul>
            </div>
            <br />
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
                    {/* 
                      <th>Date</th>
                      <th>
                        <span className="nobr">Total</span>
                      </th>
                      <th>Status</th>
                      <th>&nbsp;</th> */}
                  </tr>
                </thead>
                <tbody>
                  {orderData?.orderedProductsArr?.length ? (
                    orderData?.orderedProductsArr?.map(p => (
                      <tr key={p._id} className="first odd">
                        <td>
                          <ol
                            className="products-list"
                            id="products-list"
                            style={{ float: 'none' }}
                          >
                            <li>
                              <div className="product-image">
                                {' '}
                                <img
                                  crossOrigin='anonymous'
                                  className="small-image"
                                  src={`${URL}/${p.imgPath}`}
                                  alt={'title'}
                                />{' '}
                              </div>
                              <div className="product-shop">
                                <div className="product-name">
                                  <h4>{p.name}</h4>
                                </div>
                                <h6 className="product-name">
                                  {p.manufacturer}
                                </h6>
                                <p className="product-name">color: {p.color}</p>
                                <br />
                                <h5 className="product-name">
                                  cart quantity: <strong>{p.cartQty}</strong>
                                </h5>
                                <div className="price-box">
                                  <p className="special-price">
                                    {' '}
                                    <span className="price-label" />{' '}
                                    <span className="price">
                                      {' '}
                                      {`$${p.price}`}{' '}
                                    </span>{' '}
                                    <span> each</span>
                                  </p>{' '}
                                  {p.onSale && (
                                    <p className="old-price">
                                      {' '}
                                      <span className="price-label" />{' '}
                                      <span className="price">
                                        {' '}
                                        {`$${(p.price + p.price / 10).toFixed(
                                          2
                                        )}`}{' '}
                                      </span>{' '}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </li>
                          </ol>
                        </td>
                        <td className="a-center last">
                          <span className="nobr"> </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>
                        <p>No ordered products</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>{errorMessage}</p>
        )}
      </div>
    </>
  );
}

export default AdminOrderFind;
