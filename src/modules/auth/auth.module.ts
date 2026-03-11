import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtAccountStrategy } from './strategies/jwt-account.strategy';
import { JwtAccountGuard } from './guards/jwt-account.guard';
import { UserEntity, UserSchema } from '../user/schemas/user.schema';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    PassportModule,
    AccountModule,
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    JwtAccountStrategy,
    JwtAccountGuard,
  ],
  exports: [JwtAuthGuard, JwtAccountGuard],
})
export class AuthModule {}
