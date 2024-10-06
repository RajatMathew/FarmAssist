import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup/user')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      return { status: 'error', message: 'Email is already in use' };
    }
    return this.usersService.createUser(createUserDto);
  }

  @Post('signup/admin')
  async adminRegister(@Body() createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      return { status: 'error', message: 'Email is already in use' };
    }
    return this.usersService.createAdmin(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): any {
    return this.usersService.getUserData(req.user.id);
  }
}
