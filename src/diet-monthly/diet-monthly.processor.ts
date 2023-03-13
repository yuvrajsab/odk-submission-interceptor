import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppService } from '../app.service';
import { RequestQueue } from '@prisma/client';
import { DietMonthlyService } from './diet-monthly.service';
import { DietMonthlySubmission } from './diet-monthly.interface';

@Processor('dietMonthly')
export class DietMonthlyProcessor {
  private readonly logger = new Logger(DietMonthlyProcessor.name);
  private readonly odkFormIdSubmissionTableMap: Record<string, string> = {
    monthlyform_v1: 'MNTHLFORMV1_CORE',
    monthlyform_v2: 'MNTHLFORMV2_CORE',
  };

  constructor(
    private configService: ConfigService,
    private readonly appService: AppService,
    private readonly dietMonthlyService: DietMonthlyService,
  ) {}

  @Process('dietMonthlySubmission')
  async handleSubmit(job: Job) {
    const request: RequestQueue = job.data;
    this.logger.debug(`Processing id: ${request.id}...`);
    await this.appService.updateRequestStatus(request.id, 'PROCESSING');

    try {
      const submissionData = <DietMonthlySubmission>(<unknown>request.data);
      for (const submission of submissionData.data) {
        const pdfMapping =
          this.dietMonthlyService.createMappingForPdf(submission);

        const pdfResponse = await this.appService.sendPdfRequest(
          this.dietMonthlyService.getTemplateId(submission.wingname),
          pdfMapping,
        );
        if ('error' in pdfResponse) {
          throw new Error(`PDF Service: ${JSON.stringify(pdfResponse)}`);
        }
        const pdfUrl = pdfResponse.data;
        this.logger.debug(
          `PDF generated for diet monthly form for uuid: ${submission.instanceID} => ${pdfUrl}`,
        );

        const storePdfResponse = await this.dietMonthlyService.storePdfUrl(
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
          `PDF link successfully dumped for diet monthly form for uuid: ${submission.instanceID}`,
        );

        const dumpSubmissionResponse =
          await this.dietMonthlyService.dumpSubmission(submission);
        if ('errors' in dumpSubmissionResponse) {
          throw new Error(
            `Hasura Service: ${JSON.stringify(dumpSubmissionResponse)}`,
          );
        }
        this.logger.debug(
          `Submission successfully dumped for diet monthly form for uuid: ${submission.instanceID}`,
        );

        const tableName =
          this.odkFormIdSubmissionTableMap[submissionData.formId];
        const result = await this.dietMonthlyService.updateSubmissionFlag(
          submission.instanceID,
          tableName,
        );
        if (!result) {
          throw new Error('ODK Postgres db error occurred');
        }
        this.logger.debug(
          `Submission flag successfully update for diet monthly form for uuid: ${submission.instanceID}`,
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
