const { GraphQLNonNull, GraphQLID } = require('graphql');
const Product = require('../../../models/product');
const ProductType = require('../../types/productType');
const {
  notAuthenticated,
  noFound,
  accessDenied,
} = require('../../errorsData/errorsData');
const { clearImage } = require('../../../util/clearImg');

const DeleteProduct = {
  type: ProductType,
  description: 'Deleting a product',
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
    }

    const product = await Product.findById(args.id);
    if (!product) {
      noFound('No product found');
    }
    accessDenied(); // remove this line to set product as deleted
    clearImage(product.imgPath);
    product.isDeleted = true;
    await product.save();
    return true;
  },
};

module.exports = DeleteProduct;
