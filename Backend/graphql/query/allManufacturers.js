const Manufacturer = require('../../models/manufacturer');
const ManufacturerType = require('../types/manufacturerType');
const { GraphQLList } = require('graphql');

const AllManufacturersQuery = {
  type: new GraphQLList(ManufacturerType),
  description: 'Query all the manufacturers',
  resolve: async (parent, args, context) => {
    const allManufacturers = await Manufacturer.find({ isDeleted: false });
    return allManufacturers;
  },
};

module.exports = AllManufacturersQuery;
