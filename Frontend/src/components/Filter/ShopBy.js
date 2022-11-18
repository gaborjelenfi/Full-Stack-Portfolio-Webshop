import React, { useEffect } from 'react';
import useShopByStore from '../../Store/shopByStore';
import useUrlStore from '../../Store/urlStore';
import { useLocation, useNavigate } from 'react-router-dom';
import useFilterStore from '../../Store/filterStore';

// Filter products
const ShopBy = () => {
  const URL = useUrlStore(state => state.baseURL);
  const navigate = useNavigate();
  const location = useLocation();

  const changeFilter = useFilterStore(state => state.changeFilter);

  const fetchAllColors = useShopByStore(state => state.fetchAllColors);
  const fetchAllManufacturers = useShopByStore(
    state => state.fetchAllManufacturers
  );
  const fetchAllPrices = useShopByStore(state => state.fetchAllPrices);
  const allManufacturers = useShopByStore(state => state.manufacturers);
  const allColors = useShopByStore(state => state.colors);
  const allPrices = useShopByStore(state => state.prices);

  const manufacturersWithCounts = {};
  const colorsWithCounts = {};
  allManufacturers
    .map(({ manufacturer }) => manufacturer)
    .forEach(x => {
      manufacturersWithCounts[x] = (manufacturersWithCounts[x] || 0) + 1;
    });
  allColors
    .map(({ color }) => color)
    .forEach(x => {
      colorsWithCounts[x] = (colorsWithCounts[x] || 0) + 1;
    });

  const colorFilterName = 'color';
  const manufacturerFilterName = 'manufacturer';
  const priceBelowFilterName = 'priceBelow';
  const priceStartingValue = '0.01';
  const priceBelowValue = '199.99';
  const priceAboveFilterName = 'priceAbove';
  const priceAboveValue = '200.00';

  useEffect(() => {
    fetchAllColors(URL);
    fetchAllManufacturers(URL);
    fetchAllPrices(URL);
  }, [fetchAllColors, fetchAllManufacturers, URL, fetchAllPrices]);

  const goTo = (filterName, filterValue) => {
    navigate({
      pathname: `${location.pathname === '/products-list' ? '/products-list' : '/admin/dashboard/products'}`,
      search: `filter:${filterName}=${filterValue}`,
    });
  };

  return (
    <div className="block block-layered-nav">
      <div className="block-title">Shop By</div>
      <div className="block-content">
        <p className="block-subtitle">Shopping Options</p>
        <dl id="narrow-by-list">
          <dt className="odd">Price</dt>
          <dd className="odd">
            <ol>
              <li>
                {' '}
                <button
                  style={{ backgroundColor: 'transparent' }}
                  onClick={() => {
                    changeFilter(priceBelowFilterName, priceBelowValue);
                    goTo(priceBelowFilterName, priceBelowValue);
                  }}
                >
                  <span className="price">${priceStartingValue}</span> -{' '}
                  <span className="price">${priceBelowValue}</span>
                </button>{' '}
                (
                {
                  allPrices.filter(item => item.price <= +priceBelowValue)
                    .length
                }
                ){' '}
              </li>
              <li>
                {' '}
                <button
                  style={{ backgroundColor: 'transparent' }}
                  onClick={() => {
                    changeFilter(priceAboveFilterName, priceAboveValue);
                    goTo(priceAboveFilterName, priceAboveValue);
                  }}
                >
                  <span className="price">${priceAboveValue}</span> & above
                </button>{' '}
                (
                {
                  allPrices.filter(item => item.price >= +priceAboveValue)
                    .length
                }
                ){' '}
              </li>
            </ol>
          </dd>
          <dt className="even">Manufacturer</dt>
          <dd className="even">
            <ol>
              {allManufacturers &&
                Object.entries(manufacturersWithCounts).map(
                  ([key, value], index) => (
                    <li key={index}>
                      {' '}
                      <button
                        style={{ backgroundColor: 'transparent' }}
                        onClick={() => {
                          changeFilter(manufacturerFilterName, key);
                          goTo(manufacturerFilterName, key);
                        }}
                      >
                        {key[0].toUpperCase() + key.substring(1)}
                      </button>{' '}
                      ({value}){' '}
                    </li>
                  )
                )}
            </ol>
          </dd>
          <dt className="odd">Color</dt>
          <dd className="odd">
            <ol>
              {allColors &&
                Object.entries(colorsWithCounts).map(([key, value], index) => (
                  <li key={index}>
                    {' '}
                    <button
                      style={{ backgroundColor: 'transparent' }}
                      onClick={() => {
                        changeFilter(colorFilterName, key);
                        goTo(colorFilterName, key);
                      }}
                    >
                      {key[0].toUpperCase() + key.substring(1)}
                    </button>{' '}
                    ({value}){' '}
                  </li>
                ))}
            </ol>
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default ShopBy;
