const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLObjectType,
  GraphQLInt,
} = require('graphql');

const FurnitureCategoryType = new GraphQLObjectType({
  name: 'FurnitureCategory',
  description: 'This represents the data of a furniture category',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    categoryId: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = FurnitureCategoryType;
