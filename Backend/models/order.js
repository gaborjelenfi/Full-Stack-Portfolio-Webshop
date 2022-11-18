const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
    },
    orderedProductsArr: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    orderedAt: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    orderTotal: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Order', OrderSchema);
