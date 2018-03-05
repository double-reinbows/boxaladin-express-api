const db = require('../models')
const jwt = require('jsonwebtoken')

module.exports = {
	checkDuplicate: (req, res, next) => {
		const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

		db.phonenumber.findOne({
			where: {
				number: req.body.phonenumber,
				userId: decoded.id
			}
		})
		.then(result => {
			if (result !== null) {
				res.send({
					message: 'duplicate number'
				})
			} else {
				next()
			}
		})
	},
	checkAlready: (req, res, next) => {
		db.phonenumber.findOne({
			where: {
				number: req.body.phonenumber,
				verified: true
			}
		})
		.then(result => {
			if (result !== null) {
				res.send({
					message: 'already use'
				})
			} else {
				next()
			}
		})
	}
}
