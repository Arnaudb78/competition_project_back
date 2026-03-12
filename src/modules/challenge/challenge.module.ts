import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeEntity, ChallengeSchema } from './schemas/challenge.schema';
import { ChallengeCompletionEntity, ChallengeCompletionSchema } from './schemas/challenge-completion.schema';
import { AccountEntity, AccountSchema } from '../account/schemas/account.schema';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChallengeEntity.name, schema: ChallengeSchema },
      { name: ChallengeCompletionEntity.name, schema: ChallengeCompletionSchema },
      { name: AccountEntity.name, schema: AccountSchema },
    ]),
    AuthModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
  exports: [ChallengeService],
})
export class ChallengeModule {}
