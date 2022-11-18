import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useFilterStore from '../../Store/filterStore';
import useUrlStore from '../../Store/urlStore';

const SideNav = () => {
  const URL = useUrlStore(state => state.baseURL);
  const navigate = useNavigate()
  const location = useLocation();
  
  const fetchAllCategories = useFilterStore(state => state.fetchAllCategories);
  const allCategories = useFilterStore(state =>
    state.categories.sort((a, b) => a.name.localeCompare(b.name))
  );
  const changeFilter = useFilterStore(state => state.changeFilter);
  const categoryFilterName = 'categoryName';

  useEffect(() => {
    fetchAllCategories(URL);
  }, [URL, fetchAllCategories]);

  const goTo = (filterName, filterValue) => {
    navigate({
      pathname: `${location.pathname === '/products-list' ? '/products-list' : '/admin/dashboard/products'}`,
      search: `filter:${filterName}=${filterValue}`,
    });
  };

  return (
    <>
      {allCategories
        ? allCategories.map(c => (
            <li key={c._id}>
              {' '}
              <button
                style={{ backgroundColor: 'transparent' }}
                onClick={() => {
                  changeFilter('categoryName', c.name)
                  goTo('categoryName', c.name)
                }}
                to={`./filter?${categoryFilterName}=${c.name}`}
              >
                {c.name[0].toUpperCase() + c.name.substring(1)}
              </button>{' '}
              <ul
                className="level0_415"
                style={{
                  display: 'block',
                }}
              ></ul>
            </li>
          ))
        : 'Something went wrong'}
    </>
  );
};

export default SideNav;
