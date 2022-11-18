const bcrypt = require('bcryptjs');
const validator = require('validator');
const Customer = require('../../../models/customer');
const CustomerType = require('../../types/customerType');
const { GraphQLNonNull, GraphQLString } = require('graphql');
const { invalidInput } = require('../../errorsData/errorsData');

const CreateCustomer = {
  type: CustomerType,
  description: 'Sign up a new customer',
  // use GraphQLString because validator package require a string
  args: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
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
    const existingCustomer = await Customer.findOne({
      email: args.email,
    });
    if (existingCustomer) {
      throw new Error(
        'This email has already taken, please choose another email.'
      );
    }
    const address = {
      firstName: '',
      lastName: '',
      company: '',
      country: '',
      stateOrProvince: '',
      zipCode: '',
      city: '',
      street: '',
      email: '',
      telephone: '',
    };

    const hashedPassword = await bcrypt.hash(args.password, 12);
    const newCustomer = new Customer({
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      password: hashedPassword,
      addresses: [
        { ...address, isBillingAddress: true },
        { ...address, isShippingAddress: true },
      ],
    });
    const savedCustomer = await newCustomer.save();

    return { ...savedCustomer._doc, _id: savedCustomer._id.toString() };
  },
};

module.exports = CreateCustomer;
