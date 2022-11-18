const validator = require('validator');
const Product = require('../../../models/product');
const ProductType = require('../../types/productType');
const { invalidInput } = require('../../errorsData/errorsData');
const { notAuthenticated } = require('../../errorsData/errorsData');
const { GraphQLNonNull, GraphQLString } = require('graphql');
const furnitureCategory = require('../../../models/furnitureCategory');

const CreateProduct = {
  type: ProductType,
  description: 'Creating a new product',
  // use GraphQLString because validator package require a string
  args: {
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
    const product = new Product({
      name: args.name,
      description: args.description,
      storageQuantity: args.storageQuantity,
      price: args.price,
      imgPath: args.imgPath,
      onSale: args.onSale,
      furnitureCategory: FCategory.name,
      color: args.color,
      manufacturer: args.manufacturer,
      isDeleted: false,
    });
    const savedProduct = await product.save();
    return { ...savedProduct._doc, _id: savedProduct._id.toString() };
  },
};

module.exports = CreateProduct;
