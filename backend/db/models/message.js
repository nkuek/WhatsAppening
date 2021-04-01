'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
        'Message',
        {
            body: DataTypes.STRING,
            authorId: DataTypes.INTEGER,
            chatRoomId: DataTypes.INTEGER,
        },
        {}
    );
    Message.associate = function (models) {
        Message.belongsTo(models.User, { foreignKey: 'authorId' });
        Message.belongsTo(models.ChatRoom, { foreignKey: 'chatRoomId' });
        Message.hasMany(models.MessageReaction, { foreignKey: 'messageId' });
    };
    return Message;
};
