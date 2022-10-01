const { Sequelize } = require('sequelize');
const sequelize = require("../utils/connectingToDatabase");
const Category = require("./createCategoryDim");
const Product_dim = require("./createProductDim");

const Shop = require("./createShopDim");

const product_categories = sequelize.define('product_categories', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_dims_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Category,
            key: 'category_id'
        }
    },
    product_dim_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Product_dim,
            key: 'product_id'
        }
    },
    shop_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Shop,
            key: 'shop_id'
        }
    }

});




module.exports = product_categories;