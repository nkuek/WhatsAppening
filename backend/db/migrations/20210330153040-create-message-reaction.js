'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('MessageReactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            messageId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Message' },
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'User' },
            },
            reactionType: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('MessageReactions');
    },
};
