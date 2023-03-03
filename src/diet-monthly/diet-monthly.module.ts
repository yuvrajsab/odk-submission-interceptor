import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { DietWeeklyModule } from 'src/diet-weekly/diet-weekly.module';
import { ODKSubmissionHelperService } from 'src/service/odk-submission-helper.service';
import { PrismaService } from 'src/prisma.service';
import { DietMonthlyProcessor } from './diet-monthly.processor';
import { DietMonthlyService } from './diet-monthly.service';

const dietMonthlyQueue = BullModule.registerQueue({
  name: 'dietMonthly',
});

@Module({
  imports: [dietMonthlyQueue, HttpModule, DietWeeklyModule],
  providers: [
    DietMonthlyProcessor,
    AppService,
    PrismaService,
    DietMonthlyService,
    ODKSubmissionHelperService,
  ],
  exports: [dietMonthlyQueue],
})
export class DietMonthlyModule {}
