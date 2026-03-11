import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionEntity, QuestionSchema } from './schemas/question.schema';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { AuthModule } from '../auth/auth.module';
import { ModuleEntity, ModuleSchema } from '../module/schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionEntity.name, schema: QuestionSchema },
      { name: ModuleEntity.name, schema: ModuleSchema },
    ]),
    AuthModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
