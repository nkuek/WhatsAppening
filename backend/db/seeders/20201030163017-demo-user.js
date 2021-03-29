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
                    phoneNumber: faker.phone.phoneNumber(),
                },
                {
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: faker.phone.phoneNumber(),
                },
                {
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: faker.phone.phoneNumber(),
                },
                {
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: faker.phone.phoneNumber(),
                },
                {
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: faker.phone.phoneNumber(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            'Users',
            {
                username: {
                    [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'],
                },
            },
            {}
        );
    },
};
