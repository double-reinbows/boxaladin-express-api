'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('products', {
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			category_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'categories', key: 'id' }
			},
			brand_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'brands', key: 'id' }
			},
			price_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'prices', key: 'id' }
			},
			description: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('products');
	}
};
