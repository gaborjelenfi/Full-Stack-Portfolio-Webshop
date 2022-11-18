const { GraphQLObjectType } = require('graphql');
const createCustomer = require('./customer/createCustomer');
const createManufacturer = require('./manufacturer/createManufacturer');
const createCategory = require('./furnitureCategory/createCategory');
const createProduct = require('./product/createProduct');
const createOrder = require('./order/createOrder');
const createAdmin = require('./admin/createAdmin');
const updateCustomer = require('./customer/updateCustomer');
const updateCustomerAddress = require('./customer/updateCustomerAddress');
const updateCustomerOrders = require('./customer/updateCustomerOrders');
const updateManufacturer = require('./manufacturer/updateManufacturer');
const updateCategory = require('./furnitureCategory/updateCategory');
const updateProduct = require('./product/updateProduct');
const updateAdmin = require('./admin/updateAdmin');
const deleteCustomer = require('../mutation/customer/deleteCustomer');
const deleteManufacturer = require('../mutation/manufacturer/deleteManufacturer');
const deleteCategory = require('../mutation/furnitureCategory/deleteCategory');
const deleteProduct = require('./product/deleteProduct');
const deleteOrder = require('./order/deleteOrder.js');
const deleteAdmin = require('./admin/deleteAdmin');
const deleteCustomerOrder = require('./customer/deleteCustomerOrder.js');

const RootQueryType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({
        createCustomer,
        createManufacturer,
        createCategory,
        createProduct,
        createOrder,
        createAdmin,
        updateCustomer,
        updateCustomerAddress,
        updateCustomerOrders,
        updateManufacturer,
        updateCategory,
        updateProduct,
        updateAdmin,
        deleteCustomer,
        deleteManufacturer,
        deleteCategory,
        deleteProduct,
        deleteOrder,
        deleteAdmin,
        deleteCustomerOrder
    })
});

module.exports = RootQueryType;
