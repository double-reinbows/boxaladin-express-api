'use strict';
module.exports = function(sequelize, DataTypes) {
    var phonenumber = sequelize.define('phonenumber', {
      userId: DataTypes.INTEGER,
      number: DataTypes.STRING,
      verified: DataTypes.BOOLEAN
    });

phonenumber.associate = (models) => {
  phonenumber.belongsTo(models.user, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
};

  return phonenumber;
};


// module.exports = (sequelize, DataTypes) => {
//   const TodoItem = sequelize.define('TodoItem', {
//     content: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     complete: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//   });
//
//   TodoItem.associate = (models) => {
//     TodoItem.belongsTo(models.Todo, {
//       foreignKey: 'todoId',
//       onDelete: 'CASCADE',
//     });
//   };
//
//   return TodoItem;
// };
