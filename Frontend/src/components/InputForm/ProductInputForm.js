import React from 'react';
import useFilterStore from '../../Store/filterStore';

// products input component at admin site
const ProductInputForm = ({
  touched,
  handleChange,
  productData,
  hasInputError,
}) => {
  const allCategories = useFilterStore(state =>
    state.categories
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(item => item.name !== 'all')
  );
  const allManufacturersData = useFilterStore(state =>
    state.allManufacturersData.sort((a, b) => a.name.localeCompare(b.name))
  );

  const emptyInputErrMsg = 'This is a required field';
  const numberInputErrMsg = 'Only numbers allowed';

  const resizeInputTags = {
    padding: '4px',
    lineHeight: '19px',
    fontSize: '16px',
  };

  const requiredInput = {
    color: '#ff0000',
    display: 'block',
  };

  return (
    <li className="item" style={{ listStyleType: 'none' }}>
      <form action="/upload-image" method="POST" encType="multipart/form-data">
        <div className="product-shop">
          <h2 className="product-name">
            <label
              style={{
                fontSize: '14px',
              }}
              htmlFor="name"
            >
              Name
            </label>
            <em
              style={{
                fontSize: '20px',
              }}
              className="required"
            >
              *
            </em>
            <div className="input-box1">
              <input
                style={resizeInputTags}
                autoFocus
                onChange={handleChange}
                value={productData.name}
                type="text"
                name="name"
                title="Name"
                className="input-text required-entry"
              />
              {hasInputError.nameInputError && touched.name && (
                <p style={requiredInput}>{emptyInputErrMsg}</p>
              )}
            </div>
          </h2>
          <div className="input-box1">
            <label
              style={{
                fontSize: '14px',
              }}
              htmlFor="manufacturer"
            >
              Manufacturer
            </label>
            <em
              style={{
                fontSize: '12px',
              }}
              className="required"
            >
              *
            </em>
            <select
              style={{ resizeInputTags, display: 'block' }}
              onChange={handleChange}
              value={productData.manufacturer}
              name="manufacturer"
              titel="manufacturer"
              className="validate-select required-entry"
            >
              <option value="">Please select a category</option>
              {allManufacturersData &&
                allManufacturersData.map(m => (
                  <option key={m.name} value={m.name} title={m.name}>
                    {m.name}
                  </option>
                ))}
            </select>
          </div>
          <label
            style={{
              fontSize: '14px',
            }}
            htmlFor="description"
          >
            Description
          </label>
          <em
            style={{
              fontSize: '12px',
            }}
            className="required"
          >
            *
          </em>
          <div className="desc std">
            <div className="input-box1">
              <textarea
                style={resizeInputTags}
                onChange={handleChange}
                type="text"
                name="description"
                title="Description"
                defaultValue={productData.description}
                rows={5}
                cols={20}
                maxLength='80'
                className="input-text required-entry"
              />
              {hasInputError.descriptionInputError && touched.description && (
                <p style={requiredInput}>{emptyInputErrMsg}</p>
              )}
            </div>
          </div>
          <label
            style={{
              fontSize: '14px',
            }}
            htmlFor="color"
          >
            Color
          </label>
          <em
            style={{
              fontSize: '12px',
            }}
            className="required"
          >
            *
          </em>
          <div className="input-box1">
            <input
              style={resizeInputTags}
              onChange={handleChange}
              value={productData.color}
              type="text"
              name="color"
              title="Corol"
              className="input-text required-entry"
            />
            {hasInputError.colorInputError && touched.color && (
              <p style={requiredInput}>{emptyInputErrMsg}</p>
            )}
          </div>
          <label
            style={{
              fontSize: '14px',
            }}
            htmlFor="storageQuantity"
          >
            Storage quantity
          </label>
          <em
            style={{
              fontSize: '12px',
            }}
            className="required"
          >
            *
          </em>
          <div className="input-box1">
            <input
              style={resizeInputTags}
              onChange={handleChange}
              value={productData.storageQuantity}
              type="text"
              name="storageQuantity"
              title="Storage quantity"
              className="input-text required-entry"
            />
            {hasInputError.storageQuantityInputError &&
              touched.storageQuantity && (
                <p style={requiredInput}>{numberInputErrMsg}</p>
              )}
          </div>
          <label
            style={{
              fontSize: '14px',
            }}
            htmlFor="price"
          >
            Price (if on sale, add the sale price)
          </label>
          <em
            style={{
              fontSize: '12px',
            }}
            className="required"
          >
            *
          </em>
          <div>
            <p className="special-price">
              {' '}
              <span className="price-label" /> <span className="price">$</span>{' '}
            </p>{' '}
            <input
              style={resizeInputTags}
              onChange={handleChange}
              value={productData.price}
              type="text"
              name="price"
              title="Price"
              className="input-text required-entry"
            />
            {hasInputError.priceInputError && touched.price && (
              <p style={requiredInput}>{numberInputErrMsg}</p>
            )}
          </div>
          <label
            style={{
              fontSize: '14px',
              margin: '2px',
            }}
            htmlFor="onSale"
          >
            On Sale
          </label>
          <div className="input-box1">
            <input
              onChange={handleChange}
              defaultChecked={productData.onSale}
              type="checkbox"
              name="onSale"
              title="On Sale"
              className="input-text required-entry"
            />
          </div>
          <div className="input-box">
            <label htmlFor="furnitureCategory">Category</label>
            <em
              style={{
                fontSize: '12px',
              }}
              className="required"
            >
              *
            </em>
            <br />
            <select
              style={resizeInputTags}
              onChange={handleChange}
              value={productData.furnitureCategory}
              name="furnitureCategory"
              titel="Furniture Category"
              className="validate-select required-entry"
            >
              <option value="">Please select a category</option>
              {allCategories &&
                allCategories.map(c => (
                  <option key={c.name} value={c.name} title={c.name}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <br />
          <div className="input-box1">
            <label
              htmlFor="imgPath"
              style={{
                borderColor: '#FFa500',
                padding: '7px 15px',
                fontSize: '14px',
                borderWidth: '1px',
                color: '#333',
                MozTransition: 'all 0.3s linear',
                WebkitTransition: 'all 0.3s linear',
                borderStyle: 'solid',
                WebkitAppearance: 'button',
                cursor: 'pointer',
              }}
            >
              Upload image
            </label>
            <input
              onChange={handleChange}
              name="imgPath"
              id="imgPath"
              title="Upload new image"
              type="file"
              accept="image/*"
              style={{
                visibility: 'hidden',
              }}
            />
            {!productData.imgPath && touched.imgPath && (
              <p style={requiredInput}>{emptyInputErrMsg}</p>
            )}
          </div>
        </div>
      </form>
    </li>
  );
};

export default ProductInputForm;
