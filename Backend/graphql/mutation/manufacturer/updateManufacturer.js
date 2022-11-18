const validator = require('validator');
const Manufacturer = require('../../../models/manufacturer');
const ManufacturerType = require('../../types/manufacturerType');
const { GraphQLNonNull, GraphQLID, GraphQLString } = require('graphql');
const {
  noFound,
  invalidInput,
  notAuthenticated,
} = require('../../errorsData/errorsData');

const UpdateManufacturer = {
  type: ManufacturerType,
  description: 'Updating a selected manufacturer',
  // use GraphQLString because validator package require a string
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    const manufacturer = await Manufacturer.findById(args.id);
    if (!manufacturer) {
      noFound('No manufacturer found');
    }
    if (validator.isEmpty(args.name)) {
      errors.push({
        message: 'Manufacturer name has to be at least 1 character',
      });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    manufacturer.name = args.name;
    const updatedManufacturer = await manufacturer.save();
    return {
      ...updatedManufacturer._doc,
      _id: updatedManufacturer._id.toString(),
    };
  },
};

module.exports = UpdateManufacturer;
