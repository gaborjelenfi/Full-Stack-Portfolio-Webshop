const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} = require('graphql');

const DeliveryAddressType = new GraphQLObjectType({
  name: 'DeliveryAddress',
  description:
    'This represents the data of a delivery address and contact info',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: GraphQLString },
    stateOrProvince: { type: GraphQLString },
    country: { type: new GraphQLNonNull(GraphQLString) },
    zipCode: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    telephone: { type: new GraphQLNonNull(GraphQLString) },
    isBillingAddress: { type: GraphQLBoolean },
    isShippingAddress: { type: GraphQLBoolean },
  }),
});

module.exports = DeliveryAddressType;
