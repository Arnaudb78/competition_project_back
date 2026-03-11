import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModuleEntity, ModuleDocument } from './schemas/module.schema';
import { CreateModuleDto } from './dto/create-module.dto';

const QUESTION_POPULATE = ['childQuestion', 'adultQuestion'];

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
    return this.moduleModel
      .find({ isVisible: true })
      .populate(QUESTION_POPULATE);
  }

  findAll() {
    return this.moduleModel.find().populate(QUESTION_POPULATE);
  }

  findOne(id: string) {
    return this.moduleModel.findById(id).populate(QUESTION_POPULATE);
  }

  update(id: string, dto: Partial<CreateModuleDto>) {
    return this.moduleModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate(QUESTION_POPULATE);
  }

  remove(id: string) {
    return this.moduleModel.findByIdAndDelete(id);
  }

  async reorder(ids: string[]) {
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

  async attachQuestion(
    moduleId: string,
    ageGroup: 'child' | 'adult',
    questionId: string,
  ) {
    const field = ageGroup === 'child' ? 'childQuestion' : 'adultQuestion';
    const updated = await this.moduleModel
      .findByIdAndUpdate(moduleId, { [field]: questionId }, { new: true })
      .populate(QUESTION_POPULATE);
    if (!updated) throw new NotFoundException('Module introuvable');
    return updated;
  }

  async detachQuestion(moduleId: string, ageGroup: 'child' | 'adult') {
    if (ageGroup !== 'child' && ageGroup !== 'adult') {
      throw new BadRequestException('ageGroup doit être "child" ou "adult"');
    }
    const field = ageGroup === 'child' ? 'childQuestion' : 'adultQuestion';
    const updated = await this.moduleModel
      .findByIdAndUpdate(moduleId, { $unset: { [field]: 1 } }, { new: true })
      .populate(QUESTION_POPULATE);
    if (!updated) throw new NotFoundException('Module introuvable');
    return updated;
  }
}
