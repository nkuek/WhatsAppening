'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            body: {
                type: Sequelize.TEXT,
            },
            authorId: {
                type: Sequelize.INTEGER,
                references: { model: 'Users' },
            },
            chatRoomId: {
                type: Sequelize.INTEGER,
                references: { model: 'ChatRooms' },
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
        return queryInterface.dropTable('Messages');
    },
};
