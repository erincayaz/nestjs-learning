# Database

Unfortunately, I didn't have the time to polish the table structure and indexes, it is doing the work but I believe it can be polished.

## Table structure

There are 3 tables in the project:

#### Vendors
`id`, `name`, `createdAt` and `updatedAt` are stored in this table. To ensure case-insensitive search, I am using `citext`:
``` sql
CREATE EXTENSION IF NOT EXISTS citext
ALTER TABLE vendors ALTER COLUMN name TYPE citext
```

#### Users
`id`, `email`, `password`, `role`, `vendorId`, `createdAt`, `updatedAt` are stored in this table.

There are 2 roles, one is admin, the other is vendor. I expect vendorId to not be null if role is vendor and it can be null if role is admin. So a constraint can be written for that.

Password is stored in hashed format and it is hashed using `bcrypt`.

#### Transactions
`id`, `amount`, `currency`, `status`, `vendorId`, `pgExtraInfo`, `createdAt`, `updatedAt` are stored in this table.

VendorId is a foreign key that is pointing to vendors table.

There are 2 indexes used for this table:

``` sql
CREATE INDEX IF NOT EXISTS tx_vendor_created_idx
ON transactions ("vendorId", "createdAt" DESC)
```
This one is used, because in the reporting endpoint, grouping by createdAt will be used.

``` sql
CREATE INDEX IF NOT EXISTS tx_cardbrand_idx
ON transactions (("pgExtraInfo"->>'cardBrand'))
```
This one is used, because again it is used for reporting.

Both of these indexes were disscussed in the interview.