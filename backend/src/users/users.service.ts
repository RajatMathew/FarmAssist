import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<any> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        roles: ['user'],
        password: data.password,
      },
    });
    return user;
  }

  async createAdmin(data: CreateUserDto): Promise<any> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        roles: ['admin'],
        password: data.password,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserData(id: number): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        reports: true,
        crops: true,
      },
    });
  }
}
