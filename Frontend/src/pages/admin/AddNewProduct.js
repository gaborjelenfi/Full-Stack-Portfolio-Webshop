import React, { useState } from 'react';
import axios from 'axios';
import ProductInputForm from '../../components/InputForm/ProductInputForm';
import useProductStore from '../../Store/productStore';
import useValidationStore from '../../Store/validationStore';
import useFilterStore from '../../Store/filterStore';
import { useNavigate } from 'react-router-dom';
import useUrlStore from '../../Store/urlStore';
import useAdminStore from '../../Store/adminStore';
import { generateBase64FromImage } from '../../utility/image';

function AdminAddNewProduct() {
  const navigate = useNavigate();

  const URL = useUrlStore(state => state.baseURL);
  
  const graphqlQuery = useAdminStore(state => state.graphqlQuery);
  const token = useAdminStore(state => state.token);
  const setErrorMessage = useAdminStore(state => state.setErrorMessage);
  const errorMessage = useAdminStore(state => state.errorMessage);

  const emptyProduct = useProductStore(state => state.emptyProduct);

  const validateIsEmpty = useValidationStore(state => state.validateIsEmpty);
  const validateIsInt = useValidationStore(state => state.validateIsInt);
  const validateIsFloat = useValidationStore(state => state.validateIsFloat);

  const allCategories = useFilterStore(state =>
    state.categories
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(item => item.name !== 'all')
  );
  
  const [touched, setTouched] = useState({});
  const [productData, setProductData] = useState(emptyProduct);

  const saveCreateProduct = async () => {
    const data = new FormData();
    data.append('imgPath', productData.imgPath[0]);

    const [category] = allCategories.filter(
      c => c.name === productData.furnitureCategory
    );
    // upload image to server
    const response = await axios.post(
      `${URL}/upload-image`,
      data,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );

    const createProductMutation = {
      query: `mutation CreateProduct {
        createProduct(
          name: "${productData.name}", 
          description: "${productData.description}",
          storageQuantity: "${productData.storageQuantity}", 
          price: "${productData.price}", 
          imgPath: "${response.data.filePath.replace('\\', '/')}",
          onSale: "${productData.onSale}", 
          furnitureCategoryId: "${category?.categoryId}", 
          color: "${productData.color}", 
          manufacturer: "${productData.manufacturer}") {
          _id
        }
      }`,
    };
    await graphqlQuery(createProductMutation, URL);
    setProductData(emptyProduct);
    if (!errorMessage) {
      navigate(-1);
    }
  };

  const cancelCreateProduct = () => {
    setProductData(emptyProduct);
    navigate(-1);
  };

  // input change handler
  const handleChange = e => {
    setErrorMessage('');
    setTouched({ ...touched, [e.target.name]: true });
    let value = e.target.value;
    // selected image turn into base64 code
    if (e.target.name === 'imgPath') {
      value = e.target.files;
      if (value) {
        generateBase64FromImage(e.target.files[0])
          .then(b64 => {
            setProductData({
              ...productData,
              imagePreview: b64,
              [e.target.name]: value,
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
    { inputKey: 'onSale', data: productData.onSale.toString() },
    { inputKey: 'furnitureCategory', data: productData.furnitureCategory }
  ];

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

  if (!productData.imgPath) {
    isSaveBtnDisabled = true;
  }

  if (!(Object.keys(hasInputError).length === 0)) {
    isSaveBtnDisabled = true;
  }
  /// Validations ends

  const imageStyle = {
    border: '1px solid black',
    display: 'block',
    marginRight: '-200px',
    width: '200px',
    height: '200px',
    marginTop: '30px',
  };

  return (
    <div className="products-list">
      <div className="product-image" style={imageStyle}>
        {' '}
        {productData.imagePreview && (
          <img
            crossOrigin='anonymous'
            className="small-image"
            src={`${productData.imagePreview}`}
            alt={'product'}
          />
        )}{' '}
      </div>
      <ProductInputForm
        touched={touched}
        hasInputError={hasInputError}
        handleChange={handleChange}
        productData={productData}
      />
      <br />
      <div
        className="actions"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <button
          onClick={saveCreateProduct}
          disabled={isSaveBtnDisabled}
          className="button"
          name="save"
          title="Save edit product"
          type="button"
          style={{
            borderColor: '#A6D785',
            backgroundColor: isSaveBtnDisabled ? '#CFD2CF' : '',
            pointerEvents: isSaveBtnDisabled ? 'none' : '',
          }}
        >
          <span>Save</span>
        </button>
        <button
          onClick={() => cancelCreateProduct()}
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
      <br />
    </div>
  );
}

export default AdminAddNewProduct;
