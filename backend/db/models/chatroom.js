'use strict';
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define(
        'ChatRoom',
        {
            name: DataTypes.STRING,
            adminId: DataTypes.INTEGER,
            imageUrl: DataTypes.STRING,
        },
        {}
    );
    ChatRoom.associate = function (models) {
        ChatRoom.belongsTo(models.User, {
            foreignKey: 'adminId',
            onDelete: 'CASCADE',
        });
        ChatRoom.hasMany(models.Message, { foreignKey: 'chatRoomId' });
        ChatRoom.belongsToMany(models.User, {
            as: 'participants',
            through: 'Participant',
            foreignKey: 'roomId',
            otherKey: 'userId',
            onDelete: 'CASCADE',
        });
    };
    return ChatRoom;
};
