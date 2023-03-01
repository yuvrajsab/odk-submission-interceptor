import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AppService } from '../app.service';
import { DietWeeklyProcessor } from './diet-weekly.processor';
import { DietWeeklyService } from './diet-weekly.service';

const dietWeeklyQueue = BullModule.registerQueue({
  name: 'dietWeekly',
});

@Module({
  imports: [dietWeeklyQueue, HttpModule],
  providers: [
    DietWeeklyProcessor,
    AppService,
    PrismaService,
    DietWeeklyService,
  ],
  exports: [dietWeeklyQueue],
})
export class DietWeeklyModule {}
