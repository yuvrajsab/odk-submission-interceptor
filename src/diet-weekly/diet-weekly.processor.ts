import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppService } from '../app.service';
import { RequestQueue } from '@prisma/client';
import { DietWeeklyService } from './diet-weekly.service';
import { DietWeeklySubmission } from './diet-weekly.interface';

@Processor('dietWeekly')
export class DietWeeklyProcessor {
  private readonly logger = new Logger(DietWeeklyProcessor.name);

  constructor(
    private configService: ConfigService,
    private readonly appService: AppService,
    private readonly dietWeeklyService: DietWeeklyService,
  ) {}

  @Process('dietWeeklySubmission')
  async handleSubmit(job: Job) {
    const request: RequestQueue = job.data;
    this.logger.debug(`Processing id: ${request.id}...`);
    await this.appService.updateRequestStatus(request.id, 'PROCESSING');

    try {
      const submissionData = <DietWeeklySubmission>(<unknown>request.data);
      for (const submission of submissionData.data) {
        const pdfMapping =
          this.dietWeeklyService.createMappingForPDF(submission);

        const pdfResponse = await this.appService.sendPDFRequest(
          this.configService.getOrThrow('DIET_WEEKLY_TEMPLATE_ID'),
          pdfMapping,
        );
        if ('error' in pdfResponse) {
          throw new Error(`PDF Service: ${JSON.stringify(pdfResponse)}`);
        }
        const pdfUrl = pdfResponse.data;
        this.logger.debug(
          `PDF generated for diet weekly form for uuid: ${submission.instanceID} => ${pdfUrl}`,
        );
      }

      await this.appService.updateRequestStatus(request.id, 'DONE');
    } catch (error: any) {
      this.logger.error(`id: ${request.id}: ERROR: ${error.message}`);
      await this.appService.updateRequestStatus(
        request.id,
        'FAILED',
        error.message,
      );
    }
    return 'OK';
  }
}
