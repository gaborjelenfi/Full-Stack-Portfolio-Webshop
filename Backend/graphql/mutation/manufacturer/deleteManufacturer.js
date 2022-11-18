const Manufacturer = require('../../../models/manufacturer');
const Product = require('../../../models/product');
const ManufacturerType = require('../../types/manufacturerType');
const { GraphQLNonNull, GraphQLID } = require('graphql');
const {
  noFound,
  notAuthenticated,
  accessDenied,
} = require('../../errorsData/errorsData');

const DeleteManufacturer = {
  type: ManufacturerType,
  description: 'Deleting a selected manufacturer',
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
     }

    const manufacturer = await Manufacturer.findById(args.id);
    if (!manufacturer) {
      noFound('No manufacturer found');
    }
    accessDenied(); // remove this line to set admin as deleted
    manufacturer.isDeleted = true;

    // every manufacturers set as deleted with that manufacturer
    await Product.updateMany(
      { manufacturer: manufacturer.name },
      { $set: { isDeleted: true } }
    );

    await manufacturer.save();
    return true;
  },
};

module.exports = DeleteManufacturer;
