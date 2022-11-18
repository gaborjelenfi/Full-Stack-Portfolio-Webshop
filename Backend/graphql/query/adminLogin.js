const AdminAuthData = require('../types/adminAuthData');
const Admin = require('../../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLString } = require('graphql');
const {
  noFound,
  incorrectPasswordOrEmail,
} = require('../errorsData/errorsData');

const AdminLoginQuery = {
  type: AdminAuthData,
  description: 'Login a valid registered admin',
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    const admin = await Admin.findOne({ email: args.email });
    if (!admin) {
      noFound('No admin found!');
    }
    const isEqual = await bcrypt.compare(args.password, admin.password);
    if (!isEqual) {
      incorrectPasswordOrEmail();
    }
    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        email: admin.email,
      },
      process.env.ADMIN_SECRET_KEY,
      { expiresIn: '1h' }
    );
    return {
      token: token,
      adminId: admin._id.toString(),
      email: args.email,
    };
  },
};

module.exports = AdminLoginQuery;
