import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useAdminStore from '../../Store/adminStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

function AdminCustomerFind() {
  const URL = useUrlStore(state => state.baseURL);

  const graphqlQuery = useAdminStore(state => state.graphqlQuery);
  const token = useAdminStore(state => state.token);
  const setErrorMessage = useAdminStore(state => state.setErrorMessage);
  const errorMessage = useAdminStore(state => state.errorMessage);
  const accessDenied = useAdminStore(state => state.accessDenied);
  const setAccessDenied = useAdminStore(state => state.setAccessDenied);
  const accessErrMsg = useAdminStore(state => state.accessErrMsg);

  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsEmail = useValidationStore(state => state.validateIsEmail);
  
  const [customerData, setCustomerData] = useState();
  const [inputData, setInputData] = useState({ email: '' });
  const [touched, setTouched] = useState({});
  const [selected, setSelected] = useState({ customer: false, order: false });

  useEffect(() => {
    setAccessDenied(false);
    setErrorMessage('');
  }, [setErrorMessage, setAccessDenied]);

  const handleChange = e => {
    setAccessDenied(false);
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    setInputData({ ...inputData, [e.target.name]: value });
  };

  const deleteCustomerOrderMutation = async (customerId, order_id) => {
    setSelected({ order: true, id: order_id });
    const deleteCustomerOrder = {
      query: `mutation DeleteCustomerOrder {
        deleteCustomerOrder(
          customerId: "${customerId}", 
          _id: "${order_id}") {
          orderedProductsArr {
            _id
          }
        }
      }`,
    };
    await graphqlQuery(deleteCustomerOrder, URL);

    const deleteOrderMutation = {
      query: `mutation DeleteOrder{
        deleteOrder(id: "${order_id}") {
          isDeleted
        }
      }`,
    };
    await graphqlQuery(deleteOrderMutation, URL);
    await findCustomerQuery(customerData);
  };

  /// Validations
  let hasInputError = {};

  hasInputError = {
    ...hasInputError,
    ...validateIsEmpty({ inputKey: 'email', data: inputData.email }),
  };
  hasInputError = { ...hasInputError, ...validateIsEmail(inputData.email) };
  /// Validations ends

  const findCustomerQuery = async data => {
    const customerByEmailQuery = {
      query: `query CustomerByEmail{
            customer(email: "${data.email}"){
              firstName
              lastName
              email
              _id
              orderedProducts {
                _id
                orderId
                orderedAt
                orderTotal
                orderStatus
                isDeleted
              }
            }
          }`,
    };
    try {
      const response = await axios.post(`${URL}/graphql`, customerByEmailQuery, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const responseCustomerData = response.data.data.customer;
      setCustomerData(responseCustomerData);
      if (response.data.errors) {
        const [error] = response.data.errors;
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
    setInputData({ email: '' });
    setTouched({});
  };

  const deleteCustomer = async id => {
    setSelected({ customer: true });
    const deleteCustomerMutation = {
      query: `mutation DeleteCustomer {
        deleteCustomer(id: "${id}") {
          _id
        }
      }`,
    };
    await graphqlQuery(deleteCustomerMutation, URL);
  };

  const tdCenter = {
    verticalAlign: 'center',
  };

  return (
    <>
      <div className="page-title">
        <h1>Customer finder</h1>
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
            Find customer by email:
          </label>
          <input
            style={{
              width: '300px',
              margin: '7.5px 15px 0',
              padding: '10px',
            }}
            onChange={handleChange}
            value={inputData.email}
            type="text"
            placeholder="example@email.com"
            name="email"
            title="Find a customer"
            className="input-text required-entry"
          />
        </div>
        <button
          onClick={() => findCustomerQuery(inputData)}
          disabled={hasInputError.email}
          className="button"
          name="find"
          title="Find a customer"
          type="button"
          style={{
            display: 'inline-block',
            backgroundColor: hasInputError.emailInputError ? '#CFD2CF' : '',
            pointerEvents: hasInputError.emailInputError ? 'none' : '',
          }}
        >
          <span>Find</span>
        </button>{' '}
      </div>
      {hasInputError.emailInputError && touched.email && (
        <p
          style={{
            color: '#ff0000',
            margin: '-20px 0 -10px 0',
            textAlign: 'center',
          }}
        >
          Please use a valid email address
        </p>
      )}
      <hr />
      <br />
      <div
        className="box-content box-category"
        style={{ width: '100%', margin: '30px' }}
      >
        {customerData ? (
          <>
            <button
              onClick={() => deleteCustomer(customerData._id)}
              disabled={false}
              className="button"
              name="delete"
              title="Delete customer"
              type="button"
              style={{
                borderColor: '#FE433C',
                float: 'right',
              }}
            >
              <span>Delete customer</span>
            </button>{' '}
            {selected.customer && accessDenied && (
              <p style={{ color: '#FE433C', float: 'right', margin: '10px' }}>
                {accessErrMsg}
              </p>
            )}
            <p>
              <strong>First name: </strong>
              {customerData.firstName}
            </p>
            <p>
              <strong>Last name: </strong>
              {customerData.lastName}
            </p>
            <p>
              <strong>Email: </strong>
              {customerData.email}
            </p>
            <div className="recent-orders">
              <div className="title-buttons">
                <strong>Cotumer's Orders</strong>{' '}
              </div>
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
                      <th>Order ID #</th>
                      <th>Date</th>
                      <th>
                        <span className="nobr">Total</span>
                      </th>
                      <th>Status</th>
                      <th style={{ float: 'right' }}>Delete</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerData.orderedProducts.length ? (
                      customerData.orderedProducts.map(p => (
                        <tr key={p.orderId} className="first odd">
                          <td>{p.orderId}</td>
                          <td>{p.orderedAt}</td>
                          <td>
                            <span className="price">
                              ${Number(p.orderTotal).toFixed(2)}
                            </span>
                          </td>
                          <td>
                            <em style={tdCenter}>{p.orderStatus}</em>
                          </td>
                          <td>
                            {p.isDeleted ? (
                              <em style={{ color: '#FE433C', float: 'right' }}>
                                deleted
                              </em>
                            ) : (
                              <button
                                onClick={() =>
                                  deleteCustomerOrderMutation(
                                    customerData._id,
                                    p._id
                                  )
                                }
                                disabled={false}
                                className="button"
                                name="delete"
                                title="Delete order"
                                type="button"
                                style={{
                                  borderColor: '#FE433C',
                                  marginLeft: '40px',
                                }}
                              >
                                <span>Delete</span>
                              </button>
                            )}
                            {selected.order && selected.id === p._id && accessDenied && (
                              <p style={{ color: '#FE433C', float: 'right' }}>
                                {accessErrMsg}
                              </p>
                            )}
                          </td>
                          <td className="a-center last">
                            <span className="nobr"> </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <p>Customer have no orders.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p>{errorMessage}</p>
        )}
      </div>
    </>
  );
}

export default AdminCustomerFind;
