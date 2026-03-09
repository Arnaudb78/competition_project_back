import { ConflictException, Injectable } from '@nestjs/common';
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

  async create(dto: CreateModuleDto) {
    try {
      return await this.moduleModel.create(dto);
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Ce numéro de module est déjà utilisé');
      }
      throw error;
    }
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

  remove(id: string) {
    return this.moduleModel.findByIdAndDelete(id);
  }

  async reorder(ids: string[]) {
    // On passe d'abord par des nombres négatifs temporaires pour éviter
    // les conflits d'unicité lors des updates intermédiaires
    await Promise.all(
      ids.map((id, i) =>
        this.moduleModel.findByIdAndUpdate(id, { number: -(i + 1) }),
      ),
    );
    await Promise.all(
      ids.map((id, i) =>
        this.moduleModel.findByIdAndUpdate(id, { number: i + 1 }),
      ),
    );
  }
}
