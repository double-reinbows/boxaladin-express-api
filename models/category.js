'use strict';
module.exports = function(sequelize, DataTypes) {
	var Category = sequelize.define('category', {
		id: DataTypes.INTEGER,
		category: DataTypes.STRING
	});

	Category.associate = models => {
		Category.hasMany(models.Product);
		// {
		// 	foreignKey: 'categoryId',
		// 	as: 'product'
		// });
	};

	return Category;
};
