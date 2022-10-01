const Product = require("../../model/createProductDim");
const { Op } = require("sequelize");
const Shop = require("../../model/createShopDim")
const ProductFact = require("../../model/createProductFact");
const Time_dim = require('../../model/createTimeDim');
const sequelize = require('../../utils/connectingToDatabase');
const data = require('../data');


let product_fact_module = (async () => {
    await ProductFact.sync();
    let batch_id = 0;
    let max_batch = await ProductFact.findOne({
        attributes: [[sequelize.fn('max', sequelize.col('batch_id')), 'batch_id']],
        raw: true,
    });
    if (max_batch['batch_id'] === null) {
        batch_id = 1;
    } else {
        batch_id = max_batch['batch_id'] + 1;
    }

    const { count, rows } = await ProductFact.findAndCountAll();
    console.log(count);

    let product_count = count + 1;
    for (let allcatagory in data) {
        for (let product in data[allcatagory]) {
            product = data[allcatagory][product];

            //find shop
            const shop = await Shop.findOne({ where: { shop_name: 'turkishfoodmart' } });

            //find product_categories_dims_id
            const product_dims = await Product.findOne({ where: { product_name: product['name'] } });

            //price
            let priceArr = product["price"].split("$");

            //scraped_at
            let date = await new Date(product["scraped_at"]);
            let scraped_date = (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
            const time_dim = await Time_dim.findOne({ where: { date_actual: scraped_date } });
            console.log(time_dim["date_dim_id"]);
            //break;

            const [product_create, created] = await ProductFact.findOrCreate({
                where: {
                    product_dims_id: product_dims['product_id'],
                    time_dim_id: time_dim["date_dim_id"],
                    shop_id: shop["shop_id"]
                },
                defaults: {
                    product_id: shop["shop_name"] + product_count,
                    shop_product_id: product["shop_product_id"],
                    availability: product["availability"],
                    price: priceArr[1],
                    currency: product["currency"],
                    weight: product["discription"],
                    shop_id: shop["shop_id"],
                    scraped_at: product["scraped_at"],
                    batch_id: batch_id,
                    valid_from: product["scraped_at"],
                    valid_till: product["scraped_at"]
                }
            });
            if (created == true) {
                product_count++;
            }
            console.log(created);
        }

    }

})();



module.exports = product_fact_module;



