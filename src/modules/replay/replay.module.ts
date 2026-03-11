import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Replay, ReplaySchema } from './schemas/replay.schema';
import { ReplayService } from './replay.service';
import { ReplayController } from './replay.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Replay.name, schema: ReplaySchema }]),
  ],
  controllers: [ReplayController],
  providers: [ReplayService],
})
export class ReplayModule {}
