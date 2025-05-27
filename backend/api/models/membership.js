'use strict';

module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define('Membership', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    current_period_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Membership.associate = function (models) {
    Membership.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Membership;
};
