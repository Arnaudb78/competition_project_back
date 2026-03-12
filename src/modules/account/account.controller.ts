import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAccountGuard } from '../auth/guards/jwt-account.guard';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @UseGuards(JwtAccountGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return this.accountService.findById(req.user._id);
  }

  @UseGuards(JwtAccountGuard)
  @Patch('me')
  updateMe(@Request() req: any, @Body() body: any) {
    return this.accountService.updateMe(req.user._id, body);
  }
}
