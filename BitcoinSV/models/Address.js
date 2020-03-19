module.exports = (sequelize, DataTypes) => {
  return sequelize.define('addresses', {
    address: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(35),
      allowNull: false,
    },
    key_index: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};
