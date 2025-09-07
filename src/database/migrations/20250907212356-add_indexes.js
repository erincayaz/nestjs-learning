'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS tx_vendor_created_idx
      ON transactions ("vendorId", "createdAt" DESC)
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS tx_cardbrand_idx
      ON transactions (("pgExtraInfo"->>'cardBrand'))
    `);

    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS citext`);
    await queryInterface.sequelize.query(`ALTER TABLE vendors ALTER COLUMN name TYPE citext`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP INDEX tx_vendor_created_idx`);
    await queryInterface.sequelize.query(`DROP INDEX tx_cardbrand_idx`);

    await queryInterface.sequelize.query(`ALTER TABLE vendors ALTER COLUMN name TYPE text`);
    await queryInterface.sequelize.query(`DROP EXTENSION IF EXISTS citext`);
  }
};
