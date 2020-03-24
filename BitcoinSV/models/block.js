module.exports = (sequelize, DataTypes) => {
  return sequelize.define('blocks', {
    coin_type: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    hash: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });
}