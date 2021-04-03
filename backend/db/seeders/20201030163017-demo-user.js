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
                    name: 'Demo-lition',
                    hashedPassword: bcrypt.hashSync('password'),
                    profileUrl:
                        'https://d92mrp7hetgfk.cloudfront.net/images/sites/misc/App_Academy_logo-8/original.png?1567098952',
                    phoneNumber: '5555555555',
                    isPublic: true,
                },
                {
                    email: faker.internet.email(),
                    name: faker.name.findName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: '5555555556',
                    isPublic: true,
                },
                {
                    email: faker.internet.email(),
                    name: faker.name.findName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: '5555555557',
                    isPublic: true,
                },
                {
                    email: faker.internet.email(),
                    name: faker.name.findName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: '5555555558',
                },
                {
                    email: faker.internet.email(),
                    name: faker.name.findName(),
                    hashedPassword: bcrypt.hashSync(faker.internet.password()),
                    phoneNumber: '5555555559',
                    isPublic: true,
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface
            .bulkDelete('Participants')
            .then(() => queryInterface.bulkDelete('Messages'))
            .then(() => queryInterface.bulkDelete('ChatRooms'))
            .then(() => queryInterface.bulkDelete('Contacts'))
            .then(() => queryInterface.bulkDelete('Users'));
    },
};
