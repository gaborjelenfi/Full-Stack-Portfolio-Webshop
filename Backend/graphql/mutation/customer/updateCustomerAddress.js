const validator = require('validator');
const DeliveryAddressType = require('../../types/deliveryAddressType');
const Customer = require('../../../models/customer');
const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { invalidInput, noFound } = require('../../errorsData/errorsData');

const UpdateCustomerAddress = {
  type: DeliveryAddressType,
  description: "Create or update customer's addresses",
  // use GraphQLString because validator package require a string
  args: {
    customerId: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: GraphQLString },
    stateOrProvince: { type: GraphQLString },
    country: { type: new GraphQLNonNull(GraphQLString) },
    zipCode: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    telephone: { type: new GraphQLNonNull(GraphQLString) },
    isBillingAddress: { type: GraphQLString },
    isShippingAddress: { type: GraphQLString },
  },
  resolve: async (parent, args, context) => {
    const errors = [];
    if (!context.isAuth) {
      notAuthenticated();
    }
    if (
      validator.isEmpty(args.customerId) ||
      validator.isEmpty(args.firstName) ||
      validator.isEmpty(args.lastName) ||
      validator.isEmpty(args.country) ||
      validator.isEmpty(args.zipCode) ||
      validator.isEmpty(args.city) ||
      validator.isEmpty(args.street) ||
      validator.isEmpty(args.email) ||
      validator.isEmpty(args.telephone)
    ) {
      errors.push({ message: 'Input fields have to be filled' });
    }
    if (!validator.isEmail(args.email)) {
      errors.push({ message: 'Use a valid email address' });
    }
    if (errors.length > 0) {
      invalidInput(errors);
    }
    const customer = await Customer.findById(args.customerId);
    if (!customer) {
      noFound('No customer found');
    }

    const customerAddress = {
      firstName: args.firstName,
      lastName: args.lastName,
      company: args.company,
      country: args.country,
      stateOrProvince: args.stateOrProvince,
      zipCode: args.zipCode,
      city: args.city,
      street: args.street,
      email: args.email,
      telephone: args.telephone,
    };

    // first element at customer's addresses is the Billing address always
    if (args.isBillingAddress === 'true') {
      customer.addresses[0] = { ...customerAddress, isBillingAddress: true };
    }
    // second element at customer's addresses is the Shipping address always
    if (args.isShippingAddress === 'true') {
      customer.addresses[1] = { ...customerAddress, isShippingAddress: true };
    }

    await customer.save();
    return {
      ...customerAddress,
      isBillingAddress: /true/i.test(args.isBillingAddress),
      isShippingAddress: /true/i.test(args.isShippingAddress),
    };
  },
};

module.exports = UpdateCustomerAddress;
