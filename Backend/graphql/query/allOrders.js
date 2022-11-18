const Order = require('../../models/order');
const OrderType = require('../types/orderType');
const { GraphQLList } = require('graphql');
const { notAuthenticated } = require('../errorsData/errorsData');

const AllOrdersQuery = {
  type: new GraphQLList(OrderType),
  description: 'Query all the orders',
  resolve: async (parent, args, context) => {
    if (!context.isAuth) {
      notAuthenticated();
    }
    const allOrders = await Order.find({ isDeleted: false });
    return allOrders;
  },
};

module.exports = AllOrdersQuery;
