const Product = require("../../model/createProductDim");
const ProductCategory = require("../../model/createCategoryDim");
const Shop = require("../../model/createShopDim");
const data = require('../data');
const Product_categories = require('../../model/createProductCategories');


let product_fact_module = (async () => {
    await Product_categories.sync();
    const shop = await Shop.findOne({ where: { shop_name: 'turkishfoodmart' } });
    for (let allcatagory in data) {
        for (let product in data[allcatagory]) {
            product = data[allcatagory][product];

            for (let i in product['catagory']) {
                const productCategory = await ProductCategory.findOne({ where: { category_name: product['catagory'][i] } });
                const product_dim = await Product.findOne({ where: { product_name: product['name'] } });
                console.log(product['catagory'][i])
                console.log(productCategory['category_name']);

                const [product_create, created] = await Product_categories.findOrCreate({
                    where: {
                        category_dims_id: productCategory['category_id'],
                        product_dim_id: product_dim["product_id"],
                        shop_id: shop["shop_id"]
                    },
                    defaults: {
                        category_dims_id: productCategory['category_id'],
                        product_dim_id: product_dim["product_id"],
                        shop_id: shop["shop_id"]
                    }
                });
                console.log(created);
            }

        }

    }

})();

module.exports = product_fact_module;



