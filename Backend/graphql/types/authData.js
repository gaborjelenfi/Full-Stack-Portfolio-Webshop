const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql');

const AuthData = new GraphQLObjectType({
  name: 'AuthData',
  description: 'This represents the authentication data',
  fields: () => ({
    token: { type: new GraphQLNonNull(GraphQLString) },
    customerId: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = AuthData;
