import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { RequestStatus } from './enum/RequestStatus.enum';
import { QueueService } from './service/queue.service';

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
  async process(
    @Query('form_id') formId: string,
    @Body() body: Record<string, any>,
  ) {
    if (!formId) {
      throw new BadRequestException('form_id is required');
    }

    const request = await this.prismaService.requestQueue.create({
      data: { form_id: formId, data: body, status: RequestStatus.QUEUED },
    });
    this.queueService.pushRequestToQueue(request);
    this.logger.debug(`Request added: ${JSON.stringify(request)}`);
    return 'Request queued!';
  }
}
