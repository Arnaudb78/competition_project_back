import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Admin
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  // Visiteurs — signin
  @Post('account/signin')
  signinAccount(@Body() dto: SigninDto) {
    return this.authService.signinAccount(dto);
  }

  // Visiteurs — signup
  @Post('account/signup')
  signupAccount(
    @Body()
    dto: {
      firstName: string;
      lastName: string;
      age: number;
      email: string;
      password: string;
    },
  ) {
    return this.authService.signupAccount(dto);
  }
}
