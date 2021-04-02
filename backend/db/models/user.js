'use strict';
const { Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 256],
                },
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            profileUrl: {
                type: DataTypes.STRING,
            },
            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
                validate: {
                    len: [60, 60],
                },
            },
            isPublic: {
                type: DataTypes.BOOLEAN,
            },
        },
        {
            defaultScope: {
                attributes: {
                    exclude: [
                        'hashedPassword',
                        'email',
                        'createdAt',
                        'updatedAt',
                    ],
                },
            },
            scopes: {
                currentUser: {
                    attributes: { exclude: ['hashedPassword'] },
                },
                loginUser: {
                    attributes: {},
                },
            },
        }
    );
    User.associate = function (models) {
        User.hasMany(models.ChatRoom, {
            foreignKey: 'adminId',
            as: 'Admin',
            onDelete: 'CASCADE',
        });
        User.belongsToMany(models.ChatRoom, {
            as: 'Participants',
            through: 'Participant',
            foreignKey: 'userId',
            otherKey: 'roomId',
            onDelete: 'CASCADE',
        });
        User.hasMany(models.Message, {
            foreignKey: 'authorId',
            onDelete: 'CASCADE',
        });
        User.hasMany(models.MessageReaction, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
        User.belongsToMany(models.User, {
            as: 'Contacts',
            through: 'Contact',
            foreignKey: 'user1Id',
            otherKey: 'user2Id',
            onDelete: 'CASCADE',
        });
        User.belongsToMany(models.User, {
            as: 'User2Contacts',
            through: 'Contact',
            foreignKey: 'user2Id',
            otherKey: 'user1Id',
            onDelete: 'CASCADE',
        });
    };
    User.prototype.toSafeObject = function () {
        // remember, this cannot be an arrow function
        const { id, name, profileUrl, email } = this; // context will be the User instance
        return { id, name, profileUrl, email };
    };

    User.prototype.validatePassword = function (password) {
        return bcrypt.compareSync(password, this.hashedPassword.toString());
    };

    User.getCurrentUserById = async function (id) {
        return await User.scope('currentUser').findByPk(id);
    };

    User.login = async function ({ credential, password }) {
        const { Op } = require('sequelize');
        const user = await User.scope('loginUser').findOne({
            where: {
                [Op.or]: {
                    phoneNumber: credential,
                    email: credential,
                },
            },
        });
        if (user && user.validatePassword(password)) {
            return await User.scope('currentUser').findByPk(user.id);
        }
    };

    User.signup = async function ({ name, email, password, phoneNumber }) {
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            name,
            email,
            hashedPassword,
            phoneNumber,
        });
        return await User.scope('currentUser').findByPk(user.id);
    };
    return User;
};
