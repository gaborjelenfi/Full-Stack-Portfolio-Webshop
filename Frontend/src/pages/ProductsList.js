import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Product from './../components/Product';
import ShopBy from '../components/Filter/ShopBy';
import SideMiniCart from '../components/Aside/SideMiniCart';
import RecentlyViewed from '../components/Aside/RecentlyViewed';
import SideNav from '../components/Navigation/SideNav';
import useProductStore from '../Store/productStore';
import useUrlStore from '../Store/urlStore';
import useFilterStore from '../Store/filterStore';
import ReactPaginate from 'react-paginate';
import usePaginateStore from '../Store/paginateStore';
import useCustomerStore from '../Store/customerStore';

const ProductsList = () => {
  const URL = useUrlStore(state => state.baseURL);
  const filterName = useFilterStore(state => state.filterName);
  const filterValue = useFilterStore(state => state.filterValue);
  const isAuth = useCustomerStore(state => state.isAuth);
  const customerId = useCustomerStore(state => state.customerId);
  const fetchCustomerAddresses = useCustomerStore(
    state => state.fetchCustomerAddresses
  );
  let allProductsQueryParam = `{ allProducts`;

  if (filterValue !== 'all') {
    allProductsQueryParam = `($filterValue: String!) {
      allProductsFilter(${filterName}: $filterValue)`;
  }
  
  const fetchAllProducts = useProductStore(state => state.fetchAllProducts);
  const products = useProductStore(state => state.products);
  const [isLoading, setIsLoading] = useState(true);

  const sortBy = useProductStore(state => state.sortBy);
  const changeSortBy = useProductStore(state => state.changeSortBy);
  const asc = useProductStore(state => state.asc);
  const toggleAscDesc = useProductStore(state => state.toggleAscDesc);

  //Pagination
  const pageCount = usePaginateStore(state => state.pageCount);
  const itemOffset = usePaginateStore(state => state.itemOffset);
  const itemsPerPage = usePaginateStore(state => state.itemsPerPage);
  const setPageCount = usePaginateStore(state => state.setPageCount);
  const setItemOffset = usePaginateStore(state => state.setItemOffset);
  const setItemsPerPage = usePaginateStore(state => state.setItemsPerPage);
  const endOffset = itemOffset + itemsPerPage;

  useEffect(() => {
    window.scrollTo(0, 0);
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
    setIsLoading(false);
  }, [
    URL,
    allProductsQueryParam,
    filterName,
    filterValue,
    fetchAllProducts,
    itemOffset,
    itemsPerPage,
    setItemOffset
  ]);
  
  useEffect(() => {
    setItemOffset(0);
    if(products.length <= itemsPerPage) {
      setPageCount(1);
      return;
    }
    setPageCount(Math.ceil(products.length / itemsPerPage));
  }, [itemsPerPage, products.length, setItemOffset, setPageCount])
  
  // sort products by name
  products.sort((a, b) => a.name.localeCompare(b.name));

  // sort products by price
  if (sortBy === 'price') products.sort((a, b) => a.price - b.price);

  if (!asc) products.reverse();

  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if(isAuth) {
      fetchCustomerAddresses(customerId, URL);
    }
  },[URL, customerId, fetchCustomerAddresses, isAuth])
 
  return (
    <div className="inner-page">
      <div id="page">
        <br />
        {/* Main Container */}
        <section className="main-container col2-left-layout bounceInUp animated">
          <div className="container">
            <div className="row">
              <div className="col-main col-sm-9 col-sm-push-3">
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
                                to={`${window.location.pathname}${window.location.search}`}
                              >
                                Name
                              </Link>
                            </li>
                            <li>
                              <Link
                                onClick={() => changeSortBy('price')}
                                to={`${window.location.pathname}${window.location.search}`}
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
                        to={`${window.location.pathname}${window.location.search}`}
                        title="Set Descending Direction"
                      >
                        <span className={asc ? 'top_arrow' : 'buttom_arrow'} />
                      </Link>{' '}
                    </div>
                    <div className="pager">
                      <div id="limiter">
                        <label>View: </label>
                        <ul>
                          <li>
                            <Link
                              onClick={() => setItemsPerPage(itemsPerPage)}
                              to={`${window.location.pathname}${window.location.search}`}
                            >
                              {itemsPerPage}
                              <span className="right-arrow" />
                            </Link>
                            <ul>
                              <li>
                                <Link
                                  onClick={() => setItemsPerPage(10)}
                                  to={`${window.location.pathname}${window.location.search}`}
                                >
                                  {10}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() => setItemsPerPage(20)}
                                  to={`${window.location.pathname}${window.location.search}`}
                                >
                                  {20}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() => setItemsPerPage(30)}
                                  to={`${window.location.pathname}${window.location.search}`}
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
                              //initialPage={0}
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
                          >
                            <Product
                              _id={p._id}
                              name={p.name}
                              description={p.description}
                              storageQuantity={p.storageQuantity}
                              price={p.price}
                              imgPath={p.imgPath}
                              onSale={p.onSale}
                              furnitureCategory={p.furnitureCategory}
                              color={p.color}
                              manufacturer={p.manufacturer}
                              isLoading={isLoading}
                            />
                          </ol>
                        ))
                      : 'No products'}
                  </div>
                </article>
              </div>
              <div className="col-left sidebar col-sm-3 col-xs-12 col-sm-pull-9">
                <aside className="col-left sidebar">
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
                  <SideMiniCart />
                  <RecentlyViewed />
                </aside>
              </div>
            </div>
          </div>
        </section>
        {/* Main Container End */}
      </div>
    </div>
  );
};

export default ProductsList;
