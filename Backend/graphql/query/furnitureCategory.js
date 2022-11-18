const furnitureCategory = require('../../models/furnitureCategory');
const CategoryType = require('../types/furnitureCategoryType');
const { GraphQLID, GraphQLInt } = require('graphql');
const { noFound } = require('../errorsData/errorsData');

const FurnitureCategoryQuery = {
  type: CategoryType,
  description: 'Query a single furniture category name',
  args: {
    id: { type: GraphQLID },
    categoryId: { type: GraphQLInt },
  },
  resolve: async (parent, args) => {
    const FCategory = await furnitureCategory.findOne({
      categoryId: args.categoryId,
      isDeleted: false,
    });
    if (!FCategory) {
      noFound('No furniture category found!');
    }
    return {
      ...FCategory._doc,
      _id: FCategory._id.toString(),
    };
  },
};

module.exports = FurnitureCategoryQuery;
