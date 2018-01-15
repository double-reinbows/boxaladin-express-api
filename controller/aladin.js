const db = require('../models')
const jwt = require('jsonwebtoken')
const firebase = require('firebase')

module.exports = {
	decreaseAladinPrice: (req, res) => {
		const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
		db.user.findById(decoded.id)
		.then(user => {
			user.aladin_keys <= 0 ? res.send({ message: 'not enough aladin key'}) : null

			user.update({
				aladin_keys: user.aladin_keys - 1
			})
			.then(result => {

				db.product.findById(req.body.productId, {
					include: [
						{ all: true}
					]
				})
				.then(product => {

					product.update({
						aladinPrice: product.aladinPrice - 500
					}, {
						where: {
							id: req.body.productId
						}
					})
					.then(result => {

            // update di firebase

						const productsRef = firebase.database().ref().child('products')
						productsRef.child(result.id).set({
							id: result.id,
							productName: result.productName,
							price: result.price,
							aladinPrice: result.aladinPrice,
							brand: result.brand.brandName,
							category: result.category.categoryName
						})

						res.send({
							message: 'success',
							data: result
						})
					})
					.catch(err => res.send(err))

				})
				.catch(err => res.send(err))

			})
			.catch(err => res.send(err))

		})
		.catch(err => res.send(err))
	}
}
