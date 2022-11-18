const validator = require('validator');
const Customer = require('../../../models/customer');
const { invalidInput, noFound } = require('../../errorsData/errorsData');
const { GraphQLNonNull, GraphQLID, GraphQLList } = require('graphql');
const OrderType = require('../../types/orderType');
const OrderInputType = require('../../types/orderInputType');

const UpdateCustomerOrders = {
  type: OrderType,
  description: "Create new customer's order log",
  args: {
    customerId: { type: new GraphQLNonNull(GraphQLID) },
    order: { type: new GraphQLList(OrderInputType) },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (!context.isAuth) {
      notAuthenticated();
    }
    if (validator.isEmpty(args.customerId)) {
      errors.push({ message: 'Input fields have to be filled' });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    const customer = await Customer.findById(args.customerId);
    if (!customer) {
      noFound('No customer found');
    }

    // Registered customers orders saved into their documents too.
    customer.orderedProducts.push(...args.order);

    await customer.save();
    return {
      ...customer.orderedProducts,
    };
  },
};

module.exports = UpdateCustomerOrders;
