import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupEntity, GroupSchema } from './schemas/group.schema';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GroupEntity.name, schema: GroupSchema }]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
