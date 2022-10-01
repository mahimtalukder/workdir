const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./utils/connectingToDatabase');
const queryInterface = sequelize.getQueryInterface();
const Product = require('./model/createProductFact');
const Time_dim = require('./model/createTimeDim');
const Product_categories = require('./model/createProductCategories');
const Product_dims = require('./model/createProductDim');
const Category = require('./model/createCategoryDim');

let update = (product) => new Promise(async (resolve, reject) => {
    if (product['scraped_at'] != null) {
        let scraped_date = new Date(product['scraped_at']);
        const updatedRows = await Product.findOne({ where: { product_id: product['product_id'] } });
        updatedRows['scraped_at_new'] = scraped_date;
        await updatedRows.save();
        resolve(updatedRows);

    } else {
        const scrapt = new Date('Tue, 13 Sep 2022 12:15:49 GMT');
        const updatedRows = await Product.findOne({ where: { product_id: product['product_id'] } });
        updatedRows['scraped_at_new'] = scrapt;
        await updatedRows.save();
        resolve(updatedRows);
    }
});


let update_price = (product) => new Promise(async (resolve, reject) => {
    console.log(product["product_id"]);
    let priceArr = product['price'].split(" ");;
    const updatedRows = await Product.findOne({ where: { product_id: product['product_id'] } });
    updatedRows['price'] = priceArr[1];
    await updatedRows.save();
    resolve(updatedRows);
});

let update_time_dim = (product) => new Promise(async (resolve, reject) => {
    let date = new Date(product['scraped_at']);
    let scraped_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const time_dim = await Time_dim.findOne({ where: { date_actual: scraped_date } });
    console.log(time_dim);
    const updatedRows = await Product.findOne({ where: { product_id: product['product_id'] } });
    updatedRows['time_dim_id'] = time_dim["date_dim_id"];
    await updatedRows.save();
    resolve(updatedRows);
});

let update_batch = (product) => new Promise(async (resolve, reject) => {
    const event = new Date(product['scraped_at']);
    const myArray = await product['scraped_at'].toString().split(" ");

    console.log(myArray[2]);


    if (myArray[2] == '13') {
        product['batch_id'] = 1;
        await product.save();
        resolve(product);
    } else if (myArray[2] == '15') {
        product['batch_id'] = 2;
        await product.save();
        resolve(product);
    } else if (myArray[2] == '16') {
        product['batch_id'] = 3;
        await product.save();
        resolve(product);
    } else if (myArray[2] == '17') {
        product['batch_id'] = 4;
        await product.save();
        resolve(product);
    } else if (product['scraped_at'] == '18') {
        product['batch_id'] = 5;
        await product.save();
        resolve(product);
    }
});


let productCategories = (product) => new Promise(async (resolve, reject) => {
    //const product_dims = await Product_dims.findOne({ where: { product_id: product['product_dim_id'] } });
    //const category = await Category.findOne({ where: { category_id: product['product_category_id'] } });




    //console.log(created);

    const product_categories = await Product_categories.findOne({
        where: {
            category_dims_id: product['product_category_id'],
            product_dim_id: product['product_dim_id']
        }
    });
    console.log(product_categories["id"]);

    product['product_category_dims_id'] = product_categories["id"];
    console.log(product_categories["id"]);
    await product.save();
    resolve(product);
});


let update_shop = (product) => new Promise(async (resolve, reject) => {
    product["shop_id"] = 1;
    await product.save();
    resolve(product);
});

let update_valid = (product) => new Promise(async (resolve, reject) => {
    product["valid_from"] = product["scraped_at"];
    product["valid_till"] = product["scraped_at"];
    await product.save();
    resolve(product);
});




(async () => {
    //task 1
    // //queryInterface.addColumn('product_facts', 'valid_from', { type: DataTypes.DATE });
    //  queryInterface.addColumn('product_facts', 'valid_till', { type: DataTypes.DATE });




    //await Product.sync();
    // const product = await Product_categories.findAll();
    // for (let obj of product) {
    //     console.log(obj);
    //     obj["shop_id"] = 1;
    //     await obj.save();
    //     //let currentPageData = await update_shop(product[obj]);
    // }




    // task 2
    await Product.sync();
    const product = await Product.findAll();
    for (let obj in product) {
        let currentPageData = await update_valid(product[obj]);
    }


    // const product = await Product.findOne({
    //     attributes: [[sequelize.fn('max', sequelize.col('batch_id')), 'batch_id']],
    //     raw: true,
    // });

    // console.log(product['batch_id']);

    //task 3
    //queryInterface.removeColumn('product_facts', 'productDimProductID', { /* query options */ });
})();
