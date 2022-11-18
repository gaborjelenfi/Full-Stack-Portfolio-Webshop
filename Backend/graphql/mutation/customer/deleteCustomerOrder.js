const Customer = require('../../../models/customer');
const { noFound, accessDenied } = require('../../errorsData/errorsData');
const { GraphQLNonNull, GraphQLID } = require('graphql');
const OrderType = require('../../types/orderType');

const DeleteCustomerOrders = {
  type: OrderType,
  description: "Delete a customer's order log",
  args: {
    customerId: { type: new GraphQLNonNull(GraphQLID) },
    _id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    const customer = await Customer.findById(args.customerId);
    if (!customer) {
      noFound('No customer found');
    }

    // find order in customer's documents
    const [deletedCustomerOrder] = customer.orderedProducts.filter(order => {
      if (order._id === args._id) {
        return (order.isDeleted = true);
      }
    });

    // get index of order in customer's orderedProducts array
    const index = customer.orderedProducts.findIndex(el => el._id === args._id);

    accessDenied(); // remove this line to set admin as deleted
    customer.orderedProducts[index] = deletedCustomerOrder;
    await customer.save();
    return true;
  },
};

module.exports = DeleteCustomerOrders;
