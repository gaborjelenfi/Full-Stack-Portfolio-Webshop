import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../Store/adminStore';
import useFilterStore from '../../Store/filterStore';
import useProductStore from '../../Store/productStore';
import useUrlStore from '../../Store/urlStore';
import useValidationStore from '../../Store/validationStore';

function AdminCategories() {
  const URL = useUrlStore(state => state.baseURL);

  const fetchAllCategories = useFilterStore(state => state.fetchAllCategories);
  const allCategories = useFilterStore(state =>
    state.categories.sort((a, b) => a.name.localeCompare(b.name))
  );

  const graphqlQuery = useAdminStore(state => state.graphqlQuery);
  const setErrorMessage = useAdminStore(state => state.setErrorMessage);
  const accessDenied = useAdminStore(state => state.accessDenied);
  const setAccessDenied = useAdminStore(state => state.setAccessDenied);
  const accessErrMsg = useAdminStore(state => state.accessErrMsg);

  const validateIsInt = useValidationStore(state => state.validateIsInt);
  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  
  const toggleAscDesc = useProductStore(state => state.toggleAscDesc);
  const asc = useProductStore(state => state.asc);
  const emptyCategoryData = {
    name: '',
    categoryId: '',
    newCategory: '',
  };
  const [categoryData, setCategoryData] = useState(emptyCategoryData);
  const [newCategoryData, setNewCategoryData] = useState({ newCategory: '' });
  const [sortBy, setSortBy] = useState('name');
  const [touched, setTouched] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setAccessDenied(false);
    setErrorMessage('');
    fetchAllCategories(URL);
  }, [URL, fetchAllCategories, setErrorMessage]);

  if (sortBy === 'name') {
    allCategories.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortBy === 'categoryId') {
    allCategories.sort((a, b) => a.categoryId - b.categoryId);
  }

  if (!asc) allCategories.reverse();

  // Input change handler
  const handleChange = e => {
    setAccessDenied(false);
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    const value = e.target.value;
    if (e.target.name === 'newCategory') {
      setNewCategoryData({ ...newCategoryData, [e.target.name]: value });
    }
    setCategoryData({ ...categoryData, [e.target.name]: value });
  };

  /// Validations
  let hasInputError = {};

  const isEmptyDatas = [
    { inputKey: 'name', data: categoryData.name },
    { inputKey: 'categoryId', data: categoryData.categoryId.toString() },
  ];

  hasInputError = { ...hasInputError, ...validateIsEmpty(...isEmptyDatas) };
  hasInputError = {
    ...hasInputError,
    ...validateIsEmpty({
      inputKey: 'newCategory',
      data: newCategoryData.newCategory,
    }),
  };

  hasInputError = {
    ...hasInputError,
    ...validateIsInt({
      inputKey: 'categoryId',
      data: categoryData.categoryId.toString(),
    }),
  };
  /// Validations ends

  const addNewCategory = async () => {
    const genCategoryId =
      allCategories.length > 0
        ? Math.max(...allCategories.map(c => c.categoryId)) + 1
        : 1;
    const createCategoryMutation = {
      query: `mutation CreateCategory {
        createCategory(
          categoryId: "${genCategoryId}", 
          name: "${newCategoryData.newCategory}") {
            _id
            categoryId
            name
        }
      }`,
    };
    await graphqlQuery(createCategoryMutation, URL);
    fetchAllCategories(URL);
    setNewCategoryData({ newCategory: '' });
    setTouched({ ...touched, newCategory: false });
  };

  const editCategory = _id => {
    setAccessDenied(false);
    setTouched({ ...touched, newCategory: false });
    const selectedCategory = allCategories.filter(item => item._id === _id);
    setCategoryData(...selectedCategory);
  };

  const cancelEditCategory = () => {
    setTouched({ ...touched, newCategory: false });
    setCategoryData(emptyCategoryData);
  };

  const saveEditCategory = async () => {
    const updateProductMutation = {
      query: `mutation UpdateCategory {
        updateCategory(
          id: "${categoryData._id}", 
          categoryId: "${categoryData.categoryId}", 
          name: "${categoryData.name}") {
          _id
          categoryId
          name
        }
      }`,
    };
    await graphqlQuery(updateProductMutation, URL);
    setCategoryData(emptyCategoryData);
    fetchAllCategories(URL);
  };

  const deleteCategory = async _id => {
    setSelectedId(_id);
    const DeleteCategoryMutation = {
      query: `mutation DeleteCategory {
        deleteCategory(id: "${_id}") {
          _id
        }
      }`,
    };
    await graphqlQuery(DeleteCategoryMutation, URL);
    fetchAllCategories(URL);
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
        <h1>Categories</h1>
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
            New category name:
          </label>
          <input
            style={{
              width: '300px',
              margin: '7.5px 15px 0',
              padding: '10px',
            }}
            onChange={handleChange}
            value={newCategoryData.newCategory}
            type="text"
            name="newCategory"
            title="Add new category"
            className="input-text required-entry"
          />
        </div>
        <button
          onClick={addNewCategory}
          disabled={hasInputError.newCategoryInputError}
          className="button"
          name="add"
          title="Add category"
          type="button"
          style={{
            display: 'inline-block',
            backgroundColor: hasInputError.newCategoryInputError
              ? '#CFD2CF'
              : '',
            pointerEvents: hasInputError.newCategoryInputError ? 'none' : '',
          }}
        >
          <span>Add</span>
        </button>{' '}
      </div>
      {hasInputError.newCategoryInputError && touched.newCategory && (
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
        style={{
          display: 'flex',
        }}
      >
        <h4>Sort by: </h4>
        <button
          className="button"
          onClick={() => setSortBy('name')}
          style={{ marginLeft: '20px' }}
        >
          Name
        </button>
        <button
          className="button"
          onClick={() => setSortBy('categoryId')}
          style={{ marginLeft: '20px' }}
        >
          Category ID
        </button>
        <div id="sort-by">
          <Link
            onClick={() => toggleAscDesc(!asc)}
            className="button-asc left"
            to="./"
            title="Set Descending Direction"
            style={{
              margin: '6px',
            }}
          >
            <span className={asc ? 'top_arrow' : 'buttom_arrow'} />
          </Link>{' '}
        </div>
      </div>
      <div
        className="box-content box-category"
        style={{ width: '100%', margin: '30px' }}
      >
        <div style={alertMsgStyle}>
          <strong>Warning!</strong> If you delete a category, the process will
          delete all the products in that category!
        </div>
        <ul>
          {allCategories
            ? allCategories
                .filter(item => item.categoryId !== 0)
                .map(c => (
                  <li
                    style={{
                      textAlign: 'center',
                      lineHeight: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px',
                    }}
                    key={c._id}
                  >
                    {categoryData._id === c._id ? (
                      <>
                        {' '}
                        <button
                          onClick={saveEditCategory}
                          disabled={
                            hasInputError.nameInputError && touched.name
                          }
                          className="button"
                          name="save"
                          title="Save category"
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
                            value={categoryData.name}
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
                        <div className="input-box1">
                          <label htmlFor="name" style={{ marginLeft: '20px' }}>
                            Category ID:
                          </label>
                          <p
                            style={{
                              display: 'inline-block',
                              margin: '0',
                              width: '20px',
                              padding: '7.5px',
                            }}
                            className="input-text"
                          >
                            {categoryData.categoryId}
                          </p>
                        </div>
                        <button
                          onClick={cancelEditCategory}
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
                          onClick={() => editCategory(c._id)}
                          disabled={false}
                          className="button"
                          name="edit"
                          title="Edit category"
                          type="button"
                          style={{
                            borderColor: '#0095EF',
                            marginRight: 'auto',
                          }}
                        >
                          <span>Edit</span>
                        </button>{' '}
                        <p
                          style={{
                            margin: '0',
                          }}
                        >
                          Name: {c.name[0].toUpperCase() + c.name.substring(1)}
                        </p>{' '}
                        <p
                          style={{
                            margin: '0',
                            marginLeft: ' 20px',
                          }}
                        >{`Category ID: ${c.categoryId}`}</p>
                        <div style={{ marginLeft: 'auto' }}>
                          <button
                            onClick={() => deleteCategory(c._id)}
                            disabled={false}
                            className="button"
                            name="delete"
                            title="Delete category"
                            type="button"
                            style={{
                              borderColor: '#FE433C',
                            }}
                          >
                            <span>Delete</span>
                          </button>
                          {selectedId === c._id && accessDenied && (
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

export default AdminCategories;
