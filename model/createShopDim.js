const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../utils/connectingToDatabase")


const shop_dim = sequelize.define('shop_dim', {
    shop_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    shop_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    branc_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


module.exports = shop_dim;