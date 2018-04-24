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
	},

	checkNumber: (req, res, newNumber, next) => {

		var phone = req.body.phonenumber
		var splitNumber = phone.split('')
	
		if (splitNumber[0] === '0') {
			splitNumber.splice(0, 1, '0')
			var newNumber = splitNumber.join('')
			next()
		} else if (splitNumber[0] + splitNumber[1] + splitNumber[2] === '+62') {
			splitNumber.splice(0, 3, '0')
			var newNumber = splitNumber.join('')
			next()

		} else if (splitNumber[0] + splitNumber[1] === '62') {
			splitNumber.splice(0, 2, '0')
			var newNumber = splitNumber.join('')
			next()

		} else if (splitNumber[0] === '8') {
			splitNumber.splice(0, 0, '0')
			var newNumber = splitNumber.join('')
			next()

		} else if (splitNumber.length === 0) {
			var newNumber = splitNumber.join('')
			next()

		} else {
			var newNumber = phone
			next()

		}
	}
}
