const Customer = require('../../models/customer');
const CustomerType = require('../types/customerType');
const { GraphQLID, GraphQLString } = require('graphql');
const { notAuthenticated, noFound } = require('../errorsData/errorsData');

const CustomerQuery = {
  type: CustomerType,
  description: 'Query a single customer',
  args: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
  },
  resolve: async (parent, args, context) => {
    let customer = null;
    if (!context.isAuth && !context.isAdminAuth) {
      notAuthenticated();
    }

    if (args.id) {
      customer = await Customer.findById(args.id);
    }
    if (args.email) {
      customer = await Customer.findOne({ email: args.email });
    }
    if (!customer) {
      noFound('No customer found!');
    }
    return {
      ...customer._doc,
      _id: customer._id.toString(),
    };
  },
};

module.exports = CustomerQuery;
