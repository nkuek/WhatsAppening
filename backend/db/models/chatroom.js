'use strict';
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define(
        'ChatRoom',
        {
            name: DataTypes.STRING,
            adminId: DataTypes.INTEGER,
        },
        {}
    );
    ChatRoom.associate = function (models) {
        ChatRoom.belongsTo(models.User, {
            foreignKey: 'adminId',
        });
        ChatRoom.hasMany(models.Message, { foreignKey: 'chatRoomId' });
        ChatRoom.belongsToMany(models.User, {
            as: 'participants',
            through: 'Participant',
            foreignKey: 'roomId',
            otherKey: 'userId',
        });
    };
    return ChatRoom;
};
