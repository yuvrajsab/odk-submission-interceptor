import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestQueue } from '@prisma/client';
import { Queue } from 'bull';
import { catchError, lastValueFrom, map } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectQueue('dietWeekly') private readonly dietWeeklyQueue: Queue,
  ) {}

  async updateRequestStatus(
    id: number,
    status: string,
    remark = '',
  ): Promise<any> {
    this.logger.debug(
      `id: ${id}: updateRequestStatus() callback: ${JSON.stringify([
        id,
        status,
        remark,
      ])}`,
    );
    return this.prismaService.requestQueue.update({
      where: { id: id },
      data: { status: status, remark: remark },
    });
  }

  async sendPDFRequest(templateId: string, payload: Record<string, string>) {
    return await lastValueFrom(
      this.httpService
        .post(
          `${this.configService.getOrThrow(
            'DOC_GEN_URL',
          )}/generate/?plugin=pdf`,
          {
            config_id: +this.configService.getOrThrow('DOC_GEN_CONFIG_ID'),
            data: payload,
            template_id: +templateId,
          },
        )
        .pipe(
          map((response: Record<string, any>) => {
            if ('error' in response.data) {
              this.logger.error(
                `Doc Gen error: ${JSON.stringify(response.data)}`,
              );
            } else {
              this.logger.debug(
                `Doc Gen response: ${JSON.stringify(response.data)}`,
              );
            }
            return response.data;
          }),
        ),
    );
  }

  async sendGqlRequest(query: string): Promise<any> {
    const headers: Record<string, any> =
      this.configService.getOrThrow('GQL_HEADERS');
    this.logger.debug(`Sending GQL request for query: ${query}...`);
    return await lastValueFrom(
      this.httpService
        .post(
          this.configService.getOrThrow('GQL_URL'),
          { query },
          { headers: JSON.parse(headers.toString()) },
        )
        .pipe(
          map((response: any) => {
            this.logger.debug(`GQL response:`, response.data);
            return response.data;
          }),
          catchError(async (e) => {
            this.logger.error(`GQL error: ${e.toString()}`);
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );
  }

  async pushRequestToQueue(request: RequestQueue) {
    if (request.form_id === 'dietsweeky_v1') {
      try {
        await this.dietWeeklyQueue.add('dietWeeklySubmission', request);
        return 'Successfully Submitted dietWeekly Form!!';
      } catch (e: unknown) {
        return `Request failed for dietWeekly Form: ${(<Error>e).message}`;
      }
    }
  }
}
