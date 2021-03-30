'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Contacts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user1Id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users' },
            },
            user2Id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users' },
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
        return queryInterface.dropTable('Contacts');
    },
};
