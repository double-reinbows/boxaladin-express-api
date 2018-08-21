const db = require('../models')

module.exports = {
  async findProductBought(req, res) {
    const product = await db.product.findOne({
      where: {
        brandId: req.body.brandId,
        pulsaPriceId: req.body.priceId
      }
    })
    if (!product){
      return ({
        message: 'product not found',
        status: 200
      })
    } else if (product.active === false){
      return ({
        message: 'product not active',
        status: 200
      })
    } else {
      return ({
        product,
        status: 200
      })
    }
  }
}
