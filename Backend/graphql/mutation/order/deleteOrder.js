const { GraphQLNonNull, GraphQLID } = require('graphql');
const { noFound, accessDenied } = require('../../errorsData/errorsData');
const OrderType = require('../../types/orderType');
const Order = require('../../../models/order');

const DeleteOrder = {
  type: OrderType,
  description: 'Deleting an order',
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
    }

    const order = await Order.findById(args.id);
    if (!order) {
      noFound('No order found');
    }
    accessDenied(); // remove this line to set order as deleted
    order.isDeleted = true;
    await order.save();
    return true;
  },
};

module.exports = DeleteOrder;
