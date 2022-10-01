const Category = require("../../model/createCategoryDim");
const data = require('../data');


let category_module = (async () => {
    await Category.sync();
    for (let catagory in data) {
        const [product_create, created] = await Category.findOrCreate({
            where: { category_name: catagory },
            defaults: {
                category_type: "category",
            }
        });
    }
})();

module.exports = category_module;



