const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');
const ProductType = require('./productType');

const CustomerOrderType = new GraphQLObjectType({
  name: 'CustomerOrder',
  description: 'This represents the data of an order',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    customerId: { type: GraphQLID },
    customerEmail: { type: GraphQLString },
    orderId: { type: new GraphQLNonNull(GraphQLString) },
    orderedProductsArr: {
      type: new GraphQLList(ProductType),
    },
    orderedAt: { type: new GraphQLNonNull(GraphQLString) },
    billingAddress: { type: new GraphQLNonNull(GraphQLString) },
    shippingAddress: { type: new GraphQLNonNull(GraphQLString) },
    orderTotal: { type: new GraphQLNonNull(GraphQLString) },
    orderStatus: { type: new GraphQLNonNull(GraphQLString) },
    isDeleted: { type: GraphQLBoolean },
  }),
});

module.exports = CustomerOrderType;
