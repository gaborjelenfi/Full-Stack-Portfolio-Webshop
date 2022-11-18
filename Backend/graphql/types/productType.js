const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
} = require('graphql');

const ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'This represents the data of a product',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    cartQty: { type: GraphQLInt },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    storageQuantity: { type: new GraphQLNonNull(GraphQLInt) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    imgPath: { type: new GraphQLNonNull(GraphQLString) },
    onSale: { type: new GraphQLNonNull(GraphQLBoolean) },
    furnitureCategory: { type: new GraphQLNonNull(GraphQLString) },
    color: { type: new GraphQLNonNull(GraphQLString) },
    manufacturer: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = ProductType;
