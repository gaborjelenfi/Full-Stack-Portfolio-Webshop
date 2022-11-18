const Admin = require('../../models/admin');
const AdminType = require('../types/adminType');
const { GraphQLID } = require('graphql');
const { notAuthenticated, noFound } = require('../errorsData/errorsData');

const AdminQuery = {
  type: AdminType,
  description: 'Query a single admin',
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
    }

    let admin = null;
    admin = await Admin.findById(args.id);
    if (!admin) {
      noFound('No admin found!');
    }
    return {
      ...admin._doc,
      _id: admin._id.toString(),
    };
  },
};

module.exports = AdminQuery;
