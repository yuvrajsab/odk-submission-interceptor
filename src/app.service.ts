import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ODKFormSubmissionAttachment } from './interface/odk-submission-attachment.interface';
import { PrismaService } from './prisma.service';
import * as pg from 'pg';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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

  async sendPdfRequest(
    templateId: string,
    payload: Record<string, string>,
  ): Promise<Record<string, any>> {
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

  async sendGqlRequest(query: string): Promise<Record<string, any>> {
    const headers: Record<string, string> =
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
          map((response: Record<string, any>) => {
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

  async executeQuery(query: string) {
    const pool = new pg.Pool({
      connectionString: this.configService.getOrThrow('ODK_DB_CONN_STRING'),
    });

    let res;
    try {
      res = await pool.query(query);
    } catch (err) {
      res = null;
      this.logger.error(`ODK Postgres error: ${err}`);
    } finally {
      await pool.end();
    }

    return res;
  }

  getODKAttachmentDownloaderUrl(fileObj: ODKFormSubmissionAttachment) {
    return `${this.configService.getOrThrow(
      'ODK_ATTACHMENT_DOWNLOADER_URL',
    )}?type=${fileObj.type}&filename=${fileObj.filename}&url=${
      fileObj.url
    }&configId=${this.configService.getOrThrow(
      'ODK_ATTACHMENT_DOWNLOADER_CONFIG_ID',
    )}`;
  }
}
