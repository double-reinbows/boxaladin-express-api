'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('categories', {
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			category: {
				allowNull: false,
				type: Sequelize.STRING
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('categories');
	}
};

