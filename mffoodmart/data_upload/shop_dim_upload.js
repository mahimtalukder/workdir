const Shop = require("../../model/createShopDim");



let shop_module = (async () => {
    await Shop.sync();
    const mffoodmart = Shop.build(
        {
            shop_name: "mffoodmart",
            branc_name: "1"
        }
    );
    await mffoodmart.save();
})();

module.exports = shop_module;