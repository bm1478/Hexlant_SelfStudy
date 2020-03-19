module.exports = (sequelize, DataTypes) => {
  return sequelize.define('utxos', {
    address: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(35),
      allowNull: false,
    },
    tx_id: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    output_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    satoshis: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    spent_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    timestamps: false,
  });
};
