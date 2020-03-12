module.exports = (sequelize, DataTypes) => {
    return sequelize.define('transactions', {
        address: {
            type: DataTypes.STRING(35),
            allowNull: false,
        },
        txid: {
            type: DataTypes.STRING(70),
            allowNull: false,
        },
        outputindex: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        satoshis: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        is_spent: {
            type:DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        timestamps: false,
    });
};