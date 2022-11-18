const AuthData = require('../types/authData');
const Customer = require('../../models/customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLString } = require('graphql');
const {
  noFound,
  incorrectPasswordOrEmail,
} = require('../errorsData/errorsData');

const LoginQuery = {
  type: AuthData,
  description: 'Login a valid signed up customer',
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    const customer = await Customer.findOne({ email: args.email });
    if (!customer) {
      noFound('No customer found!');
    }
    const isEqual = await bcrypt.compare(args.password, customer.password);
    if (!isEqual) {
      incorrectPasswordOrEmail();
    }
    const token = jwt.sign(
      {
        customerId: customer._id.toString(),
        email: customer.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
    return {
      token: token,
      customerId: customer._id.toString(),
      email: args.email,
    };
  },
};

module.exports = LoginQuery;
