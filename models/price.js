'use strict';
module.exports = (sequelize, DataTypes) => {
	var Price = sequelize.define('Price', {
		id: DataTypes.INTEGER,
		price: DataTypes.STRING
	});

	Price.associate = models => {
		Price.hasMany(models.Price, {
			foreignKey: 'priceId',
			as: 'price'
		});
	};
	return Price;
};
