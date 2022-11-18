const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');
const Order = require('../../../models/order');
const OrderType = require('../../types/orderType');
const validator = require('validator');
const { invalidInput } = require('../../errorsData/errorsData');
const ProductInputType = require('../../types/productInputType');
const Product = require('../../../models/product');
const ObjectId = require('mongodb').ObjectId;

const CreateOrder = {
  type: OrderType,
  description: 'Creating a new order',
  // use GraphQLString because validator package require a string
  args: {
    customerEmail: { type: GraphQLString },
    customerId: { type: GraphQLID },
    orderId: { type: new GraphQLNonNull(GraphQLString) },
    orderedAt: { type: new GraphQLNonNull(GraphQLString) },
    orderedProductsArr: { type: new GraphQLList(ProductInputType) },
    billingAddress: { type: new GraphQLNonNull(GraphQLString) },
    shippingAddress: { type: new GraphQLNonNull(GraphQLString) },
    orderTotal: { type: new GraphQLNonNull(GraphQLString) },
    orderStatus: { type: new GraphQLNonNull(GraphQLString) },
    isDeleted: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (
      validator.isEmpty(args.orderId) ||
      validator.isEmpty(args.orderedAt) ||
      validator.isEmpty(args.billingAddress) ||
      validator.isEmpty(args.shippingAddress) ||
      validator.isEmpty(args.orderTotal) ||
      validator.isEmpty(args.orderStatus)
    ) {
      errors.push({ message: 'Input fields have to be filled' });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    args.orderedProductsArr.forEach(async el => {
      await Product.updateOne(
        { _id: ObjectId(el._id) },
        { $set: { storageQuantity: el.storageQuantity - el.cartQty } }
      );
    });
    const newOrder = new Order({
      customerEmail: args.customerEmail,
      customerId: args.customerId,
      orderId: args.orderId,
      orderedAt: args.orderedAt,
      orderedProductsArr: args.orderedProductsArr,
      billingAddress: args.billingAddress,
      shippingAddress: args.shippingAddress,
      orderTotal: args.orderTotal,
      orderStatus: args.orderStatus,
      isDeleted: false,
    });
    const savedOrder = await newOrder.save();

    return { ...savedOrder._doc, _id: savedOrder._id.toString() };
  },
};

module.exports = CreateOrder;
