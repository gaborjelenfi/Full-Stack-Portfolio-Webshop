const Order = require('../../models/order');
const { GraphQLID, GraphQLString } = require('graphql');
const { notAuthenticated, noFound } = require('../errorsData/errorsData');
const OrderType = require('../types/orderType');

const OrderQuery = {
  type: OrderType,
  description: 'Query a single order',
  args: {
    id: { type: GraphQLID },
    orderId: { type: GraphQLString },
  },
  resolve: async (parent, args, context) => {
    let order = null;
    if (!context.isAuth && !context.isAdminAuth) {
      notAuthenticated();
    }

    if (args.id) {
      order = await Order.findById(args.id);
    }
    if (args.orderId) {
      order = await Order.findOne({ orderId: args.orderId });
    }
    if (!order) {
      noFound('No order found!');
    }
    return {
      ...order._doc,
      _id: order._id.toString(),
    };
  },
};

module.exports = OrderQuery;
