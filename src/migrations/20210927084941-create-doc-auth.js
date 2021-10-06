'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('DocAuth', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            auth: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
        await queryInterface.addColumn('DocAuth', 'DocId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Doc',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            allowNull: true
        })
        await queryInterface.addColumn('DocAuth', 'UserId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn('DocAuth', 'DocId')
        await queryInterface.removeColumn('DocAuth', 'UserId')
        await queryInterface.dropTable('DocAuth');
    }
};