const AdminType = require('../types/adminType');
const Admin = require('../../models/admin');
const { GraphQLList } = require('graphql');

const AllAdminsQuery = {
  type: new GraphQLList(AdminType),
  description: 'Query all admins',
  resolve: async (parent, args, context) => {
    console.log(context.isAuth);
    if (!context.isAdminAuth) {
      notAuthenticated();
    }
    const allAdmin = await Admin.find();
    return allAdmin;
  },
};

module.exports = AllAdminsQuery;

