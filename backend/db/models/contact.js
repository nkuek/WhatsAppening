'use strict';

const user = require('./user');

module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define(
        'Contact',
        {
            user1Id: DataTypes.INTEGER,
            user2Id: DataTypes.INTEGER,
        },
        {}
    );
    Contact.associate = function (models) {
        Contact.belongsTo(models.User, { foreignKey: 'user1Id' });
        Contact.belongsTo(models.User, { foreignKey: 'user2Id' });
    };
    return Contact;
};
