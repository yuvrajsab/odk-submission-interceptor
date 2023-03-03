import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ODKFormSubmissionAttachment } from 'src/interface/odk-submission-attachment.interface';

@Injectable()
export class ODKSubmissionHelperService {
  constructor(private readonly appService: AppService) {}

  validateData(data: string | number | null): string {
    if (data === null) {
      return 'NA';
    }
    if (typeof data === 'number') {
      return data.toString();
    }
    return data;
  }

  extractMonthNameFromDate(date: string): string {
    return new Date(date).toLocaleString('default', { month: 'long' });
  }

  getAttachmentLink(fileObj: ODKFormSubmissionAttachment | null): string {
    if (fileObj === null) {
      return 'NA';
    }
    return this.appService.getODKAttachmentDownloaderUrl(fileObj);
  }
}
