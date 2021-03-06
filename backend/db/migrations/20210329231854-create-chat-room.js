'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ChatRooms', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING(50),
            },
            adminId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users' },
            },
            imageUrl: {
                type: Sequelize.STRING,
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            description: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('ChatRooms');
    },
};
