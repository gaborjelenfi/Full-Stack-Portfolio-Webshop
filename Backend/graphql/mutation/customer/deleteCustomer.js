const Customer = require('../../../models/customer');
const CustomerType = require('../../types/customerType');
const { GraphQLNonNull, GraphQLID } = require('graphql');
const {
  noFound,
  notAuthenticated,
  accessDenied,
} = require('../../errorsData/errorsData');

const DeleteCustomer = {
  type: CustomerType,
  description: 'Deleting a customer account',
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    accessDenied(); // remove this line to set customer as deleted
    const customer = await Customer.findByIdAndRemove(args.id);
    if (!customer) {
      noFound('No customer found');
    }
    await customer.save();
  },
};

module.exports = DeleteCustomer;
