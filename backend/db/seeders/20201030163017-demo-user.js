'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'Users',
            [
                {
                    email: 'demo@user.io',
                    firstName: 'Demo',
                    lastName: 'Lition',
                    hashedPassword: bcrypt.hashSync('password'),
                    phoneNumber: '5555555555',
                },
                {
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: '5555555556',
                },
                {
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: '5555555557',
                },
                {
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: '5555555558',
                },
                {
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: '5555555559',
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users');
    },
};
