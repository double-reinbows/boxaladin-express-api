const db = require('../models')
const jwt = require('jsonwebtoken')
const firebase = require('firebase')

module.exports = {
	decreaseAladinPrice: (req, res) => {
		const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
		db.user.findById(decoded.id)
		.then(user => {
			if (user.aladinKeys <= 0) {
				return res.send({ message: 'not enough aladin key'})
			}

			user.update({
				aladinKeys: user.aladinKeys - 1,
				coin: user.coin + 1
			})
			.then(result => {
				db.product.findById(req.body.productId, {
					include: [
						{
						model: db.brand,
					},
					{
						model: db.category
					}
				]
				})
				.then(product => {
					console.log('opened', product)
					// kalau harga sudah 10.000 maka tidak turunkan harga lagi
					if (product.aladinPrice <= 10000) {
						return res.send({
							message: 'success',
							data: product
					})
					}
						product.update({
							aladinPrice: product.aladinPrice - product.decreasePrice,
							opened: product.opened + 1
						}, {
							where: {
								id: req.body.productId
							}
						})
						.then(result => {
							db.aladinkeyLog.create({
								userId: decoded.id,
								productId: req.body.productId,
								priceBefore: product.aladinPrice + product.decreasePrice,
								priceAfter: product.aladinPrice,
							})
							.then(createLog => {
								console.log('opened', product.opened)
								// update di firebase

								const productsRef = firebase.database().ref().child('productsdummy')
								// const productsRef = firebase.database().ref().child('products')
								productsRef.child(result.id).update({
									id: result.id,
									// productName: result.productName,
									// price: result.price,
									aladinPrice: result.aladinPrice,
									// brand: result.brand.brandName,
									// category: result.category.categoryName,
									// brandId: result.brand.id,
									// categoryId: result.category.id
								}, function() {

									return res.send({
										message: 'success',
										data: result
									})

								})
							})
							.catch(err => res.send(err))
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
