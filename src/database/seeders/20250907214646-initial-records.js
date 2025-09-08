'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    // --- Vendors ---
    const vendor1Id = uuidv4();
    const vendor2Id = uuidv4();

    await queryInterface.bulkInsert('vendors', [
      { id: vendor1Id, name: 'Acme Corp', createdAt: now, updatedAt: now },
      { id: vendor2Id, name: 'Globex', createdAt: now, updatedAt: now },
    ]);

    // --- Users ---
    const adminId = uuidv4();
    const vendorUserId = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        email: 'admin@example.com',
        password: '$2b$10$peCe1.CLcKZ87Z38/Ekfke/6E.DQ7xrLcrIa1cNQM/jI2Je0QViDK', // hashedpassword
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: vendorUserId,
        email: 'vendor@example.com',
        password: '$2b$10$peCe1.CLcKZ87Z38/Ekfke/6E.DQ7xrLcrIa1cNQM/jI2Je0QViDK', // hashedpassword
        role: 'vendor',
        vendorId: vendor1Id,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Transactions ---
    const statuses = ['authorized', 'captured', 'refunded', 'failed'];
    const cardBrands = ['Visa', 'Mastercard', 'Amex', 'Discover'];

    const transactions = [];
    for (let i = 0; i < 200; i++) {
      const vendorId = i % 2 === 0 ? vendor1Id : vendor2Id;
      const amount = Math.floor(Math.random() * 10000) / 100; // 0.00–100.00
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const cardBrand = cardBrands[Math.floor(Math.random() * cardBrands.length)];

      transactions.push({
        id: uuidv4(),
        vendorId,
        amount,
        currency: 'USD',
        status,
        pgExtraInfo: JSON.stringify({ cardBrand }),
        createdAt: new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 30), // son 30 gün
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert('transactions', transactions);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('vendors', null, {});
  }
};
