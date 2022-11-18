const Admin = require('../../../models/admin');
const AdminType = require('../../types/adminType');
const { GraphQLNonNull, GraphQLID } = require('graphql');
const {
  noFound,
  notAuthenticated,
  accessDenied,
} = require('../../errorsData/errorsData');

const DeleteAdmin = {
  type: AdminType,
  description: 'Deleting an admin account',
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    const admin = await Admin.findById(args.id);
    if (!admin) {
      noFound('No admin found');
    }
    accessDenied(); // remove this line to set admin as deleted
    admin.isDeleted = true;
    await admin.save();
    return true;
  },
};

module.exports = DeleteAdmin;
