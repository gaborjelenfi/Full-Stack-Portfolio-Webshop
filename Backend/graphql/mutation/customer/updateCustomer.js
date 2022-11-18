const bcrypt = require('bcryptjs');
const validator = require('validator');
const Customer = require('../../../models/customer');
const CustomerType = require('../../types/customerType');
const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const {
  noFound,
  invalidInput,
  notAuthenticated,
} = require('../../errorsData/errorsData');

const UpdateCustomer = {
  type: CustomerType,
  description: 'Updating a signed up customer',
  // use GraphQLString because validator package require a string
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    currentPassword: { type: GraphQLString },
    confirmNewPassword: { type: GraphQLString },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (!context.isAuth) {
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
    const customer = await Customer.findById(args.id);
    if (!customer) {
      noFound('No customer found');
    }
    if (args.currentPassword) {
      const isEqual = await bcrypt.compare(
        args.currentPassword,
        customer.password
      );
      if (!isEqual) {
        noFound('Wrong password');
      }
    }

    customer.firstName = args.firstName;
    customer.lastName = args.lastName;
    customer.email = args.email;
    if (args.confirmNewPassword) {
      const hashedPassword = await bcrypt.hash(args.confirmNewPassword, 12);
      customer.password = hashedPassword;
    }
    const savedCustomer = await customer.save();

    return { ...savedCustomer._doc };
  },
};

module.exports = UpdateCustomer;
