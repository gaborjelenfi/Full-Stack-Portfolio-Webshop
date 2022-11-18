const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema(
  {
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

module.exports = mongoose.model('Manufacturer', ManufacturerSchema);
