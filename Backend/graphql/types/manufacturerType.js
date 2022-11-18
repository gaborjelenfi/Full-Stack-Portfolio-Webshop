const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLObjectType,
} = require('graphql');

const ManufacturerType = new GraphQLObjectType({
  name: 'Manufacturer',
  description: 'This represents the data of a manufacturer',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = ManufacturerType;
