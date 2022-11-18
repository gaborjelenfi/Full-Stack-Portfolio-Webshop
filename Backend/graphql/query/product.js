const Product = require('../../models/product');
const ProductType = require('../types/productType');
const { GraphQLID } = require('graphql');
const { noFound } = require('../errorsData/errorsData');

const ProductQuery = {
  type: ProductType,
  description: 'Query a single product',
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (parent, args, context) => {
    const product = await Product.findById(args.id);
    if (!product) {
      noFound('No product found!');
    }
    return {
      ...product._doc,
      _id: product._id.toString(),
    };
  },
};

module.exports = ProductQuery;
