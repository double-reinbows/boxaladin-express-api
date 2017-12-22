'use strict';
module.exports = (sequelize, DataTypes) => {
	var Brand = sequelize.define('Brand', {
		id: DataTypes.INTEGER,
		brand: DataTypes.STRING
	});

	Brand.associate = models => {
		Brand.hasMany(models.Brand, {
			foreignKey: 'modelId',
			as: 'product'
		});
	};

	return Brand;
};
