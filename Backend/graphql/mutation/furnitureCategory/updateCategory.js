const validator = require('validator');
const Category = require('../../../models/furnitureCategory');
const CatergoryType = require('../../types/furnitureCategoryType');
const { GraphQLNonNull, GraphQLID, GraphQLString } = require('graphql');
const {
  noFound,
  invalidInput,
  notAuthenticated,
} = require('../../errorsData/errorsData');

const UpdateCategory = {
  type: CatergoryType,
  description: 'Updating a category',
  // use GraphQLString because validator package require a string
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    categoryId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (!context.isAdminAuth) {
      notAuthenticated();
    }

    const category = await Category.findById(args.id);
    if (!category) {
      noFound('No category found');
    }
    if (validator.isEmpty(args.name)) {
      errors.push({
        message: 'Furniture category name has to be at least 1 character',
      });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    category.name = args.name;
    category.categoryId = args.categoryId;
    const updatedCategory = await category.save();
    return {
      ...updatedCategory._doc,
      _id: updatedCategory._id.toString(),
    };
  },
};

module.exports = UpdateCategory;
