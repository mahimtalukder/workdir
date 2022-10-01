const Shop = require("../../model/createShopDim");



let shop_module = (async () => {
    await Shop.sync();
    const turkishfoodmart = Shop.build(
        {
            shop_name: "turkishfoodmart",
            branc_name: "1"
        }
    );
    await turkishfoodmart.save();
})();

module.exports = shop_module;