const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    categoryId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      require: true,
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

module.exports = mongoose.model('furnitureCategory', CategorySchema);
