const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../utils/connectingToDatabase")

const category_dim = sequelize.define('category_dim', {
    category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_type: {
        type: DataTypes.STRING,
        allowNull: true
    }
});



module.exports = category_dim;