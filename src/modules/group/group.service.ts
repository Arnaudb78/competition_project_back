import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupEntity, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto, UpdateScoreDto, CompleteModuleDto } from './dto/create-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupEntity.name)
    private groupModel: Model<GroupDocument>,
  ) {}

  create(dto: CreateGroupDto) {
    const participants = dto.participants.map((p) => ({ name: p.name, age: p.age, score: 0 }));
    return this.groupModel.create({ participants });
  }

  async findOne(id: string) {
    const group = await this.groupModel.findById(id);
    if (!group) throw new NotFoundException('Groupe introuvable');
    return group;
  }

  async addScore(id: string, dto: UpdateScoreDto) {
    const group = await this.groupModel.findById(id);
    if (!group) throw new NotFoundException('Groupe introuvable');

    const participant = group.participants.find(
      (p) => p.name === dto.participantName,
    );
    if (participant) {
      participant.score += dto.points;
    }

    return group.save();
  }

  async completeModule(id: string, dto: CompleteModuleDto) {
    const group = await this.groupModel.findById(id);
    if (!group) throw new NotFoundException('Groupe introuvable');

    if (!group.completedModules.includes(dto.moduleId)) {
      group.completedModules.push(dto.moduleId);
    }

    return group.save();
  }

  async endVisit(id: string) {
    const group = await this.groupModel.findById(id);
    if (!group) throw new NotFoundException('Groupe introuvable');

    group.endedAt = new Date();
    return group.save();
  }
}
