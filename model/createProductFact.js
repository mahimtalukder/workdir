const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../utils/connectingToDatabase")
const Shop = require("../model/createShopDim");
const Product = require("../model/createProductDim")
const Category = require('../model/createCategoryDim')
const Time = require('../model/createTimeDim');
const Product_dims = require('../model/createProductDim')


const product_fact = sequelize.define('product_fact', {
    product_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    shop_product_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    availability: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pieces: {
        type: DataTypes.STRING,
        allowNull: true
    },
    inventory: {
        type: DataTypes.STRING,
        allowNull: true
    },
    scraped_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    time_dim_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_dims_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valid_from: {
        type: DataTypes.DATE,
        allowNull: true
    },
    valid_till: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

Shop.hasMany(product_fact, {
    foreignKey: 'shop_id'
});

Time.hasMany(product_fact, {
    foreignKey: 'time_dim_id'
});

Product_dims.hasMany(product_fact, {
    foreignKey: 'product_dims_id'
});

module.exports = product_fact;