import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Clip, ClipSchema } from './schemas/clip.schema';
import { ClipService } from './clip.service';
import { ClipController } from './clip.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Clip.name, schema: ClipSchema }]),
  ],
  controllers: [ClipController],
  providers: [ClipService],
})
export class ClipModule {}
