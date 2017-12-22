'use strict';
module.exports = (sequelize, DataTypes) => {
	var Product = sequelize.define('Product', {
		id: DataTypes.INTEGER,
		category_id: DataTypes.INTEGER,
		brand_id: DataTypes.INTEGER,
		price_id: DataTypes.INTEGER,
		description: DataTypes.STRING
	});

	Product.associate = models => {
		Product.belongsTo(models.Category);
		// product.belongsTo(models.brand, {
		// 	foreignKey: 'brandId'
		// }),
		// product.belongsTo(models.brand, {
		// 	foreignKey: 'priceId'
		// });
	};

	return Product;
};
