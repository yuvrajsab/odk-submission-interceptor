import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma.service';
import { DietMonthlyProcessor } from './diet-monthly.processor';
import { DietMonthlyService } from './diet-monthly.service';

const dietMonthlyQueue = BullModule.registerQueue({
  name: 'dietMonthly',
});

@Module({
  imports: [dietMonthlyQueue, HttpModule],
  providers: [
    DietMonthlyProcessor,
    AppService,
    PrismaService,
    DietMonthlyService,
  ],
  exports: [dietMonthlyQueue],
})
export class DietMonthlyModule {}
