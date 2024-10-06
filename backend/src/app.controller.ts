import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Role } from './users/enum/role.enum';
import { Roles } from './users/decorator/roles.decorator';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { RolesGuard } from './users/guard/roles.guard';
import { PrismaService } from './prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsByUserDto } from './dto/get-reports-by-user.dto';
import { CreateCropDto } from './dto/create-crop.dto';
import { CreateAlertDto } from './dto/create-alert.dto';
import { ReplyReportDto } from './dto/reply-dto.dto';
import { GetReportsFromAreaDto } from './dto/get-reports-from-area-dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  test() {
    return this.appService.roleHello();
  }

  @UseGuards(JwtAuthGuard)
  @Post('report')
  async createReport(@Req() req, @Body() createReportDto: CreateReportDto) {
    return this.appService.createReport(createReportDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('report')
  async getReportsByUser(@Req() req) {
    return this.appService.getReportsByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('reply')
  async replyReport(@Body() replyReportDto: ReplyReportDto) {
    const { reportId, reply } = replyReportDto;
    return this.appService.replyReport(reportId, reply);
  }

  @UseGuards(JwtAuthGuard)
  @Post('crop')
  async createCrop(@Body() createCropDto: CreateCropDto, @Req() req) {
    const userId = req.user.id;
    return this.appService.createCrop(createCropDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('crop')
  async getCropsByUser(@Req() req) {
    const userId = req.user.id;
    return this.appService.getCropsByUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('alert')
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.appService.createAlert(createAlertDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('get-reports-from-area')
  async getReportsFromArea(@Req() req) {
    const area = req.user.area;

    return this.appService.getReportsFromArea(area);
  }

  @Get('alert')
  async getAlert(@Body('location') location: string, @Req() req) {
    return this.appService.getAlertByLocation(location);
  }
}
