const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    addresses: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    orderedProducts: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Customer', CustomerSchema);
