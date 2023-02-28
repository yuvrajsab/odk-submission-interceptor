import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppService } from '../app.service';
import { RequestQueue } from '@prisma/client';

@Processor('dietWeekly')
export class DietWeeklyProcessor {
  private readonly logger = new Logger(DietWeeklyProcessor.name);

  constructor(
    private configService: ConfigService,
    private readonly appService: AppService,
  ) {}

  @Process('dietWeeklySubmission')
  async handleSubmit(job: Job) {
    const request: RequestQueue = job.data;
    console.log(request);
    console.log(request.id);

    return 'OK';
  }
}
