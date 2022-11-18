const furnitureCategory = require('../../models/furnitureCategory');
const furnitureCategoryType = require('../types/furnitureCategoryType');
const { GraphQLList } = require('graphql');

const AllFurnitureCategoriesQuery = {
  type: new GraphQLList(furnitureCategoryType),
  description: 'Query all the furniture categorys',
  resolve: async (parent, args, context) => {
    const allFurnitureCategories = await furnitureCategory.find({
      isDeleted: false,
    });
    return allFurnitureCategories;
  },
};

module.exports = AllFurnitureCategoriesQuery;
