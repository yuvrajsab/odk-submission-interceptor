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
  private readonly odkFormIdSubmissionTableMap: Record<string, string> = {
    dietsweeky_v1: 'DITSWEKY_V1_CORE',
    dietsweeky_v2: 'DIE6Y_V2_CORE',
  };

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
          this.dietWeeklyService.createMappingForPdf(submission);

        const pdfResponse = await this.appService.sendPdfRequest(
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

        const storePdfResponse = await this.dietWeeklyService.storePdfUrl(
          pdfUrl,
          submission,
          submissionData.formId,
        );
        if ('errors' in storePdfResponse) {
          throw new Error(
            `Hasura Service: ${JSON.stringify(storePdfResponse)}`,
          );
        }
        this.logger.debug(
          `PDF link successfully dumped for diet weekly form for uuid: ${submission.instanceID}`,
        );

        const dumpSubmissionResponse =
          await this.dietWeeklyService.dumpSubmission(submission);
        if ('errors' in dumpSubmissionResponse) {
          throw new Error(
            `Hasura Service: ${JSON.stringify(dumpSubmissionResponse)}`,
          );
        }
        this.logger.debug(
          `Submission successfully dumped for diet weekly form for uuid: ${submission.instanceID}`,
        );

        const tableName =
          this.odkFormIdSubmissionTableMap[submissionData.formId];
        const result = await this.dietWeeklyService.updateSubmissionFlag(
          submission.instanceID,
          tableName,
        );
        if (!result) {
          throw new Error('ODK Postgres db error occurred');
        }
        this.logger.debug(
          `Submission flag successfully update for diet weekly form for uuid: ${submission.instanceID}`,
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
