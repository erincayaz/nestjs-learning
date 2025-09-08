## Description

Junior Backend Developer Technical Task written with **NestJS**, **PostgreSQL**, **TypeScript**, **Sequelize**.

Done in 3 days from 2025-09-05T17:00:00+03 to 2025-09-08T15:00:00+03.

## Features

**Done:**
- [x] Auth & Roles: Routes are protected with JWT and role guard. Vendors can access their own data
- [x] Transactions: Created table for transactions with model and migrations. Endpoints are implemented with filtering and pagination
- [x] Reporting: Endpoints for reporting are implemented
- [x] Data Integrity & Performance: Custom indexes are implemented.

**Would like to implement:**  
- [ ] It is ensured that vendors can access their own data but it is done via custom logic in service and repository scripts. I believe it is possible to implement a cleaner way to do that
- [ ] I implemented base endpoints for user route and can extend it to vendor and transaction but due to time restriction I couldn't implement it
- [ ] Implemented reporting endpoints and it is working as intended but I implemented it last minute, so it is not clean and there are repeating logic, especially in repository layer. I would like to fix that
- [ ] Implemented custom indexes but I believe it is possible to find more partial, custom indexes for this case.
- [ ] I really wanted to implement swagger for this project using **@nestjs/swagger** but didn't have the time. Still try to implement it after sending the case because it would make your job easier

## Full Documentation
- [Full Documentation](/docs/readme.md)
