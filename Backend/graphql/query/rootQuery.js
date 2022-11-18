const customer = require('./customer');
const product = require('./product');
const manufacturer = require('./manufacturer');
const allManufacturers = require('./allManufacturers');
const allAdmins = require('./allAdmins');
const allOrders = require('./allOrders');
const {
  AllProductsQuery: allProducts,
  AllProductsFilterQuery: allProductsFilter,
} = require('./allProducts');
const furnitureCategory = require('./furnitureCategory');
const allCategory = require('./allCategory');
const login = require('./login');
const adminLogin = require('./adminLogin');
const admin = require('./admin');
const order = require('./order');
const { GraphQLObjectType } = require('graphql');

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query',
  fields: () => ({
    customer,
    login,
    adminLogin,
    admin,
    order,
    product,
    manufacturer,
    allAdmins,
    allManufacturers,
    allProducts,
    allProductsFilter,
    allCategory,
    allOrders,
    furnitureCategory,
  }),
});

module.exports = RootQueryType;
