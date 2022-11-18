const bcrypt = require('bcryptjs');
const validator = require('validator');
const Admin = require('../../../models/admin');
const AdminType = require('../../types/adminType');
const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const {
  noFound,
  invalidInput,
  notAuthenticated,
} = require('../../errorsData/errorsData');

const UpdateAdmin = {
  type: AdminType,
  description: 'Updating a registered admin',
  // use GraphQLString because validator package require a string
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    currentPassword: { type: GraphQLString },
    confirmNewPassword: { type: GraphQLString }
  },
  resolve: async (parent, args, context) => {
    const errors = [];
      if (!context.isAdminAuth) {
      notAuthenticated();
    }
    if (!validator.isEmail(args.email)) {
      errors.push({ message: 'Use a valid email address' });
    }
    if (args.confirmNewPassword) {
      if (
        validator.isEmpty(args.confirmNewPassword) ||
        !validator.isLength(args.confirmNewPassword, { min: 6 })
        ) {
          errors.push({ message: 'Password has to be at least 6 characters' });
        }
      }
      if (errors.length > 0) {
        invalidInput(errors);
      }
      const admin = await Admin.findById(args.id);
      if (!admin) {
      noFound('No admin found');
    }
    if (args.currentPassword) {
      const isEqual = await bcrypt.compare(
        args.currentPassword,
        admin.password
      );
      if (!isEqual) {
        noFound('Wrong password');
      }
    }

    admin.firstName = args.firstName;
    admin.lastName = args.lastName;
    admin.email = args.email;
    if (args.confirmNewPassword) {
      const hashedPassword = await bcrypt.hash(args.confirmNewPassword, 12);
      admin.password = hashedPassword;
    }
    const savedAdmin = await admin.save();

    return { ...savedAdmin._doc };
  },
};

module.exports = UpdateAdmin;
