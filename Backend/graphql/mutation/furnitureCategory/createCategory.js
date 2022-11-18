const validator = require('validator');
const furnitureCategory = require('../../../models/furnitureCategory');
const CategoryType = require('../../types/furnitureCategoryType');
const { GraphQLNonNull, GraphQLString } = require('graphql');
const { invalidInput } = require('../../errorsData/errorsData');

const CreateCategory = {
  type: CategoryType,
  description: 'Creating a new furniture Category',
  // use GraphQLString because validator package require a string
  args: {
    categoryId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    if (validator.isEmpty(args.name)) {
      errors.push({
        message: 'Furniture category name has to be at least 1 character',
      });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    const category = new furnitureCategory({
      categoryId: args.categoryId,
      name: args.name,
      isDeleted: false,
    });
    const savedCategory = await category.save();
    return { ...savedCategory._doc, _id: savedCategory._id.toString() };
  },
};

module.exports = CreateCategory;
