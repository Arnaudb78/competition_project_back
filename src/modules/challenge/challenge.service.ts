import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengeEntity, ChallengeDocument } from './schemas/challenge.schema';
import { ChallengeCompletionEntity, ChallengeCompletionDocument } from './schemas/challenge-completion.schema';
import { AccountEntity, AccountDocument } from '../account/schemas/account.schema';
import { CreateChallengeDto, UpdateChallengeDto } from './dto/create-challenge.dto';

const QUESTION_POPULATE = [
  { path: 'questions.childQuestion' },
  { path: 'questions.adultQuestion' },
];

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(ChallengeEntity.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(ChallengeCompletionEntity.name)
    private challengeCompletionModel: Model<ChallengeCompletionDocument>,
    @InjectModel(AccountEntity.name)
    private accountModel: Model<AccountDocument>,
  ) {}

  findAllPublic() {
    return this.challengeModel
      .find({ isVisible: true })
      .populate(QUESTION_POPULATE);
  }

  findAll() {
    return this.challengeModel.find().populate(QUESTION_POPULATE);
  }

  findOne(id: string) {
    return this.challengeModel.findById(id).populate(QUESTION_POPULATE);
  }

  create(dto: CreateChallengeDto) {
    return this.challengeModel.create(dto);
  }

  update(id: string, dto: UpdateChallengeDto) {
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, 1> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (value === null) {
        $unset[key] = 1;
      } else {
        $set[key] = value;
      }
    }

    const update: Record<string, unknown> = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;

    return this.challengeModel
      .findByIdAndUpdate(id, update, { new: true })
      .populate(QUESTION_POPULATE);
  }

  remove(id: string) {
    return this.challengeModel.findByIdAndDelete(id);
  }

  async addQuestionPair(
    id: string,
    childQuestionId: string,
    adultQuestionId: string,
  ) {
    const updated = await this.challengeModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            questions: {
              childQuestion: childQuestionId,
              adultQuestion: adultQuestionId,
            },
          },
        },
        { new: true },
      )
      .populate(QUESTION_POPULATE);
    if (!updated) throw new NotFoundException('Challenge introuvable');
    return updated;
  }

  async removeQuestionPair(id: string, index: number) {
    const challenge = await this.challengeModel.findById(id);
    if (!challenge) throw new NotFoundException('Challenge introuvable');

    challenge.questions.splice(index, 1);
    await challenge.save();

    return this.challengeModel.findById(id).populate(QUESTION_POPULATE);
  }

  async complete(challengeId: string, accountId: string, score: number) {
    // Find the best score already achieved on this challenge
    const best = await this.challengeCompletionModel
      .findOne({ challengeId, accountId })
      .sort({ score: -1 });

    const bestScore = best?.score ?? 0;
    const trophyDelta = Math.max(0, score - bestScore);

    const completion = await this.challengeCompletionModel.create({
      challengeId,
      accountId,
      score,
    });

    if (trophyDelta > 0) {
      await this.accountModel.findByIdAndUpdate(accountId, {
        $inc: { trophies: trophyDelta },
      });
    }

    return { ...completion.toObject(), trophyDelta };
  }

  findCompletionsByAccount(accountId: string) {
    return this.challengeCompletionModel
      .find({ accountId })
      .populate({ path: 'challengeId', select: 'name imageUrl' });
  }
}
