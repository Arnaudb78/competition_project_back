import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModuleEntity, ModuleDocument } from './schemas/module.schema';
import { CreateModuleDto } from './dto/create-module.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(ModuleEntity.name)
    private moduleModel: Model<ModuleDocument>,
  ) {}

  create(dto: CreateModuleDto) {
    return this.moduleModel.create(dto);
  }

  findAllPublic() {
    return this.moduleModel.find({ isVisible: true });
  }

  findAll() {
    return this.moduleModel.find();
  }

  findOne(id: string) {
    return this.moduleModel.findById(id);
  }

  update(id: string, dto: Partial<CreateModuleDto>) {
    return this.moduleModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // Bulk update positions pour le drag & drop
  async updatePositions(
    positions: { id: string; x: number; y: number }[],
  ): Promise<any> {
    const ops = positions.map(({ id, x, y }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position: { x, y } } },
      },
    }));
    return this.moduleModel.bulkWrite(ops);
  }

  remove(id: string) {
    return this.moduleModel.findByIdAndDelete(id);
  }
}
