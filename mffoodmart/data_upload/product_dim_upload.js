const Product = require("../../model/createProductDim");
const data = require('../data');


let product_dim_module = (async () => {
    await Product.sync();
    for (let catagory in data) {
        for (let product in data[catagory]) {
            product = data[catagory][product];
            const [product_create, created] = await Product.findOrCreate({
                where: { product_name: product["name"] },
                defaults: {
                    downloaded_pageLink: product["downloaded_pageLink"],
                    actual_pageLink: product["actual_pageLink"],
                    images: product["images"]
                }
            });
            console.log(created);
        }

    }

})();

module.exports = product_dim_module;



