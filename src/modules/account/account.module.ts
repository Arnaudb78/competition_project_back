import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountEntity, AccountSchema } from './schemas/account.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountEntity.name, schema: AccountSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
