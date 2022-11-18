import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFilterStore from '../../Store/filterStore';

const Navigation = () => {
  const navigate = useNavigate();
  const allCategories = useFilterStore(state =>
    state.categories.sort((a, b) => a.name.localeCompare(b.name))
  );
  const changeFilter = useFilterStore(state => state.changeFilter);
  const categoryFilterName = 'categoryName';

  const goTo = (filterName, filterValue) => {
    navigate({
      pathname: `/products-list`,
      search: `filter:${filterName}=${filterValue}`,
    });
  };

  return (
    <nav>
      <div className="container">
        {/* Header Logo */}
        <div className="logo">
          <Link
            title="Datson"
            onClick={() => changeFilter(categoryFilterName, 'all')}
            to="/products-list"
          >
            <img crossOrigin='anonymous' alt="Datson" src="images/logo.png" />
          </Link>
        </div>
        {/* End Header Logo */}
        <ul className="nav menu-item menu-item-left hidden-xs">
          {allCategories
            ? allCategories.slice(0, allCategories.length / 2).map(c => (
                <li key={c._id} className="mega-menu active">
                  <Link
                    onClick={() => {
                      changeFilter(categoryFilterName, c.name)
                      goTo(categoryFilterName, c.name)
                    }}
                      
                    to={`/products-list?filter:${categoryFilterName}=${c.name}`}
                  >
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))
            : 'Something went wrong'}
        </ul>
        <ul className="nav menu-item menu-item-right hidden-xs">
          {allCategories
            ? allCategories
                .slice(allCategories.length / 2, allCategories.length)
                .map(c => (
                  <li key={c._id} className="mega-menu active">
                    <Link
                      onClick={() => {
                        changeFilter(categoryFilterName, c.name)
                        goTo(categoryFilterName, c.name)
                      }
                      }
                      to={`/products-list?filter:${categoryFilterName}=${c.name}`}
                    >
                      <span>{c.name}</span>
                    </Link>
                  </li>
                ))
            : 'Something went wrong'}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
