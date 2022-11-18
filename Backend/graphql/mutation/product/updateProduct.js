const validator = require('validator');
const Product = require('../../../models/product');
const ProductType = require('../../types/productType');
const { notAuthenticated, noFound } = require('../../errorsData/errorsData');
const { GraphQLID, GraphQLNonNull, GraphQLString } = require('graphql');
const furnitureCategory = require('../../../models/furnitureCategory');

const UpdateProduct = {
  type: ProductType,
  description: 'Updating a product',
  // use GraphQLString because validator package require a string
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    storageQuantity: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLString) },
    imgPath: { type: new GraphQLNonNull(GraphQLString) },
    onSale: { type: new GraphQLNonNull(GraphQLString) },
    furnitureCategoryId: { type: new GraphQLNonNull(GraphQLString) },
    color: { type: new GraphQLNonNull(GraphQLString) },
    manufacturer: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    const product = await Product.findById(args.id);
    if (!product) {
      noFound('No product found');
    }
    if (
      validator.isEmpty(args.name) ||
      validator.isEmpty(args.description) ||
      validator.isEmpty(args.storageQuantity) ||
      validator.isEmpty(args.price) ||
      validator.isEmpty(args.imgPath) ||
      validator.isEmpty(args.onSale) ||
      validator.isEmpty(args.furnitureCategoryId) ||
      validator.isEmpty(args.color) ||
      validator.isEmpty(args.manufacturer)
    ) {
      errors.push({ message: 'Input fields have to be filled' });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    const FCategory = await furnitureCategory
      .findOne(
        { categoryId: +args.furnitureCategoryId },
        (err, result) => result.name
      )
      .clone()
      .catch(function (err) {
        console.log(err);
      });
    product.name = args.name;
    product.description = args.description;
    product.storageQuantity = args.storageQuantity;
    product.price = args.price;
    product.imgPath = args.imgPath;
    product.onSale = args.onSale;
    product.furnitureCategory = FCategory.name;
    product.color = args.color;
    product.manufacturer = args.manufacturer;
    const updatedProduct = await product.save();
    return {
      ...updatedProduct._doc,
      _id: updatedProduct._id.toString(),
    };
  },
};

module.exports = UpdateProduct;
