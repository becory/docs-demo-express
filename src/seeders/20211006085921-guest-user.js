'use strict';

module.exports = {
    up: async (queryInterface) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('User', [{
            id: -1,
            username: "Guest",
            password: "Guest",
            name: "來賓",
            email: "任何人",
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },

    down: async () => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
