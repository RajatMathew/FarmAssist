import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { CreateCropDto } from './dto/create-crop.dto';
import { CreateAlertDto } from './dto/create-alert.dto';
import { GetReportsByUserDto } from './dto/get-reports-by-user.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  roleHello(): string {
    return 'hello from role';
  }

  async createReport(data: CreateReportDto, req) {
    const userId = req.user.id; // Assuming req.user contains the user object with an id property
    return this.prisma.report.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getReportsByUser(userId: number) {
    const reports = await this.prisma.report.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reports;
  }

  async getReportsFromArea(area: string) {
    const reports = await this.prisma.report.findMany({
      where: { area },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reports;
  }

  async createCrop(data: CreateCropDto, userId: number) {
    return this.prisma.crop.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getCropsByUser(userId: number) {
    return this.prisma.crop.findMany({
      where: { userId },
    });
  }

  async createAlert(data: CreateAlertDto) {
    return this.prisma.alert.create({
      data: {
        ...data,
      },
    });
  }

  async getAlertByLocation(location: string) {
    console.log(location);
    return this.prisma.alert.findMany({
      where: {
        location,
      },
    });
  }

  async replyReport(reportId: number, reportReply: string) {
    return this.prisma.report.update({
      where: { id: reportId },
      data: { reportReply },
    });
  }
}
