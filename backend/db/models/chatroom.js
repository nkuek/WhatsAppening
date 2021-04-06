'use strict';
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define(
        'ChatRoom',
        {
            name: DataTypes.STRING,
            adminId: DataTypes.INTEGER,
            imageUrl: DataTypes.STRING,
            isRead: DataTypes.BOOLEAN,
            description: DataTypes.STRING,
        },
        {}
    );
    ChatRoom.associate = function (models) {
        ChatRoom.belongsTo(models.User, {
            as: 'Admin',
            foreignKey: 'adminId',
        });
        ChatRoom.hasMany(models.Message, {
            foreignKey: 'chatRoomId',
            onDelete: 'CASCADE',
            hooks: true,
        });
        ChatRoom.belongsToMany(models.User, {
            as: 'Participants',
            through: 'Participant',
            foreignKey: 'roomId',
            otherKey: 'userId',
            onDelete: 'CASCADE',
            hooks: true,
        });
    };
    return ChatRoom;
};
