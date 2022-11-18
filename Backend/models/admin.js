const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
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
    mainAdmin: {
      type: Boolean,
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

module.exports = mongoose.model('Admin', AdminSchema);
