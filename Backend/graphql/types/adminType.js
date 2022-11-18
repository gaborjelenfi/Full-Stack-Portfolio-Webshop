const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const AdminType = new GraphQLObjectType({
  name: 'Admin',
  description: 'This represents the data of an admin',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    mainAdmin: { type: new GraphQLNonNull(GraphQLBoolean) },
    isDeleted: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
});

module.exports = AdminType;
