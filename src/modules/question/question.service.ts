import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionEntity, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ModuleEntity, ModuleDocument } from '../module/schemas/module.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(QuestionEntity.name)
    private questionModel: Model<QuestionDocument>,
    @InjectModel(ModuleEntity.name)
    private moduleModel: Model<ModuleDocument>,
  ) {}

  async create(dto: CreateQuestionDto) {
    this.validateAnswers(dto.answers);
    return this.questionModel.create(dto);
  }

  findAll(ageGroup?: 'child' | 'adult') {
    const filter = ageGroup ? { ageGroup } : {};
    return this.questionModel.find(filter).sort({ createdAt: -1 });
  }

  findOne(id: string) {
    return this.questionModel.findById(id);
  }

  async update(id: string, dto: Partial<CreateQuestionDto>) {
    if (dto.answers) {
      this.validateAnswers(dto.answers);
    }
    return this.questionModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    // Détacher la question de tous les modules qui la référencent
    await this.moduleModel.updateMany(
      { childQuestion: id },
      { $unset: { childQuestion: 1 } },
    );
    await this.moduleModel.updateMany(
      { adultQuestion: id },
      { $unset: { adultQuestion: 1 } },
    );
    return this.questionModel.findByIdAndDelete(id);
  }

  private validateAnswers(answers: CreateQuestionDto['answers']) {
    if (answers.length !== 3) {
      throw new BadRequestException('Une question doit avoir exactement 3 réponses');
    }
    const correctCount = answers.filter((a) => a.isCorrect).length;
    if (correctCount !== 1) {
      throw new BadRequestException('Une question doit avoir exactement 1 bonne réponse');
    }
  }
}
