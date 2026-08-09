import { AuthService } from './auth.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  /**authService: AuthService;*/

  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }

  @Get('signup')
  signup() {
    const result = this.authService.signup()
    return {
      data: result,
      message: "user created successfully",
      status:true
    }
  }
}
