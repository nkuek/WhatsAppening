'use strict';
module.exports = (sequelize, DataTypes) => {
    const MessageReaction = sequelize.define(
        'MessageReaction',
        {
            messageId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            reactionType: DataTypes.INTEGER,
        },
        {}
    );
    MessageReaction.associate = function (models) {
        MessageReaction.belongsTo(models.User, { foreignKey: 'userId' });
        MessageReaction.belongsTo(models.Message, { foreignKey: 'messageId' });
    };
    return MessageReaction;
};
