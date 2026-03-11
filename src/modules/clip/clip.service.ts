import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clip, ClipDocument } from './schemas/clip.schema';
import { CreateClipDto } from './dto/clip.dto';

@Injectable()
export class ClipService {
  constructor(@InjectModel(Clip.name) private clipModel: Model<ClipDocument>) {}

  findAll() {
    return this.clipModel.find({ isVisible: true }).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const clip = await this.clipModel.findById(id);
    if (!clip) throw new NotFoundException('Clip introuvable');
    return clip;
  }

  create(dto: CreateClipDto) {
    return this.clipModel.create(dto);
  }

  async update(id: string, dto: Partial<CreateClipDto>) {
    const clip = await this.clipModel.findByIdAndUpdate(id, dto, { new: true });
    if (!clip) throw new NotFoundException('Clip introuvable');
    return clip;
  }

  async remove(id: string) {
    const clip = await this.clipModel.findByIdAndDelete(id);
    if (!clip) throw new NotFoundException('Clip introuvable');
    return clip;
  }

  async toggleLike(id: string, userId: string) {
    const clip = await this.clipModel.findById(id);
    if (!clip) throw new NotFoundException('Clip introuvable');

    const alreadyLiked = clip.likedBy.includes(userId);
    if (alreadyLiked) {
      clip.likedBy = clip.likedBy.filter((uid) => uid !== userId);
    } else {
      clip.likedBy.push(userId);
    }
    return clip.save();
  }
}
