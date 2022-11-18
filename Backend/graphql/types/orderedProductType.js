const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
} = require('graphql');

const OrderedProductType = new GraphQLObjectType({
  name: 'OrderedProduct',
  description: 'This represents the data of a product',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    cartQty: { type: new GraphQLNonNull(GraphQLInt) },
    storageQuantity: { type: new GraphQLNonNull(GraphQLInt) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    imgPath: { type: new GraphQLNonNull(GraphQLString) },
    onSale: { type: new GraphQLNonNull(GraphQLBoolean) },
    furnitureCategory: { type: new GraphQLNonNull(GraphQLString) },
    color: { type: new GraphQLNonNull(GraphQLString) },
    manufacturer: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = OrderedProductType;
