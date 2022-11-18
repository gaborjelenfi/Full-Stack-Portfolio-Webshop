const Manufacturer = require('../../models/manufacturer');
const ManufacturerType = require('../types/manufacturerType');
const { GraphQLID } = require('graphql');
const { noFound } = require('../errorsData/errorsData');

const ManufacturerQuery = {
  type: ManufacturerType,
  description: 'Query a single manufacturer name',
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (parent, args) => {
    const manufacturer = await Manufacturer.findById(args.id);
    if (!manufacturer) {
      noFound('No manufacturer found');
    }
    return {
      ...manufacturer._doc,
      _id: manufacturer._id.toString(),
    };
  },
};

module.exports = ManufacturerQuery;
