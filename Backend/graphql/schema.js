const { GraphQLSchema } = require('graphql');
const RootQueryType = require('./query/rootQuery');
const RootMutationType = require('./mutation/rootMutation');

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

module.exports = schema;
