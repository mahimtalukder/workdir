
const { Sequelize, DataTypes } = require('sequelize-views-support');
const sequelize = require("../utils/connectionToDatabaseForView")

const OutOfStock = sequelize.define('out_of_stocks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    treatAsView: true,
    viewDefinition: `
    CREATE VIEW "out_of_stock" AS
    select product_dims.product_id, product_dims.product_name,
        product_facts.price, product_facts.batch_id, product_categories.category_dims_id, product_facts.scraped_at 
        FROM
            product_facts
        INNER JOIN product_dims ON product_dims.product_id = product_facts.product_dims_id
        INNER JOIN product_categories ON product_categories.product_dim_id = product_dims.product_id
        Where product_facts.availability = 'no'
`
});

module.exports = OutOfStock;