import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleEntity, ModuleSchema } from './schemas/module.schema';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModuleEntity.name, schema: ModuleSchema },
    ]),
    AuthModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
