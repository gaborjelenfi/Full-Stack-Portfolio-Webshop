import ProductInputForm from '../../components/InputForm/ProductInputForm';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../../Store/productStore';
import useUrlStore from '../../Store/urlStore';
import useFilterStore from '../../Store/filterStore';
import ReactPaginate from 'react-paginate';
import usePaginateStore from '../../Store/paginateStore';
import SideNav from '../../components/Navigation/SideNav';
import ShopBy from '../../components/Filter/ShopBy';
import useValidationStore from '../../Store/validationStore';
import useShopByStore from '../../Store/shopByStore';
import useAdminStore from '../../Store/adminStore';
import axios from 'axios';
import { generateBase64FromImage } from '../../utility/image';

const AdminProducts = () => {
  const URL = useUrlStore(state => state.baseURL);
  const token = useAdminStore(state => state.token);
  const filterName = useFilterStore(state => state.filterName);
  const filterValue = useFilterStore(state => state.filterValue);
  const setErrorMessage = useAdminStore(state => state.setErrorMessage);
  const errorMessage = useAdminStore(state => state.errorMessage);
  const accessDenied = useAdminStore(state => state.accessDenied);
  const setAccessDenied = useAdminStore(state => state.setAccessDenied);
  const accessErrMsg = useAdminStore(state => state.accessErrMsg);

  let allProductsQueryParam = `{ allProducts`;

  if (filterValue !== 'all') {
    allProductsQueryParam = `($filterValue: String!) {
      allProductsFilter(${filterName}: $filterValue)`;
  }

  const fetchAllColors = useShopByStore(state => state.fetchAllColors);
  const fetchAllManufacturers = useShopByStore(
    state => state.fetchAllManufacturers
  );
  const fetchAllPrices = useShopByStore(state => state.fetchAllPrices);
  const fetchAllProducts = useProductStore(state => state.fetchAllProducts);
  const products = useProductStore(state => state.products);
  const fetchManufacturersData = useFilterStore(
    state => state.fetchManufacturersData
  );
  const fetchAllCategories = useFilterStore(state => state.fetchAllCategories);
  const allCategories = useFilterStore(state =>
    state.categories
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(item => item.name !== 'all')
  );

  const sortBy = useProductStore(state => state.sortBy);
  const changeSortBy = useProductStore(state => state.changeSortBy);
  const asc = useProductStore(state => state.asc);
  const toggleAscDesc = useProductStore(state => state.toggleAscDesc);
  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsInt = useValidationStore(state => state.validateIsInt);
  const validateIsFloat = useValidationStore(state => state.validateIsFloat);
  const graphqlQuery = useAdminStore(state => state.graphqlQuery);
  const emptyProduct = useProductStore(state => state.emptyProduct);

  //Pagination
  const pageCount = usePaginateStore(state => state.pageCount);
  const itemOffset = usePaginateStore(state => state.itemOffset);
  const itemsPerPage = usePaginateStore(state => state.itemsPerPage);
  const setPageCount = usePaginateStore(state => state.setPageCount);
  const setItemOffset = usePaginateStore(state => state.setItemOffset);
  const setItemsPerPage = usePaginateStore(state => state.setItemsPerPage);
  const endOffset = itemOffset + itemsPerPage;

  const [touched, setTouched] = useState({});
  const [productData, setProductData] = useState(emptyProduct);
  const [selectedId, setSelectedId] = useState(null);
  const [oldPath, setOldPath] = useState();

  const getProductsFromDB = () => {
    const allProductsQuery = {
      query: `query FetchProducts ${allProductsQueryParam} {
          _id
          name
          description
          price
          imgPath
          onSale
          furnitureCategory
          storageQuantity
          color
          manufacturer
        }
      }`,
      variables: { filterValue: filterValue },
    };
    fetchAllProducts(allProductsQuery, filterValue, URL);
  };

  useEffect(() => {
    setAccessDenied(false);
    fetchAllCategories(URL);
    fetchManufacturersData(URL);
  }, [URL, fetchAllCategories, fetchManufacturersData, setAccessDenied]);

  useEffect(() => {
    setItemOffset(0);
    if (products.length <= itemsPerPage) {
      setPageCount(1);
      return;
    }
    setPageCount(Math.ceil(products.length / itemsPerPage));
  }, [itemsPerPage, products.length, setItemOffset, setPageCount]);

  // sort by name
  products.sort((a, b) => a.name.localeCompare(b.name));

  // sort by price
  if (sortBy === 'price') products.sort((a, b) => a.price - b.price);

  if (!asc) products.reverse();

  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  // Input change handler
  const handleChange = e => {
    setAccessDenied(false);
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    let value = e.target.value;
    if (e.target.name === 'imgPath') {
      setOldPath(productData.imgPath);
      value = e.target.files;
      // turn image into base64 code
      if (value) {
        generateBase64FromImage(e.target.files[0])
          .then(b64 => {
            setProductData({
              ...productData,
              imagePreview: b64,
              [e.target.name]: value,
              isImgChanged: true,
            });
          })
          .catch(e => {
            setProductData({ ...productData, imagePreview: null });
          });
      }
    }
    if (e.target.name === 'onSale') {
      value = e.target.checked;
    }
    setProductData({ ...productData, [e.target.name]: value });
  };

  const editProduct = _id => {
    const selectedProd = products.filter(item => item._id === _id);
    setProductData(...selectedProd);
  };

  const saveEditProduct = async () => {
    setOldPath(productData.imgPath);
    const data = new FormData();
    data.append('imgPath', productData.imgPath[0]);
    // if image file changed then send oldPath to backend to remove that image
    if (productData.isImgChanged) {
      data.append('oldPath', oldPath);
    }
    const [category] = allCategories.filter(
      c => c.name === productData.furnitureCategory
    );
    let imgData = productData.imgPath;
    // if image changed then upload the new image to the server
    if (productData.isImgChanged) {
      const response = await axios.post(
        `${URL}/upload-image`,
        data,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      imgData = response.data.filePath.replace('\\', '/');
    }
    const updateProductMutation = {
      query: `mutation UpdateProduct {
        updateProduct(
          id: "${productData._id}", 
          name: "${productData.name}", 
          description: "${productData.description}",
          storageQuantity: "${productData.storageQuantity}", 
          price: "${productData.price}", 
          onSale: "${productData.onSale}", 
          imgPath: "${imgData}",
          furnitureCategoryId: "${category?.categoryId}", 
          color: "${productData.color}", 
          manufacturer: "${productData.manufacturer}") {
          _id
        }
      }`,
    };
    await graphqlQuery(updateProductMutation, URL);
    setProductData(emptyProduct);
    fetchAllColors(URL);
    fetchAllManufacturers(URL);
    fetchAllPrices(URL);
    getProductsFromDB();
  };

  const cancelEditProduct = () => {
    setProductData(emptyProduct);
  };

  const deleteProduct = async _id => {
    setSelectedId(_id);
    const deleteProductQuery = {
      query: `mutation DeleteProduct {
        deleteProduct(id:"${_id}") {
          name
        }
      } `,
    };
    await graphqlQuery(deleteProductQuery, URL);
    getProductsFromDB();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setErrorMessage('');
    getProductsFromDB();
  }, [
    URL,
    allProductsQueryParam,
    filterName,
    filterValue,
    fetchAllProducts,
    itemOffset,
    itemsPerPage,
    setAccessDenied,
    setErrorMessage,
  ]);

  /// Validations
  let isSaveBtnDisabled = false;
  let hasInputError = {};

  const isEmptyDatas = [
    { inputKey: 'name', data: productData.name },
    { inputKey: 'manufacturer', data: productData.manufacturer },
    { inputKey: 'color', data: productData.color },
    { inputKey: 'price', data: productData.price.toString() },
    {
      inputKey: 'storageQuantity',
      data: productData.storageQuantity.toString(),
    },
    { inputKey: 'description', data: productData.description },
    { inputKey: 'furnitureCategory', data: productData.furnitureCategory },
  ];

  if (!productData.imgPath) {
    isSaveBtnDisabled = true;
  }

  hasInputError = { ...hasInputError, ...validateIsEmpty(...isEmptyDatas) };
  hasInputError = {
    ...hasInputError,
    ...validateIsFloat(productData.price.toString()),
  };
  hasInputError = {
    ...hasInputError,
    ...validateIsInt({
      inputKey: 'storageQuantity',
      data: productData.storageQuantity.toString(),
    }),
  };

  if (!(Object.keys(hasInputError).length === 0)) {
    isSaveBtnDisabled = true;
  }
  /// Validations ends

  const imageStyle = {
    border: '1px solid black',
    display: 'block',
    width: '200px',
    height: '200px',
    marginTop: '30px',
  };

  return (
    <>
      <div className="inner-page">
        <div id="page">
          <br />
          {/* Main Container */}
          <section className="main-container col2-left-layout bounceInUp animated">
            <div className="container">
              <div className="row">
                <div className="col-main col-sm-7 col-sm-push-1">
                  <article className="col-main">
                    <div className="page-title">
                      <h1>
                        {filterName === 'priceBelow'
                          ? 'furnitures under $' + filterValue + ''
                          : filterName === 'priceAbove'
                          ? 'furnitures above $' + filterValue
                          : filterValue + ' furnitures'}{' '}
                      </h1>
                    </div>
                    <div className="toolbar">
                      <div className="sorter"></div>
                      <div id="sort-by">
                        <label className="left">Sort By: </label>
                        <ul>
                          <li>
                            <span>
                              {sortBy[0].toUpperCase() + sortBy.substring(1)}
                              <span className="right-arrow" />
                            </span>
                            <ul>
                              <li>
                                <Link
                                  onClick={() => changeSortBy('name')}
                                  to="./"
                                >
                                  Name
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() => changeSortBy('price')}
                                  to="./"
                                >
                                  Price
                                </Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                        <Link
                          onClick={() => toggleAscDesc(!asc)}
                          className="button-asc left"
                          to="./"
                          title="Set Descending Direction"
                        >
                          <span
                            className={asc ? 'top_arrow' : 'buttom_arrow'}
                          />
                        </Link>{' '}
                      </div>
                      <div className="pager">
                        <div id="limiter">
                          <label>View: </label>
                          <ul>
                            <li>
                              <Link
                                onClick={() => setItemsPerPage(itemsPerPage)}
                                to="./"
                              >
                                {itemsPerPage}
                                <span className="right-arrow" />
                              </Link>
                              <ul>
                                <li>
                                  <Link
                                    onClick={() => setItemsPerPage(10)}
                                    to="./"
                                  >
                                    {10}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() => setItemsPerPage(20)}
                                    to="./"
                                  >
                                    {20}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() => setItemsPerPage(30)}
                                    to="./"
                                  >
                                    {30}
                                  </Link>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <div className="pages">
                          <label>Page:</label>
                          <ul className="pagination">
                            <li>
                              <ReactPaginate
                                breakLabel="..."
                                nextLabel="»"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={1}
                                pageCount={pageCount}
                                forcePage={itemOffset/10}
                                previousLabel={'«'}
                                renderOnZeroPageCount={null}
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="category-products">
                      {products
                        ? products.slice(itemOffset, endOffset).map(p => (
                            <ol
                              key={p._id}
                              className="products-list"
                              id="products-list"
                              style={{ float: 'none' }}
                            >
                              {productData._id === p._id ? (
                                <>
                                  {productData.imagePreview ? (
                                    <div
                                      className="product-image"
                                      style={imageStyle}
                                    >
                                      {' '}
                                      <img
                                        crossOrigin='anonymous'
                                        className="small-image"
                                        src={`${productData.imagePreview}`}
                                        alt={'product'}
                                      />{' '}
                                    </div>
                                  ) : (
                                    <div
                                      className="product-image"
                                      style={imageStyle}
                                    >
                                      {' '}
                                      <img
                                        crossOrigin='anonymous'
                                        className="small-image"
                                        src={`${URL}/${p.imgPath}`}
                                        alt={'product'}
                                      />{' '}
                                    </div>
                                  )}
                                  <ProductInputForm
                                    touched={touched}
                                    hasInputError={hasInputError}
                                    handleChange={handleChange}
                                    productData={productData}
                                  />
                                  <br />
                                  <div
                                    className="actions"
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <button
                                      onClick={saveEditProduct}
                                      disabled={isSaveBtnDisabled}
                                      className="button"
                                      name="save"
                                      title="Save edit product"
                                      type="button"
                                      style={{
                                        borderColor: '#A6D785',
                                        backgroundColor: isSaveBtnDisabled
                                          ? '#CFD2CF'
                                          : '',
                                        pointerEvents: isSaveBtnDisabled
                                          ? 'none'
                                          : '',
                                        marginLeft: '60px',
                                      }}
                                    >
                                      <span>Save</span>
                                    </button>
                                    {errorMessage && errorMessage}
                                    <button
                                      onClick={cancelEditProduct}
                                      disabled={false}
                                      className="button"
                                      name="cancel"
                                      title="Cancel button"
                                      type="button"
                                      style={{
                                        marginLeft: '60px',
                                      }}
                                    >
                                      <span>Cancel</span>
                                    </button>{' '}
                                  </div>
                                </>
                              ) : (
                                <li className="item">
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
                                    <div className="desc std">
                                      <p>{p.description} </p>
                                    </div>
                                    <p className="product-name">
                                      color: {p.color}
                                    </p>
                                    <br />
                                    {p.storageQuantity > 0 ? (
                                      <p className="availability in-stock not-pull-right">
                                        <span>In Stock</span>
                                      </p>
                                    ) : (
                                      <p className="availability out-of-stock not-pull-right">
                                        <span>Out of Stock</span>
                                      </p>
                                    )}
                                    <div className="price-box">
                                      <p className="special-price">
                                        {' '}
                                        <span className="price-label" />{' '}
                                        <span className="price">
                                          {' '}
                                          {`$${p.price}`}{' '}
                                        </span>{' '}
                                      </p>{' '}
                                      {p.onSale && (
                                        <p className="old-price">
                                          {' '}
                                          <span className="price-label" />{' '}
                                          <span className="price">
                                            {' '}
                                            {`$${(
                                              p.price +
                                              p.price / 10
                                            ).toFixed(2)}`}{' '}
                                          </span>{' '}
                                        </p>
                                      )}
                                    </div>
                                    <div className="actions">
                                      <button
                                        onClick={() => editProduct(p._id)}
                                        disabled={false}
                                        className="button"
                                        title="Edit product"
                                        name="edit"
                                        type="button"
                                        style={{ borderColor: '#0095EF' }}
                                      >
                                        <span>Edit</span>
                                      </button>
                                      <button
                                        onClick={() => deleteProduct(p._id)}
                                        disabled={false}
                                        className="button"
                                        name="delete"
                                        title="Delete product"
                                        type="button"
                                        style={{
                                          borderColor: '#FE433C',
                                          marginLeft: '20px',
                                        }}
                                      >
                                        <span>Delete</span>
                                      </button>{' '}
                                      {selectedId === p._id && accessDenied && (
                                        <p style={{ color: '#FE433C' }}>
                                          {accessErrMsg}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              )}
                            </ol>
                          ))
                        : 'No products'}
                    </div>
                  </article>
                </div>
                <div className="col-left sidebar col-sm-2 col-xs-12 col-sm-pull-9">
                  <aside className="col-left sidebar">
                    <div className="block block-list">
                      <div className="block-title"> New product </div>
                      {/*block-title*/}
                      {/* BEGIN BOX-CATEGORY */}
                      <div className="box-content box-category">
                        <ul>
                          <li>
                            <Link to="../new-product">New product</Link>
                          </li>
                        </ul>
                      </div>
                      {/*box-content box-category*/}
                    </div>
                    <div className="side-nav-categories">
                      <div className="block-title"> Categories </div>
                      {/*block-title*/}
                      {/* BEGIN BOX-CATEGORY */}
                      <div className="box-content box-category">
                        <ul>
                          <SideNav />
                        </ul>
                      </div>
                      {/*box-content box-category*/}
                    </div>
                    <ShopBy />
                  </aside>
                </div>
              </div>
            </div>
          </section>
          {/* Main Container End */}
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
