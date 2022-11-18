import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../Store/adminStore';
import useFilterStore from '../../Store/filterStore';
import useProductStore from '../../Store/productStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

function AdminManufacturers() {
  const URL = useUrlStore(state => state.baseURL);

  const fetchManufacturersData = useFilterStore(
    state => state.fetchManufacturersData
  );
  const allManufacturersData = useFilterStore(state =>
    state.allManufacturersData.sort((a, b) => a.name.localeCompare(b.name))
  );

  const graphqlQuery = useAdminStore(state => state.graphqlQuery);
  const setErrorMessage = useAdminStore(state => state.setErrorMessage);
  const accessDenied = useAdminStore(state => state.accessDenied);
  const setAccessDenied = useAdminStore(state => state.setAccessDenied);
  const accessErrMsg = useAdminStore(state => state.accessErrMsg);

  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  
  const toggleAscDesc = useProductStore(state => state.toggleAscDesc);
  const asc = useProductStore(state => state.asc);
  const emptyManufacturerData = {
    name: '',
    newManufacturer: '',
  };
  const [manufacturerData, setManufacturerData] = useState(
    emptyManufacturerData
  );
  const [newManufacturerData, setNewManufacturerData] = useState({
    newManufacturer: '',
  });
  const [touched, setTouched] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setAccessDenied(false);
    setErrorMessage('');
    fetchManufacturersData(URL);
  }, [URL, fetchManufacturersData, setErrorMessage, setAccessDenied]);

  allManufacturersData.sort((a, b) => a.name.localeCompare(b.name));

  if (!asc) allManufacturersData.reverse();

  const handleChange = e => {
    setAccessDenied(false);
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    if (e.target.name === 'newManufacturer') {
      setNewManufacturerData({
        ...newManufacturerData,
        [e.target.name]: value,
      });
    }
    setManufacturerData({ ...manufacturerData, [e.target.name]: value });
  };

  /// Validations
  let hasInputError = {};

  const isEmptyDatas = [{ inputKey: 'name', data: manufacturerData.name }];
  hasInputError = { ...hasInputError, ...validateIsEmpty(...isEmptyDatas) };
  hasInputError = {
    ...hasInputError,
    ...validateIsEmpty({
      inputKey: 'newManufacturer',
      data: newManufacturerData.newManufacturer,
    }),
  };
  /// Validations ends

  const addNewManufacturer = async () => {
    const createManufacturerMutation = {
      query: `mutation CreateManufacturer{
        createManufacturer(name: "${newManufacturerData.newManufacturer}") {
          _id
          name
        }
      }`,
    };
    await graphqlQuery(createManufacturerMutation, URL);
    fetchManufacturersData(URL);
    setNewManufacturerData({ newManufacturer: '' });
    setTouched({ ...touched, newManufacturer: false });
  };

  const editManufacturer = _id => {
    setAccessDenied(false);
    setTouched({ ...touched, newManufacturer: false });
    const selectedManufacturer = allManufacturersData.filter(
      item => item._id === _id
    );
    setManufacturerData(...selectedManufacturer);
  };

  const cancelEditManufacturer = () => {
    setTouched({ ...touched, newManufacturer: false });
    setManufacturerData(emptyManufacturerData);
  };

  const saveEditManufacturer = async () => {
    const updateManufacturerMutation = {
      query: `mutation UpdateManufacturer{
        updateManufacturer(
            id: "${manufacturerData._id}", 
            name: "${manufacturerData.name}") {
          _id
          name
        }
      }`,
    };
    await graphqlQuery(updateManufacturerMutation, URL);
    setManufacturerData(emptyManufacturerData);
    fetchManufacturersData(URL);
  };

  const deleteManufacturer = async _id => {
    setSelectedId(_id);
    const DeleteManufacturerMutation = {
      query: `mutation DeleteManufacturer{
        deleteManufacturer(id: "${_id}") {
          _id
        }
      }`,
    };
    await graphqlQuery(DeleteManufacturerMutation, URL);
    fetchManufacturersData(URL);
  };

  const alertMsgStyle = {
    padding: '20px',
    margin: '10px',
    backgroundColor: '#ff6700',
    color: '#ffffff',
  };

  return (
    <>
      <div className="page-title">
        <h1>Manufacturers</h1>
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
            New manufacturer name:
          </label>
          <input
            style={{
              width: '300px',
              margin: '7.5px 15px 0',
              padding: '10px',
            }}
            onChange={handleChange}
            value={newManufacturerData.newManufacturer}
            type="text"
            name="newManufacturer"
            title="Add new manufacturer"
            className="input-text required-entry"
          />
        </div>
        <button
          onClick={addNewManufacturer}
          disabled={hasInputError.newManufacturerInputError}
          className="button"
          name="add"
          title="Add Manufacturer"
          type="button"
          style={{
            display: 'inline-block',
            backgroundColor: hasInputError.newManufacturerInputError
              ? '#CFD2CF'
              : '',
            pointerEvents: hasInputError.newManufacturerInputError
              ? 'none'
              : '',
          }}
        >
          <span>Add</span>
        </button>{' '}
      </div>
      {hasInputError.newManufacturerInputError && touched.newManufacturer && (
        <p
          style={{
            color: '#ff0000',
            margin: '-20px 0 -10px 0',
            textAlign: 'center',
          }}
        >
          Cannot be empty
        </p>
      )}
      <hr />
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
      <br />
      <div
        className="box-content box-category"
        style={{ width: '100%', margin: '30px' }}
      >
        <div style={alertMsgStyle}>
          <strong>Warning!</strong> If you delete a manufacturer, the process
          will delete all the products with that manufacturer!
        </div>
        <ul>
          {allManufacturersData
            ? allManufacturersData.map(m => (
                <li
                  style={{
                    textAlign: 'center',
                    lineHeight: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                  }}
                  key={m._id}
                >
                  {manufacturerData._id === m._id ? (
                    <>
                      {' '}
                      <button
                        onClick={saveEditManufacturer}
                        disabled={hasInputError.nameInputError && touched.name}
                        className="button"
                        name="save"
                        title="Save manufacturer"
                        type="button"
                        style={{
                          borderColor: '#A6D785',
                          backgroundColor:
                            hasInputError.nameInputError && touched.name
                              ? '#CFD2CF'
                              : '',
                          pointerEvents:
                            hasInputError.nameInputError && touched.name
                              ? 'none'
                              : '',
                          marginRight: 'auto',
                        }}
                      >
                        <span>Save</span>
                      </button>
                      <div className="input-box1">
                        <label htmlFor="name">Name</label>
                        <em className="required">*</em>
                        <input
                          style={{
                            margin: '0',
                            width: '100px',
                            marginLeft: '10px',
                            padding: '7.5px',
                          }}
                          autoFocus
                          onChange={handleChange}
                          value={manufacturerData.name}
                          type="text"
                          name="name"
                          title="Name"
                          className="input-text required-entry"
                        />
                      </div>
                      {hasInputError.nameInputError && touched.name && (
                        <p
                          style={{
                            color: '#ff0000',
                            display: 'block',
                            float: 'left',
                            marginLeft: '20px',
                          }}
                        >
                          Cannot be empty
                        </p>
                      )}
                      <button
                        onClick={cancelEditManufacturer}
                        disabled={false}
                        className="button"
                        name="cancel"
                        title="Cancel editing"
                        type="button"
                        style={{
                          marginLeft: 'auto',
                        }}
                      >
                        <span>Cancel</span>
                      </button>{' '}
                      <ul
                        className="level0_415"
                        style={{
                          display: 'block',
                        }}
                      ></ul>
                    </>
                  ) : (
                    <>
                      {' '}
                      <button
                        onClick={() => editManufacturer(m._id)}
                        disabled={false}
                        className="button"
                        name="edit"
                        title="Edit manufacturer"
                        type="button"
                        style={{
                          borderColor: '#0095EF',
                        }}
                      >
                        <span>Edit</span>
                      </button>{' '}
                      <p
                        style={{
                          margin: '0',
                          marginLeft: 'auto',
                        }}
                      >
                        {m.name[0].toUpperCase() + m.name.substring(1)}
                      </p>{' '}
                      <div style={{ marginLeft: 'auto' }}>
                        <button
                          onClick={() => deleteManufacturer(m._id)}
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
                        </button>{' '}
                        {selectedId === m._id && accessDenied && (
                          <p style={{ color: '#FE433C' }}>{accessErrMsg}</p>
                        )}
                      </div>
                      <ul
                        className="level0_415"
                        style={{
                          display: 'block',
                        }}
                      ></ul>
                    </>
                  )}
                </li>
              ))
            : 'Something went wrong'}
        </ul>
      </div>
    </>
  );
}

export default AdminManufacturers;
