const Product = require('../../models/product');
const ProductType = require('../types/productType');
const {
  GraphQLList,
  GraphQLString,
} = require('graphql');

module.exports = {
  AllProductsQuery: {
    type: new GraphQLList(ProductType),
    description: 'Query all the products',
    resolve: async (parent, args, context) => {
      const allProducts = await Product.find(
        { isDeleted: false } //list only products that are marked as isDeleted:false
      );
      return allProducts;
    },
  },

  AllProductsFilterQuery: {
    type: new GraphQLList(ProductType),
    description: 'Query all the products with filter',
    args: {
      categoryName: { type: GraphQLString },
      priceBelow: { type: GraphQLString },
      priceAbove: { type: GraphQLString },
      color: { type: GraphQLString },
      manufacturer: { type: GraphQLString },
    },
    resolve: async (parent, args, context) => {
      let allProducts = [];
      if (args.categoryName) {
        allProducts = await Product.find({
          furnitureCategory: args.categoryName,
          isDeleted: false,
        });
      }
      if (args.priceAbove) {
        allProducts = await Product.find({
          price: { $gte: args.priceAbove },
          isDeleted: false,
        });
      }
      if (args.priceBelow) {
        allProducts = await Product.find({
          price: { $lt: args.priceBelow },
          isDeleted: false,
        });
      }
      if (args.color) {
        allProducts = await Product.find({
          color: args.color,
          isDeleted: false,
        });
      }
      if (args.manufacturer) {
        allProducts = await Product.find({
          manufacturer: args.manufacturer,
          isDeleted: false,
        });
      }
      return allProducts;
    },
  },
};
