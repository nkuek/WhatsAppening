'use strict';
module.exports = (sequelize, DataTypes) => {
    const Participant = sequelize.define(
        'Participant',
        {
            userId: DataTypes.INTEGER,
            roomId: DataTypes.INTEGER,
        },
        {}
    );
    Participant.associate = function (models) {
        Participant.belongsTo(models.User, {
            foreignKey: 'userId',
        });
        Participant.belongsTo(models.ChatRoom, {
            foreignKey: 'roomId',
        });
    };
    return Participant;
};
