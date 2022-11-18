const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql');

const adminAuthData = new GraphQLObjectType({
  name: 'adminAuthData',
  description: 'This represents the admin authentication data',
  fields: () => ({
    token: { type: new GraphQLNonNull(GraphQLString) },
    adminId: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = adminAuthData;
