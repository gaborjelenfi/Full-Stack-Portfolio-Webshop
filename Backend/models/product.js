const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    storageQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    imgPath: {
      type: String,
      required: true,
    },
    onSale: {
      type: Boolean,
      required: true,
      default: false,
    },
    furnitureCategory: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    manufacturer: {
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

module.exports = mongoose.model('Product', productSchema);
