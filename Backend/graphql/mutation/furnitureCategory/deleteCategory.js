const Category = require('../../../models/furnitureCategory');
const Product = require('../../../models/product');
const CategoryType = require('../../types/furnitureCategoryType');
const { GraphQLNonNull, GraphQLID } = require('graphql');
const {
  noFound,
  notAuthenticated,
  accessDenied,
} = require('../../errorsData/errorsData');

const DeleteCategory = {
  type: CategoryType,
  description: 'Deleting a furniture category',
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
    }

    const category = await Category.findById(args.id);
    if (!category) {
      noFound('No furniture category found');
    }
    accessDenied(); // remove this line to set category as deleted

    //  every products set as deleted in that category
    await Product.updateMany(
      { furnitureCategory: category.name },
      { $set: { isDeleted: true } }
    );
    category.isDeleted = true;
    await category.save();
    return true;
  },
};

module.exports = DeleteCategory;
