module.exports = (sequelize, DataTypes) => {
    return sequelize.define('address', {
        seed: {
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        address: {
            type:DataTypes.STRING(35),
            allowNull:false,
        },
        path: {
            type:DataTypes.STRING(10),
            allowNull:false,
        },
        seedIndex: {
            type:DataTypes.BIGINT,
            allowNull:false,
        },
    }, {
        timestamps: false,
    });
};