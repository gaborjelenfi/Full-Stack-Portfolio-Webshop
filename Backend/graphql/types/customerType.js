const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} = require('graphql');
const CustomerOrderType = require('./customerOrderType');
const DeliveryAddressType = require('./deliveryAddressType');

const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  description: 'This represents the data of a customer',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
    addresses: {
      type: new GraphQLList(DeliveryAddressType),
      description: "List of customer's addresses",
    },
    orderedProducts: {
      type: new GraphQLList(CustomerOrderType),
      description: "List of customer's ordered products",
    },
  }),
});

module.exports = CustomerType;
