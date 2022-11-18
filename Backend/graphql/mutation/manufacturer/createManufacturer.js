const validator = require('validator');
const Manufacturer = require('../../../models/manufacturer');
const ManufacturerType = require('../../types/manufacturerType');
const { GraphQLNonNull, GraphQLString } = require('graphql');
const { invalidInput } = require('../../errorsData/errorsData');

const CreateManufacturer = {
  type: ManufacturerType,
  description: 'Creating a new brand',
  // use GraphQLString because validator package require a string
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    if (validator.isEmpty(args.name)) {
      errors.push({
        message: 'Manufacturer name has to be at least 1 character',
      });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    const brand = new Manufacturer({
      name: args.name,
      isDeleted: false,
    });
    const savedManufacturer = await brand.save();
    return { ...savedManufacturer._doc, _id: savedManufacturer._id.toString() };
  },
};

module.exports = CreateManufacturer;
