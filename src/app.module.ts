import { Module } from '@nestjs/common';
import { VendorModule } from './vendors/vendor.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transactions/transaction.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'erincayaz',
      password: '123',
      database: 'qlub',
      autoLoadModels: true,
      synchronize: true,
    }),
    VendorModule,
    UserModule,
    AuthModule,
    TransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
