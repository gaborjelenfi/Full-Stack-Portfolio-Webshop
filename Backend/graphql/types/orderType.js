const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
} = require('graphql');
const OrderedProductType = require('./orderedProductType');

const OrderType = new GraphQLObjectType({
  name: 'Order',
  description: 'This represents the data of an order',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    customerId: { type: GraphQLID },
    customerEmail: { type: GraphQLString },
    orderId: { type: new GraphQLNonNull(GraphQLString) },
    orderedProductsArr: {
      type: new GraphQLList(OrderedProductType),
      description: 'List of ordered products',
    },
    orderedAt: { type: new GraphQLNonNull(GraphQLString) },
    billingAddress: { type: new GraphQLNonNull(GraphQLString) },
    shippingAddress: { type: new GraphQLNonNull(GraphQLString) },
    orderTotal: { type: new GraphQLNonNull(GraphQLFloat) },
    orderStatus: { type: new GraphQLNonNull(GraphQLString) },
    isDeleted: { type: GraphQLBoolean },
  }),
});

module.exports = OrderType;
