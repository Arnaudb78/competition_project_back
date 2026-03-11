import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
