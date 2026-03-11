import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Replay, ReplayDocument } from './schemas/replay.schema';
import { CreateReplayDto, AddCommentDto } from './dto/replay.dto';

@Injectable()
export class ReplayService {
  constructor(
    @InjectModel(Replay.name) private replayModel: Model<ReplayDocument>,
  ) {}

  findAll() {
    return this.replayModel.find({ isVisible: true }).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const replay = await this.replayModel.findById(id);
    if (!replay) throw new NotFoundException('Replay introuvable');
    return replay;
  }

  create(dto: CreateReplayDto) {
    return this.replayModel.create(dto);
  }

  async update(id: string, dto: Partial<CreateReplayDto>) {
    const replay = await this.replayModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!replay) throw new NotFoundException('Replay introuvable');
    return replay;
  }

  async remove(id: string) {
    const replay = await this.replayModel.findByIdAndDelete(id);
    if (!replay) throw new NotFoundException('Replay introuvable');
    return replay;
  }

  async addComment(id: string, dto: AddCommentDto) {
    const replay = await this.replayModel.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            author: dto.author,
            text: dto.text,
            createdAt: new Date(),
          },
        },
      },
      { new: true },
    );
    if (!replay) throw new NotFoundException('Replay introuvable');
    return replay;
  }
}
