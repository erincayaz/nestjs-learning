import { Module } from '@nestjs/common';
import { VendorModule } from './vendors/vendor.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transactions/transaction.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportModule } from './reports/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
      })
    }),
    VendorModule,
    UserModule,
    AuthModule,
    TransactionModule,
    ReportModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
