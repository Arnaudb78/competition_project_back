import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountService } from '../../account/account.service';
import { AccountDocument } from '../../account/schemas/account.schema';

@Injectable()
export class JwtAccountStrategy extends PassportStrategy(
  Strategy,
  'jwt-account',
) {
  constructor(
    config: ConfigService,
    private accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<AccountDocument> {
    if (payload.role !== 'account') throw new UnauthorizedException();

    const account = await this.accountService.findById(payload.sub);
    if (!account || !account.isActive) throw new UnauthorizedException();
    return account;
  }
}
