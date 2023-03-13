import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { RequestStatus } from './enum/RequestStatus.enum';
import { QueueService } from './service/queue.service';
import { ODKFormSubmission } from './interface/odk-submission.interface';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  @Get()
  getHome(): string {
    return 'ODK Submission Interceptor';
  }

  @Post('/process')
  async process(@Body() body: ODKFormSubmission) {
    const request = await this.prismaService.requestQueue.create({
      data: {
        form_id: body.formId,
        data: <object>body,
        status: RequestStatus.QUEUED,
      },
    });
    this.queueService.pushRequestToQueue(request);
    this.logger.debug(`Request added: ${JSON.stringify(request)}`);
    return 'Request queued!';
  }
}
