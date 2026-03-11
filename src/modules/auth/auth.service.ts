import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserEntity, UserDocument } from '../user/schemas/user.schema';
import { AccountService } from '../account/account.service';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name)
    private userModel: Model<UserDocument>,
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  // ─── Admin signin ──────────────────────────────────────────────────────────
  async signin(dto: SigninDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: 'admin',
    });

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  // ─── Account signin (visiteurs) ────────────────────────────────────────────
  async signinAccount(dto: SigninDto) {
    const account = await this.accountService.findByEmail(dto.email);
    if (!account)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const isMatch = await bcrypt.compare(dto.password, account.password);
    if (!isMatch)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    if (!account.isActive) throw new UnauthorizedException('Compte désactivé');

    const token = this.jwtService.sign({
      sub: account._id,
      email: account.email,
      role: 'account',
    });

    return {
      access_token: token,
      account: {
        id: account._id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        age: account.age,
      },
    };
  }

  // ─── Account signup ────────────────────────────────────────────────────────
  async signupAccount(dto: {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
  }) {
    const account = await this.accountService.create(dto);

    const token = this.jwtService.sign({
      sub: account._id,
      email: account.email,
      role: 'account',
    });

    return {
      access_token: token,
      account: {
        id: account._id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        age: account.age,
      },
    };
  }
}
