import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { AccountEntity, AccountDocument } from './schemas/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(AccountEntity.name)
    private accountModel: Model<AccountDocument>,
  ) {}

  async create(dto: CreateAccountDto): Promise<AccountDocument> {
    const existing = await this.accountModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Cet email est déjà utilisé');
    return this.accountModel.create(dto);
  }

  async findByEmail(email: string): Promise<AccountDocument | null> {
    return this.accountModel.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(id: string): Promise<AccountDocument | null> {
    return this.accountModel.findById(id).select('-password');
  }

  async addTrophies(
    id: string,
    amount: number,
  ): Promise<AccountDocument | null> {
    return this.accountModel.findByIdAndUpdate(
      id,
      { $inc: { trophies: amount } },
      { new: true },
    );
  }

  async updateMe(
    id: string,
    dto: {
      firstName?: string;
      lastName?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ): Promise<AccountDocument | null> {
    const account = await this.accountModel.findById(id);
    if (!account) return null;

    if (dto.firstName) account.firstName = dto.firstName;
    if (dto.lastName) account.lastName = dto.lastName;
    if (dto.email) {
      const existing = await this.accountModel.findOne({
        email: dto.email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (existing) throw new ConflictException('Cet email est déjà utilisé');
      account.email = dto.email.toLowerCase().trim();
    }
    if (dto.newPassword) {
      if (!dto.currentPassword)
        throw new BadRequestException('Mot de passe actuel requis');
      const valid = await bcrypt.compare(dto.currentPassword, account.password);
      if (!valid)
        throw new UnauthorizedException('Mot de passe actuel incorrect');
      account.password = dto.newPassword; // le hook pre('save') s'occupe du hash
    }

    return account.save();
  }
}
