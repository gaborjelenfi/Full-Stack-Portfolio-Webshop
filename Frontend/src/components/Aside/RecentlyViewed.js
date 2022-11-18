import React from 'react';
import useProductStore from '../../Store/productStore';
import { useNavigate } from 'react-router-dom';

const RecentlyViewed = () => {
  const recentlyViewed = useProductStore(state => state.recentlyViewed);
  const navigate = useNavigate();

  const goTo = (id) => {
    navigate({
      pathname: `/product-detail`,
      search: `id=${id}`,
    });
  };

  return (
    <div className="block block-list block-viewed">
      <div className="block-title"> Recently Viewed </div>
      <div className="block-content">
        <ol id="recently-viewed-items">
          {recentlyViewed &&
            recentlyViewed.map(product => (
              <li className="item odd" key={product.idOfProduct}>
                <p className="product-name">
                  <button style={{ backgroundColor: 'transparent' }} onClick={() => goTo(product.idOfProduct)}>
                    {' '}
                    {product.name}
                  </button>
                </p>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
};
export default RecentlyViewed;
