'use strict';
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define(
        'ChatRoom',
        {
            name: DataTypes.STRING,
            adminId: DataTypes.INTEGER,
            imageUrl: DataTypes.STRING,
            isRead: DataTypes.BOOLEAN,
        },
        {}
    );
    ChatRoom.associate = function (models) {
        ChatRoom.belongsTo(models.User, {
            as: 'Admin',
            foreignKey: 'adminId',
            onDelete: 'CASCADE',
        });
        ChatRoom.hasMany(models.Message, { foreignKey: 'chatRoomId' });
        ChatRoom.belongsToMany(models.User, {
            as: 'Participants',
            through: 'Participant',
            foreignKey: 'roomId',
            otherKey: 'userId',
            onDelete: 'CASCADE',
        });
    };
    return ChatRoom;
};
