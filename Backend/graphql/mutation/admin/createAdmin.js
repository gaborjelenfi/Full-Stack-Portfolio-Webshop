const { GraphQLNonNull, GraphQLString } = require('graphql');
const Admin = require('../../../models/admin');
const AdminType = require('../../types/adminType');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const {
  invalidInput,
  notAuthenticated,
} = require('../../errorsData/errorsData');

const CreateAdmin = {
  type: AdminType,
  description: 'Sign up a new admin',
  // use GraphQLString because validator package require a string
  args: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    const errors = [];
    if (!validator.isEmail(args.email)) {
      errors.push({ message: 'Use a valid email address' });
    }
    if (
      validator.isEmpty(args.password) ||
      !validator.isLength(args.password, { min: 6 })
    ) {
      errors.push({ message: 'Password has to be at least 6 characters' });
    }
    if (
      validator.isEmpty(args.firstName) ||
      validator.isEmpty(args.lastName) ||
      validator.isEmpty(args.email)
    ) {
      errors.push({ message: 'Input fields have to be filled' });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    const existingAdmin = await Admin.findOne({
      email: args.email,
    });
    if (existingAdmin) {
      throw new Error(
        'This email has already taken, please choose another email.'
      );
    }
    const hashedPassword = await bcrypt.hash(args.password, 12);
    const newAdmin = new Admin({
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      password: hashedPassword,
      isDeleted: false,
      mainAdmin: false,
    });
    const savedAdmin = await newAdmin.save();

    return { ...savedAdmin._doc, _id: savedAdmin._id.toString() };
  },
};

module.exports = CreateAdmin;
